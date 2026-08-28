import { QueryValidator } from '../security.js';

// Identifiers that contain a forbidden keyword as a substring. These are ordinary
// column names -- RecordCreatedDate and IsDeleted are standard audit columns and
// appear on most tables in the database this was written against.
describe('keyword matching is word-boundary, not substring', () => {
  const legitimate = [
    'SELECT RecordCreatedDate FROM bix.DimUnit',
    'SELECT * FROM bix.DimGLAccount WHERE IsDeleted = 0',
    'SELECT CreateDate, RenewCreateDate FROM bix.DimRenewal',
    'SELECT mrrCreatedBy, CreatedByEmployee FROM bix.DimServiceRequest',
    'SELECT osl_RenewCreatorId FROM bix.DimRenewal',
    'SELECT resp_code FROM t',
    'SELECT grantor, updated_at, deleted_flag, create_date FROM t',
    'SELECT alteration_id, dropped_count, merged_flag FROM t',
  ];

  it.each(legitimate)('accepts %s', (query) => {
    expect(QueryValidator.validateQuery(query).isValid).toBe(true);
  });
});

describe('real write attempts are still blocked', () => {
  const writes: [string, string][] = [
    ['SELECT 1; DROP TABLE t', 'DROP'],
    ['SELECT * FROM t; DELETE FROM t', 'DELETE'],
    ['SELECT * FROM OPENROWSET(BULK N\'x\')', 'OPENROWSET'],
    ['WITH x AS (SELECT 1) INSERT INTO t SELECT * FROM x', 'INSERT'],
    ['SELECT * FROM t WHERE 1=1 EXEC sp_executesql @s', 'EXEC'],
    ['SELECT * FROM t TRUNCATE TABLE t', 'TRUNCATE'],
    ['SELECT * FROM t GRANT CONTROL TO x', 'GRANT'],
    ['SELECT * FROM t UPDATE t SET a = 1', 'UPDATE'],
    ['SELECT * FROM t ALTER TABLE t ADD c INT', 'ALTER'],
    ['SELECT * FROM t MERGE INTO t USING s ON 1=1', 'MERGE'],
  ];

  it.each(writes)('blocks %s', (query, keyword) => {
    const result = QueryValidator.validateQuery(query);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain(keyword);
  });

  it('still rejects statements that do not start with an allowed keyword', () => {
    const result = QueryValidator.validateQuery('CREATE TABLE ztest (id INT)');
    expect(result.isValid).toBe(false);
    expect(result.error).toMatch(/must start with/i);
  });
});

// Comments and UNION are ordinary SQL and were previously rejected outright.
describe('comments and UNION are permitted', () => {
  const permitted = [
    'SELECT a FROM t1 UNION SELECT b FROM t2',
    'SELECT a FROM t1 UNION ALL SELECT b FROM t2',
    'SELECT 1 -- trailing comment',
    'SELECT /* inline note */ 1 FROM t',
    '-- leading note is not allowed to change the statement type\nSELECT 1',
  ].slice(0, 4); // a leading comment still fails the starts-with check, by design

  it.each(permitted)('accepts %s', (query) => {
    expect(QueryValidator.validateQuery(query).isValid).toBe(true);
  });

  // A comment cannot be used to smuggle a forbidden keyword: the keyword scan
  // reads the whole string, so the write is still caught.
  it('does not let a comment hide a write', () => {
    const result = QueryValidator.validateQuery('SELECT 1 -- harmless\nDROP TABLE t');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('DROP');
  });
});

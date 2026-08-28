export class QueryValidator {
  private static readonly ALLOWED_STATEMENTS = [
    'SELECT',
    'WITH',
    'SHOW',
    'DESCRIBE',
    'EXPLAIN',
  ];

  private static readonly FORBIDDEN_KEYWORDS = [
    'INSERT',
    'UPDATE',
    'DELETE',
    'DROP',
    'CREATE',
    'ALTER',
    'TRUNCATE',
    'EXEC',
    'EXECUTE',
    'SP_',
    'XP_',
    'OPENROWSET',
    'OPENDATASOURCE',
    'BULK',
    'MERGE',
    'GRANT',
    'REVOKE',
    'DENY',
  ];

  static validateQuery(query: string): { isValid: boolean; error?: string } {
    const normalizedQuery = query.trim().toUpperCase();

    if (!normalizedQuery) {
      return { isValid: false, error: 'Empty query not allowed' };
    }

    // Check if query starts with allowed statement
    const startsWithAllowed = this.ALLOWED_STATEMENTS.some(stmt => 
      normalizedQuery.startsWith(stmt)
    );

    if (!startsWithAllowed) {
      return { 
        isValid: false, 
        error: `Query must start with one of: ${this.ALLOWED_STATEMENTS.join(', ')}` 
      };
    }

    // Check for forbidden keywords.
    //
    // Match on word boundaries rather than bare substrings. A plain
    // `includes()` rejects legitimate identifiers that merely contain a
    // keyword -- RecordCreatedDate and IsDeleted (standard audit columns on
    // most of our tables) tripped CREATE and DELETE, and resp_code tripped
    // SP_. That made 47 of 74 tables effectively unqueryable, and pushed
    // analysts into dropping `WHERE IsDeleted = 0` filters, which silently
    // changes results.
    //
    // SP_ and XP_ are prefixes, so they anchor only on the left. Real write
    // statements are still caught: see the tests in __tests__/security.test.ts.
    for (const forbidden of this.FORBIDDEN_KEYWORDS) {
      const pattern = forbidden.endsWith('_')
        ? new RegExp(`\\b${forbidden}`)
        : new RegExp(`\\b${forbidden}\\b`);
      if (pattern.test(normalizedQuery)) {
        return { 
          isValid: false, 
          error: `Forbidden keyword detected: ${forbidden}` 
        };
      }
    }

    // Additional security checks
    if (this.containsSqlInjectionPatterns(normalizedQuery)) {
      return { 
        isValid: false, 
        error: 'Potential SQL injection pattern detected' 
      };
    }

    return { isValid: true };
  }

  private static containsSqlInjectionPatterns(query: string): boolean {
    // Comment patterns (/--/ and /\/\*/) and the UNION pattern were removed here.
    //
    // All three rejected ordinary, correct SQL: commented queries, and UNION
    // between two SELECTs. Neither was providing real protection. A comment
    // cannot smuggle a keyword past the check above, because the keyword scan
    // reads the entire query string, and SQL Server will not accept a comment
    // inside a keyword (CRE/**/ATE parses as two tokens, not CREATE). UNION
    // requires a SELECT on both sides and cannot write.
    //
    // What actually enforces read-only here is three other things: the query
    // must start with an allowed statement, the keyword scan above, and -- the
    // real guarantee -- database permissions, where the login is db_datareader
    // with explicit DENY on INSERT/UPDATE/DELETE.
    const patterns = [
      /;.*SELECT/,  // Statement injection
      /'\s*OR\s*'.*'/,  // OR injection
      /'\s*AND\s*'.*'/,  // AND injection
    ];

    return patterns.some(pattern => pattern.test(query));
  }

  static sanitizeQuery(query: string): string {
    return query
      .trim()
      .replace(/\s+/g, ' ')  // Normalize whitespace
      .replace(/;$/, '');    // Remove trailing semicolon
  }

  static addRowLimit(query: string, maxRows: number): string {
    const normalizedQuery = query.trim().toUpperCase();
    
    // If query already has TOP clause, don't modify
    if (normalizedQuery.includes('TOP ')) {
      return query;
    }

    // Add TOP clause after SELECT
    return query.replace(
      /^(\s*SELECT\s+)/i,
      `$1TOP ${maxRows} `
    );
  }
}
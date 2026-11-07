# Where this material should live

**Date:** 2026-11-07
**Question:** Should schedules, the process map, the responsibility matrix, and the job-description inventory be their own repo, or part of BBL-DataSource?

## Short answer

Three homes, split by sensitivity and by who consumes the data:

| Content | Home | Why |
|---|---|---|
| Comp, reviews, person-level personnel data, org chart with names | Local machine or `Strategy / Executive Materials / Personnel` (restricted SharePoint folder) | Already the governed restricted location. Never in a Git repo. |
| Process map, responsibility matrix, schedule templates, JD inventory, artifact source | A **new private GitHub repo** (`bb-living/operating-model` or similar), plus a mirror folder on the Strategy SharePoint site | Versioned text and HTML; low sensitivity but still internal. |
| Critical dates as data (one row per community per milestone) | **BBL-DataSource** `reference/` as `t_critical_dates.xlsx`, once the artifact's data model has settled | This is the only piece that belongs in the warehouse: it is a table, it has a business owner, and Power BI and the construction-schedule integration need it. |

## What BBL-DataSource actually is

BBL-DataSource is not a Git repository. It is the SharePoint site `sites/BBL-DataSource` with `_governance/`, `inputs/`, `logic/`, `reference/`, `archive/`, and `research/`. Its README (owner: Frank, updated 2026-08-30) says the folder is a **production data source** read nightly by the SharePoint to Azure Blob to BULK INSERT pipeline orchestrated by GitHub Actions. Rules: filename equals target table name, one tab named `data`, every file has a manifest row, no renames, no decorative formatting.

That rules it out as a working directory for memos, HTML, meeting notes, or job descriptions. It is the right place for a **clean table** of critical dates once the shape is stable, because then the dates become reportable alongside BIX, JBREC, and the construction cost integration already planned in the `Construction_Data_Integration_Plan` drafts.

## The constraint that changes the answer

The only GitHub repository this session can reach under the `bb-living` org is `bb-living/mcp-sqlserver`, and it is a **public fork**. The deliverables in this folder were written so that nothing sensitive is in them, but a public repo is still the wrong permanent home for internal operating material. Recommendation:

1. Create a private repo for the operating model (process map, schedule templates, artifact sources, JD inventory, responsibility matrix). Move this `docs/schedules-process-map/` folder there as the first commit.
2. Keep `mcp-sqlserver` for what it is: the read-only SQL MCP server.
3. Do not commit the seeded community dates. They live in the artifact's shared store and, later, in `t_critical_dates` on BBL-DataSource.

## Proposed structure for the private repo

```
operating-model/
  process-map/        # Level 1 template (CSV + markdown), partner milestones, change log
  schedules/          # critical-date-calendar.html, sub-schedule templates per department
  responsibility/     # RACI by milestone, title/department canonical list
  job-descriptions/   # inventory only (links to SharePoint), review template, staleness report
  README.md
```

The SharePoint mirror is `Strategy / Shared Documents / Sitetracker / Complete Workflow Project`, which is already where the current process map, notes, and the `Title & Dept Clean Up.xlsx` sit.

## What goes to BBL-DataSource, and when

| Table | Grain | Source | Trigger |
|---|---|---|---|
| `t_process_map_milestone` | one row per WBS milestone (58 rows) | the template embedded in the artifact | now; it is stable |
| `t_critical_dates` | community x milestone: forecast, actual, override, updated_at | export from the artifact store | after the team has used the artifact for one cycle and the field list stops changing |
| `t_role_canonical` | canonical title, department, Bamboo title, Bamboo department | `Title & Dept Clean Up.xlsx` | after the Bamboo cleanup in `05-personnel-and-bamboo.md` |

Each needs a manifest row (business owner, technical owner, refresh cadence) before the pipeline touches it, per the governance README.

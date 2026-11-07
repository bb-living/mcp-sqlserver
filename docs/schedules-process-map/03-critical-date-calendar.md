# Critical Date Calendar

**Artifact:** https://claude.ai/artifact/RtXbYDJWBbGiqLAs7jJsf2
**Source:** `critical-date-calendar.html` in this folder
**Built from:** `Sitetracker - Process Map Update.xlsx`, sheet "Updated ST Process Map" (Strategy / Sitetracker / Complete Workflow Project), the version sent to Sitetracker on 2026-03-14.

## What it does

- One line per critical date for every community: 53 milestones in 9 stages, exactly as the Level 1 map was submitted to Sitetracker, plus a tenth stage (Stabilized & Disposition) with the three post-stabilization milestones from the June 2026 Master Schedule Milestones sheet (stabilized NOI vs underwriting, disposition or recap decision, capital event or sale close). Template dates reproduce the sheet (Accepted LOI 1/1/2026 gives PSA Executed 3/2/2026 and Lease Stabilization 11/16/2029). Stage 10 durations are placeholders for Finance and AM to set.
- Forecast logic is the sheet's: predecessor date plus calendar days. An actual date closes a milestone and moves every downstream forecast. A typed forecast override holds a date without closing it. When nothing upstream has a real date, the chain is floored at the latest actual on record so history is not forecast from the 2026 template anchor.
- Status per milestone: complete, late (forecast in the past with no actual), due soon (within 30 days), on track, and "no record" (no actual, but a later milestone has one, so the project passed it without a date; not counted as late).
- Each community carries a lifecycle status: Pipeline, Pre-development, Under construction, Lease-up, Stabilized, Sold / exited. The status closes the stages behind it, shown as "Complete (by status)": Pre-development closes IC Memo and DD Period; Under construction closes everything through Land Closing; Lease-up closes through Land Development; Stabilized closes everything except the Stabilized & Disposition stage; Sold closes all. This is how overdue items were cleared for stabilized communities without inventing dates.
- Four views: Portfolio (community by stage), Community (editable dates), Next 90 days (the weekly deep-dive list), Template (the Level 1 map itself).
- Community dates live in the artifact's shared database. Anyone the artifact is shared with at Contributor or above can add communities and enter dates; Viewers read only. Republishing the page never touches the data.

## Where the dates came from

Every actual date in the store on 2026-11-07 came from one place: the per-community columns of `ST Process Map - Historical Communities.xlsx` (Strategy site, Sitetracker / Complete Workflow Project, last modified 2026-03-16). That sheet was keyed by hand from Sitetracker and deal files when the Level 1 map was being rebuilt. It records acquisition, due diligence and entitlement milestones (Accepted LOI through Civil Improvement Plan Approval, plus a few Building Plan Approval dates) for 21 communities. It has no construction start, paving, model, opening or stabilization dates for any community. Nothing was loaded from Microsoft Planner, Sitetracker, BuilderLynx or RealPage.

Statuses, markets and the three new stage-10 milestones were set on the same day from the AM team's `Road to Stable Occupancy.xlsx` (Settings tab, stage per property as of 9/26/2026) and the National Property Operations bi-weekly brief of 10/7/2026 (18 operating communities). Windrose is recorded under its operating name Val Vista; Centennial as Trails Edge; Lakewood Ranch as Antigua. Six communities with no dates in the historical sheet were added as rows so the portfolio is complete: Desert Ridge (lease-up), Cavasson, Bear Creek Reserve, 5609 E Thomas Rd and Firefly Park (pre-development), Waketon Road (pipeline). Shalimar is a Fund II deal still in pre-development. Murphy Creek is not in the operating portfolio and was set to Sold / exited; the disposition date should be confirmed and entered.

The seed is kept out of this repository (the repo is public); it lives in the artifact store and in the source sheets.

## Microsoft Planner: not reachable, and what to do instead

Planner could not be pulled. The Microsoft 365 connector in this session has no Planner tool and its granted Graph scopes (Mail, Files, Sites, Calendars, Chat, Teams channel messages) do not include Tasks.Read or Group.Read.All. The v6.3 Master Deal Action Checklist says the same in its own header: "Planner is not accessible through this connector; boards must be reconciled manually against these tabs." No Planner plan exports exist on SharePoint apart from the retreat follow-up import sheet.

So the Planner-to-artifact comparison is still open. Two ways to close it:

1. Planner has "Export plan to Excel" on every plan. Export each community plan to the Strategy site (one file per community, say `planner/<community>.xlsx`) and the dates can be diffed against the store and loaded as actuals in one pass.
2. Add Tasks.Read to the connector's consent (a Microsoft Entra admin change) so the pull can be done directly next time. Sitetracker's own notes from the 10/9/2026 reverse demo confirm that project scheduling moved to Planner because of Sitetracker customization limits, so Planner is where the construction dates actually live today.

Branden's 4 Nov 2026 note on project visibility proposes the opposite division of labor (Sitetracker as the milestone system of record, Planner as the quarterback's working checklist, Power BI as the dashboard). The Critical Date Calendar is the milestone spine in that model, and its 53 plus 3 milestones should be reconciled with the 73-row Master Schedule Milestones sheet (June 2026) before the Sitetracker template is built; see the completeness section below.

## Data model

```
communities/<id>
  name        string
  market      string
  fund        string
  status      "pipeline" | "pre-development" | "under-construction" | "lease-up" | "stabilized" | "sold" | ""
  notes       string
  dates       { "<wbs>": { actual?: "YYYY-MM-DD", forecast?: "YYYY-MM-DD" } }
  createdAt   "YYYY-MM-DD"
  updatedAt   "YYYY-MM-DD"
```

The template (wbs, name, stage, predecessor, duration, owner role) is in the page source. Changing the map means editing that list and republishing. When the team wants the template editable in place, move it to a `template/milestones` document in the same store.

## Artifact now, web app later: is there a gap?

The request said to start with a Claude artifact and move to the web app later "unless there is not a significant gap in required time between the two methods." Findings:

- The artifact took one session and is in use today. It covers the Level 1 use case completely: enter actuals, see forecasts roll, see what is late, share with the team.
- The web app path (Sitetracker, which is Salesforce) is the long-term system of record and is already being rebuilt from this same sheet. That rebuild has been in flight since March 2026 and still needs the training plan Kurt asked for.
- The two are not competing. The artifact is the interim tracker and the reporting layer; Sitetracker is where the dates should be entered once the rebuild and training are done. The bridge is a `t_critical_dates` table on BBL-DataSource that either source can feed, and that Power BI and the construction cost integration read.

So: no reason to wait for the web app, and no reason to skip it. Use the artifact through the Sitetracker rebuild, then flip the artifact to read from the warehouse.

## The schedule tree

Level 1 (this calendar) is the trunk. Each stage owner keeps a Level 2 schedule whose milestones map back to one or more Level 1 dates. Level 3 is the working schedule (MS Project, BuilderLynx, Planner) that the Level 2 rolls up from.

| L1 stage | L2 sub-schedule | Owner role | Existing source material |
|---|---|---|---|
| IC Memo, DD Period | Acquisitions deal schedule (LOI, PSA, IC memo tasks, DD checklist, deposits) | Director of Acquisitions | `BBL_Process_Map_FULL.xlsx` sections 1 to 3; `Acquisitions Process & UW Tool v2.0.xlsx` |
| DD Period, Pre-Development | Product development and design (product selection, architect, concept set, 30/50/90/100 percent sets, agency submittals) | National VP Design Management | `Process Map Notes.xlsx` sheet 2 (drafted 2025); full map sections 5 and 7 |
| Entitlement Period | Entitlement submittal schedule by municipality | Director of Planning and Entitlements | full map section 6; entitlement-schedule-generator skill |
| Loan Closing, Land Closing | Lender package and closing checklist | VP Finance | full map sections 9 and 10 |
| Land Development, Vertical Construction | LD and vertical construction schedules (bid, award, start, paving, models, production) | VP Construction, Director Construction Services | full map sections 11 to 12; Skyline schedule examples (Apr 2026) |
| Vertical Construction, Leasing | Community opening countdown (90 / 60 / 30 days), FF&E, signage, leasing office | VP Construction with VP Asset Management | full map section 13; PM Playbook 2.5, 2.7, 2.8 |
| Leasing and after | AM lease-up and stabilization cadence (PMA, hiring, Knock setup, concessions, pricing calls, reporting) | VP Asset Management | PM Playbook 1.2, 2.1, 2.2, 2.6, 3.1, 4.2 |

Rule for the tree: a Level 2 milestone that is also a Level 1 date is entered once, in the calendar, and the sub-schedule reads it. Sub-schedules add detail; they do not restate critical dates.

## Completeness review: questions to settle

The calendar reproduces the Level 1 map as is. These are the items to review before calling it complete, drawn from the Sitetracker update notes, the 6/19/25 full map, and the partner-level milestone list.

Sequencing in the current sheet:

- Loan Closing (5.x) and Land Closing (6.x) all chain from DD Period Expiration (2.8) with fixed offsets rather than from entitlement or each other. Lender Identification at 120 days after DD expiration may be early or late depending on the deal.
- Pre-Development (4.x) chains from Partner Sign-Off: Conceptual Design (2.4) and DD expiration (2.8). The notes from the January review asked whether pre-development should follow land closing.
- Civil Improvement Plan Approval (7.3) sits in Land Development but is owned by Planning in practice.
- Entitlement Contingency Expiration (3.4) is owned by Acquisitions while the rest of stage 3 is Planning.

The June 2026 Master Schedule Milestones sheet (73 rows, with FIM baseline, forecast, actual, variance, owner, tracking system and critical-path flag per milestone) is the other candidate Level 1. It is organized around the v6.3 quarterback handoffs and carries items the Sitetracker sheet lacks: tear sheet, LOI submitted, Ediphi estimate review, pre-application meeting, partner reviews at 30/60/90 percent design, first and last lot delivered, building permits filed, partner reviews at 25/50/75 percent vertical, opening-prep gates at 180 and 60 days, grand opening, first move-in, graded handoffs, the Cardinal lease-up stages, and the three post-stabilization items now in stage 10. The two lists should be merged into one spine before the Sitetracker rebuild locks the template.

Milestones in the partner-level list (22) that are not Level 1 dates today:

- M1 Internal discussion to advance deal (go / no-go)
- M8 Approval of concept package
- M9 Phasing plan for community and model locations
- M10 Design committee final review
- M12 Third-party property manager confirmation
- M16 and M17 LD and vertical bid award recommendations (the sheet has bid award dates, not the recommendation step)
- M18 to M21 Community / model home opening 90, 60, 30 days out and opening day
- M22 First move-in, plus project closeout

Items dropped from the prior Sitetracker map that may deserve to come back as Level 1 or move to Level 2:

- Model furniture ordered and installed (now folded into FF&E ordered / installed)
- Amenity completion date
- Pre-leasing start date (replaced by website live)
- Property manager identified (replaced by property manager hired)

Ownership questions:

- "Acquisitions Manager" is the owner of 14 milestones but the title is now Director of Acquisitions. Owner labels should use canonical titles from the Bamboo cleanup.
- "CSO" owns Partner Sign-Off: Conceptual Design. Confirm whether that should be President or the design committee.

## Operating cadence (proposed)

- Weekly: stage owners enter actuals and adjust forecasts for their milestones. The "Next 90 days" view is the agenda.
- Monthly: Portfolio view reviewed in the construction / ops meeting; late milestones need a reason and a new forecast.
- Quarterly: template review (durations against actuals across communities), then republish.

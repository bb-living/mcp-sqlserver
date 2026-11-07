# Critical Date Calendar

**Artifact:** https://claude.ai/artifact/RtXbYDJWBbGiqLAs7jJsf2
**Source:** `critical-date-calendar.html` in this folder
**Built from:** `Sitetracker - Process Map Update.xlsx`, sheet "Updated ST Process Map" (Strategy / Sitetracker / Complete Workflow Project), the version sent to Sitetracker on 2026-03-14.

## What it does

- One line per critical date for every community: 58 milestones in 9 stages, exactly as the Level 1 map was submitted to Sitetracker. Template dates reproduce the sheet (Accepted LOI 1/1/2026 gives PSA Executed 3/2/2026 and Lease Stabilization 11/16/2029).
- Forecast logic is the sheet's: predecessor date plus calendar days. An actual date closes a milestone and moves every downstream forecast. A typed forecast override holds a date without closing it.
- Status per milestone: complete, late (forecast in the past with no actual), due soon (within 30 days), on track.
- Four views: Portfolio (community by stage), Community (editable dates), Next 90 days (the weekly deep-dive list), Template (the Level 1 map itself).
- Community dates live in the artifact's shared database. Anyone the artifact is shared with at Contributor or above can add communities and enter dates; Viewers read only. Republishing the page never touches the data.

## What was seeded

Twenty-one communities from `ST Process Map - Historical Communities.xlsx` (Windrose through Sweetwater II) with the actual dates that sheet records, mostly through entitlement. Cavasson, 5609 E Thomas Rd, and Bear Creek Reserve had no dates in that sheet and were not seeded. Market and fund were left blank for the team to fill. The seed is kept out of this repository (the repo is public); it lives in the artifact store and in the source sheet.

## Data model

```
communities/<id>
  name        string
  market      string
  fund        string
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

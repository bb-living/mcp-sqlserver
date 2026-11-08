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
- Community dates live in the artifact's shared database (32 communities as of 2026-11-08). Anyone the artifact is shared with at Contributor or above can add communities and enter dates; Viewers read only. Republishing the page never touches the data.

## Where the dates came from

Two loads so far.

**2026-11-07, acquisition through entitlement.** Every actual date in the first load came from the per-community columns of `ST Process Map - Historical Communities.xlsx` (Strategy site, Sitetracker / Complete Workflow Project, last modified 2026-03-16). That sheet was keyed by hand from Sitetracker and deal files when the Level 1 map was being rebuilt. It records Accepted LOI through Civil Improvement Plan Approval, plus a few Building Plan Approval dates, for 21 communities. It has no construction, model, opening or stabilization dates. Statuses, markets and the three stage-10 milestones were set the same day from the AM team's `Road to Stable Occupancy.xlsx` (Settings tab, stage per property as of 9/26/2026) and the National Property Operations bi-weekly brief of 10/7/2026. Windrose is recorded under its operating name Val Vista; Centennial as Trails Edge; Lakewood Ranch as Antigua. Murphy Creek was set to Sold / exited; the disposition date should be confirmed.

**2026-11-08, land, construction and opening dates from Planner.** The construction team's Planner plans are exported weekly to PDF task grids by the Claude project in the Construction site (`03. Construction Projects / Reporting Documents / Claude Project Folder / Task Grid Schedules`). The 10/29/2026 set (`<community> Pre-Construction Schedule_29Oct.pdf`, plus `Waketon Road Due Diligence Schedule_29Oct.pdf`) carries, per community, the DD-exit-memo baseline, scheduled finish and variance for each milestone, and the full task list underneath. Those grids were mapped to Level 1 milestones and loaded: past dates as actuals, future dates as forecast overrides. The Design Management Portfolio Update of 10/28/2026 (Rick Maddox) supplied Cavasson's contracting and start forecasts and the prototype-walk dates. Loaded or updated: Logan Ranch, Sweetwater II, Bear Creek Reserve, Waketon Road, Cavasson, Lakewood Ranch II (note only), and five communities that were not in the calendar: Arvada, Hillsong, Jared's Nursery, Northfield, The Orchards. Each community's notes field says which file each date came from and lists conflicts.

What the comparison showed:

- The artifact and the Planner grids barely overlapped before the load. The historical sheet stops at entitlement; the grids start at closing. The only shared dates were Logan Ranch and Sweetwater II DD milestones, and one conflict: Sweetwater II open of escrow is 5/23/2024 in the historical sheet and 12/9/2024 in the Planner grid. The sheet's date was kept and the conflict is in the notes.
- Bear Creek Reserve was carried as pre-development; the grid shows land development complete (8/14/2026), permits in hand 10/23/2026 and vertical start 11/2/2026. Status changed to under construction. The vertical start is left as a forecast because the Design Management update of 10/28 still showed permits pending.
- Sweetwater II was carried as under construction per AM; land development starts 11/9/2026 per the grid. Status left as is. The Design Management update lists a "Sweetwater Ranch Trails" with vertical start January 2028; confirm whether that is the same community.
- Variances to the DD-exit baseline are large: Logan Ranch vertical start +419 days, Hillsong +90, Jared's Nursery +204, Sweetwater II +140, Arvada +16. The calendar now shows these as late or forecast against the Level 1 template; the baseline column itself is not stored (see the open question on baselines below).
- Not in the grids: anything for stabilized or lease-up communities (amenity complete, model delivery, leasing start, stabilization). Those still have to come from BuilderLynx, RealPage or the site teams.
- Pipeline deals in the Design Management update with no schedule yet (The Ranch, O'Kelly Chapel Road, Boca Raton, Haggard Farms) were not added.

The seed is kept out of this repository (the repo is public); it lives in the artifact store and in the source files above.

## Microsoft Planner: how other sessions reached it, and what to use

The Microsoft 365 connector in this session cannot read Planner. Its granted Graph scopes (Mail, Files, Sites, Calendars, Chat, Teams channel messages) do not include Tasks.Read or Group.Read.All, and it has no Planner tool.

The earlier sessions that could read Planner did not use this connector. They ran Python scripts from the private `fgidaro/bb-living-data` repository (`scripts/planner/audit_planner.py`, `inspect_active_plans.py`, `investigate_opportunity_tracker.py`) against the Dataverse environment behind Planner Premium (`org2434a0ee.crm.dynamics.com`), using the Entra app credentials that repo's `CLAUDE.md` describes as environment variables. Their outputs are in `research_log/2026-05-27_planner-audit.md` and `2026-05-27_planner-plans-detail.md` (39 active plans, per-bucket task counts and first and last task end dates). The scripts themselves cannot be read through SharePoint from here (served as binary), so the exact auth flow is not reproduced in this folder. To repeat a direct pull: run those scripts from a session that has the bb-living-data repo attached and the Entra secret available, or add Tasks.Read to this connector's consent.

For the calendar, the direct pull is not needed. The weekly Planner-to-PDF task grids in the Construction site are the practical feed: one file per active community, dated, with baseline, scheduled finish and variance per milestone. The 10/29/2026 set was loaded on 2026-11-08. The next load is the same mapping against the next dated set; the mapping (grid row to Level 1 WBS) is recorded in each community's notes and should be moved to a `template/planner-map` document in the store when it stabilizes.

Branden's 4 Nov 2026 note on project visibility proposes Sitetracker as the milestone system of record, Planner as the quarterback's working checklist, Power BI as the dashboard. The Critical Date Calendar is the milestone spine in that model, and its 53 plus 3 milestones should be reconciled with the 73-row Master Schedule Milestones sheet (June 2026) before the Sitetracker template is built; see the completeness section below.

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

Baselines: the Planner grids carry a DD-exit-memo baseline per milestone and report variance against it. The calendar stores only actual and forecast, so variance is measured against the Level 1 template durations, not the deal's own baseline. Add a `baseline` field per milestone (set at DD exit, never overwritten) if the team wants the grid's variance in the calendar.

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

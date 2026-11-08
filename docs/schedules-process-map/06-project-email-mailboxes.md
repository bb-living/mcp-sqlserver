# Project email mailboxes: what exists, and how to use them in reporting

**Date:** 2026-11-08
**Sources:** Outlook (Kurt's 11/13/2025 announcement and 12/4/2025 reminder; the April 2026 "Project email summary" and "Project Status Report" threads; the 4/22/2026 "Project Email Summaries" note), the Construction site library `13. Weekly Project Email Summaries` (28 community folders plus `01 Weekly Volume Summaries`), the `BBLivingTeam / Project Email Summaries` folder, and direct reads of four shared mailboxes through the Microsoft 365 connector (Mail.Read.Shared is granted).

## What was set up

- **13 Nov 2025.** Kurt announced project-specific email addresses to the construction, design, planning, acquisitions and accounting teams: cc the project address on every project email, reply-all to add it when it is missing, forward historical folders as .msg attachments, and ask Allison Kremer for a new address when a deal starts. Fourteen addresses at launch; a reminder went out 4 Dec 2025.
- **Allison's list (8 Apr 2026)** had 23 addresses. **Kurt's volume report of 30 Oct 2026** tracks 34 mailboxes: 31 communities plus `safety@`, `lessonslearned@` and `urbaneduo@`.
- The mailboxes are Exchange shared mailboxes with named members (Northfield: Adrienne, Branden, Frank, Kurt and one more). Members see them in Outlook; Miles IT had to tune the mapping so they do not flood a member's inbox.

## What is already being done with them

This is further along than "limited reporting" suggests, but it lives in one person's workflow.

- **Weekly Claude summaries, since 8 Apr 2026.** Kurt runs a saved Claude request across all project addresses and files one Word document per community per week in `Construction / 13. Weekly Project Email Summaries`. Logan Ranch has 21 weekly files (Apr 8 to Oct 30); Northfield 29. The format has seven sections: activity counts, thread breakdown, who sent and responded, thread summaries, open tasks and deliverables (owner, due date), decisions (decided or pending), and scope changes.
- **Weekly volume report.** `BB_Living_Email_Volume_<date>.xlsx`, 26 files from mid-April to 30 Oct: emails per mailbox and an active/quiet flag. Week of 23 to 30 Oct: 555 emails across 20 active mailboxes; Lakewood Ranch 2 (98), Logan Ranch (86), Vicenza/Orchards (49), Bear Creek, Sweetwater 2, Arvada, Safety (35 to 36 each). Fourteen mailboxes were quiet, mostly stabilized communities.
- **Ad hoc research.** On 19 Oct 2026 Kurt answered the Northfield public-versus-private-road question with a dated chronology pulled from the project mailbox. That is the retrieval use case the mailboxes were created for, working.
- **Executive feedback already given (Frank, 9 Apr 2026):** for the executive audience drop or collapse sections 1 to 3, turn section 4 into "Key Issues" with one summary per topic rather than per thread, keep sections 5 to 7.
- **Kurt's design intent (29 Apr 2026):** Emily sends the Planner schedule report to the project mailbox so it leads each summary, followed by Schedule, Deliverables, Open Tasks, Decisions, Risks. Branden called the resulting dashboard the agenda for the monthly operational meetings.

## Where it falls short today

1. **Output is unstructured.** Every finding is prose in a .docx. Nothing is a table that reporting can join to a community, a milestone or a person. The open tasks, decisions and scope changes are re-derived every week with no memory of last week's state, so items close and reopen (Kurt saw "open issues" flagged that had been resolved).
2. **No distribution.** The documents sit in a library. No one is routed to them, there is no digest, and the Monthly Operational Meeting agenda is still built by hand.
3. **Compliance is partial and unmeasured against a target.** About 50 percent of project mail carried the address in April. The volume report counts messages but cannot say what fraction of a community's traffic reached the mailbox. Quiet mailboxes for active deals (Gem Lake, Sweetwater Crossing, Harvest, Belknap) are either compliance gaps or dead deals; the report does not distinguish.
4. **Coverage gaps for new deals.** Waketon Road uses `waketon@bbliving.com` (per the Design Management update) but is not in the 30 Oct volume list and Frank is not a member. Haggard Farms, O'Kelly Chapel Road, Boca Raton and 5609 E Thomas Rd have no address in any list seen.
5. **Naming drift.** Littleton is Jared's Nursery; Vicenza Way and Orchards are two addresses for one deal; `harvesttx@` and `lakewoodranch2@` differ from the warehouse names. There is no crosswalk from mailbox to the community master, so nothing can be joined to BBLivingDW or to the Critical Date Calendar.
6. **Membership is uneven.** Frank can read Northfield, Logan Ranch, Bear Creek and Colliers Hill but not Waketon. Whoever runs reporting needs read access to every mailbox, ideally through one service identity rather than personal membership.
7. **Signal mixed with noise.** Read.ai meeting reports, bid-portal notifications and vendor marketing land in the same mailbox as decisions. The summaries handle this, but a structured extract needs sender classes.

## Plan

### Phase 0, this month: make the mailboxes a dimension

- Add `projectEmail` to the Critical Date Calendar community record and to the community master that becomes `t_community` in BBLivingDW (today `bix.Community_Lookup` plus `bix.PipelineCommunity`). One address per community; the Vicenza/Orchards pair maps to The Orchards.
- Ask Allison to create addresses for Waketon Road (confirm `waketon@`), Haggard Farms, O'Kelly Chapel Road, Boca Raton and 5609 E Thomas Rd, and to add a reporting identity (Frank, or a service account) as a member of all 34 plus the new ones. Publish the list once, on the Construction site, and link it from the calendar.
- Record the rule in the process map: the project address is created at Accepted LOI (milestone 1.1) by Allison, and the community quarterback owns compliance from DD exit onward.

### Phase 1, December: structured weekly extract

Keep Kurt's weekly run but change what it produces. Alongside the Word summary, the same run writes three flat tables, one row per item, with the community key, the week, and the source message id:

| Table | Columns | Feeds |
|---|---|---|
| `project_email_items` | community, week, item_type (task, decision, scope change, risk), title, owner, due_date, status, first_seen_week, last_seen_week, source_message_id | open-items aging, decision log, meeting agendas |
| `project_email_dates` | community, week, wbs (Level 1 milestone), date_mentioned, actual_or_forecast, confidence, quote, source_message_id | Critical Date Calendar proposals |
| `project_email_volume` | community, week, emails, threads, internal_senders, external_senders, agencies | compliance and activity reporting (already produced; just keep the layout fixed) |

Items carry forward week to week by matching title and owner, so the status moves from open to closed instead of being re-derived. The run saves the three tables as CSV in `13. Weekly Project Email Summaries / _data /` and the BBL-DataSource loader picks them up into `cns` as `t_project_email_items`, `t_project_email_dates`, `t_project_email_volume` with manifest rows. The extraction can run as a scheduled Claude task in this environment, since the connector already reads shared mailboxes; the prompt is Kurt's current one with the table output added and the executive edits Frank asked for in April.

### Phase 2, January: close the loop with the Critical Date Calendar

- The calendar gets a **Signals** panel per community: this week's thread count, open decisions, and every date the extract found that maps to a Level 1 milestone, shown as a proposal next to the milestone with the quote and a link to the message. The quarterback accepts or dismisses; accepting writes the actual or forecast with provenance. This replaces hand entry for the dates that show up in email first: permit in hand, bids due, award, start, delivery, C of O, hand-off.
- Each weekly summary opens with the community's Level 1 status from the calendar (next three milestones, anything late), which is Kurt's "schedule first" design without depending on the Planner export.
- The Next 90 days view links each milestone to the mailbox search for its name, so the deep-dive starts from the email record.

### Phase 3, Q1 2027: broader reporting

- Power BI pages on the warehouse tables: activity by community and week; open items aging by owner and department; decision log with status; scope changes by community; compliance (emails captured versus total project emails, estimated from the share of each member's project mail that carries the address, sampled quarterly).
- An executive digest on Monday morning: one page per active community in Frank's April format (key issues, then open tasks, decisions and scope changes), delivered by email or Teams, generated from the tables rather than from fresh summarization.
- Monthly Operational Meeting agenda assembled from open items and pending decisions, per Branden's April intent.
- Retention: define what the mailbox is the record of (decisions, approvals, agency correspondence) and what SharePoint holds (documents). Forwarded historical folders stay in the mailbox; nothing is deleted.

## Owners and cadence

| Role | Responsibility |
|---|---|
| Kurt Ehlers | Owns the weekly run and the summary format; approves the table definitions |
| Allison Kremer | Mailbox creation, membership, the published address list |
| Frank Gidaro | Warehouse tables, loader, Power BI, calendar integration |
| Community quarterbacks | Compliance on their deal; accept or dismiss date proposals weekly |
| Branden Lombardi | Executive digest audience; decides what goes to the operational meeting |

Weekly: run, publish, quarterbacks review proposals. Monthly: compliance and quiet-mailbox review in the operational meeting. Quarterly: prompt and table review.

## Decisions needed

1. Service identity or personal membership for the reporting reader.
2. Whether the structured extract runs in Kurt's Claude account, as a scheduled task in this cloud environment, or in the bb-living-data pipeline. The second is the quickest to prove.
3. Whether to retire the `vicenzaway@` address in favor of `orchards@`, and to rename `littleton@` now that the deal is Jared's Nursery.
4. The compliance target (the April figure was 50 percent) and whether it becomes a quarterback metric.

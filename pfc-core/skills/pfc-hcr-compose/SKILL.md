---
name: pfc-hcr-compose
description: AGENT_SUPERVISED Health Check Report composer — assembles all upstream skill chain outputs into a complete HCR v2.0 report following HCR-ONT structure. Produces Parts I–V (Executive Summary, Domain Assessments, Strategic Analysis, Assurance, Appendices). Multi-format output: HTML interactive, PDF print, DOCX Word deliverable. Pauses at HC-HCR-COMPOSE-1 for draft review before final formatting.
argument-hint: "[all HCR pipeline outputs or 'use findings'] [--format html|pdf|docx|all] [--customer-name 'name'] [--engagement-ref 'REF']"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-hcr-compose — Health Check Report Composer

**Skill ID:** SKL-107
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.25a
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.5 — 5-part report, 20+ sections, multi-format, full skill chain aggregation, HCR-ONT instantiation, narrative synthesis
HG-02 (Autonomy):   6.0 — human checkpoint for draft review before client delivery
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You are the capstone composition skill for the HCR pipeline. You ingest all outputs from the Azure assessment skill chain (WAF, CAF, Cyber, Health, Strategy, QVF, GRC, correlation analysis, roadmap, and verification), instantiate the `hcr:Report` HCR-ONT entity, populate all `hcr:ReportSection` entities, and assemble a complete Health Check Report v2.0. You synthesise narrative from structured data, produce the Part I Executive Summary, Part II Domain Assessments, Part III Strategic Analysis, Part IV Assurance & Verification, and Part V Appendices. You pause at HC-HCR-COMPOSE-1 for architect and customer review of the draft before final formatting and delivery.

---

## Section 1: Input Assembly & Report Instantiation

**Quality Gate G1: All upstream inputs loaded, hcr:Report entity instantiated**

Load all upstream skill chain outputs:

| Input | Source Skill | Report Part |
|---|---|---|
| WAF assessment | `pfc-alz-assess-waf` (SKL-086) | Part II Ch.1 |
| CAF assessment | `pfc-alz-assess-caf` (SKL-087) | Part II Ch.2 |
| MCSB/Cyber assessment | `pfc-alz-assess-cyber` (SKL-088) | Part II Ch.3 |
| ALZ Health assessment | `pfc-alz-assess-health` (SKL-089) | Part II Ch.4 |
| GRC MCSB deep assessment | `pfc-grc-mcsb-assess` (SKL-091) | Part II Ch.3 supplement |
| Unified posture score | `pfc-grc-posture` (SKL-098) | Part I scorecard |
| Correlated findings | `pfc-hcr-analyse` (SKL-108) | Parts II & III |
| Strategic gap analysis | `pfc-alz-strategy` (SKL-090) | Part III |
| GRC ROI economic case | `pfc-qvf-grc-roi` (SKL-105) | Part III |
| Cyber Value Equation | `pfc-qvf-grc-value` (SKL-106) | Part III |
| Backcasted roadmap | `pfc-hcr-roadmap` (SKL-111) | Part III §16 |
| Verification attestation | `pfc-hcr-verify` (SKL-109) | Part IV |
| FDN engagement context | Foundation context | Headers, metadata |

Instantiate `hcr:Report` entity:

```json
{
  "type": "hcr:Report",
  "version": "2.0.0",
  "reportId": "HCR-[customer]-[engagement-ref]-[date]",
  "customer": "--customer-name",
  "engagementRef": "--engagement-ref",
  "assessmentDate": "[from FDN]",
  "reportDate": "[current date]",
  "lead": "[lead architect from FDN]",
  "unifiedPostureScore": "[from pfc-grc-posture]",
  "overallRiskLevel": "[from pfc-hcr-analyse aggregate]",
  "status": "draft",
  "sections": []
}
```

**G1 checkpoint:** All upstream inputs loaded ✓ | hcr:Report entity instantiated ✓ | Section list populated ✓

---

## Section 2: Part I — Executive Summary Assembly

**Quality Gate G2: Part I Executive Summary assembled**

Part I structure and content sources:

**§1 — Engagement Context (1 page):**
```
Purpose: what this assessment covers and why
Customer: [name], [sector], [Azure scale: N subscriptions, N workloads]
Assessment scope: WAF + CAF + MCSB + AZALZ health
Assessment date: [date]
Lead architect: [name]
Methodology: Azlan Azure Health Check v2.0 — HCR-ONT backed, multi-framework
```

**§2 — Executive Scorecard (1 page):**
```
Unified posture score: [N]% ([RAG label]) — source: pfc-grc-posture
Domain summary table:
  | Domain | Score | RAG | Critical Findings | Trend |
  | WAF Reliability | [N]% | [R/A/G] | [N] | [↑/↓/→] |
  | ... (all 5 WAF pillars, 12 MCSB domains, CAF readiness) |

Top 3 CRITICAL findings — brief description and risk exposure
Top 3 immediate recommendations — brief description and expected value
```

**§3 — Strategic Recommendation (0.5 page):**
```
Headline: single paragraph synthesising the assessment conclusion
"[Customer] Azure environment presents [X] Critical and [Y] High findings across
[Z] frameworks, with concentrated risk in [top cluster]. The recommended adaptive
GRC programme delivers a [N]-year Cyber Value of £[N] — [N]× ROI on a £[N]
investment — and moves [Customer] from [current risk level] to [destination risk
level] by [target date]."

Investment thesis: why the programme is the right response
Urgency statement: any compliance deadline, insurance renewal, or risk appetite breach
```

**§4 — Report Structure (0.25 page):**
```
Brief table of contents showing Parts II–V and what each covers
```

Produce `hcr:ReportSection[type=executive-summary]` entity with all subsections linked.

**G2 checkpoint:** Part I assembled ✓ | Executive scorecard populated ✓ | Strategic recommendation narrative written ✓

---

## Section 3: Part II — Domain Assessments & Part III — Strategic Analysis

**Quality Gate G3: Parts II and III assembled**

**Part II — Domain Assessments (9 chapters):**

Each domain chapter follows standard structure:

```
§[N] — [Domain Name] Assessment

1. Scope & Methodology (0.25 page)
2. Current State — Three-State Gauge + score narrative (0.5 page)
3. Findings Summary — findings table (severity, risk, recommendation link)
4. Detailed Findings — per-finding: description, evidence reference, risk, recommendation
5. Cross-Framework Correlation — where this domain overlaps other frameworks
6. Recommended Actions — prioritised list with VE priority and phase assignment

Domain chapters:
  Ch.1: Azure Well-Architected (5 pillars, from SKL-086)
  Ch.2: Cloud Adoption Framework (readiness areas, from SKL-087)
  Ch.3: MCSB Cyber Security (12 domains + AI Security, from SKL-088 + SKL-091)
  Ch.4: ALZ Infrastructure Health (7 AZALZ domains, from SKL-089)
```

For each finding, populate `hcr:Finding` link within the section:
- Description, severity, evidence reference (hash-verified)
- RMF risk score and ALE contribution (if calculated)
- Recommendation with effort/cost/value/phase

**Part III — Strategic Analysis (4 sections):**

```
§12 — Cross-Framework Analysis:
  Source: pfc-hcr-analyse
  Content: systemic patterns, root cause clusters, amplification chains
  Narrative: "three clusters of systemic weakness are identified — Governance, Identity,
             and Monitoring — each generating cascading downstream findings..."

§13 — Risk & Financial Analysis:
  Source: pfc-qvf-cyber-impact, pfc-qvf-grc-roi, pfc-qvf-grc-value
  Content: current ALE, ΔALE by phase, insurance savings, Cyber Value Equation
  Includes: board-ready investment case table (from pfc-qvf-grc-roi)

§14 — GRC Programme Framework:
  Source: pfc-grc-mcsb-benchmark, pfc-grc-plan
  Content: three-state gap analysis summary, Gap₁ (accepted risk) and Gap₂ (remediation)
  MCSB compliance trajectory per phase

§15 — OKR Framework:
  Source: pfc-alz-strategy, pfc-hcr-roadmap
  Content: 3 strategic objectives + key results mapped to VE chain (VSOM→OKR→KPI→VP→QVF)

§16 — Backcasted Roadmap:
  Source: pfc-hcr-roadmap
  Content: 4-phase plan (Foundation→Transform→Sustain→Optimise)
  Gantt timeline, OKRs per phase, investment model, benefits schedule, resource plan
```

**G3 checkpoint:** All 4 domain chapters complete ✓ | All 5 Part III sections assembled ✓

---

## Section 4: Parts IV & V Assembly

**Quality Gate G4: Parts IV and V assembled**

**Part IV — Assurance & Verification:**

```
§17 — Evidence Assurance:
  Source: pfc-hcr-verify
  Content: evidence integrity summary, methodology audit results, re-execution consistency
  hcr:VerificationAttestation scope and methodology statement

§18 — Formal Attestation:
  Source: hcr:VerificationAttestation entity
  Content: attestation status (PASS / CONDITIONAL PASS / FAIL)
  Signed attestation statement with verifier identity
  Any stated conditions or limitations

§19 — Continuous Assurance Plan:
  How posture will be maintained post-assessment
  pfc-grc-drift schedule (monthly drift check)
  pfc-grc-mcsb-assess cadence (quarterly)
  Annual full reassessment trigger conditions
```

**Part V — Appendices:**

```
Appendix A: Azure Resource Inventory
  Summary of assessed environment: subscriptions, resource groups, key resources
  Source: pfc-alz-assess-health resource enumeration

Appendix B: Full Recommendations Register
  Complete list of all recommendations across all domains
  Columns: ID | Domain | Title | Severity | Priority | Phase | Effort | Value | Status

Appendix C: Evidence Pack Index
  All evidence items: ID | type | source | timestamp | hash | verification status

Appendix D: Assessment Methodology
  Three-state gap model explanation
  MCSB v2.0.0 domain weight table
  RMF risk scoring methodology (ISO 27005)
  FAIR financial model methodology

Appendix E: Glossary
  Key terms, acronyms, framework references
  MCSB domain codes, AZALZ entity names, ontology prefixes
```

**G4 checkpoint:** Part IV assurance sections assembled ✓ | Part V appendices complete ✓

---

## Section 5: HC-HCR-COMPOSE-1 & Final Formatting

**Quality Gate G5: Draft review passed, final report formatted and delivered**

**HC-HCR-COMPOSE-1 (Human Checkpoint — Draft Report Review):**

Present draft report structure for review:
- Part I Executive Summary: does the scorecard accurately represent the assessment?
- Part II Domain chapters: are findings correctly attributed and described?
- Part III §16 Roadmap: phases, investment, and value confirmed (HC-HCR-ROADMAP-1 should already be passed)?
- Part IV Attestation: verification status confirmed (HC-HCR-VERIFY-1 should already be passed)?
- Any factual corrections required before final formatting?
- Customer approval to proceed to final formatting and delivery?

Await architect and customer confirmation before producing final formatted outputs.

Final formatting and output production:

```
HTML Interactive Report:
  Technology: zero-build-step HTML + embedded CSS + ES modules
  Features: collapsible sections, finding filter, domain navigation
  Embeds: pfc-hcr-dashboard Level 0 executive view inline in Part I
  File: HCR-[customer]-[date]-v1.0.html

PDF Print Version:
  Formatted for A4 printing
  Page numbers, headers, footers with customer name and engagement reference
  File: HCR-[customer]-[date]-v1.0.pdf

DOCX Word Deliverable:
  Standard Azlan HCR template styling
  Tracked changes off, all fields resolved
  File: HCR-[customer]-[date]-v1.0.docx
```

**`hcr:Report` entity updated to status=final** with delivery metadata.

Output artefacts:
1. **HTML interactive report** (full 5-part, embeds dashboard)
2. **PDF print version** (A4 formatted)
3. **DOCX Word deliverable** (Azlan HCR template)
4. **`hcr:Report` graph instance** (complete HCR-ONT object for downstream skills)
5. **Metadata JSON** for SlideDeck pipeline and pfc-proposal-composer
6. **Slide data** (executive summary, key findings, roadmap for slide generation)

**G5 checkpoint:** HC-HCR-COMPOSE-1 confirmed ✓ | All 6 output artefacts produced ✓ | hcr:Report entity final ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| HCR-ONT | v1.0.0 | All entities — `hcr:Report`, `hcr:ReportSection`, `hcr:Finding`, `hcr:Evidence`, `hcr:Roadmap` |
| MCSB-ONT | v2.0.0 | Domain findings, scores, trajectory data |
| EA-MSFT-ONT | v1.1.0 | WAF pillar data |
| AZALZ-ONT | v1.0.0 | ALZ domain data |
| NCSC-CAF-ONT | v1.0.0 | CAF readiness data |
| RMF-IS27005-ONT | v1.0.0 | Risk scores, risk treatment data |
| QVF-ONT | v1.0.0 | `qvf:ValueModel`, financial case data |
| VP-ONT | v1.0.0 | Value Proposition narrative for Part I |
| RRR-ONT | v1.0.0 | `rrr:Result` per benefit component |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-COMPOSE-REPORT-001 | `hcr:Report` → `hcr:ReportSection` | hasSection |
| JP-COMPOSE-SECTION-001 | `hcr:ReportSection` → `hcr:Finding` | contains |
| JP-COMPOSE-FIND-001 | `hcr:Finding` → `hcr:Evidence` | supportedBy |
| JP-COMPOSE-ROADMAP-001 | `hcr:Report` → `hcr:Roadmap` | includesRoadmap |
| JP-COMPOSE-QVF-001 | `hcr:Report` → `qvf:ValueModel` | includesEconomicCase |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-hcr-dashboard` (SKL-110) | `hcr:Report` graph instance for interactive views |
| SlideDeck pipeline | Slide data JSON + chart exports for presentation |
| `pfc-alz-strategy` (SKL-090) | Completed report feeds commercial model and exec 1-pager |
| `pfc-proposal-composer` | Report metadata + key findings for proposal integration |

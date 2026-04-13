---
name: pfc-hcr-dashboard
description: AGENT_AUTONOMOUS interactive dashboard generation — produces four-level drill-down views (Executive→Domain→Finding→Evidence) from the HCR-ONT graph instance. Outputs zero-build-step HTML dashboard (ES modules), Chart.js/D3 visualisations, and embeddable widgets. Covers posture gauge, domain heatmap, risk heatmap, Gantt, SPC control chart, financial waterfall, and correlation matrix.
argument-hint: "[hcr instance or 'use findings'] [--format html|pdf|widget] [--level executive|full] [--customer-name 'name']"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write"
---

# pfc-hcr-dashboard — Interactive Dashboard & Drill-Down

**Skill ID:** SKL-110
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.25d
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.5 — 4-level drill-down, 10 visualisation types, multi-format output, HCR-ONT graph traversal
HG-02 (Autonomy):   7.5 — fully autonomous; dashboard generation is deterministic given HCR-ONT instance
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You generate interactive dashboard views from the `hcr:Report` graph instance produced by `pfc-hcr-compose`. You produce a four-level drill-down interface: Executive → Domain → Finding → Evidence. Each level renders different visualisation types appropriate to its data density. All output is zero-build-step ES modules (consistent with the PFC visualiser architecture), deployable to GitHub Pages or a customer portal. You are fully autonomous — dashboard generation is deterministic given a valid HCR-ONT instance.

---

## Section 1: HCR-ONT Instance Ingestion & Dashboard Configuration

**Quality Gate G1: HCR graph instance loaded, dashboard configuration resolved**

Load dashboard inputs:

| Input | Source | Content |
|---|---|---|
| `hcr:Report` instance | `pfc-hcr-compose` (SKL-107) | Full report with all section entities |
| `hcr:Finding` set | `pfc-hcr-analyse` (SKL-108) | Enriched findings with cross-refs, amplification |
| `hcr:Roadmap` | `pfc-hcr-roadmap` (SKL-111) | 4-phase plan with OKRs, investment, risk trajectory |
| `hcr:VerificationAttestation` | `pfc-hcr-verify` (SKL-109) | Attestation status and evidence chain |
| Posture data | `pfc-grc-posture` (SKL-098) | Unified posture score + domain scores |
| SPC baseline | `pfc-grc-baseline` (SKL-092) | UCL/LCL, control chart data per domain |
| QVF data | `pfc-qvf-grc-value` (SKL-106) | Cyber value equation components |
| Historical posture | Previous assessment data (if available) | Trend sparkline data |

Resolve dashboard configuration:
```
Output format:     --format (default: html)
Drill depth:       --level (default: full — all 4 levels)
Customer branding: --customer-name → inserted into title, header
Colour theme:      HCR-ONT `hcr:ReportTheme` if defined, else PFC default
RAG thresholds:    Red < 60%, Amber 60–79%, Green ≥ 80% (per three-state model)
```

**G1 checkpoint:** HCR instance loaded ✓ | Dashboard configuration resolved ✓ | All visualisation data sources confirmed ✓

---

## Section 2: Level 0 — Executive Dashboard

**Quality Gate G2: Executive dashboard (single page) produced with all summary visualisations**

Executive dashboard components (single-page overview):

**Component 1 — Unified Posture Gauge:**
```
Type: Circular gauge (compliance-reporter.js pattern)
Data: pfc-grc-posture unified score (0–100%)
Display: Large gauge — score %, RAG colour, trend arrow (vs. last assessment)
Bands: Red [0–59] | Amber [60–79] | Green [80–100]
```

**Component 2 — Domain Heatmap:**
```
Type: RAG grid (CSS grid + colour scale)
Data: Per-domain scores from pfc-grc-mcsb-assess
Layout: 4×3 grid (12 MCSB domains + AI Security)
Each cell: Domain name, score %, RAG colour
Interaction: Click cell → drill to Level 1 Domain Dashboard
```

**Component 3 — Top 5 Critical Findings:**
```
Type: Sorted list (table with inline severity badges)
Data: hcr:Finding where severity = Critical, sorted by compound risk score
Columns: Finding title | Domain | RMF score | Phase assigned
Interaction: Click row → drill to Level 2 Finding Detail
```

**Component 4 — Risk Profile Radar Chart:**
```
Type: Multi-axis radar (Chart.js radar)
Axes: WAF (5 pillars), MCSB aggregate, CAF readiness, AZALZ health
Data: Three-state scores — Current (solid) | Desired (dashed) | Best Practice (dotted)
```

**Component 5 — Roadmap Gantt Timeline:**
```
Type: Phase Gantt (vis-timeline)
Data: hcr:RoadmapPhase entities (start, end, label, status)
Display: 4 phases on horizontal timeline with milestone markers
Interaction: Click phase → expand to show phase recommendations
```

**Component 6 — Cyber Value Equation Summary:**
```
Type: Financial waterfall (Chart.js bar)
Data: pfc-qvf-grc-value — 4 value components + investment cost
Bars: Risk Reduction | Insurance Savings | Compliance Value | Operational Value | − Investment
Final bar: Net Cyber Value (highlighted)
```

**Component 7 — Trend Sparklines:**
```
Type: Inline SVG mini-charts
Data: Historical posture per domain (if previous assessment data available)
Per domain: 6-month trend line (or "First assessment — no trend data")
```

**G2 checkpoint:** All 7 executive dashboard components produced ✓ | RAG thresholds applied ✓

---

## Section 3: Level 1 — Domain Dashboard & Level 2 — Finding Detail

**Quality Gate G3: All domain drill-down views and finding detail pages produced**

**Level 1 — Domain Dashboard (one per domain, rendered on-demand):**

```
Three-State Gauge:
  Type: Stacked gauge — Current / Desired / Best Practice
  Data: Three-state scores from pfc-grc-mcsb-benchmark

Findings Table:
  Type: Sortable data table
  Sort options: severity | risk score | VE priority | Kano class | phase
  Columns: ID | Title | Severity | RMF | VE Priority | Kano | Phase
  Interaction: Click row → Level 2 Finding Detail

Cross-Framework Correlation View:
  Type: Tag matrix — which other frameworks share this domain's findings
  Data: pfc-hcr-analyse correlation matrix slice for this domain

Domain Risk Heatmap:
  Type: Impact × Likelihood matrix (5×5 grid, SVG)
  Data: RMF risk scores for all findings in this domain

Recommendations List:
  Prioritised, effort-tagged, phase-assigned
  Grouped by root cause (from pfc-hcr-analyse clusters)

SPC Control Chart (if baseline data available):
  Type: Time series + UCL/LCL bands (Chart.js line)
  Data: pfc-grc-baseline UCL, LCL, σ per domain
  Markers: Nelson rule violations highlighted
```

**Level 2 — Finding Detail (one per finding, rendered on-demand):**

```
Header: Finding ID, title, severity badge, Kano class
Body sections:
  Current State:   evidence summary + current score
  Desired State:   VE/WAF/MCSB target definition
  RMF Assessment:  impact, likelihood, composite score, ALE (if calculated)
  Remediation:     effort, cost, value, phase assignment, recommended action
  Cross-Framework: all frameworks that reference this finding
  Evidence Chain:  timestamped, hash-verified, source-attributed evidence items

Amplification indicator: if finding is part of CRITICAL-COMPOUND chain,
  display compound chain visualisation (mini Sankey: finding → amplification → risk)

Interaction: Click evidence item → Level 3 Evidence Viewer
```

**G3 checkpoint:** Level 1 domain views complete ✓ | Level 2 finding detail pages complete ✓

---

## Section 4: Level 3 — Evidence Viewer & Cross-Dashboard Links

**Quality Gate G4: Evidence viewer produced, all drill-path interactions wired**

**Level 3 — Evidence Viewer (one per evidence item):**

```
Header: Evidence ID, type, timestamp, verification status badge
Sections:
  Raw Evidence:      KQL result / policy JSON / config export (formatted, syntax-highlighted)
  Source Attribution: azure-skills MCP call ID + call parameters
  Hash Verification: SHA-256 hash + verification status (MATCH / MISMATCH)
  Audit Trail:       verifier, verification date, methodology reference
  Finding Links:     all findings this evidence supports (back-links)
```

**Additional dashboard views (accessible from navigation):**

**Correlation Matrix View:**
```
Type: Heatmap grid (CSS grid + colour intensity)
Data: pfc-hcr-analyse framework × framework correlation matrix
Rows/Cols: WAF | CAF | MCSB | OWASP | AZALZ
Each cell: count of shared findings (colour intensity = count)
Click cell: filtered finding list (findings shared by both frameworks)
```

**Amplification Chain View:**
```
Type: Sankey diagram (D3 sankey)
Data: pfc-hcr-analyse amplification chains
Flow: Root cause finding → amplification chain → compound risk label
Highlight: CRITICAL-COMPOUND chains in red
```

**Financial Waterfall Detail:**
```
Expanded view of QVF waterfall with per-year breakdown
Year-by-year investment vs. cumulative value
ROI curve overlay (from pfc-qvf-grc-roi)
```

Drill-path navigation:
```
All views linked with breadcrumb: Executive → Domain → Finding → Evidence
Back button at each level
Navigation sidebar: jump to any domain directly
```

**G4 checkpoint:** Level 3 evidence viewer complete ✓ | All drill-paths wired ✓ | Additional views produced ✓

---

## Section 5: Export Package & Embeddable Widgets

**Quality Gate G5: Full dashboard output package produced**

**Multi-format outputs:**

```
HTML Interactive Dashboard:
  File: hcr-dashboard-[customer]-[date].html
  Technology: zero-build-step ES modules, Chart.js, D3, vis-timeline
  Deploy: GitHub Pages or customer-hosted static site
  Size target: single self-contained file < 2MB (all data embedded as JSON)

PDF Snapshot (--format pdf):
  Executive dashboard page only (Level 0)
  Full report summary (all domain gauges + top findings)
  Generated as: print-optimised CSS + html2canvas capture

PNG Chart Exports:
  Each Chart.js / D3 visualisation exportable as PNG
  Naming: hcr-[chart-type]-[domain]-[date].png

CSV Data Extracts:
  findings.csv — all hcr:Finding entities with all fields
  domain-scores.csv — per-domain scores (current / desired / best practice)
  roadmap.csv — phase plan with investment and value per phase
  correlation-matrix.csv — framework × framework overlap counts
```

**Embeddable Widgets:**

```
Posture gauge widget:
  <div data-hcr-widget="posture-gauge" data-score="[N]"></div>
  Standalone ES module, no build step required

Domain heatmap widget:
  <div data-hcr-widget="domain-heatmap"></div>
  Renders 4×3 RAG grid inline in any HTML page

Roadmap timeline widget:
  <div data-hcr-widget="roadmap"></div>
  4-phase Gantt, embeddable in customer portal

Usage: include widget JS file and data attribute → renders inline
```

**`hcr:DashboardView` entities** (one per major view):
```json
{
  "type": "hcr:DashboardView",
  "viewId": "executive-overview",
  "level": 0,
  "components": ["posture-gauge", "domain-heatmap", "top-findings", "radar", "gantt", "financial-waterfall", "sparklines"],
  "dataSource": "hcr:Report instance",
  "outputFile": "hcr-dashboard-[customer]-[date].html"
}
```

Output artefacts:
1. **Interactive HTML dashboard** (full 4-level drill-down)
2. **Executive PDF snapshot** (Level 0, print-ready)
3. **PNG chart exports** (per visualisation type)
4. **CSV data extracts** (findings, scores, roadmap, correlation)
5. **Embeddable widgets** (posture gauge, domain heatmap, roadmap timeline)
6. **`hcr:DashboardView` entities** for downstream SlideDeck and proposal pipeline

**G5 checkpoint:** All output artefacts produced ✓ | Embeddable widgets ready ✓ | hcr:DashboardView entities complete ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| HCR-ONT | v1.0.0 | `hcr:Report`, `hcr:Finding`, `hcr:Evidence`, `hcr:DashboardView`, `hcr:Roadmap` |
| MCSB-ONT | v2.0.0 | Domain scores for heatmap and drill-down |
| QVF-ONT | v1.0.0 | Financial waterfall components |
| RMF-IS27005-ONT | v1.0.0 | Risk heatmap data |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-DASH-VIEW-001 | `hcr:DashboardView` → `hcr:Report` | visualises |
| JP-DASH-DRILL-001 | `hcr:DashboardView[level=0]` → `hcr:DashboardView[level=1]` | drillsInto |
| JP-DASH-FIND-001 | `hcr:DashboardView[level=2]` → `hcr:Finding` | renders |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| SlideDeck pipeline | PNG chart exports + data JSON for slide generation |
| `pfc-proposal-composer` | Dashboard screenshots embedded in proposals |
| Customer portal | Embeddable widget JS files |

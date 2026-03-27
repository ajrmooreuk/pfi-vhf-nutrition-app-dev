---
name: pfc-kpi
description: Defines KPIs with formulas, thresholds, data sources, and BSC perspective classification. Completes the VSOM>BSC>KPI golden chain. Follows KPI-ONT v1.0.0.
argument-hint: "[okr output file, vsom output file, or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-KPI: KPI Definition & BSC Classification

Define Key Performance Indicators with formulas, thresholds, data sources, and BSC perspective classification. Completes the VSOM>BSC>KPI golden chain by operationalising VSOM metrics and OKR Key Results into measurable, owned KPIs.

## Dtree Classification

`SKILL_STANDALONE` — Low autonomy (structured template workflow), no orchestration, single-concern.

**Path:** HG-01 FAIL (3.3) -> HG-04 PASS (6.5, override from PARTIAL due to 8 sections + 5 gates) -> SKILL_STANDALONE

## What You Do

When the user invokes `/azlan-github-workflow:pfc-kpi`, follow these 8 sections in order. Each section has a quality gate that MUST pass before proceeding.

---

### Section 1: Measurement Loading

Load the upstream measurement artefacts that feed KPI definition:

- **OKR output** — `ve-pipeline-output/04-okr-{instance}-v*.jsonld` containing Objectives and Key Results
- **VSOM output** — `ve-pipeline-output/02-vsom-{instance}-v*.jsonld` containing metrics from the strategy framework
- **BSC perspectives** — from BSC-ONT or VSOM BSC strategy map (Financial, Customer, Internal Process, Learning & Growth)

If the user provides a PFI instance name, auto-resolve paths using the naming convention.

Extract and index:
- **OKR Key Results** — each KR with its parent Objective, target value, and measurement period
- **VSOM Metrics** — each metric with its parent Objective, formula (if specified), and leading/lagging classification
- **BSC Perspective Map** — which objectives sit under which BSC perspective

If upstream files are missing, ask the user to run `pfc-okr` and/or `pfc-vsom` first.

**Quality Gate G1 -- OKR Loaded:**
- [ ] OKR Key Results loaded and indexed
- [ ] Each KR has a parent Objective reference
- [ ] VSOM metrics loaded (or user confirms VSOM-only or OKR-only mode)

---

### Section 2: KPI Identification

For each OKR Key Result, determine the relationship to KPIs:

1. **KR IS the KPI** — the Key Result is directly measurable and becomes a KPI (e.g. "Increase NPS to 70" -> KPI: NPS Score)
2. **KPI feeds KR** — the Key Result is a composite or outcome, and one or more KPIs contribute to it (e.g. "Reduce churn to <5%" -> KPIs: Monthly Churn Rate, Voluntary Churn Rate, Involuntary Churn Rate)

Also scan VSOM metrics that are NOT covered by OKR KRs — these become standalone KPIs.

**De-duplication:** Where multiple KRs reference the same underlying measurement, create ONE KPI and link it to all parent KRs. Record the mapping in a KR-to-KPI index.

Present the KPI candidate list to the user for confirmation before proceeding.

---

### Section 3: KPI Definition

For each confirmed KPI, define the full specification:

| Field | Description |
|-------|-------------|
| `kpiId` | `KPI-{INSTANCE}-{SEQ}` (e.g. `KPI-BAIV-001`) |
| `name` | Concise metric name (e.g. "Monthly Active Users") |
| `description` | What this KPI measures and why it matters |
| `formula` | Calculation formula (e.g. `revenue / customers` or `count(active_users, period=30d)`) |
| `unit` | Measurement unit (%, GBP, count, days, ratio, score) |
| `dataSource` | System or process that produces the raw data |
| `frequency` | Measurement cadence (daily, weekly, monthly, quarterly) |
| `parentKRs` | OKR Key Result(s) this KPI serves |
| `parentMetrics` | VSOM Metric(s) this KPI operationalises |

**Quality Gate G2 -- KPI Definition Complete:**
- [ ] Every KPI has a formula defined
- [ ] Every KPI has a unit specified
- [ ] Every KPI has a data source identified
- [ ] Every KPI has a measurement frequency set

---

### Section 4: Threshold Setting

For each KPI, define Red/Yellow/Green thresholds and direction:

| Field | Description |
|-------|-------------|
| `direction` | `higher-is-better` or `lower-is-better` |
| `greenThreshold` | Target met or exceeded |
| `yellowThreshold` | Needs attention — within tolerance |
| `redThreshold` | Below acceptable — intervention required |

**Direction validation:**
- `higher-is-better`: green >= yellow > red (e.g. NPS: green >= 70, yellow >= 50, red < 50)
- `lower-is-better`: green <= yellow < red (e.g. Churn: green <= 3%, yellow <= 5%, red > 5%)

**Quality Gate G3 -- Thresholds Valid:**
- [ ] Every KPI has all 3 thresholds (red, yellow, green) defined
- [ ] Direction is explicitly stated for each KPI
- [ ] Threshold ordering is consistent with direction (no contradictions)

---

### Section 5: BSC Classification

Classify each KPI by BSC perspective and leading/lagging indicator type:

| Field | Description |
|-------|-------------|
| `bscPerspective` | `financial` / `customer` / `internal-process` / `learning-growth` |
| `indicatorType` | `leading` (predictive, actionable) or `lagging` (outcome, historical) |
| `causalHypothesis` | Which leading KPIs drive which lagging KPIs (optional, from BSC strategy map) |

**BSC Perspective Guidelines:**
- **Financial** — revenue, cost, margin, ROI, CLV
- **Customer** — NPS, CSAT, churn, acquisition, retention
- **Internal Process** — cycle time, throughput, defect rate, automation %
- **Learning & Growth** — training hours, skill coverage, innovation pipeline, employee engagement

**Leading/Lagging Mix:**
- A healthy KPI set has a balance of leading and lagging indicators
- Leading indicators should outnumber lagging (aim for 60:40 leading:lagging ratio)
- Each lagging KPI should have at least one leading KPI in its causal chain

**Quality Gate G4 -- BSC Coverage:**
- [ ] All 4 BSC perspectives have at least one KPI assigned
- [ ] Both leading AND lagging indicator types are present
- [ ] No perspective has only lagging indicators (must have at least one leading)

---

### Section 6: Data Source Mapping

For each KPI, detail the data collection specifics:

| Field | Description |
|-------|-------------|
| `system` | Source system (e.g. HubSpot, GA4, Stripe, Azure Monitor, internal DB) |
| `collectionMethod` | API pull, webhook, manual entry, ETL batch, calculated |
| `ownerRole` | RRR role responsible for data quality (ref to `rrr:Role`) |
| `refreshCadence` | How often data is refreshed (may differ from measurement frequency) |
| `dataQualityNotes` | Known limitations, lag, or accuracy concerns |

**RRR Role Alignment:**
- Every KPI must have an `ownerRole` that maps to an `rrr:Role` from the RRR-ONT
- The owner is accountable for data accuracy and timeliness
- If no RRR output exists yet, record role names and flag for later alignment

---

### Section 7: Output Assembly

Assemble the KPI definition set into JSON-LD format following KPI-ONT v1.0.0.

**Output file:** `ve-pipeline-output/06-kpi-{instance}-v1.0.0.jsonld`

**JSON-LD structure:**
```json
{
  "@context": "https://baiv.co.uk/context/kpi-ont/v1",
  "@type": "KPIDefinitionSet",
  "instance": "{instance}",
  "version": "1.0.0",
  "kpis": [
    {
      "@type": "kpi:KeyPerformanceIndicator",
      "kpiId": "KPI-{INSTANCE}-001",
      "name": "...",
      "description": "...",
      "formula": "...",
      "unit": "...",
      "dataSource": { "system": "...", "collectionMethod": "...", "ownerRole": "..." },
      "frequency": "...",
      "thresholds": {
        "direction": "higher-is-better",
        "green": "...",
        "yellow": "...",
        "red": "..."
      },
      "bscPerspective": "...",
      "indicatorType": "leading",
      "parentKRs": ["..."],
      "parentMetrics": ["..."]
    }
  ],
  "krToKpiIndex": { "KR-001": ["KPI-{INSTANCE}-001", "KPI-{INSTANCE}-003"] },
  "metricToKpiIndex": { "METRIC-001": ["KPI-{INSTANCE}-001"] },
  "bscSummary": {
    "financial": { "count": 0, "leading": 0, "lagging": 0 },
    "customer": { "count": 0, "leading": 0, "lagging": 0 },
    "internal-process": { "count": 0, "leading": 0, "lagging": 0 },
    "learning-growth": { "count": 0, "leading": 0, "lagging": 0 }
  }
}
```

**Quality Gate G5 -- No Orphan Metrics:**
- [ ] Every VSOM metric maps to at least one KPI
- [ ] Every OKR Key Result maps to at least one KPI
- [ ] No KPI exists without a parent KR or parent metric (no orphan KPIs)
- [ ] Output file validates against KPI-ONT v1.0.0 schema

---

### Section 8: Validation & Summary

Perform final validation checks and present summary to user:

1. **KPI Count by BSC Perspective** — table showing count, leading, lagging per perspective
2. **Coverage Check** — any VSOM metrics or OKR KRs without a KPI?
3. **Threshold Consistency** — any direction contradictions?
4. **Data Source Gaps** — any KPIs with `manual entry` or `TBD` data sources?
5. **Leading/Lagging Ratio** — actual ratio vs 60:40 target

**Summary table format:**
```
| BSC Perspective    | KPIs | Leading | Lagging | Coverage |
|--------------------|------|---------|---------|----------|
| Financial          |    3 |       2 |       1 | 100%     |
| Customer           |    4 |       3 |       1 | 100%     |
| Internal Process   |    5 |       3 |       2 | 100%     |
| Learning & Growth  |    2 |       1 |       1 | 100%     |
| TOTAL              |   14 |       9 |       5 | 100%     |
```

Report any warnings or recommendations for KPI refinement.

---

## PFI Instance Customisation

### W4M-WWG (UK Specialist Food Importer)
- **Corridor-specific KPIs** — each source corridor (AU, NZ, Iceland, Ireland -> UK) may have per-corridor targets
- `crossGraph: true` flag on corridor KPIs to indicate cross-corridor aggregation
- Data sources: supply chain ERP, customs/logistics platforms, internal spreadsheets
- Typical perspectives: heavy on Internal Process (fulfilment) and Financial (margin per corridor)

### BAIV (MarTech Platform)
- Data sources: **HubSpot** (CRM/marketing), **GA4** (web analytics), **Stripe** (payments/revenue)
- API-first collection methods for most KPIs
- Typical perspectives: heavy on Customer (acquisition/retention) and Financial (MRR/ARR)

### AIRL (Azure AI Readiness)
- Data sources: **Azure Governance** tools, **CAF Assessment** tool, compliance dashboards
- Typical perspectives: heavy on Internal Process (governance maturity) and Learning & Growth (readiness scores)

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| KPI-ONT v1.0.0 | Core KPI schema | `kpi:` |
| OKR-ONT v2.1.0 | Upstream Key Results | `okr:` |
| VSOM-ONT v3.0.0 | Upstream Metrics + Objectives | `vsom:` |
| BSC-ONT v1.0.0 | BSC perspective classification | `bsc:` |
| RRR-ONT v4.0.0 | Data source owner roles | `rrr:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-BSC-001` | VSOM>BSC>KPI golden chain — Objective -> BSC Perspective -> KPI |
| `KPI>OKR bridge` | KPI.parentKRs -> okr:KeyResult (many-to-many) |
| `KPI>RRR` | KPI.dataSource.ownerRole -> rrr:Role (data source ownership) |

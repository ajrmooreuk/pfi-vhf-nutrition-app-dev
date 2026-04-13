---
name: pfc-grc-drift
description: AGENT_AUTONOMOUS continuous MCSB compliance drift detection — compares live compliance state against SPC baseline, applies 5 detection rules (score breach, new non-compliance, policy removal, resource addition, trend), generates drift alerts. Designed for recurring scheduled execution.
argument-hint: "[Azure tenant context] [--scope mg:<id>|sub:<id>] [--sensitivity high|normal|low]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-grc-drift — Continuous Compliance Drift Detection

**Skill ID:** SKL-094
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.20
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 5.8 — 5 detection rules, SPC comparison, alert generation, root cause indication
HG-02 (Autonomy):   8.5 — fully autonomous for drift detection; escalation only on Critical drift
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You continuously monitor MCSB compliance posture for drift from the established SPC baseline. On each run you invoke `azure-compliance` to get the current live state, compare against the baseline LCL/UCL per domain, apply 5 detection rules, classify drift severity, identify root causes, and generate structured drift alerts. You are designed for recurring scheduled execution (daily/weekly) as Stage 7 of `pfc-alz-pipeline`.

For Critical drift (domain score below LCL with MUST-BE Kano classification, or policy removed from security-critical domain): auto-escalate — generate HC-GRC-DRIFT-1 checkpoint and flag to `pfc-grc-remediate`.

---

## Section 1: Baseline & Live State Ingestion

**Quality Gate G1: Baseline loaded, live compliance state captured**

1. Load SPC baseline from `pfc-grc-baseline` output (`baseline-<tenantId>.json`)
   - Per-domain: mean, UCL, LCL, stability status, target
   - Overall posture: mean, UCL, LCL
2. Load sensitivity setting (`--sensitivity`):
   - `high`: alert at UCL − 10% (earlier warning)
   - `normal`: alert at LCL breach (default)
   - `low`: alert only at LCL − 10% (reduce noise for mature programmes)
3. Invoke `azure-compliance` → current MCSB initiative compliance state (same scope as baseline)
4. Invoke `azure-resource-lookup` → resource inventory snapshot (detect new resource deployments)
5. Record run timestamp

**G1 checkpoint:** Baseline loaded ✓ | Live compliance state captured ✓ | Resource inventory snapshot taken ✓

---

## Section 2: Five-Rule Drift Detection

**Quality Gate G2: All 5 detection rules applied, drift findings collected**

Apply each detection rule:

### Rule 1: Score Drift — Domain Below LCL
```
Trigger: current_score < LCL for any domain
Severity: Critical if Kano=MUST-BE and score < LCL − 10
          High if Kano=MUST-BE and LCL − 10 ≤ score < LCL
          High if Kano=PERFORMANCE and score < LCL
          Medium if Kano=ENABLING and score < LCL
Root cause indicators: query policy compliance delta, new resource count, RBAC changes
```

### Rule 2: New Non-Compliance — Previously Compliant Control Fails
```
Trigger: control was compliant at last assessment, is now non-compliant
Severity: inherits from control's domain Kano + RMF risk rating
Root cause indicators: resource ID, deployment date (detect recently deployed resource)
```

### Rule 3: Policy Removal — MCSB Policy Assignment Removed or Disabled
```
Trigger: invoke pfc-grc-mcsb-policy → detect missing policy assignments vs. baseline
Severity: Critical if security-critical policy (Defender plans, identity, network deny)
          High if compliance policy
Root cause indicators: change log query (who removed/disabled)
```

### Rule 4: Resource Drift — New Resource Deployed Without Policy Coverage
```
Trigger: resource in inventory not covered by MCSB policy assignments
Severity: High if resource is security-significant (VM, storage, network, AI)
          Medium otherwise
Root cause indicators: resource deployment date, deploying principal
```

### Rule 5: Trend Drift — Consecutive Declining Assessments
```
Trigger: 3+ consecutive data points showing decreasing score for same domain
Severity: High (trend suggests systemic degradation)
Root cause indicators: correlate with resource deployment activity, team changes
```

For each drift finding:
- Domain, rule triggered, current score, baseline reference (LCL/previous score)
- Severity: Critical / High / Medium / Low
- Root cause indicator (policy change / new resource / config change / unknown)
- Delta: how far from LCL / previous state

**G2 checkpoint:** All 5 rules applied ✓ | Drift findings collected with severity and root cause ✓

---

## Section 3: Drift Severity Classification & Escalation

**Quality Gate G3: Drift findings classified, Critical escalation triggered if required**

Classify overall drift status:
- **No Drift**: No rules triggered — all domains within control limits and stable
- **Minor Drift**: Only Rule 5 (trend) or low-severity Rule 4 triggers — monitor closely
- **Moderate Drift**: High-severity findings present — schedule remediation
- **Critical Drift**: Any Critical finding (security policy removed, MUST-BE domain below LCL)

**HC-GRC-DRIFT-1 (Auto-Escalation — Critical Drift Only):**

Triggered automatically if any Critical drift finding:
- Summarise Critical findings immediately: domain, trigger, evidence
- Flag: "Compliance regression detected — immediate review required"
- Recommend: invoke `pfc-grc-mcsb-policy` to restore missing policies, or `pfc-grc-remediate` for control gap

**G3 checkpoint:** Overall drift status classified ✓ | HC-GRC-DRIFT-1 raised if Critical ✓

---

## Section 4: Root Cause Indication & Recommended Actions

**Quality Gate G4: Root cause indicated per finding, recommended actions produced**

For each drift finding, produce root cause indication:

| Root Cause Type | Detection Evidence | Typical Resolution |
|---|---|---|
| Policy removed | Policy assignment absent vs. baseline | Re-assign via `pfc-grc-mcsb-policy` |
| New resource unprotected | Resource deployment date after last assessment | Apply policy, configure Defender |
| Config changed | Resource config delta from last assessment | Investigate change, restore or justify |
| RBAC drift | New role assignment at sensitive scope | Review, revoke if unauthorised |
| Systematic degradation | Trend across multiple domains | Run full `pfc-grc-mcsb-assess` |
| Unknown | No clear root cause indicator | Manual investigation required |

Recommended action per finding:
- **P0 (Critical)**: Immediate — trigger `pfc-grc-mcsb-policy` or `pfc-grc-remediate` now
- **P1 (High)**: Same-day review and remediation scheduled
- **P2 (Medium)**: Next sprint remediation backlog
- **P3 (Low)**: Monitoring — include in next monthly assessment

**G4 checkpoint:** Root cause indicated per finding ✓ | Recommended actions with priority produced ✓

---

## Section 5: Drift Alert Output

**Quality Gate G5: Structured drift alert package produced, history log updated**

Produce drift alert package:

1. **Drift Summary**: overall status, total findings by severity, domains affected
2. **Finding Detail**: per finding — rule, domain, severity, root cause, recommended action, evidence
3. **Score Comparison Table**: per domain — baseline mean, LCL, current score, delta, status
4. **Trend Chart Data**: historical score trajectory with current point marked (for `pfc-grc-mcsb-report`)
5. **Action Queue**: ordered remediation actions for `pfc-grc-remediate` consumption

Append run to drift history log (`drift-log-<tenantId>.json`):
```json
{
  "runDate": "YYYY-MM-DD",
  "overallStatus": "Moderate Drift",
  "findings": 3,
  "critical": 0, "high": 2, "medium": 1, "low": 0,
  "domainsAffected": ["PA", "NS"]
}
```

**G5 checkpoint:** Drift alert package produced ✓ | History log updated ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Domain entities, control compliance state |
| GRC-FW-ONT | v3.0.0 | Governance control context for policy drift |
| ERM-ONT | v1.0.0 | Risk categorisation for drift severity |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-mcsb-report` (SKL-100) | Drift findings + trend chart data for trend reporting |
| `pfc-grc-remediate` (SKL-099) | P0/P1 action queue for immediate remediation backlog update |
| `pfc-grc-baseline` (SKL-092) | Drift run triggers baseline update on next full assessment |
| `pfc-alz-pipeline` (SKL-112) | Stage 7 output — continuous assurance drift alerts |

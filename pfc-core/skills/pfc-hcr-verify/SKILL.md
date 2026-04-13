---
name: pfc-hcr-verify
description: AGENT_SUPERVISED independent verification and assurance — evidence integrity checking (hash chain), methodology audit (weights, scoring consistency), 10% sample re-execution of MCP calls, cross-reference validation, and formal hcr:VerificationAttestation. Produces pass/conditional-pass/fail attestation for Part IV of the HCR.
argument-hint: "[hcr evidence set or 'use findings'] [--sample-rate 0.1] [--verifier-id 'name'] [--re-execute]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,mcp__azure-skills__*"
---

# pfc-hcr-verify — Independent Verification & Assurance

**Skill ID:** SKL-109
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.25c
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.5 — 5-step verification process, hash chain, methodology audit, MCP sample re-execution, formal attestation
HG-02 (Autonomy):   6.0 — human checkpoint: independent reviewer (not assessment author) signs attestation
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You provide independent assurance for the Health Check Report. You verify that the evidence is intact and attributable, that the scoring methodology is correctly applied, and that a sample of MCP evidence calls can be re-executed consistently. You operate as an independent assurance layer — separate from the assessment team — and produce a formal `hcr:VerificationAttestation` that records scope, methodology, findings, and attestation status. You pause at HC-HCR-VERIFY-1 for a human reviewer to sign off before attestation enters the final report.

---

## Section 1: Evidence Set Ingestion & Integrity Preparation

**Quality Gate G1: Full evidence set loaded, integrity check prepared**

Load the complete `hcr:Evidence` set from the assessment:

| Evidence Type | Source | Expected Items |
|---|---|---|
| KQL query results | azure-skills MCP calls | One per finding with log/query evidence |
| Policy export JSON | `azure-compliance`, `azure-rbac` MCP calls | Policy assignments, RBAC bindings |
| Configuration snapshots | `azure-resource-lookup`, `azure-diagnostics` | Resource configs, diagnostic settings |
| MCSB compliance data | `azure-compliance` | Per-control compliance status |
| Posture scores | `pfc-grc-posture` (SKL-098) | Domain scores, unified posture score |
| Assessment metadata | FDN context | Timestamps, scope, engagement reference |

For each evidence item, prepare integrity record:
```
{
  "evidenceId": "EV-[N]",
  "sourceSkill": "pfc-alz-assess-cyber",
  "mcpCall": "azure-compliance:get-mcsb-status",
  "timestamp": "ISO-8601",
  "contentHash": "SHA-256 of response content",
  "findingLinks": ["F-088-01", "F-088-02"],
  "verificationStatus": "pending"
}
```

Load `pfc-hcr-analyse` outputs for consistency checking baseline.
Load `pfc-alz-assess-*` scoring methodology documentation (weight tables, three-state model parameters).

**G1 checkpoint:** Full evidence set loaded ✓ | Integrity records prepared ✓ | Methodology documentation loaded ✓

---

## Section 2: Evidence Integrity Verification

**Quality Gate G2: Evidence hash chain verified, timestamps and source attribution confirmed**

Execute five integrity checks per evidence item:

**Check 1 — Hash Verification:**
```
Re-compute SHA-256 of stored evidence content.
Compare against stored hash.
Result: MATCH | MISMATCH
If MISMATCH: flag as integrity failure — evidence may have been altered post-collection.
```

**Check 2 — Timestamp Validation:**
```
Confirm all evidence timestamps fall within the assessment window.
Assessment window: [start_date] to [end_date] from FDN context.
Flag evidence outside window as: STALE (pre-window) or POST-ASSESSMENT (post-window).
Stale evidence: note that environment may have changed since collection.
```

**Check 3 — Source Attribution:**
```
Confirm each evidence item has an identifiable source MCP call.
Unattributed evidence (manually entered or copy-pasted): flag as UNVERIFIABLE.
All azure-skills MCP calls have call IDs — verify call ID present on each item.
```

**Check 4 — Finding Linkage:**
```
Confirm every finding in pfc-hcr-analyse finding set has at least one evidence item linked.
Findings with no evidence: flag as UNSUPPORTED — must be noted in attestation.
Evidence items not linked to any finding: flag as ORPHANED — may indicate scope gap.
```

**Check 5 — Completeness Coverage:**
```
Check that all 12 MCSB control families have evidence coverage.
Check that all 5 WAF pillars have evidence coverage.
Check that all 7 AZALZ domains have evidence coverage.
Flag any domains with zero evidence items as COVERAGE GAP.
```

Produce Evidence Integrity Report:
```
Items assessed:    [N]
MATCH:             [N] ([N]%)
MISMATCH:          [N] → immediate escalation
STALE:             [N] → note in scope statement
UNVERIFIABLE:      [N] → note in attestation
UNSUPPORTED findings: [N] → list by finding ID
Coverage gaps:     [N] domains
```

**G2 checkpoint:** All evidence hashes verified ✓ | Timestamp and attribution checks complete ✓ | Integrity report produced ✓

---

## Section 3: Methodology Audit

**Quality Gate G3: Scoring methodology validated for correctness and consistency**

Audit the assessment scoring methodology across four dimensions:

**Dimension 1 — Weight Validation:**
```
Three-state scoring model weights (from pfc-alz-assess-cyber SKL-088):
  MCSB component weight: 0.40
  OWASP component weight: 0.25
  WAF component weight: 0.20
  AI Security weight: 0.15
  Sum check: 0.40 + 0.25 + 0.20 + 0.15 = 1.00 ✓

AZALZ Health domain weights (from pfc-alz-assess-health SKL-089):
  Management Groups: 15%, Hub Network: 20%, Spoke: 15%, Policy: 20%,
  RBAC: 15%, Diagnostics: 5%, Identity: 10%
  Sum check: 15+20+15+20+15+5+10 = 100% ✓

Flag any weight set where Σ ≠ 1.00 as WEIGHT_ERROR.
```

**Dimension 2 — Gap Calculation Consistency:**
```
Three-state gap formula (from pfc-grc-mcsb-benchmark SKL-093):
  Gap₁ = Best_Practice − Desired_Destination (accepted risk)
  Gap₂ = Desired_Destination − Current_State (remediation gap)
  Total gap = Gap₁ + Gap₂

Verify: Gap₂ = Desired − Current for 10% sample of findings.
Flag inconsistencies where: Desired < Current (negative gap — scoring error).
```

**Dimension 3 — RMF Risk Scoring Consistency:**
```
RMF composite = Impact × Likelihood (ISO 27005 5×5 matrix)
Critical: composite ≥ 20 | High: 15–19 | Medium: 8–14 | Low: < 8

Sample 10% of risk-scored findings:
  Check composite = impact × likelihood value
  Check severity label matches composite range
  Flag any findings where label ≠ range (SCORING_INCONSISTENCY)
```

**Dimension 4 — VE Priority Weighting Validation:**
```
VE priority formula (from pfc-grc-remediate SKL-099):
  Priority = (Risk × 0.4) + (VE × 0.3) + (Effort⁻¹ × 0.3)

Sample 10% of prioritised backlog items:
  Recalculate priority score from components
  Flag any items where recalculated score differs by > 5% (PRIORITY_ERROR)
```

**G3 checkpoint:** All 4 methodology dimensions audited ✓ | Errors flagged ✓ | Consistent findings confirmed ✓

---

## Section 4: Sample Re-Execution

**Quality Gate G4: 10% of MCP evidence calls re-executed, consistency confirmed**

If `--re-execute` flag set (default: execute):

```
Sample selection:
  Rate: --sample-rate (default 10% of total MCP calls)
  Selection: random across all source skills and call types
  Minimum: 1 call per assessment skill (5 skills × 1 minimum = 5 minimum calls)

Re-execution procedure:
  For each selected evidence item:
    1. Re-execute the identical azure-skills MCP call
    2. Compare result to original evidence
    3. Classify result:
       CONSISTENT:   result matches original (within acceptable drift)
       ENVIRONMENT_DRIFT: result differs due to environment change post-assessment
                         (e.g., new resources deployed, policy changed)
       TOOL_ERROR:   original call returned error; re-execution succeeds or vice versa
       DISCREPANCY:  significant difference with no environmental explanation → flag
```

Acceptable drift thresholds:
```
MCSB compliance percentages: ±2% (minor environment changes)
Resource count: ±5 resources (deployment/deletion normal)
RBAC binding count: ±10 bindings (routine access management)
Policy assignment count: ±2 policies (routine governance changes)

If drift > threshold: classify as ENVIRONMENT_DRIFT and document change timeline.
```

Re-execution summary:
```
Calls re-executed:    [N] ([N]% of total)
CONSISTENT:           [N] ([N]%)
ENVIRONMENT_DRIFT:    [N] → documented with timeline
TOOL_ERROR:           [N] → investigate
DISCREPANCY:          [N] → escalate for investigation
```

**G4 checkpoint:** Sample re-execution complete ✓ | Consistency rate documented ✓ | Discrepancies escalated ✓

---

## Section 5: Attestation Composition & HC-HCR-VERIFY-1

**Quality Gate G5: hcr:VerificationAttestation produced, HC-HCR-VERIFY-1 confirmed**

**HC-HCR-VERIFY-1 (Human Checkpoint — Verification Attestation Sign-off):**

Present verification findings to independent reviewer (not the assessment author):

```
VERIFICATION SUMMARY — [Customer] — [Date]

Evidence Integrity:   [N] items | [N]% MATCH | [N] issues
Methodology Audit:    [Pass / [N] errors found]
Sample Re-execution:  [N] calls | [N]% consistent
Cross-references:     [N] findings checked | [N] inconsistencies

PROPOSED ATTESTATION STATUS:
  □ PASS — all checks passed or issues minor and documented
  □ CONDITIONAL PASS — [N] issues noted; report valid with stated limitations
  □ FAIL — evidence integrity or methodology errors require re-assessment

Please confirm attestation status and sign off before this enters the final report.
```

Await independent reviewer confirmation. Record reviewer identity as `hcr:Verifier`.

**hcr:VerificationAttestation entity:**

```json
{
  "type": "hcr:VerificationAttestation",
  "engagementRef": "[FDN engagement reference]",
  "assessmentDate": "[ISO-8601]",
  "verificationDate": "[ISO-8601]",
  "verifier": { "id": "--verifier-id", "role": "independent-reviewer" },
  "scope": "Full evidence set from SKL-086 to SKL-106",
  "excluded": ["[any items excluded from scope]"],
  "integrityStatus": "PASS | CONDITIONAL | FAIL",
  "methodologyStatus": "PASS | [errors listed]",
  "reExecutionStatus": "PASS | ENVIRONMENT_DRIFT | DISCREPANCY",
  "attestationStatus": "PASS | CONDITIONAL_PASS | FAIL",
  "conditions": ["[any stated limitations]"],
  "attestationStatement": "This verification confirms that the evidence supporting the Health Check Report findings is intact, attributable, and consistently applied in accordance with the stated methodology, subject to the conditions noted above."
}
```

Output artefacts:
1. **Evidence Integrity Report**: hash check results, coverage gaps, unsupported findings
2. **Methodology Audit Report**: weight validation, scoring consistency, priority errors
3. **Re-Execution Report**: consistency rate, environment drift timeline, discrepancies
4. **Verification Findings Log**: all issues identified, severity, disposition
5. **`hcr:VerificationAttestation`**: formal entity for Part IV of HCR
6. **Attestation Statement**: formatted for inclusion in report

**G5 checkpoint:** HC-HCR-VERIFY-1 confirmed ✓ | hcr:VerificationAttestation produced ✓ | All 6 output artefacts ready ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| HCR-ONT | v1.0.0 | `hcr:Evidence`, `hcr:VerificationAttestation`, `hcr:Verifier` |
| RMF-IS27005-ONT | v1.0.0 | Methodology framework for risk scoring audit |
| MCSB-ONT | v2.0.0 | Domain weight validation reference |
| QVF-ONT | v1.0.0 | Financial estimate reasonableness bounds |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-VERIFY-ATT-001 | `hcr:Evidence` → `hcr:VerificationAttestation` | supportsAttestation |
| JP-VERIFY-FIND-001 | `hcr:Finding` → `hcr:Evidence` | supportedBy |
| JP-VERIFY-VERIFIER-001 | `hcr:VerificationAttestation` → `hcr:Verifier` | signedBy |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-hcr-compose` (SKL-107) | `hcr:VerificationAttestation` + attestation statement for Part IV |
| `pfc-hcr-dashboard` (SKL-110) | Verification status indicators for evidence chain views |

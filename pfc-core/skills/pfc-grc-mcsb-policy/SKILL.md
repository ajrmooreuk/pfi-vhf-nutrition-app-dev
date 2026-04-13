---
name: pfc-grc-mcsb-policy
description: AGENT_AUTONOMOUS Azure Policy audit — enumerates all policy assignments at scope, maps to MCSB control domains, identifies coverage gaps, detects deprecated ASB remnants and conflicts, generates prioritised remediation plan. Produces policy coverage matrix.
argument-hint: "[Azure tenant context] [--scope mg:<id>|sub:<id>] [--mode audit|full]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-grc-mcsb-policy — Azure Policy Audit & Remediation

**Skill ID:** SKL-097
**Version:** v1.0.0
**Type:** AGENT_AUTONOMOUS
**Feature:** F74.20c
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.2 — policy enumeration, MCSB mapping, gap detection, conflict analysis, remediation plan
HG-02 (Autonomy):   7.5 — fully autonomous for audit mode; escalates only on policy removal from critical domain
Classification:     AGENT_AUTONOMOUS
```

---

## What You Do

You autonomously audit all Azure Policy assignments at the specified scope, map each assignment to an MCSB control domain via MCSB-ONT, identify gaps (MCSB controls without policy enforcement), detect deprecated ASB policy remnants still active, flag conflicts and duplicates, and generate a prioritised remediation plan. You run without human intervention in `--mode audit`; Critical policy gaps trigger HC-GRC-POLICY-1 escalation.

---

## Section 1: Policy Assignment Enumeration

**Quality Gate G1: All policy assignments enumerated at scope**

1. Invoke `azure-compliance` → enumerate all policy initiative and individual policy assignments at scope (MG/subscription)
2. For each assignment record:
   - Policy definition name and ID
   - Policy set (initiative) membership
   - Assignment scope (MG level / subscription level / resource group)
   - Effect (audit / deny / deployIfNotExists / modify / disabled)
   - Compliance percentage at assignment
   - Non-compliant resource count
3. Invoke `azure-validate` → check for policy exemptions that may mask non-compliance
4. Record total assignment count, scope coverage

**G1 checkpoint:** All policy assignments enumerated ✓ | Exemptions recorded ✓

---

## Section 2: MCSB Control Domain Mapping

**Quality Gate G2: All assignments mapped to MCSB domains, coverage matrix built**

Map each policy assignment to MCSB control domain via MCSB-ONT lookup:

```
For each policy assignment:
  lookup MCSB-ONT.policyToControlMapping[policy_definition_id]
  → returns: mcsb_domain (NS/IM/PA/...), mcsb_control_id (e.g., IM-3), confidence (direct/inferred)

  if no mapping found:
    → classify as: ASB_LEGACY (known ASB policy), CUSTOM (tenant-specific), UNRECOGNISED
```

Build coverage matrix per MCSB domain:

| MCSB Domain | Controls Requiring Policy | Policies Assigned | Coverage % |
|---|---|---|---|
| NS | 10 | 7 | 70% — Gap: NS-4, NS-5, NS-7 unenforced |
| IM | 9 | 6 | 67% — Gap: IM-7 legacy auth not blocked |
| PA | 8 | 4 | 50% — Gap: PA-2 PIM not enforced by policy |
| ... | ... | ... | ... |

Flag domains with coverage < 60% as High priority for remediation.
Flag domains with coverage < 40% as Critical priority.

**G2 checkpoint:** All assignments mapped ✓ | Coverage matrix produced ✓ | Gap domains identified ✓

---

## Section 3: Legacy & Conflict Detection

**Quality Gate G3: Deprecated policies and conflicts identified**

**Deprecated ASB Policy Detection:**
```
For each assignment:
  if policy_definition_id in MCSB-ONT.deprecatedAsbPolicies:
    → flag as DEPRECATED
    → lookup replacement: MCSB-ONT.deprecatedAsbPolicies[id].replacedBy
    → check if replacement already assigned (avoid gap on removal)
```

List: deprecated policies still active — sorted by risk (are they still providing coverage where replacement isn't assigned?).

**Conflict Detection:**
```
Conflict types:
  1. DUPLICATE_EFFECT: same resource property governed by >1 policy with different definitions
  2. CONFLICTING_EFFECTS: one policy = deny, another = audit for same property (deny takes precedence — audit never fires)
  3. SCOPE_OVERLAP: subscription-level assignment duplicated by MG-level assignment (redundant)
  4. EXEMPTION_CONFLICT: exemption at lower scope contradicts higher-scope deny policy
```

**Critical Escalation — HC-GRC-POLICY-1:**
Auto-triggered if:
- MCSB security-critical domain (IM, PA, NS, GS) has coverage < 40%
- Deprecated ASB policy removed would create a coverage gap with no replacement

**G3 checkpoint:** Deprecated policies identified ✓ | Conflicts classified ✓ | HC-GRC-POLICY-1 raised if critical gap ✓

---

## Section 4: Policy Coverage Gap Analysis

**Quality Gate G4: Per-control gap list with recommended policy assignments**

For each MCSB control with no policy assignment:

1. Look up recommended policy definition(s) from MCSB-ONT policy catalogue
2. Determine appropriate effect:
   - Start with `audit` (visibility without disruption)
   - Recommend `deny` after remediation wave for network/identity controls
   - Recommend `deployIfNotExists` for resource configuration controls (auto-remediation)
3. Determine appropriate assignment scope (MG-level for LZ-wide controls, subscription for specific workloads)
4. Estimate compliance improvement from deploying this policy

Remediation priority per gap:
- Critical: security-critical control in MUST-BE domain, no policy coverage
- High: MUST-BE domain control, policy exists but in disabled/audit state where deny is required
- Medium: PERFORMANCE domain gap
- Low: ENABLING domain gap

**G4 checkpoint:** Per-control gap list produced ✓ | Recommended policy assignments with effect ✓ | Priority assigned ✓

---

## Section 5: Policy Remediation Plan Output

**Quality Gate G5: Prioritised policy remediation plan produced**

Output:

1. **Policy Coverage Matrix**: per domain — controls, policies assigned, coverage %, gaps
2. **Gap Remediation List**: per control gap — recommended policy definition, scope, effect, priority, expected compliance improvement
3. **Deprecated Policy Removal Plan**: ordered removal list with prerequisite (replacement must be assigned first)
4. **Conflict Resolution Plan**: per conflict — type, affected policies, recommended resolution
5. **Exemption Audit**: list of exemptions — verify each is still valid and documented
6. **Automation Opportunities**: controls where deployIfNotExists can auto-remediate non-compliant resources — estimated resource count auto-remediatable

**G5 checkpoint:** All 6 output artefacts produced ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Policy-to-control mapping, deprecated policy registry, recommended policy catalogue |
| GRC-FW-ONT | v3.0.0 | Governance control context |
| AZALZ-ONT | v1.0.0 | ALZ-specific policy assignments (Policy domain from health skill) |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-mcsb-assess` (SKL-091) | Policy coverage feeds domain scoring accuracy |
| `pfc-grc-drift` (SKL-094) | Policy assignment baseline for drift monitoring |
| `pfc-grc-plan` (SKL-096) | Phase 1 policy assignments list |
| `pfc-alz-assess-health` (SKL-089) | Policy assignment state feeds ALZ Domain 4 |

---
name: pfc-grc-mcsb-migrate
description: AGENT_SUPERVISED ASB→MCSB migration and version upgrade — auto-detects customer benchmark state (ASB v2/v3, MCSB v1, MCSB v2, or greenfield), maps control deltas, generates phased migration plan. Three scenarios: ASB→MCSB v1, MCSB v1→v2, greenfield v2 implementation.
argument-hint: "[Azure tenant context] [--source asb-v2|asb-v3|mcsb-v1|auto-detect] [--target mcsb-v1|mcsb-v2]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-grc-mcsb-migrate — ASB→MCSB Migration & Gap Analysis

**Skill ID:** SKL-095
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** F74.21
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 6.5 — version detection, control delta mapping, scenario branching, phased migration plan
HG-02 (Autonomy):   5.8 — human checkpoint to approve migration plan before execution begins
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You assess a customer's current security benchmark state and generate a migration plan to their target MCSB version. You auto-detect which benchmark initiatives (ASB v2/v3, MCSB v1, MCSB v2, or none) are assigned in the tenant, then branch into the appropriate scenario: ASB→MCSB v1 migration, MCSB v1→v2 upgrade, or greenfield MCSB v2 implementation. You map control deltas, identify deprecated policies to remove, identify new controls to implement, and produce a phased VE-prioritised migration roadmap.

You pause at HC-GRC-MIG-1 for the architect to approve the migration plan before execution.

---

## Section 1: Benchmark State Detection

**Quality Gate G1: Current benchmark state auto-detected, target version confirmed**

1. Invoke `azure-compliance` → enumerate all policy initiative assignments at scope
2. Detect benchmark state:

```
Check for MCSB v2 initiative (policySetDefinitionId contains 'mcsb-v2' or known GUID)
  → if found: customer is MCSB v2 early adopter → assess readiness for full compliance
Check for MCSB v1 initiative
  → if found: Scenario 2 (MCSB v1 → v2 upgrade)
Check for ASB v3 initiative (Legacy AzureSecurityCenter v3)
  → if found: Scenario 1 (ASB v3 → MCSB v1 or direct to v2)
Check for ASB v2 initiative
  → if found: Scenario 1 (ASB v2 → MCSB v1 or direct to v2)
None found
  → Scenario 3 (Greenfield — MCSB v2 implementation from zero)
```

3. Confirm target version: default `--target mcsb-v2` (recommend latest); allow `--target mcsb-v1` if customer requires staged approach
4. Invoke `azure-resource-lookup` → resource inventory (shapes AI Security domain relevance)
5. AI workload detection: if AI services present → AI Security domain (AI-1 to AI-7) is in scope

**G1 checkpoint:** Benchmark state detected ✓ | Scenario identified ✓ | Target version confirmed ✓ | AI scope flag set ✓

---

## Section 2: Control Delta Mapping

**Quality Gate G2: Full control delta produced for detected scenario**

### Scenario 1: ASB → MCSB

Map each ASB policy initiative control to MCSB equivalent via MCSB-ONT cross-reference:

```
For each ASB control:
  → Look up MCSB-ONT.asbToMcsbMapping[asb_control_id]
  → Classify:
      DIRECT_MAP:   ASB control maps 1:1 to MCSB control (policy update only)
      MERGED:       Multiple ASB controls merged into one MCSB control
      EXPANDED:     ASB control split into multiple MCSB controls
      DEPRECATED:   ASB control has no MCSB equivalent — remove
      NEW_IN_MCSB:  MCSB control with no ASB equivalent — implement fresh
```

Delta counts:
- Direct map (update policy definition): n controls
- Merged (simplification, verify coverage): n controls
- Expanded (additional work required): n controls
- Deprecated ASB policies to remove: n policies
- New MCSB controls to implement: n controls

New MCSB domains not in ASB: identify (typically: DevOps Security DS, expanded AI Security)

### Scenario 2: MCSB v1 → v2

Invoke `pfc-grc-mcsb-assess` with `--version v1` for current state baseline.

Delta between MCSB v1 and v2:
- New control additions in v2: list with domain, control ID, description
- Modified controls (same ID, updated definition): list — re-assess compliance
- New AI Security domain (AI-1 to AI-7): full implementation if AI workloads detected
- New policy definitions to deploy: count (v2 has 420+ policies vs v1)
- Deprecated v1 policies: remove from assignments

### Scenario 3: Greenfield

No delta mapping needed — full v2 implementation:
- Invoke `pfc-grc-mcsb-assess` with `--version v2` for zero-baseline posture
- All controls start as "to implement"
- Priority: VE-weighted domain order (MUST-BE domains first)
- Quick wins: controls auto-remediatable by Azure Policy deployIfNotExists effect

**G2 checkpoint:** Control delta produced for detected scenario ✓ | New/deprecated/modified controls identified ✓

---

## Section 3: Policy Assignment Plan

**Quality Gate G3: Policy assignment delta plan produced**

Generate concrete policy assignment actions:

**Add (new assignments):**
List policy initiative assignments or individual policies to add, with:
- Scope (MG or subscription), policy definition name/ID, effect (audit/deny/deployIfNotExists)
- Risk: deploy as audit first, then convert to deny after remediation wave

**Remove (deprecated):**
List legacy ASB policy assignments to remove, with:
- Confirm no MCSB equivalent will leave a gap
- Removal sequence: audit removal first (verify no active exemptions)

**Update (definition changes):**
List policy assignments where definition ID or parameters change between versions.

**Conflict Detection:**
- Scan for duplicate policy assignments (same control, multiple policies)
- Scan for conflicting effects (deny vs. audit on same resource property)

**G3 checkpoint:** Add/Remove/Update lists produced ✓ | Conflicts identified ✓

---

## Section 4: Migration Plan & HC-GRC-MIG-1

**Quality Gate G4: Phased migration plan produced, HC-GRC-MIG-1 architect approval**

Phased migration plan:

**Phase 1 — Policy Housekeeping (Week 1–2):**
- Remove all deprecated ASB policies
- Add MCSB initiative assignment (audit mode) — compliance state visible immediately
- Resolve policy conflicts

**Phase 2 — Quick Win Controls (Weeks 2–4):**
- Enable deployIfNotExists policies for auto-remediatable controls
- Target: new controls closeable without application changes
- Expected: significant compliance % improvement from automation

**Phase 3 — Core Implementation (Months 2–4):**
- Implement MUST-BE domain controls (IM, PA, GS) that require architectural work
- PERFORMANCE domain controls (NS, DP, LT)
- Convert high-confidence audit policies to deny

**Phase 4 — Destination (Month 4+):**
- Remaining controls implemented
- AI Security domain (if applicable) complete
- All deprecated policies removed, MCSB initiative in full enforcement mode

**HC-GRC-MIG-1 (Human Checkpoint — Migration Plan Approval):**

Present complete migration plan for architect review:
- Control delta summary (add/remove/update counts)
- Risk: any deny policies that may break existing deployments?
- Confirm Phase 1 policy removals are safe (no active exemptions relied upon)
- Confirm Phase 3 architectural changes are resourced

Await sign-off before proceeding.

**G4 checkpoint:** Migration plan produced ✓ | HC-GRC-MIG-1 confirmed ✓

---

## Section 5: Migration Output Package

**Quality Gate G5: Complete migration package produced**

Output:

1. **Migration Summary**: scenario, source version, target version, delta counts, phase summary
2. **Control Delta Register**: full list — control ID, action (add/remove/update), domain, effort, priority
3. **Policy Assignment Plan**: exact policy definitions, scope, effects, deployment sequence
4. **Phased Migration Roadmap**: phases, milestones, expected compliance score progression per phase
5. **AI Security Implementation Plan** (if applicable): AI-1 to AI-7 implementation sequence

**G5 checkpoint:** All 5 output artefacts produced ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | Control mapping, ASB→MCSB cross-reference table |
| GRC-FW-ONT | v3.0.0 | Governance policy assignment context |
| ERM-ONT | v1.0.0 | Risk rating for migration execution risk |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-grc-mcsb-assess` (SKL-091) | Post-migration — re-assess to confirm v2 baseline |
| `pfc-grc-plan` (SKL-096) | Migration roadmap phases feed compliance plan |
| `pfc-grc-mcsb-policy` (SKL-097) | Policy assignment plan feeds policy audit/remediation |

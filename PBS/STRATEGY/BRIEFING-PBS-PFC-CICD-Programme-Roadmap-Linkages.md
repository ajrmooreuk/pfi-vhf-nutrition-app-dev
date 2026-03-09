# CANDIDATE FEATURE: PBS-PFC-CICD.Programme-Roadmap-Linkages — Unified Change Control, Audit & Governance

## Status: PROPOSAL — For Review & Scoping

| Field | Value |
| --- | --- |
| **Date** | 2026-03-06 |
| **Version** | 1.0.0 |
| **Status** | CANDIDATE FEATURE — Awaiting Epic Assignment |
| **Classification** | CONFIDENTIAL — Strategic Planning Asset |
| **Candidate ID** | PBS-PFC-CICD.Programme-Roadmap-Linkages |
| **Parent Strategy** | Epic 34: PF-Core Graph-Based Agentic Platform Strategy (#518) |
| **VSOM Master** | Epic 60: Unified Platform Delivery (#859) |
| **Cross-References** | Epic 58 (#837) PFC Triad, Epic 59 (#840) DB Cascade, Epic 31 (#441) CI/CD, Epic 10A (#127) Security |
| **Ontology Alignment** | CICD-ONT v1.1.0, GRC-FW-ONT v3.0.0, PE-ONT v3.0.0, EMC-ONT v5.0.0 |

---

## 1. Problem Statement

Change control is currently **distributed and incomplete** across:

| What Exists | Where | Gaps |
|---|---|---|
| Release audit log | `PFC-Release-Audit-Log.md` (manual) | Manual entry, no automation, no CRUD granularity |
| Registry versioning | `ont-registry-index.json` v11.2.1 | Tracks ontology status/version but not per-entity CRUD mutations |
| Per-ontology changelogs | `CHANGELOG.md` (manual, per-ontology) | Inconsistent, not machine-readable, no linkage to issue/PR |
| guard-core.yml | PFI repos | Blocks human writes to pfc-core/ — protection not tracking |
| promote.yml | PFI/PFC triads | Creates PRs but no CC record of what changed and why |
| sync-registry.js | ontology-library/ | Recalculates metadata, doesn't log change events |
| Version pinning | `pfc-version`, `azlan-workflow-version` | Pin values tracked, no history of pin changes |
| drift-detection.yml | Planned (not live) | Spec exists, not yet deployed |
| DB schema changes | Epic 59 (planned) | `supabase db push --dry-run` planned, no CC layer yet |

**Core gap**: No unified, machine-readable change control system that:
1. Records **what** changed (entity/artifact/schema CRUD)
2. Records **why** (linked to issue/PR/epic)
3. Records **who** approved (SME, automated gate, or self)
4. Records **where** the change propagated (PFC→PFI cascade)
5. Enables **PFC to see everything**, **PFI to see only its own scope**

---

## 2. Proposed Architecture

### 2.1 Two-Tier Change Control Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    PFC CHANGE CONTROL                          │
│                                                                 │
│  Scope: ALL objects, ALL PFIs, ALL layers                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │ Registry   │  │ CI/CD      │  │ DB Schema  │               │
│  │ Changes    │  │ Pipeline   │  │ Migrations │               │
│  │            │  │ Events     │  │            │               │
│  │ Ontology   │  │ Release    │  │ Table/RLS  │               │
│  │ Entity     │  │ Promotion  │  │ Function   │               │
│  │ Instance   │  │ Convention │  │ Policy     │               │
│  │ Config     │  │ Sealed Sk. │  │ Trigger    │               │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘               │
│        │               │               │                       │
│        └───────┬───────┴───────┬───────┘                       │
│                │               │                                │
│         ┌──────▼──────┐ ┌─────▼──────┐                        │
│         │ CC Event    │ │ CC Audit   │                        │
│         │ Log         │ │ Report     │                        │
│         │ (JSONLD)    │ │ (per PFI)  │                        │
│         └─────────────┘ └────────────┘                        │
│                                                                 │
│  Can: Audit, Monitor, Analyse, Report ALL PFCs + ALL PFIs     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
    ┌───────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
    │ PFI-BAIV CC  │ │ PFI-AIRL │ │ PFI-W4M-*  │  ...
    │              │ │   CC     │ │    CC      │
    │ Scope: OWN   │ │ Scope:   │ │ Scope:     │
    │ registry,    │ │ OWN only │ │ OWN only   │
    │ objects,     │ │          │ │            │
    │ artifacts,   │ │          │ │            │
    │ changes      │ │          │ │            │
    │              │ │          │ │            │
    │ Can: Audit   │ │          │ │            │
    │ Monitor      │ │          │ │            │
    │ Analyse      │ │          │ │            │
    │ Report       │ │          │ │            │
    │ OWN SCOPE    │ │          │ │            │
    └──────────────┘ └──────────┘ └────────────┘
```

### 2.2 Change Event Schema (JSONLD)

Every trackable change produces a `ChangeEvent` record:

```jsonld
{
  "@context": "https://pf-core.io/cc/v1",
  "@type": "ChangeEvent",
  "@id": "CC-2026-03-06-001",
  "eventType": "UPDATE",           // CREATE | READ | UPDATE | DELETE | DEPRECATE | PROMOTE | RELEASE
  "timestamp": "2026-03-06T12:00:00Z",
  "actor": {
    "type": "human",               // human | github-actions | agent
    "identity": "ajrmooreuk"
  },
  "scope": {
    "tier": "pfc",                  // pfc | pfi
    "instance": "pfc-core",         // pfc-core | pfi-baiv | pfi-airl-caf-aza | ...
    "stage": "dev",                 // dev | test | prod
    "layer": "registry"             // registry | cicd | db | security | config
  },
  "target": {
    "type": "ontology",             // ontology | entity | relationship | instance-data | schema | workflow | skill | config
    "id": "VP-ONT",
    "version": "3.1.0",
    "path": "ontology-library/VE-Series/VP-ONT/vp-v3.1.0-oaa-v7.json"
  },
  "change": {
    "operation": "UPDATE",
    "fields": ["entities[vp:ValueProposition].subtypes"],
    "before": { "subtypeCount": 4 },
    "after": { "subtypeCount": 5 },
    "delta": "+1 subtype (vp:StrategicPartnerProposition)"
  },
  "governance": {
    "issueRef": "https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/900",
    "epicRef": "Epic 45 (#634)",
    "prRef": "https://github.com/ajrmooreuk/pfc-dev/pull/15",
    "approval": "self",             // self | peer-review | sme-approval | automated-gate
    "gates": ["oaa-v7-validate", "registry-lint", "vitest"]
  },
  "propagation": {
    "cascadeTo": ["pfi-baiv", "pfi-airl-caf-aza", "pfi-w4m-wwg"],
    "releaseTag": "pfc-v2.2.0",
    "promotionPath": "pfc-dev → pfc-test → pfc-prod → PFI dev repos"
  }
}
```

### 2.3 Ontology Alignment — Extending Existing Models

This feature extends three existing ontologies rather than creating a new one:

| Ontology | Extension | New Entities/Relationships |
|---|---|---|
| **CICD-ONT v1.1.0** | Add `ChangeEvent` entity type | `ChangeEvent`, `ChangePropagation`, `ChangeApproval` |
| **GRC-FW-ONT v3.0.0** | Add CC assurance type | `GovernanceAssurance.assuranceType: change-control-audit` |
| **PE-ONT v3.0.0** | Add CC process pattern | `Process.processType: change-control`, `ProcessArtifact.artifactType: change-event-log` |

**Alternatively** — if scope warrants a standalone ontology:

| Candidate | Series | Rationale |
|---|---|---|
| **CC-ONT** (Change Control Ontology) | PE-Series | If >10 entities needed; models CC lifecycle, event types, approval chains, propagation rules |

Decision point: extend existing vs. create CC-ONT — depends on entity count at design time.

---

## 3. Four Layers of Change Control

### 3.1 Layer 1: Registry Changes

| What's Tracked | Source | Event Types |
|---|---|---|
| Ontology added/updated/deprecated | `ont-registry-index.json` | CREATE, UPDATE, DEPRECATE |
| Entity added/removed within ontology | Ontology JSON files | CREATE, UPDATE, DELETE |
| Relationship added/removed | Ontology JSON files | CREATE, UPDATE, DELETE |
| PFI instance config changed | `pfiInstances[]` in registry | UPDATE |
| Series structure changed | `seriesRegistry` | CREATE, UPDATE |
| Version history entry added | `versionHistory[]` per entry | CREATE |

**Automation**: Extend `sync-registry.js` to emit `ChangeEvent` records on each recalculation. Diff before/after to generate CRUD events.

### 3.2 Layer 2: CI/CD Pipeline Events

| What's Tracked | Source | Event Types |
|---|---|---|
| PFC-Core release to PFI dev repos | `pfc-release.yml` | RELEASE |
| Promotion (dev→test, test→prod) | `promote.yml` | PROMOTE |
| Convention sync to live repos | `sync-to-live.yml` | PROMOTE |
| Sealed skill distribution | `pfc-release.yml` | RELEASE |
| Guard-core block event | `guard-core.yml` | BLOCK (failed CC) |
| Drift detected | `drift-detection.yml` | DRIFT |

**Automation**: Add a `log-cc-event` step to each workflow that appends to a CC event log (JSONLD or Supabase table).

### 3.3 Layer 3: Database Schema Changes

| What's Tracked | Source | Event Types |
|---|---|---|
| Migration created | `supabase/migrations/*.sql` | CREATE |
| Schema promoted (dev→test→prod) | `promote-db.yml` (Epic 59) | PROMOTE |
| RLS policy added/modified | Migration SQL | CREATE, UPDATE |
| Function added/modified | Migration SQL | CREATE, UPDATE |
| Rollback (forward migration) | Migration SQL | UPDATE |

**Automation**: `promote-db.yml` emits CC events with `supabase db diff` output as change delta.

### 3.4 Layer 4: Security & Governance Changes

| What's Tracked | Source | Event Types |
|---|---|---|
| PROMOTION_PAT scope change | Manual / gh secret set | UPDATE |
| Branch protection change | `setup-branch-protection.sh` | UPDATE |
| CODEOWNERS change | Git commit to CODEOWNERS | UPDATE |
| RLS policy change (security scope) | DB migration | UPDATE |
| Guard-core.yml enforcement | Workflow run | BLOCK |
| OAA compliance gate results | `oaa-v7-validate.yml` | VALIDATE |

**Automation**: Security CC events are a subset of Layer 2 (CI/CD) and Layer 3 (DB) — tagged with `layer: security`.

---

## 4. PFC vs PFI Scope Boundary

### 4.1 PFC Change Control (Full Visibility)

PFC CC can audit, monitor, analyse and report:

| Scope | Access |
|---|---|
| All ontology registry changes | Full CRUD history |
| All CI/CD pipeline events across all PFIs | Release, promotion, drift, blocks |
| All DB schema changes (PFC + PFI) | Migration history, RLS changes |
| All security events | PAT changes, branch protection, guard-core blocks |
| Cross-PFI comparison | Which PFIs are on which version, drift analysis |
| Programme-level reporting | Epic 55 (#836) federated portfolio reporting |

### 4.2 PFI Change Control (Own Scope Only)

Each PFI CC can audit, monitor, analyse and report:

| Scope | Access | Cannot Access |
|---|---|---|
| Own instance registry (filtered by subscribed series) | Full CRUD | Other PFI instance data |
| Own triad CI/CD events (dev→test→prod) | Promotion, release receipt | Other PFI promotions |
| Own DB schema changes | Migrations, RLS | PFC or other PFI schemas |
| Own security events | Branch protection, guard-core | PFC PAT config, other PFI security |
| PFC-Core release receipt | What arrived in own pfc-core/ | PFC dev/test internal events |

### 4.3 Enforcement

| Rule | Mechanism |
|---|---|
| PFI cannot see other PFI CC data | Supabase RLS: `tenant_id = current_tenant()` (Epic 10A) |
| PFC sees all CC data | Supabase RLS: PFC admin role bypasses tenant filter |
| CC events are append-only | No UPDATE/DELETE on cc_events table; corrections via new CORRECTION event |
| CC events include audit trail | Actor, timestamp, approval type, gate results — immutable |

---

## 5. Cross-Reference to Current Epics

| Epic | Relationship to CC | CC Layer |
|---|---|---|
| **Epic 31 (#441)** CI/CD Pipeline | CC events from pfc-release.yml, promote.yml, guard-core.yml, drift-detection.yml | Layer 2 (CI/CD) |
| **Epic 58 (#837)** PFC Triad | PFC triad adds 2 new promotion stages to CC tracking (pfc-dev→test, pfc-test→prod) | Layer 2 (CI/CD) |
| **Epic 59 (#840)** DB Cascade | DB promotion events, schema migration tracking, RLS policy changes | Layer 3 (DB) |
| **Epic 10A (#127)** Security MVP | RLS enforcement for PFI scope isolation, tenant context function | Layer 4 (Security) |
| **Epic 55 (#836)** Portfolio Reporting | CC data feeds into cross-PFI portfolio analytics | Reporting |
| **Epic 60 (#859)** VSOM Platform Delivery | CC is a KPI source for platform delivery metrics (KPI-PD-01 through KPI-PD-12) | All Layers |
| **Epic 30 (#370)** GRC Framework | GRC-FW-ONT GovernanceAssurance entity models CC audit activities | Layer 4 (Governance) |
| **Epic 34 (#518)** Platform Strategy | CC is infrastructure for S1 (Graph-First) + S6 (Integration+EA) | All Layers |

---

## 6. Implementation Approach

### Phase 1: CC Event Schema & Registry Layer (Low lift)

| Story | Description | Depends On |
|---|---|---|
| Define CC event JSONLD schema | `ChangeEvent` type, fields, validation | None |
| Extend `sync-registry.js` to emit CC events | Before/after diff → CRUD events on each registry recalculation | CC schema |
| Create `cc-events/` directory in pfc-dev | Append-only JSONLD event files, one per release/session | CC schema |
| Add CC event step to `pfc-release.yml` | Log release events (target PFIs, files, versions) automatically | CC schema |

### Phase 2: CI/CD Pipeline Layer (Medium lift)

| Story | Description | Depends On |
|---|---|---|
| Add CC step to `promote.yml` | Log promotion events (source, target, files, approval) | Phase 1 |
| Add CC step to `guard-core.yml` | Log block events (who tried, what was blocked) | Phase 1 |
| Deploy `drift-detection.yml` | Weekly drift audit with CC event logging | Phase 1, Epic 31 |
| Create CC dashboard view in visualiser | Timeline of CC events, filterable by layer/scope/PFI | Phase 1 |

### Phase 3: DB & Security Layer (Requires Epic 59)

| Story | Description | Depends On |
|---|---|---|
| Add CC step to `promote-db.yml` | Log schema migration promotions | Epic 59 (F59.2) |
| Create `cc_events` Supabase table | Append-only, RLS-scoped, PFC admin bypass | Epic 59 (F59.1), Epic 10A |
| Implement PFI scope filtering | RLS: PFI sees own CC events only | Epic 10A |
| Security event logging | PAT changes, branch protection, CODEOWNERS | Phase 2 |

### Phase 4: Reporting & Analytics

| Story | Description | Depends On |
|---|---|---|
| PFC CC report (cross-PFI) | Aggregate view of all CC events, trend analysis | Phase 3 |
| PFI CC report (own scope) | Instance-specific CC dashboard | Phase 3 |
| Integration with Epic 55 portfolio reporting | CC metrics feed into federated analytics | Phase 3, Epic 55 |
| Ontology entity extension (CICD-ONT or CC-ONT) | Formal ontology modelling of CC entities | Phase 1 |

---

## 7. Ontology Decision Point

**Option A: Extend CICD-ONT** (if <10 new entities)
- Add `ChangeEvent`, `ChangePropagation`, `ChangeApproval` to CICD-ONT v2.0.0
- Pros: No new ontology, builds on existing PE-Series structure
- Cons: CICD-ONT scope creep; CC is broader than CI/CD

**Option B: Create CC-ONT** (if ≥10 entities needed)
- New ontology in PE-Series: `PE-Series/CC-ONT/pfc-cc-v1.0.0-oaa-v7.json`
- Entities: `ChangeEvent`, `ChangeSet`, `ChangeApproval`, `ChangePropagation`, `ChangeScope`, `AuditReport`, `ComplianceCheck`, `DriftEvent`, `BlockEvent`, `CorrectionEvent`
- Cross-refs: CICD-ONT (pipeline), GRC-FW-ONT (governance), PE-ONT (process), EMC-ONT (scope)
- Pros: Clean separation, dedicated namespace (`cc:`), full CRUD lifecycle modelling
- Cons: +1 ontology to maintain

**Recommendation**: Start with Option A (extend CICD-ONT) in Phase 1. If entity count exceeds 10 during design, refactor to CC-ONT in Phase 4.

---

## 8. Acceptance Criteria (Full Feature)

- [ ] CC event JSONLD schema defined and validated against OAA v7
- [ ] `sync-registry.js` emits CC events on registry changes
- [ ] `pfc-release.yml` logs CC events per release
- [ ] `promote.yml` logs CC events per promotion
- [ ] `guard-core.yml` logs CC block events
- [ ] `drift-detection.yml` live and logging
- [ ] PFC can audit/monitor/analyse/report ALL CC events (cross-PFI)
- [ ] PFI can audit/monitor/analyse/report OWN CC events only (RLS-scoped)
- [ ] CC events are append-only (no UPDATE/DELETE)
- [ ] CC dashboard in visualiser (timeline view, filterable)
- [ ] Cross-reference to CICD-ONT/CC-ONT entities
- [ ] Integration with Epic 55 portfolio reporting

---

## 9. Risk & Dependencies

| Risk | Impact | Mitigation |
|---|---|---|
| CC event volume becomes large at scale (100 PFIs) | Storage, query performance | Partition by PFI, archive events >1 year |
| PFI RLS bypass vulnerability | CC data leak across PFI boundaries | Epic 10A RLS testing, pen-test gate (PbD/SbD) |
| CC slows down CI/CD pipelines | Developer friction | CC logging is async/non-blocking step |
| Ontology decision (extend vs. create) | Architecture debt if wrong choice | Start A, refactor if needed |

| Dependency | Status | Blocks |
|---|---|---|
| Epic 58 (#837) PFC Triad | F58.1 complete, F58.2 in progress | Phase 1 (CC in pfc-dev) |
| Epic 59 (#840) DB Cascade | Proposed | Phase 3 (Supabase cc_events table) |
| Epic 10A (#127) Security MVP | Schema written, not deployed | Phase 3 (RLS for PFI scope) |
| Epic 55 (#836) Portfolio Reporting | Proposed | Phase 4 (CC feeds into analytics) |

---

*Document: BRIEFING-PBS-PFC-CICD-Programme-Roadmap-Linkages.md*
*Candidate ID: PBS-PFC-CICD.Programme-Roadmap-Linkages*
*Next action: Review scope → assign to new Epic or as Feature under Epic 60 → begin Phase 1*

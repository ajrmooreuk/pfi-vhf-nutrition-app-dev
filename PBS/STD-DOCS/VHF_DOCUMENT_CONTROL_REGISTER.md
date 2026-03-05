# VHF DOCUMENT CONTROL REGISTER
## Unified Register of Design & Build Artifacts

---

| Document Control | |
|-----------------|---|
| **Document Number** | VHF-DCR-001 |
| **Version** | 1.2 |
| **Status** | Active |
| **Date** | 26 January 2026 |

---

## 1. PURPOSE

This Document Control Register (DCR) provides a single source of truth for all VHF project documentation. It:

- Tracks all design and build artifacts
- Records version history and approval status
- Ensures document traceability
- Supports governance and audit requirements

### 1.1 Master Change Control Reference

> **IMPORTANT:** This register works alongside the **Master Change Control Register**:
>
> | Document | Path | Purpose |
> |----------|------|---------|
> | **VHF-NI-App-Mk3-Master-Change-Control-v1.0.md** | `PBS/STD-DOCS/` | Detailed change tracking, design token verification, brand approval status |
> | This document | `PBS/STD-DOCS/` | Document inventory and hierarchy |
>
> For **detailed change history**, **design token verification**, and **approval sign-offs**, refer to the Master Change Control Register.

---

## 2. PBS STRUCTURE

```
VHF-App-Mk3/
├── PBS/
│   ├── ARCHITECTURE/       # PRD, HLD, Ontology, PBS, WBS (6 docs)
│   ├── DESIGN-SYSTEM/      # Tokens, brand, Figma, components (16 docs)
│   ├── AGENTS/             # Agent specifications (3 docs)
│   ├── IMPLEMENTATION/     # Dev guides, Claude Code setup (6 docs)
│   ├── STD-DOCS/           # Governance, CC, manifests (8 docs)
│   └── REFERENCE/          # Summaries, quick refs (7 docs)
├── PROPOSALS/              # PRDs, PBS, WBS, HLD, Implementation templates (9 docs)
├── .github/                # CI/CD, templates
└── README.md
```

---

## 3. DOCUMENT INVENTORY

### 3.1 ARCHITECTURE (6 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-ARCH-001 | VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md | 3.0 | Active |
| VHF-ARCH-002 | VHF-NI-App-Mk3-HLD-Architecture-v2.0.md | 2.0 | Active |
| VHF-ARCH-003 | VHF-NI-App-Mk3-Ontology-Implementation-v2.0.md | 2.0 | Active |
| VHF-ARCH-004 | VHF-Context-Engineering-Integration-Summary.md | 1.0 | Active |
| VHF-ARCH-005 | viridian-product-breakdown-structure.md | 1.0 | Active |
| VHF-ARCH-006 | viridian-work-breakdown-structure.md | 1.0 | Active |

### 3.2 DESIGN-SYSTEM (16 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-DS-001 | VHF-NI-App-Mk3-Design-Tokens-v3.0.json | 3.0 | Active |
| VHF-DS-002 | viridian-design-tokens-v2.json | 2.0 | Active |
| VHF-DS-003 | viridian-brand-guidelines-v2.md | 2.0 | Active |
| VHF-DS-004 | viridian-component-usage-examples-v2.md | 2.0 | Active |
| VHF-DS-005 | viridian-storybook-config-v2.md | 2.0 | Active |
| VHF-DS-006 | VHF-NI-App-Mk3-Design-Token-Summary-v1.0.md | 1.0 | Active |
| VHF-DS-007 | VHF-NI-App-Mk3-Design-Implementation-Addendum-v1.0.md | 1.0 | Active |
| VHF-DS-008 | VHF-Design-System-Layout-Spacing-Fix-v1.0.md | 1.0 | Active |
| VHF-DS-009 | VHF-NI-App-Mk3-Figma-Architecture-v1.0.md | 1.0 | Active |
| VHF-DS-010 | VHF-NI-App-Mk3-Figma-Integration-Complete-v1.0.md | 1.0 | Active |
| VHF-DS-011 | VHF-NI-App-Mk3-Figma-to-Code-v1.0.md | 1.0 | Active |
| VHF-DS-012 | viridian-figma-to-mvp-workflow-v2.md | 2.0 | Active |
| VHF-DS-013 | viridian-figma-to-mvp-workflow.md | 1.0 | Active |
| VHF-DS-014 | VHF-Mockup-FigmaMake-Documentation-Requirements.md | 1.0 | Active |
| VHF-DS-015 | VHF-Mockup-FigmaMake-PBS-v1.0.md | 1.0 | Active |
| VHF-DS-016 | VHF-Mockup-FigmaMake-PRD-v1.0.md | 1.0 | Active |

### 3.3 AGENTS (3 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-AGT-001 | viridian-agent-set-specification-full.md | 1.0 | Active |
| VHF-AGT-002 | viridian-agent-set-specification.md | 1.0 | Active |
| VHF-AGT-003 | VE-CE_Executive_Overview_v1.0.md | 1.0 | Active |

### 3.4 IMPLEMENTATION (6 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-IMP-001 | viridian-implementation-guide.md | 1.0 | Active |
| VHF-IMP-002 | viridian-github-claude-code-setup.md | 1.0 | Active |
| VHF-IMP-003 | VHF-NI-App-Mk3-Claude-Code-Initiation-v1.0.md | 1.0 | Active |
| VHF-IMP-004 | VHF-NI-App-Mk3-Claude-Code-Package-v1.0.md | 1.0 | Active |
| VHF-IMP-005 | VHF-NI-App-Mk3-Claude-Code-Transition-Guide-v1.0.md | 1.0 | Active |
| VHF-IMP-006 | VHF-NI-App-Mk3-Implementation-Authorization-v1.0.md | 1.0 | Active |

### 3.5 STD-DOCS (8 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-STD-001 | VHF_DOCUMENT_CONTROL_REGISTER.md | 1.2 | Active |
| VHF-STD-002 | VHF_CC_GITHUB_WORKFLOW.md | 1.4 | Active |
| VHF-STD-003 | VHF-NI-App-Mk3-Master-Change-Control-v1.0.md | 1.0 | Active |
| VHF-STD-004 | VHF-NI-App-Mk3-Document-Manifest-v2.0.md | 2.0 | Active |
| VHF-STD-005 | VHF-NI-App-Mk3-Document-Manifest-v3.0.md | 3.0 | Active |
| VHF-STD-006 | VHF-NI-App-Mk3-Update-Manifest-v3.0.md | 3.0 | Active |
| VHF-STD-007 | VHF-NI-App-Mk3-Sync-Verification-v1.0.md | 1.0 | Active |
| VHF-STD-008 | VHF_UNIFIED_REGISTER_PROCESS.md | 1.0 | Active |

### 3.6 REFERENCE (7 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-REF-001 | 4-Week-Mockup-First-Quick-Reference.md | 1.0 | Active |
| VHF-REF-002 | COMPLETE-PACKAGE-SUMMARY.md | 1.0 | Active |
| VHF-REF-003 | QUICK-START-Claude-Code-Transition.md | 1.0 | Active |
| VHF-REF-004 | VHF-NI-App-Mk3-Complete-Package-Summary-v1.0.md | 1.0 | Active |
| VHF-REF-005 | VHF-NI-App-Mk3-Complete-Package-v1.0.md | 1.0 | Active |
| VHF-REF-006 | SESSION-SUMMARY-2024-12-05.md | 1.0 | Active |
| VHF-REF-007 | VHF-NI-App-Mk3-ToDo-Actions-v1.0.md | 1.0 | Active |

### 3.7 PROPOSALS (9 docs)

| Doc ID | Document Name | Version | Status |
|--------|---------------|---------|--------|
| VHF-PROP-001 | VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md | 3.0 | Active |
| VHF-PROP-002 | VHF-Mockup-FigmaMake-PRD-v1.0.md | 1.0 | Active |
| VHF-PROP-003 | VHF-Mockup-FigmaMake-Documentation-Requirements.md | 1.0 | Active |
| VHF-PROP-004 | VHF-Mockup-FigmaMake-PBS-v1.0.md | 1.0 | Active |
| VHF-PROP-005 | viridian-product-breakdown-structure.md | 1.0 | Active |
| VHF-PROP-006 | viridian-work-breakdown-structure.md | 1.0 | Active |
| VHF-PROP-007 | VHF_HLD_TEMPLATE.md | 1.0 | Active |
| VHF-PROP-008 | VHF_PRD_TEMPLATE.md | 1.0 | Active |
| VHF-PROP-009 | VHF_IMPLEMENTATION_PLAN_TEMPLATE.md | 1.0 | Active |

---

## 4. VERSION CONTROL POLICY

### 4.1 Document States

| State | Definition |
|-------|------------|
| **Draft** | Work in progress |
| **For Review** | Ready for stakeholder review |
| **Active** | Approved and current |
| **Superseded** | Replaced by newer version |

---

## 5. AUDIT TRAIL

| Date | Action | By | Notes |
|------|--------|-----|-------|
| 26-Jan-2026 | Register created | Technical Adviser | Initial version |
| 26-Jan-2026 | PBS reorganisation | Technical Adviser | Moved 45 docs into PBS structure |
| 26-Jan-2026 | PROPOSALS folder created | Claude Code | Copied 3 PRD/requirements docs to PROPOSALS for template use |
| 26-Jan-2026 | Added PBS/WBS to PROPOSALS | Claude Code | Copied 3 PBS/WBS docs (total 6 templates) |
| 26-Jan-2026 | Added EOMS-based templates | Claude Code | Created HLD, PRD, Implementation Plan templates from EOMS-Ph1 (total 9 docs) |
| 26-Jan-2026 | Enhanced GitHub workflow docs | Claude Code | Updated VHF_CC_GITHUB_WORKFLOW.md (v1.1) with value categories, labels, automation; Created VHF_UNIFIED_REGISTER_PROCESS.md (v1.0) |

---

**--- END OF DOCUMENT CONTROL REGISTER ---**

*Version 1.2 | Active*
*26 January 2026*

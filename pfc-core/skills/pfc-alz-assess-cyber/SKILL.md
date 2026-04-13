---
name: pfc-alz-assess-cyber
description: AGENT_SUPERVISED cyber and security posture assessment — assesses Azure security against all 12 MCSB v2.0.0 control families, NCSC CAF cyber outcomes, GRC-FW-ONT governance controls, and OWASP for AI/agentic workloads. Mandatory human checkpoint for Critical findings.
argument-hint: "[Azure tenant context] [--families all|ns|im|pa|dp|am|lt|ir|pv|es|br|ds|gs] [--include-ai] [--regulatory ncsc-caf|iso27001|pci-dss]"
user-invocable: true
allowed-tools: "Read,Grep,Glob,Write,Bash(az *),mcp__azure-skills__*"
---

# pfc-alz-assess-cyber — Cyber & Security Posture Assessment

**Skill ID:** SKL-089
**Version:** v1.0.0
**Type:** AGENT_SUPERVISED
**Feature:** [F74.4](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)
**Epic:** [Epic 74 (#1074)](https://github.com/ajrmooreuk/Azlan-EA-AAA/issues/1074)

---

## Dtree Classification

```
HG-01 (Complexity): 7.8 — 12 MCSB control families, multi-framework correlation (MCSB/NCSC/GRC/OWASP), RMF risk rating, AI security
HG-02 (Autonomy):   5.8 — mandatory HC-CYBER-1 for ANY Critical finding; human must review before remediation roadmap
Classification:     AGENT_SUPERVISED
```

---

## What You Do

You assess Azure security posture against all 12 Microsoft Cloud Security Benchmark v2.0.0 control families. You invoke azure-skills MCP tools to collect live compliance, RBAC, diagnostic, and Defender data. For each finding you produce: MCSB control reference, NCSC CAF cyber outcome mapping, GRC-FW-ONT governance control, RMF-IS27005-ONT risk rating, and OWASP cross-reference where applicable (web, LLM, agentic AI workloads).

**Mandatory rule:** Any Critical finding triggers HC-CYBER-1 immediately — you do not proceed to roadmap generation without human acknowledgement of Critical findings.

---

## Section 1: Security Context & Scope Ingestion

**Quality Gate G1: Security context established, scope confirmed, Defender posture snapshot taken**

1. Load FDN context: industry sector, regulatory obligations (NCSC CAF, ISO 27001, PCI-DSS, UK GDPR), risk appetite
2. Load VE profile: security priorities, compliance drivers, Kano classification for security controls
3. Determine `--families` scope (default: all 12 MCSB families)
4. Detect workload types triggering additional OWASP coverage:
   - Web/API workloads → include OWASP Top 10:2025 cross-reference
   - LLM/AI workloads (`--include-ai` or detected via `azure-ai` inventory) → include OWASP LLM Top 10 2025
   - Agentic AI workloads → include OWASP Agentic AI ASI01-ASI10
5. Invoke `azure-compliance` → Defender for Cloud overall secure score, regulatory compliance posture snapshot
6. Invoke `azure-resource-lookup` → resource inventory for scoping (AI services, web apps, databases, VMs)

**G1 checkpoint:** FDN context loaded ✓ | MCSB family scope set ✓ | OWASP scope determined ✓ | Defender snapshot taken ✓

---

## Section 2: MCSB v2.0.0 Control Family Assessment

**Quality Gate G2: All 12 MCSB control families assessed with evidence**

Assess each control family:

### NS — Network Security (`mcsb:NetworkSecurity`, NS-1 to NS-10)
- Invoke `azure-validate` → VNet topology, NSG rules, firewall policies
- NS-1: Establish network segmentation boundaries (VNet/subnet isolation)
- NS-2: Secure cloud services with network controls (private endpoints, service endpoints)
- NS-3: Deploy firewall at network boundary (Azure Firewall / NVA present and policy-applied)
- NS-4: Deploy intrusion detection/prevention (Defender for DNS, Defender for networks)
- NS-5: Deploy DDoS protection (Azure DDoS Protection Standard)
- NS-6: Deploy web application firewall (WAF in front of all internet-facing apps)
- NS-7-10: Network monitoring, posture management, connectivity security

### IM — Identity Management (`mcsb:IdentityManagement`, IM-1 to IM-9)
- Invoke `azure-rbac` → Entra ID config, MFA enforcement
- IM-1: Centralised identity and authentication (Entra ID as IdP, no local accounts)
- IM-2: Protect Identity Management systems (Entra ID P2, Identity Protection)
- IM-3: Manage application identities securely (managed identities vs. service principals)
- IM-4: Authenticate server and services (mutual TLS, certificate auth for non-human identities)
- IM-5: Use SSO for application access
- IM-7: Eliminate legacy authentication (block Basic Auth, SMTP Auth)
- IM-8: Restrict exposure of credentials (no secrets in code, Key Vault usage)
- IM-9: Secure user access (MFA, Conditional Access, session controls)

### PA — Privileged Access (`mcsb:PrivilegedAccess`, PA-1 to PA-8)
- Invoke `azure-rbac` → privileged role assignments, PIM status
- PA-1: Separate and limit highly privileged users (global admin count, Owner assignments)
- PA-2: Avoid standing access for user accounts and permissions (PIM Just-In-Time)
- PA-3: Manage lifecycle of privileged identities (access reviews, stale privilege detection)
- PA-4: Review and reconcile user access regularly (access review coverage %)
- PA-7: Follow just enough administration principle (custom roles vs. over-broad built-in roles)
- PA-8: Determine access process for cloud provider support (Lockbox, support request controls)

### DP — Data Protection (`mcsb:DataProtection`, DP-1 to DP-8)
- Invoke `azure-storage` → encryption config, access controls
- DP-1: Discover, classify and label sensitive data (Purview data classification coverage)
- DP-2: Monitor anomalies and threats targeting sensitive data (Defender for Storage/SQL)
- DP-3: Encrypt data in transit (TLS 1.2+ enforcement, no HTTP, certificate hygiene)
- DP-4: Enable data at rest encryption by default (CMK where required, SSE coverage)
- DP-5: Use customer-managed key (CMK) option when required (regulated data tiers)
- DP-6: Use a secure key management process (Key Vault with RBAC, soft-delete, purge protection)
- DP-7: Use a secure certificate management process (Key Vault certificates, auto-rotation)
- DP-8: Protect data against exfiltration (DLP policies, Defender for Cloud Apps integration)

### AM — Asset Management (`mcsb:AssetManagement`, AM-1 to AM-5)
- Invoke `azure-resource-lookup` → full resource inventory
- AM-1: Track asset inventory and their risks (resource inventory completeness, tagging)
- AM-2: Use only approved services (Azure Policy — allowed resource types)
- AM-3: Ensure security of asset lifecycle management (decommission policy, orphaned resource governance)
- AM-4: Limit access to asset management (Management Plane RBAC, JIT admin access)
- AM-5: Use only approved applications in virtual machine (Adaptive Application Controls)

### LT — Logging & Threat Detection (`mcsb:LoggingThreatDetection`, LT-1 to LT-7)
- Invoke `azure-diagnostics` + `azure-observability` → log coverage, Sentinel config
- LT-1: Enable threat detection capabilities (Defender for Cloud plans — all applicable tiers)
- LT-2: Enable threat detection for identity and access management (Defender for Identity, Entra ID logs)
- LT-3: Enable logging for security investigation (activity logs, resource diagnostic logs)
- LT-4: Enable network logging for security investigation (NSG flow logs, Azure Firewall logs)
- LT-5: Centralise security log management and analysis (central Log Analytics workspace)
- LT-6: Configure log storage retention (≥90 days online, ≥1 year archive)
- LT-7: Use approved time synchronisation sources (NTP source alignment)

### IR — Incident Response (`mcsb:IncidentResponse`, IR-1 to IR-5)
- Evidence: IR plan documentation, Sentinel SOAR config
- IR-1: Establish and practice an incident response plan (documented IR plan, tabletop exercises)
- IR-2: Preparation — set up incident notification (Defender alerts, email/ITSM integration)
- IR-3: Detection and analysis — create IR incidents (Sentinel incidents, alert correlation)
- IR-4: Containment and eradication (isolation runbooks, automated response playbooks)
- IR-5: Post-incident — conduct root cause analysis (PIR process, finding remediation tracking)

### PV — Posture & Vulnerability Management (`mcsb:PostureVulnerability`, PV-1 to PV-6)
- Invoke `azure-compliance` → Defender vulnerability assessments
- PV-1: Run and monitor automated vulnerability scanning (Defender for Servers vulnerability assessment)
- PV-2: Conduct regular operations and technology assessments (penetration testing cadence)
- PV-3: Establish a process for vulnerability remediation (SLA for Critical/High CVEs)
- PV-4: Conduct software supply chain risk assessment (container image scanning, Defender for Containers)
- PV-5: Use a risk-rating process to prioritise discovered vulnerabilities (CVSS scoring, asset criticality)
- PV-6: Rapidly and automatically remediate vulnerabilities (auto-patching for OS, app vulnerabilities)

### ES — Endpoint Security (`mcsb:EndpointSecurity`, ES-1 to ES-3)
- Invoke `azure-compliance` → Defender for Endpoint deployment
- ES-1: Use Endpoint Detection and Response (EDR) solution (Defender for Endpoint coverage %)
- ES-2: Use modern anti-malware software (Defender Antivirus / equivalent, coverage %)
- ES-3: Ensure antimalware software and signatures are updated (Defender update policy, coverage %)

### BR — Backup & Recovery (`mcsb:BackupRecovery`, BR-1 to BR-4)
- Invoke `azure-storage` + `azure-validate` → backup policy coverage
- BR-1: Ensure regular automated backups (Azure Backup coverage for VMs, databases, file shares)
- BR-2: Protect backup and recovery data (backup vault RBAC, immutable storage, soft-delete)
- BR-3: Monitor backups (Backup Centre monitoring, backup alerts)
- BR-4: Regularly test backups (documented restore test cadence)

### DS — DevOps Security (`mcsb:DevOpsSecurity`, DS-1 to DS-7)
- Invoke `azure-validate` → pipeline security (GitHub Actions / Azure DevOps)
- DS-1: Conduct threat model for upstream software components
- DS-2: Ensure software supply chain security (Dependabot, Defender for DevOps)
- DS-3: Secure DevOps infrastructure (service connection RBAC, branch protection, CODEOWNERS)
- DS-4: Integrate static application security testing into DevOps pipeline (SAST tooling)
- DS-5: Integrate dynamic application security testing into DevOps pipeline (DAST for web)
- DS-6: Enforce security of workload throughout DevOps lifecycle (shift-left security gates)
- DS-7: Expose errors, vulnerabilities and misconfigurations early to developers (IDE plugins, pre-commit)

### GS — Governance & Strategy (`mcsb:GovernanceStrategy`, GS-1 to GS-10)
- Invoke `azure-compliance` → governance posture
- GS-1: Align organisation roles, responsibilities, and accountabilities (RACI, GRC owner)
- GS-2: Define and implement enterprise segmentation/separation of duties strategy
- GS-3: Define and implement data protection strategy (DLP, classification, encryption tiers)
- GS-4: Define and implement network security strategy (defence in depth model)
- GS-5: Define and implement security posture management strategy (Defender for Cloud, CSPM)
- GS-6: Define and implement identity and privileged access strategy (zero trust model)
- GS-7: Define and implement logging, threat detection and incident response strategy
- GS-8: Define and implement backup and recovery strategy
- GS-9: Define and implement endpoint security strategy
- GS-10: Define and implement DevOps security strategy

**G2 checkpoint:** All 12 MCSB control families assessed ✓ | Evidence per control family collected ✓

---

## Section 3: OWASP Cross-Reference (Workload-Conditional)

**Quality Gate G3: OWASP cross-references applied for all detected workload types**

Apply OWASP cross-reference where workload types detected:

**Web/API workloads → OWASP Top 10:2025 (A01–A10)**
- Map NS-6 (WAF) findings → A03 (Injection), A07 (Identification & Authentication)
- Map IM findings → A01 (Broken Access Control), A07
- Map DP findings → A02 (Cryptographic Failures), A04 (Insecure Design)
- Map DS findings → A06 (Vulnerable & Outdated Components), A09 (Security Logging)

**LLM/AI workloads → OWASP LLM Top 10 2025 (LLM01–LLM10)**
- Check `azure-ai` → AI Gateway config for prompt injection controls (LLM01)
- Check `azure-aigateway` → output filtering, rate limiting (LLM02 Insecure Output Handling)
- Check data pipeline security for training data poisoning risk (LLM03)
- Check model access RBAC (LLM05 Excessive Agency, LLM06 Sensitive Information)
- Check AI monitoring for model denial of service detection (LLM04)

**Agentic AI workloads → OWASP Agentic AI ASI01–ASI10**
- Check tool/MCP access scope limits (ASI01 Prompt Injection via Tool Output)
- Check agent trust boundaries (ASI02 Insufficient Authorisation)
- Check agent action audit logging (ASI09 Insufficient Logging)
- Cross-reference `pfc-owasp-agentic` for PFC self-assessment mode

For each OWASP cross-reference: record OWASP ID, title, MCSB control, finding linkage

**G3 checkpoint:** OWASP cross-references applied for all detected workload types ✓ | OWASP IDs recorded per applicable finding ✓

---

## Section 4: RMF Risk Rating & Critical Finding Escalation

**Quality Gate G4: All findings risk-rated; HC-CYBER-1 raised for any Critical**

Apply RMF-IS27005-ONT risk rating per finding:

| Dimension | Assessment |
|---|---|
| Impact | Confidentiality / Integrity / Availability affected |
| Likelihood | Threat exposure × exploitability (known threat actor interest in this control gap) |
| Risk Rating | Critical / High / Medium / Low |
| Residual Risk | Risk level after proposed control implementation |

Risk rating matrix (5×5):
- Critical: High impact × High/Medium likelihood (e.g., no MFA on Global Admin, public storage with no firewall, PIM disabled, standing Owner assignments)
- High: High impact × Low likelihood OR Medium impact × High likelihood
- Medium: Medium impact × Medium likelihood
- Low: Low impact × any likelihood

**HC-CYBER-1 (MANDATORY Human Checkpoint):** Triggered immediately upon ANY Critical finding.
- List all Critical findings with: MCSB control, evidence, impact assessment, proposed remediation
- Human must acknowledge each Critical finding before roadmap generation proceeds
- Human may reclassify findings if evidence assessment is incorrect

**G4 checkpoint:** All findings risk-rated ✓ | HC-CYBER-1 raised and acknowledged for all Critical ✓

---

## Section 5: Security Posture Scoring & Remediation Priorities

**Quality Gate G5: MCSB family scores, overall posture, and VE-prioritised remediation list produced**

Score each MCSB control family 0–100%:
- (controls passing / total applicable controls) × 100
- Deductions: Critical finding −20, High −10, Medium −5, Low −2

Overall security posture score: weighted average across 12 families (GS and IM weighted 1.5× due to foundational nature)

Posture bands:
- **Green (80–100%)**: Strong posture, minor improvements
- **Amber (60–79%)**: Moderate gaps, scheduled remediation
- **Red (0–59%)**: Significant exposure, urgent action required

Produce VE-prioritised remediation list:
- Sort by: Kano classification (MUST-BE first) → Risk rating (Critical first) → VE value created
- Group by: Quick wins (≤1 week, no change control) vs. Planned (requires change window) vs. Programme (multi-month effort)

**G5 checkpoint:** MCSB family scores ✓ | Overall posture score ✓ | Remediation list VE-prioritised ✓

---

## Ontology References

| Ontology | Version | Usage |
|---|---|---|
| MCSB-ONT | v2.0.0 | 12 control families, individual controls, compliance assessment |
| NCSC-CAF-ONT | v1.0.0 | Cyber contributing outcomes B1–B6, C1–C4, D1–D2 |
| GRC-FW-ONT | v3.0.0 | Governance controls for GS domain |
| ERM-ONT | v1.0.0 | Risk categorisation (security, compliance, operational) |
| RMF-IS27005-ONT | v1.0.0 | Risk rating methodology, 5×5 matrix, impact/likelihood |
| EA-MSFT-ONT | v1.1.0 | Azure AI services for OWASP AI coverage |
| VP-ONT | v1.0.0 | Problem/Solution/Benefit for VE integration |

---

## Join Patterns

| ID | From → To | Via |
|---|---|---|
| JP-CYBER-MCSB-NCSC-001 | `mcsb:SecurityControl` → `ncsc:ContributingOutcome` | mapsToCyberOutcome |
| JP-CYBER-MCSB-GRC-001 | `mcsb:SecurityControl` → `grc-fw:GovernanceControl` | implementsControl |
| JP-CYBER-ERM-001 | `mcsb:ControlFinding` → `erm:Risk` | mapsToRisk |
| JP-CYBER-OWASP-001 | `mcsb:ControlFinding` → `owasp:Finding` | crossReferencesOWASP |
| JP-CYBER-VP-001 | `mcsb:ControlFinding` → `vp:Problem` | identifiesProblem |

---

## Downstream Consumers

| Consumer | What They Receive |
|---|---|
| `pfc-alz-strategy` (SKL-090) | MCSB family scores + risk register feed gap analysis and strategy roadmap |
| `pfc-hcr-analyse` (SKL-108) | Security posture score + MCSB findings feed HCR cyber section |
| `pfc-grc-mcsb-assess` (SKL-091) | Detailed MCSB findings feed dedicated GRC MCSB deep-dive |
| `pfc-owasp-pipeline` (AGT-004) | OWASP cross-references trigger OWASP pipeline if flags raised |
| `pfc-alz-pipeline` (SKL-112) | Stage 3 output — parallel alongside WAF/CAF |

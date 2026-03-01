---
name: pfc-industry-analysis
description: Porter's Five Forces, SWOT/TOWS, and Ansoff growth matrix providing 2-5 year competitive environment context for VE strategy formulation. Produces ind:PortersFiveForces, ind:SWOTAnalysis, ind:TOWSStrategy, and ind:AnsoffGrowthMatrix JSON-LD entities.
argument-hint: "[org-context file or PFI instance name]"
user-invocable: true
allowed-tools: "Bash(gh *),Read,Grep,Glob,Write"
---

# PFC-INDUSTRY-ANALYSIS: Competitive Environment Analyser

Analyse the competitive environment using Porter's Five Forces, SWOT/TOWS, and Ansoff frameworks from INDUSTRY-ONT. Provides the 2-5 year competitive context that informs VSOM strategy definition and OKR growth objectives.

## Dtree Classification

`SKILL_STANDALONE` — Moderate autonomy (analytical reasoning for competitive scoring, TOWS cross-matching), no orchestration, single-concern.

Path: HG-01 PARTIAL (4.6) → HG-03 FAIL (2.8) → `SKILL_STANDALONE`

## What You Do

When the user invokes `/azlan-github-workflow:pfc-industry-analysis`, follow these 8 sections in order.

---

### Section 1: Context Loading

Load upstream context:

1. **ORG-CONTEXT:** Load `01-org-context-{instance}.jsonld` — extract industry, competitors, products
2. **MACRO analysis (optional):** Load `02-macro-analysis-{instance}.jsonld` if available — external PESTEL factors feed SWOT Opportunities/Threats
3. **Summarise:** "Analysing competitive environment for {orgName} in {industry}"

If MACRO analysis is available, automatically pre-populate SWOT external factors (O/T) from PESTEL factors with direction=Positive (→ Opportunity) or direction=Negative (→ Threat).

**Quality Gate G1 — Context Loaded:**
- [ ] ORG-CONTEXT loaded with industry and competitive landscape
- [ ] MACRO analysis loaded if available (note if absent)
- [ ] At least 1 product/service identified for Ansoff positioning

---

### Section 2: Porter's Five Forces

Assess each of the 5 competitive forces:

#### 1. Competitive Rivalry
- Number and size of competitors, industry growth rate, product differentiation, exit barriers
- Ask: "How intense is competition in your market?"

#### 2. Supplier Power
- Number of suppliers, switching costs, supplier concentration, forward integration threat
- Ask: "How much leverage do your suppliers have?"

#### 3. Buyer Power
- Number of buyers, switching costs, price sensitivity, backward integration threat
- Ask: "How much leverage do your customers have?"

#### 4. Threat of New Entrants
- Entry barriers (capital, regulation, brand, scale), retaliation expectation
- Ask: "How easy is it for new competitors to enter your market?"

#### 5. Threat of Substitutes
- Availability of substitutes, price-performance ratio, switching costs
- Ask: "What alternatives could replace your product entirely?"

For each force:

| Field | Description |
|-------|-------------|
| `forceId` | `ind:force-{instance}-{force-name}` |
| `forceName` | Rivalry / SupplierPower / BuyerPower / NewEntrants / Substitutes |
| `intensity` | 1-5 (1=very low, 5=very high) |
| `drivers` | 2-4 key drivers for this score |
| `trend` | Increasing / Stable / Decreasing |
| `strategicImplication` | 1 sentence — what this means for strategy |

Calculate overall industry attractiveness: `average(5 forces)`. Lower = more attractive.

**Quality Gate G2 — Five Forces Complete:**
- [ ] All 5 forces assessed with intensity score (1-5)
- [ ] Each force has 2+ drivers identified
- [ ] Trend direction assigned to each force
- [ ] Overall industry attractiveness calculated

---

### Section 3: SWOT Construction

Build the SWOT matrix from two sources:

**Internal (S/W):** Elicit from user — what the org does well/poorly
- Strengths: Core competencies, unique resources, brand, IP, relationships
- Weaknesses: Capability gaps, resource constraints, process inefficiencies

**External (O/T):** Auto-populate from PESTEL (if available) + Porter's
- Opportunities: Positive PESTEL factors + low-intensity competitive forces
- Threats: Negative PESTEL factors + high-intensity competitive forces

For each SWOT factor:

| Field | Description |
|-------|-------------|
| `factorId` | `ind:swot-{quadrant}-{seq}` |
| `quadrant` | Strength / Weakness / Opportunity / Threat |
| `factorName` | Concise label |
| `description` | 1-2 sentence explanation |
| `significance` | High / Medium / Low |
| `source` | Internal-assessment / PESTEL / Porter / Market-data |

**Quality Gate G3 — SWOT Balance (MECE):**
- [ ] At least 2 items per quadrant (minimum 8 total)
- [ ] Internal (S/W) sourced from org assessment
- [ ] External (O/T) sourced from PESTEL/Porter or market data
- [ ] Each factor has significance rating

---

### Section 4: TOWS Strategy Matrix

Cross-match SWOT quadrants to generate strategic options:

| | Strengths (S) | Weaknesses (W) |
|---|---|---|
| **Opportunities (O)** | **S-O Strategies** (Aggressive): Use strengths to exploit opportunities | **W-O Strategies** (Reorientation): Overcome weaknesses to exploit opportunities |
| **Threats (T)** | **S-T Strategies** (Defensive): Use strengths to counter threats | **W-T Strategies** (Survival): Minimise weaknesses and avoid threats |

For each TOWS strategy:

| Field | Description |
|-------|-------------|
| `strategyId` | `ind:tows-{quadrant}-{seq}` |
| `towsQuadrant` | SO / WO / ST / WT |
| `strategyName` | Action-oriented label |
| `description` | How this strategy works |
| `strengthsUsed` / `weaknessesAddressed` | SWOT factor references |
| `opportunitiesExploited` / `threatsCountered` | SWOT factor references |
| `vsomStrategyType` | Maps to: growth / transformation / innovation / operational_excellence / customer_centricity / risk_management |
| `priority` | High / Medium / Low |

Generate at least 1 strategy per TOWS quadrant (minimum 4 total).

**Quality Gate G4 — TOWS-to-VSOM Bridge:**
- [ ] At least 1 strategy per TOWS quadrant (4 minimum)
- [ ] Each strategy mapped to a `vsomStrategyType`
- [ ] At least 1 SO strategy (growth/aggressive) identified
- [ ] Priority assigned to each strategy

---

### Section 5: Ansoff Growth Matrix

Position the organization's products and markets on the Ansoff 2x2:

| | Existing Markets | New Markets |
|---|---|---|
| **Existing Products** | Market Penetration (lowest risk) | Market Development |
| **New Products** | Product Development | Diversification (highest risk) |

For each growth vector applicable to the org:

| Field | Description |
|-------|-------------|
| `vectorId` | `ind:ansoff-{vector}-{seq}` |
| `vectorType` | Penetration / MarketDevelopment / ProductDevelopment / Diversification |
| `productRef` | Which product(s) this applies to |
| `marketRef` | Which market segment(s) |
| `riskLevel` | Low / Medium / High / Very High |
| `returnPotential` | Low / Medium / High |
| `timeToImpact` | Short (0-1yr) / Medium (1-3yr) / Long (3-5yr) |
| `okrObjectiveHint` | Suggested OKR objective statement for pfc-okr |

**Quality Gate G5 — Growth Direction:**
- [ ] Current position on Ansoff matrix identified
- [ ] At least 1 growth vector with risk/return assessment
- [ ] Each vector has `okrObjectiveHint` for downstream cascade
- [ ] Diversification (if chosen) has explicit risk acknowledgement

---

### Section 6: Strategic Recommendations

Synthesise all findings into 3-5 ranked strategic recommendations:

For each recommendation:

| Field | Description |
|-------|-------------|
| `recommendationId` | `ind:rec-{instance}-{seq}` |
| `title` | Action-oriented headline |
| `rationale` | 2-3 sentences: why, based on what evidence |
| `supportingEvidence` | References to Porter forces, SWOT factors, TOWS strategies, Ansoff vectors |
| `vsomAlignment` | Which VSOM strategy type this supports |
| `priority` | 1-5 (1=highest priority) |
| `timeframe` | Short / Medium / Long |

---

### Section 7: Output Assembly

Assemble the complete INDUSTRY analysis JSON-LD:

```json
{
  "@context": {
    "ind": "https://platformcore.io/ontology/industry/",
    "orgctx": "https://platformcore.io/ontology/org-context/",
    "macro": "https://platformcore.io/ontology/macro/",
    "pfc": "https://platformcore.io/ontology/"
  },
  "@type": "ind:IndustryAnalysis",
  "@id": "ind:analysis-{instance}",
  "ind:organizationContextRef": "org:ctx-{instance-code}",
  "ind:portersFiveForces": { "...from S2..." },
  "ind:swotAnalysis": { "...from S3..." },
  "ind:towsStrategies": [ "...from S4..." ],
  "ind:ansoffGrowthMatrix": { "...from S5..." },
  "ind:recommendations": [ "...from S6..." ],
  "pfc:version": "1.0.0",
  "pfc:status": "draft",
  "pfc:createdDate": "YYYY-MM-DD"
}
```

Write to: `{working_dir}/ve-pipeline-output/03-industry-analysis-{instance}.jsonld`

---

### Section 8: Validation

Run final validation checks:

- [ ] All G1-G5 gates passed
- [ ] JSON-LD is well-formed
- [ ] All 5 competitive forces scored
- [ ] SWOT has minimum 2 items per quadrant
- [ ] At least 4 TOWS strategies generated
- [ ] Ansoff position identified
- [ ] Output file written successfully

Present summary:
```
INDUSTRY ANALYSIS Summary: {orgName} ({instance-code})
  Industry Attractiveness: {score}/5.0 ({attractive/neutral/unattractive})
  Strongest Force:   {force} ({intensity}/5)
  SWOT Factors:      {S}/{W}/{O}/{T}
  TOWS Strategies:   {count} ({SO}/{WO}/{ST}/{WT})
  Growth Vector:     {primary-ansoff-vector}
  Top Recommendation: {rec-1-title}
  Output:            {file_path}
```

---

## Ontology References

| Ontology | Role | Namespace |
|----------|------|-----------|
| INDUSTRY-ONT v1.0.0 | Primary schema | `ind:` |
| ORG-CONTEXT-ONT v3.1.0 | Upstream context | `orgctx:` |
| MACRO-ONT v1.0.0 | External factors feed | `macro:` |
| VSOM-ONT v3.0.0 | Downstream linkage | `vsom:` |
| OKR-ONT v2.1.0 | Ansoff → OKR hints | `okr:` |

## Join Patterns

| Pattern | Description |
|---------|-------------|
| `JP-IND-001` | `ind:CompetitiveForce` → `orgctx:CompetitiveLandscape` → `vsom:Strategy` |
| `JP-IND-002` | `ind:TOWSStrategy` → `vsom:Strategy` (TOWS outputs inform VSOM strategy formulation) |
| `JP-IND-003` | `ind:AnsoffGrowthMatrix` → `okr:Objective` (growth vector maps to OKR objectives) |
| `JP-MAC-003` | `macro:PESTELFactor` → `ind:SWOTFactor` (PESTEL feeds SWOT O/T) |

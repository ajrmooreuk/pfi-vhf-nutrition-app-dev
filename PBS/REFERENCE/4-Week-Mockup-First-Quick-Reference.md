# 4-Week Mockup-First MVP: Quick Reference
## Platform Engineering + Modular Agent Architecture

**Refactored From:** 8 weeks, 175 story points → **4 weeks, 60 story points**

---

## ✅ YES - Refactored for 4-Week Mockup-First Delivery!

### Key Changes

| Aspect | Original (8 Weeks) | **Refactored (4 Weeks)** |
|--------|-------------------|------------------------|
| **Timeline** | 8 weeks | **4 weeks** |
| **Approach** | Code-first | **Mockup-first (Figma validation)** |
| **Scope** | 8 deliverables, 175 points | **3 deliverables, 60 points** |
| **Agents** | 4 specialized agents | **2 agents + 2 platform modules** |
| **Features** | All features | **ONE core flow only** |
| **Architecture** | Monolithic | **Platform Engineering (modular)** |
| **Structure** | Single product | **Joint venture with reusable modules** |

---

## 📅 4-Week Timeline

```
┌─────────────────────────────────────────────────────────────┐
│ WEEK 1-2: FIGMA MOCKUP PHASE (Design-First)               │
├─────────────────────────────────────────────────────────────┤
│ Mon-Fri:  Create 12 Figma screens (high-fidelity)         │
│ Sat-Mon:  Build interactive prototype                      │
│ Tue-Wed:  User testing (5 of James's clients)             │
│ Thu-Fri:  Iterate based on feedback                        │
│                                                             │
│ ✅ Deliverable: Validated Figma mockups + prototype       │
│ ✅ Approval Gate: James + Users 80%+ satisfaction         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WEEK 3: PLATFORM ENGINEERING (Infrastructure-First)        │
├─────────────────────────────────────────────────────────────┤
│ Mon-Tue:  Infrastructure setup (Supabase + Vercel)        │
│ Wed-Thu:  Context Engineering Module (npm package)         │
│ Wed-Thu:  Value Engineering Module Agent (npm package)     │
│ Fri:      Component library (Shadcn + Design System v2.0) │
│                                                             │
│ ✅ Deliverable: Reusable platform modules                 │
│ ✅ Test: `npx create-viridian-app` works                  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ WEEK 4: FIRST-STAGE MVP (Core Value Flow)                  │
├─────────────────────────────────────────────────────────────┤
│ Mon-Tue:  Nutrition Advisor Agent (conversational)         │
│ Wed:      Meal Planner Agent (7-day plans)                 │
│ Thu:      UI Integration (Figma → production)              │
│ Fri:      Testing + staging deployment                     │
│                                                             │
│ ✅ Deliverable: Working MVP with 1 flow                   │
│ ✅ Flow: Sign Up → Chat → Meal Plan → View Recipe         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Platform Engineering Architecture

### Modular Agent System (NEW)

**Before (4 Monolithic Agents):**
```
Nutrition Advisor ──┐
Meal Planner ───────┤
Progress Analyst ───┼──> All tightly coupled
PMF Feedback ───────┘
```

**After (2 Product Agents + 2 Platform Modules):**
```
┌─────────────────────────────────────────────────┐
│ PLATFORM MODULES (Reusable)                    │
├─────────────────────────────────────────────────┤
│ • Context Engineering Module                    │
│   → Three-tier context assembly                 │
│   → 50% cost reduction via caching             │
│                                                 │
│ • Value Engineering Module Agent                │
│   → Cost tracking & optimization                │
│   → Quality gates & validation                  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ PRODUCT AGENTS (Viridian-Specific)             │
├─────────────────────────────────────────────────┤
│ • Nutrition Advisor Agent                       │
│   → Conversational, user-facing                 │
│                                                 │
│ • Meal Planner Agent                            │
│   → 7-day structured meal plans                 │
└─────────────────────────────────────────────────┘
```

**Benefits:**
- ✅ Modules work across James's other products (PT app, booking system)
- ✅ `@viridian/context-engineering` npm package
- ✅ `@viridian/value-engineering-agent` npm package
- ✅ Infrastructure deployable with `npx create-viridian-app`

---

## 🎨 Figma-First Approach (Week 1-2)

### Why Mockup Before Code?

**Traditional Problem:**
```
Write Code → Deploy → User Test → Issues Found → Rewrite Code
= 10 hours wasted per issue
```

**Mockup-First Solution:**
```
Figma Design → User Test → Issues Found → Update Figma
= 1 hour per issue (10x faster!)
```

### 12 Figma Screens (High-Fidelity)

1. **Auth:** Sign In, Sign Up
2. **Client:** Dashboard, Chat, Meal Plan, Recipe Detail
3. **Profile:** Profile Edit, Settings
4. **Coach:** Coach Dashboard, Client Detail
5. **States:** Loading, Errors, Empty

### Interactive Prototype

- ✅ Click-through all 12 screens
- ✅ Simulated AI chat with pre-written responses
- ✅ Meal plan calendar with expand/collapse
- ✅ Mobile responsive (320px → 1920px)

### User Testing (Week 2)

- **Participants:** 5 of James's current clients
- **Duration:** 30 min each
- **Tasks:** Sign up, ask AI, view meal plan, check recipe
- **Success:** 80%+ task completion, positive sentiment

---

## 🚀 First-Stage MVP Scope (Week 4)

### Core Value Flow (ONLY)

```
User Journey (ONE Flow):
1. Sign up / onboard (5 min)
2. Ask AI nutrition question → Get advice (streaming)
3. Request meal plan → View 7-day calendar
4. Click recipe → See ingredients + instructions

That's it! Nothing else.
```

### In Scope ✅

- AI Chat (Nutrition Advisor Agent)
- Meal Plan Generation (Meal Planner Agent)
- Recipe Database (50 UK recipes)
- Client Profile (onboarding + edit)
- Authentication (email/password)

### Out of Scope ❌ (Deferred to Post-MVP)

- Progress tracking / charts
- Coach dashboard (James uses Supabase admin)
- PMF analytics module
- Shopping list export
- Recipe favorites / ratings
- Payment (Stripe)
- Email notifications

**Rationale:** Validate ONE core flow, then iterate

---

## 💎 Value Engineering Module Agent

### What Is It?

**A reusable AI agent that optimizes cost + quality for ALL other agents**

### What It Does

```typescript
// Before (no value engineering):
const response = await claude.messages.create({
  prompt: longPrompt, // 8000 tokens, no optimization
  // Cost: $0.024 per message
});

// After (with value engineering):
const optimized = await valueAgent.optimize(longPrompt);
// → Reduced to 7200 tokens (10% savings)
// → Quality validated before returning
// → Cost tracked: $0.0216 per message
// → Alert if cost spike detected
```

### Real-Time Metrics Dashboard

```
┌────────────────────────────────────────┐
│ Value Engineering Dashboard            │
├────────────────────────────────────────┤
│ Today:                                 │
│   • API Cost: $1.23                    │
│   • Interactions: 47                   │
│   • Savings: $0.89 (42% from caching) │
│                                        │
│ Quality:                               │
│   • Score: 87/100                      │
│   • Safety violations: 0               │
│                                        │
│ Cache:                                 │
│   • Tier 1 hit rate: 98%               │
│   • Tier 2 hit rate: 85%               │
└────────────────────────────────────────┘
```

---

## 🧩 Context Engineering Module

### Three-Tier Architecture

```
┌─────────────────────────────────────────────────┐
│ TIER 1: STATIC EXPERT CONTEXT                  │
│ • James's clinical nutrition methodology       │
│ • UK dietary guidelines                         │
│ • Safety protocols                              │
│ • ~5000 tokens, cached indefinitely            │
├─────────────────────────────────────────────────┤
│ TIER 2: DYNAMIC CLIENT CONTEXT                 │
│ • Client profile from Schema.org JSONB         │
│ • "Sarah, 39yo, Type 2 Diabetes, vegetarian"  │
│ • Allergens, goals, macro targets              │
│ • ~2000 tokens, cached per session             │
├─────────────────────────────────────────────────┤
│ TIER 3: REAL-TIME SESSION CONTEXT             │
│ • Current query                                 │
│ • Today's date, season                          │
│ • Recent conversation messages                  │
│ • ~500 tokens, NOT cached                      │
└─────────────────────────────────────────────────┘
                    ↓
        Combined into single prompt
                    ↓
             Claude Sonnet 4
                    ↓
      50% cost savings via caching
```

### Benefits

**Cost:**
- Without caching: $0.0375 per message
- With caching (Tier 1+2): $0.0186 per message
- **Savings: 50% average**

**Quality:**
- James's methodology always consistent (Tier 1)
- Client data always accurate (Tier 2 from JSONB)
- Real-time info always fresh (Tier 3)

---

## 📊 Success Metrics

### Week 2 (Figma Phase)

- ✅ 5 user tests completed
- ✅ 80%+ task completion rate
- ✅ Positive sentiment ("I would use this")
- ✅ James approves all designs

### Week 4 (MVP Phase)

**Technical:**
- ✅ MVP deployed to production
- ✅ <5s AI response time (P95)
- ✅ 0 critical bugs
- ✅ 99%+ uptime

**Cost:**
- ✅ API cost <£50 for Week 4
- ✅ 40%+ savings from caching

**Quality:**
- ✅ James validates 10 sample interactions
- ✅ No allergen safety violations
- ✅ Meal plans within ±5% of targets

**User:**
- ✅ 3 beta users test full flow
- ✅ 2+ positive feedback
- ✅ <3 min onboarding

---

## 🎯 What Gets Built

### Week 1-2 Output

📄 **Files Created:**
- 12 Figma screens (Design System v2.0)
- Interactive prototype (clickable)
- User testing report (findings + iterations)
- Final design handoff (for developers)

### Week 3 Output

📦 **Platform Modules (npm packages):**
- `@viridian/context-engineering`
- `@viridian/value-engineering-agent`
- `@viridian/design-system`
- `@viridian/supabase-schema`

🏗️ **Infrastructure:**
- Supabase project (PostgreSQL + Auth)
- Vercel project (Next.js hosting)
- GitHub repo with CI/CD

### Week 4 Output

🚀 **Live MVP:**
- viridian-nutrition.vercel.app (production URL)
- 3 pages: /chat, /meal-plans, /profile
- 2 agents: Nutrition Advisor, Meal Planner
- 50 UK recipes seeded
- Authentication working
- Value Engineering dashboard for James

---

## 🤝 Joint Venture Structure

### Team Commitment (4 Weeks)

**Development Team:**
- UI/UX Designer: 40 hours
- Full-Stack Developer: 80 hours
- DevOps Engineer: 20 hours
- QA Tester: 20 hours
- **Total: 160 hours**

**James Kerby (Domain Expertise):**
- Design validation & user testing: 20 hours
- Content & clinical expertise: 20 hours
- **Total: 40 hours**

**Collaborative Approach:**
- Daily standups (15 min)
- Continuous validation
- Shared ownership of platform modules
- Reusable infrastructure for future ventures

---

## 🔄 Post-MVP Roadmap

### Week 5-8: Full MVP
- Add Progress Tracking
- Build Coach Dashboard
- Add PMF Analytics Module
- Shopping list export
- Recipe favorites

### Month 2-3: Scale
- Payment integration (Stripe)
- Email notifications (Resend)
- Mobile app (React Native)
- Referral program

### Month 4+: Platform Expansion
- Deploy Context Engineering Module to James's PT app
- Deploy Value Engineering Module to booking system
- Build new products using platform modules

---

## ✅ Key Advantages of This Approach

### 1. **De-Risk Early (Week 2)**
- Validate UI/UX with real users BEFORE writing code
- Catch design issues when they cost 1 hour, not 10 hours

### 2. **Modular & Reusable (Week 3)**
- Platform modules work across ALL of James's products
- Infrastructure-as-code: deploy anywhere in <30 min

### 3. **Focused Scope (Week 4)**
- Ship ONE core flow, validate product-market fit
- No wasted effort on features users don't want

### 4. **Operationally Optimized (Platform)**
- Value Engineering Module reduces API costs by 50%
- Context Engineering Module standardizes quality

### 5. **Fast to Market**
- 4 weeks vs 8 weeks = 50% faster time to validation
- Same quality, focused scope
- Joint venture structure = shared ownership

---

## 📄 Complete Documentation Package

**NEW Documents:**
- ✅ VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md (85KB, this doc)
- ✅ 4-Week-Mockup-First-Quick-Reference.md (this summary)

**Existing Documents (Still Valid):**
- VHF-NI-App-Mk3-HLD-Architecture-v2.0.md (architecture unchanged)
- VHF-NI-App-Mk3-Ontology-Implementation-v2.0.md (Schema.org + JSONB)
- VHF-NI-App-Mk3-Figma-Workflow-v2.0.md (Design System v2.0)
- VHF-NI-App-Mk3-Agent-Spec-Full-v1.0.md (agent details)

**To Be Updated:**
- VHF-NI-App-Mk3-WBS-v1.0.md (needs 4-week refactor)

---

## 🚦 Next Steps

### Immediate (This Week)
1. **Review & Approve:** James reviews this 4-week PRD
2. **Hire Designer:** Find UI/UX designer for Week 1-2
3. **Schedule User Tests:** Book 5 of James's clients for Week 2

### Week 1 (Starting Dec 9)
1. **Kick-off:** Team sync + design brief
2. **Start Figma:** Designer creates 12 screens
3. **Daily Reviews:** James reviews Figma progress

### Week 2 (Starting Dec 16)
1. **Prototype:** Build interactive click-through
2. **User Tests:** 5 sessions with James's clients
3. **Iterate:** Fix issues, finalize designs

### Week 3 (Starting Dec 23)
1. **Infrastructure:** Set up Supabase + Vercel
2. **Platform Modules:** Build reusable npm packages
3. **Component Library:** Implement Design System v2.0

### Week 4 (Starting Dec 30)
1. **Agents:** Build Nutrition Advisor + Meal Planner
2. **UI Integration:** Figma → production code
3. **Launch:** Deploy MVP to production 🚀

---

**Ready to build? Let's ship it! 🎉**

---

**Cross-References:**
- Full PRD: VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md
- Architecture: VHF-NI-App-Mk3-HLD-Architecture-v2.0.md
- Design System: VHF-NI-App-Mk3-Figma-Workflow-v2.0.md
- Ontology: VHF-NI-App-Mk3-Ontology-Implementation-v2.0.md

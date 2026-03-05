# VHF-Mockup-FigmaMake: Product Requirements Document
## FigmaMake-Based Mockup Generation (Sub-PRD)

**Document ID:** VHF-Mockup-FigmaMake-PRD-v1.0  
**Version:** 1.0.0  
**Date:** 2024-12-10  
**Status:** Active  
**Parent Document:** VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md (Section 4)  
**GitHub:** https://github.com/ajrmooreuk/VHF-App-Mk3/blob/main/VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md

---

## Executive Summary

### Purpose
This sub-PRD isolates the Week 1-2 Figma mockup deliverables from the main PRD and defines how to execute them using FigmaMake for programmatic generation instead of manual design.

### Scope
**In Scope:**
- 12 high-fidelity Figma screens (authentication, dashboard, profile, coach, states)
- 73 design system styles (56 colors, 11 text, 6 shadows)
- Component library (atoms, molecules, organisms, templates)
- Interactive prototype with click-through flows
- Mobile responsive frames (375px, 768px, 1440px)
- User testing preparation materials

**Out of Scope:**
- Actual implementation code (Week 3-4)
- Backend/database setup
- AI agent development
- User testing execution (separate workstream)

### Success Criteria
- [ ] All 12 screens generated in Figma and viewable
- [ ] Design tokens v3.0 fully imported (73 styles)
- [ ] Interactive prototype flows end-to-end
- [ ] Mobile responsive frames for key screens
- [ ] Handoff documentation complete
- [ ] Ready for user testing by end of Week 2

---

## Product Definition

### Parent Context
From **VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md Section 4.2**:

**12 Core Screens:**
1. Sign In
2. Sign Up / Onboarding
3. Dashboard Home
4. AI Chat Interface
5. Meal Plan View
6. Recipe Detail View
7. Client Profile
8. Settings
9. Coach Home (James)
10. Client Detail View
11. Loading / Error States
12. Empty States

### Design System Foundation
**Source:** VHF-NI-App-Mk3-Figma-Architecture-v1.0.md

**Brand Colors:**
- Primary: #007c74 (Viridian Teal)
- Secondary: #f16a21 (Orange)
- Accent: #a0afa1 (Sage)

**Typography:**
- Font: PT Sans
- Weights: 400 (normal), 700 (bold)
- Scale: H1-H6, Body, Caption

**Atomic Structure:**
- **Atoms:** Colors, typography, icons, spacing (8px grid)
- **Molecules:** Button, Input, Badge, Avatar, MacroChart
- **Organisms:** MealCard, RecipeCard, ChatBubble, NutritionPanel, ProgressChart
- **Templates:** DashboardLayout, ChatLayout, MealPlanLayout, ProfileLayout
- **Pages:** 12 MVP screens

---

## Functional Requirements

### FR-1: Design Token Import
**Priority:** P0 (Critical)  
**Description:** Import VHF-NI-App-Mk3-Design-Tokens-v3.0.json into Figma as variables and styles

**Acceptance Criteria:**
- [ ] 56 color variables created (primitive → semantic → component)
- [ ] 11 typography variables created (PT Sans, sizes, weights)
- [ ] Spacing scale created (4px, 8px, 16px, 24px, 32px, 48px)
- [ ] 56 color styles applied
- [ ] 11 text styles applied
- [ ] 6 shadow styles applied (teal tint)

**Test Method:** Manual verification in Figma variables panel

---

### FR-2: Component Library Generation
**Priority:** P0 (Critical)  
**Description:** Generate reusable components following atomic design hierarchy

**Acceptance Criteria:**
- [ ] Atoms: Color swatches, icons, spacing visualizations created
- [ ] Molecules: Button (48 variants), Input (12 variants), Badge (5 variants), Avatar (6 variants), MacroChart (3 variants)
- [ ] Organisms: MealCard (16 variants), RecipeCard (4 variants), ChatBubble (4 variants), NutritionPanel (3 variants), ProgressChart (6 variants)
- [ ] Templates: 4 layout templates created with auto-layout
- [ ] All components use design tokens (no hardcoded values)

**Test Method:** Component variant inspection + token usage audit

---

### FR-3: Screen Generation
**Priority:** P0 (Critical)  
**Description:** Generate 12 high-fidelity screens using component library

**Acceptance Criteria:**
- [ ] Authentication screens (2): Sign In, Sign Up/Onboarding with 4-step form
- [ ] Dashboard screens (4): Home, Chat, Meal Plan, Recipe Detail
- [ ] Profile screens (2): Client Profile, Settings
- [ ] Coach screens (2): Coach Home, Client Detail
- [ ] State screens (2): Loading/Error, Empty States
- [ ] All screens follow design system
- [ ] Responsive layouts (mobile-first)

**Test Method:** Screen review checklist + design QA

---

### FR-4: Interactive Prototype
**Priority:** P1 (High)  
**Description:** Create click-through prototype with user flows

**Acceptance Criteria:**
- [ ] Primary flow: Sign In → Dashboard → Chat → Meal Plan → Recipe
- [ ] Onboarding flow: Sign Up → 4 steps → Dashboard
- [ ] Profile flow: Dashboard → Profile → Settings
- [ ] Coach flow: Coach Home → Client Detail
- [ ] Error flow: Loading → Error → Retry
- [ ] Button hover states functional
- [ ] Form focus states functional
- [ ] Mobile navigation functional

**Test Method:** Prototype walkthrough + flow testing

---

### FR-5: Mobile Responsiveness
**Priority:** P1 (High)  
**Description:** Create responsive frames for all breakpoints

**Acceptance Criteria:**
- [ ] 3 breakpoints defined: Mobile (375px), Tablet (768px), Desktop (1440px)
- [ ] Key screens have mobile variants (Dashboard, Chat, Meal Plan)
- [ ] Navigation adapts (hamburger menu on mobile)
- [ ] Components scale properly
- [ ] Touch targets minimum 44px

**Test Method:** Breakpoint testing + responsive inspection

---

### FR-6: Handoff Documentation
**Priority:** P1 (High)  
**Description:** Create developer handoff materials

**Acceptance Criteria:**
- [ ] Component usage guide created
- [ ] Screen flow diagram created
- [ ] Design token reference generated
- [ ] Responsive guidelines documented
- [ ] Accessibility notes included (WCAG 2.1 AA)
- [ ] Figma share link generated
- [ ] Prototype link exported

**Test Method:** Documentation completeness review

---

## Non-Functional Requirements

### NFR-1: Design Consistency
**Requirement:** All screens must use design tokens consistently  
**Measurement:** 0 hardcoded color/spacing values  
**Test:** Automated token usage audit

### NFR-2: Accessibility
**Requirement:** WCAG 2.1 AA compliance  
**Measurement:** Color contrast ratio ≥4.5:1 for text, ≥3:1 for UI elements  
**Test:** Stark plugin accessibility check

### NFR-3: Performance
**Requirement:** Figma file loads within 5 seconds  
**Measurement:** Time to interactive in Figma  
**Test:** Load time testing

### NFR-4: Maintainability
**Requirement:** Components must be instance-based (not detached)  
**Measurement:** 100% of screen elements linked to component library  
**Test:** Instance inspection

### NFR-5: Layout Spacing
**Requirement:** All content must have proper padding/margins - no content touching viewport edges  
**Measurement:** Minimum 16px container padding on mobile, 24px tablet, 32px desktop  
**Test:** Visual inspection at all breakpoints + layout spacing validation

---

## Constraints & Assumptions

### Technical Constraints
- FigmaMake must support Figma API v1
- PT Sans font must be available in Figma
- Design tokens must be in valid JSON format
- Figma account must have editor access

### Business Constraints
- Must complete within Week 1-2 (12 hours total)
- Must be ready for user testing by end of Week 2
- Must align with existing PRD timeline

### Assumptions
- Design tokens v3.0 are final and approved
- Component specifications are stable
- FigmaMake documentation is accessible
- Figma API is operational

---

## Dependencies

### Upstream Dependencies
- [x] VHF-NI-App-Mk3-Design-Tokens-v3.0.json exists
- [x] VHF-NI-App-Mk3-Figma-Architecture-v1.0.md approved
- [x] VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md approved
- [ ] Figma API token generated
- [ ] FigmaMake installed and configured

### Downstream Dependencies
- User testing preparation (depends on FR-6)
- Week 3-4 implementation (depends on FR-3, FR-6)
- Component library handoff (depends on FR-2)

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| FigmaMake API limitations | High | Medium | Fallback to manual Figma design if API insufficient |
| Design token format incompatibility | High | Low | Pre-validate JSON format with FigmaMake |
| PT Sans font unavailable | Medium | Low | Use system font fallback (Arial) |
| Component generation errors | Medium | Medium | Generate in batches, validate incrementally |
| Prototype interactions broken | Low | Low | Manual linking as fallback |

---

## Acceptance Testing

### Test Cases

**TC-1: Design Token Import**
1. Open generated Figma file
2. Navigate to Variables panel
3. Verify 56 color variables exist
4. Verify 11 typography variables exist
5. Verify spacing scale exists
6. Check Styles panel for 73 total styles
7. **Pass Criteria:** All tokens present and correctly named

**TC-2: Component Library**
1. Navigate to Components page
2. Verify Atoms page has color swatches, icons, spacing
3. Verify Molecules page has Button with 48 variants
4. Verify Organisms page has MealCard, RecipeCard, ChatBubble
5. Test component variant switching
6. **Pass Criteria:** All components render correctly, variants switch properly

**TC-3: Screen Generation**
1. Navigate to Pages (06 - Pages)
2. Verify all 12 screens exist
3. Check each screen uses component instances (not detached)
4. Verify brand colors (#007c74, #f16a21) applied
5. Verify PT Sans typography used
6. **Pass Criteria:** 12 screens complete, design system compliant

**TC-4: Interactive Prototype**
1. Click "Present" in Figma
2. Test primary flow: Sign In → Dashboard → Chat → Meal Plan
3. Test button hover states
4. Test form input focus states
5. Test mobile navigation
6. **Pass Criteria:** All flows navigate correctly, interactions work

**TC-5: Mobile Responsive**
1. View Dashboard Home at 375px (mobile)
2. View Dashboard Home at 768px (tablet)
3. View Dashboard Home at 1440px (desktop)
4. Verify layout adapts appropriately
5. Verify navigation changes to hamburger menu on mobile
6. **Pass Criteria:** All breakpoints render properly

**TC-6: Handoff Documentation**
1. Open component usage guide
2. Verify screen flow diagram exists
3. Check design token reference completeness
4. Verify Figma share link works (view-only)
5. Verify prototype link works
6. **Pass Criteria:** All documentation present and accessible

**TC-7: Layout Spacing Validation**
1. Open each of 12 screens in Figma
2. Check mobile frame (375px): Verify minimum 16px left/right padding
3. Check tablet frame (768px): Verify minimum 24px left/right padding
4. Check desktop frame (1440px): Verify minimum 32px left/right padding
5. Verify cards have internal padding (16px minimum)
6. Verify forms have field spacing (16px between fields)
7. Verify no text/icons/logos touching viewport edges
8. Check container max-widths applied (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
9. Verify grid gutters: 16px mobile, 24px tablet, 32px desktop
10. **Pass Criteria:** All content has breathing room, no edge-to-edge layouts

---

## Deliverables

### Primary Deliverables
1. **Figma File:** "VHF Nutrition Intelligence - Design System v3.0"
2. **Component Library:** 73 styles + atomic component hierarchy
3. **12 Screens:** High-fidelity mockups (authentication, dashboard, profile, coach, states)
4. **Interactive Prototype:** Click-through flows with interactions
5. **Handoff Package:** Documentation, share links, design specs

### Supporting Deliverables
1. Design token import script (if applicable)
2. Component generation logs
3. QA checklist (completed)
4. User testing preparation kit

---

## Timeline

**Week 1:**
- Day 1-2: FigmaMake setup + token import (FR-1)
- Day 3-4: Component library generation (FR-2)
- Day 5: Screen generation starts (FR-3)

**Week 2:**
- Day 1-2: Complete screens + prototype (FR-3, FR-4)
- Day 3: Mobile responsive frames (FR-5)
- Day 4-5: Documentation + handoff prep (FR-6)

**Total Effort:** 12 hours (vs 20+ manual design)

---

## References

### Parent Documents
- **PRD:** https://github.com/ajrmooreuk/VHF-App-Mk3/blob/main/VHF-NI-App-Mk3-PRD-Mockup-First-v3.0.md
- **Figma Architecture:** VHF-NI-App-Mk3-Figma-Architecture-v1.0.md
- **Design Tokens:** VHF-NI-App-Mk3-Design-Tokens-v3.0.json

### Related Documents
- **PBS:** VHF-Mockup-FigmaMake-PBS-v1.0.md (see companion document)
- **WBS:** VHF-Mockup-FigmaMake-WBS-v1.0.md (see companion document)
- **Implementation Plan:** Plan ID a4948b96-1c10-41f6-a18c-29b86a73d945
- **Layout Spacing Fix:** VHF-Design-System-Layout-Spacing-Fix-v1.0.md (CRITICAL - Applied 2024-12-11)

---

## Change Control Log

### Version 1.1.0 - 2024-12-11
**Type:** CRITICAL UPDATE - Layout Spacing Requirements Added  
**Status:** Active

**Changes:**
- Added NFR-5: Layout Spacing requirement (minimum padding specifications)
- Added TC-7: Layout Spacing Validation test case (10-step validation)
- Added reference to VHF-Design-System-Layout-Spacing-Fix-v1.0.md
- Updated dependencies: Design Tokens v3.0 now requires layout tokens

**Reason:**
- FigmaMake mockups showed content touching viewport edges at all breakpoints
- Design system lacked container padding and layout margin specifications
- Blocking issue for user testing (WCAG 2.1 AA compliance)

**Impact:**
- All 12 screens require layout token application
- Responsive padding matrix now mandatory: 16px mobile, 24px tablet, 32px desktop
- Card internal padding required: minimum 16px
- Form field spacing required: 16px between fields, 8px label-to-input

**Validation:**
- TC-7 must pass before user testing
- Visual inspection at all breakpoints (mobile/tablet/desktop)
- No content may touch viewport edges

**References:**
- Layout Fix Document: https://github.com/ajrmooreuk/VHF-App-Mk3/blob/main/VHF-Design-System-Layout-Spacing-Fix-v1.0.md
- Commit: d8275f4

---

**Document Status:** ✅ Active - Updated with Layout Spacing Requirements  
**Version:** 1.1.0  
**Last Updated:** 2024-12-11  
**Approval:** Pending stakeholder review

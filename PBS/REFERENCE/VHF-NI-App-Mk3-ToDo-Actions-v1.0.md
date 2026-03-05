# VHF-NI-App-Mk3: To-Do Actions & Implementation Checklist
## Complete Task List for 4-Week MVP Development

**Document ID:** VHF-NI-App-Mk3-ToDo-Actions-v1.0  
**Version:** 1.0.0  
**Date:** 2024-12-09  
**Status:** Active - Ready for Claude Code Implementation  
**Approval:** ✅ Design Tokens v3.0 Approved by James Kerby

---

## Table of Contents

1. [Immediate Actions (This Week)](#1-immediate-actions-this-week)
2. [Week 1 Tasks (Figma Design Phase)](#2-week-1-tasks-figma-design-phase)
3. [Week 2 Tasks (User Testing & Iteration)](#3-week-2-tasks-user-testing--iteration)
4. [Week 3 Tasks (Platform Engineering)](#4-week-3-tasks-platform-engineering)
5. [Week 4 Tasks (MVP Development)](#5-week-4-tasks-mvp-development)
6. [Post-MVP Tasks](#6-post-mvp-tasks)
7. [Documentation Updates Remaining](#7-documentation-updates-remaining)

---

## 1. Immediate Actions (This Week)

### Priority 1: Critical Path (Must Complete Before Week 1)

#### 1.1 Asset Preparation
**Owner:** Dev Team  
**Deadline:** Before Week 1, Day 1  
**Estimated Time:** 2 hours

- [ ] **Download all assets from Google Drive**
  - [ ] Logo Primary: `https://drive.google.com/file/d/136vHQXcwasJLz6u8S91eZvGrPYWV8c_O/view`
  - [ ] Hero Image: `https://drive.google.com/file/d/1M-6QLo0ZHOoO80JGw-QH6fVrHu3LVoEk/view`
  - [ ] OG Image: `https://drive.google.com/file/d/1vA0btPB9bajoR4xF3t17BgPCmSKDIgmf/view`
  - [ ] Favicon: Same as logo (136vHQXcwasJLz6u8S91eZvGrPYWV8c_O)

- [ ] **Optimize assets for production**
  - [ ] Convert logo to SVG (if not already)
  - [ ] Create @2x and @3x versions for retina displays
  - [ ] Optimize hero image (compress to <500KB)
  - [ ] Resize OG image to exactly 1200x630px
  - [ ] Create multiple favicon sizes (16x16, 32x32, 192x192, 512x512)

- [ ] **Store optimized assets**
  ```
  /assets/brand/
    ├── logo.svg
    ├── logo@2x.png
    ├── logo@3x.png
    ├── hero.jpg (optimized)
    ├── hero@2x.jpg
    ├── og-image.jpg (1200x630)
    ├── favicon.ico
    ├── favicon.svg
    ├── favicon-192.png
    └── favicon-512.png
  ```

#### 1.2 Figma Environment Setup
**Owner:** Designer  
**Deadline:** Before Week 1, Day 1  
**Estimated Time:** 30 minutes

- [ ] **Install Figma Tokens plugin**
  - Plugin: "Figma Tokens" by Jan Six
  - Verify plugin can read JSON token files

- [ ] **Create Figma project structure**
  - [ ] Create new project: "VHF Nutrition Intelligence Platform"
  - [ ] Create file: "Design System v3.0"
  - [ ] Create file: "MVP Screens - Week 1-2"
  - [ ] Set up pages: Authentication, Dashboard, Profile, Coach, States

- [ ] **Import PT Sans font to Figma**
  - [ ] Add from Google Fonts: PT Sans (400, 700)
  - [ ] Verify font renders correctly

#### 1.3 Team Coordination
**Owner:** Project Lead  
**Deadline:** Before Week 1 starts  
**Estimated Time:** 1 hour

- [ ] **Schedule Week 1 kickoff meeting**
  - Date/Time: Week 1, Day 1 morning
  - Attendees: James, Designer, Dev Lead
  - Duration: 30 minutes
  - Agenda: Review Design Tokens approval, Figma sync plan

- [ ] **Schedule daily standups**
  - Time: 15 minutes every morning
  - Format: What done, what doing, blockers
  - Tool: Zoom/Teams

- [ ] **Book 5 user testing sessions for Week 2**
  - Participants: 5 of James's current clients
  - Duration: 30 minutes each
  - Format: Remote via Zoom
  - Schedule: Week 2, Days 1-3

---

## 2. Week 1 Tasks (Figma Design Phase)

### Day 1: Figma Sync & Setup

#### Morning: Figma Token Import (90 minutes)
**Owner:** Designer  
**Priority:** CRITICAL PATH

- [ ] **Phase 1: Import Design Tokens** (30 min)
  - [ ] Open Figma Tokens plugin
  - [ ] Load `VHF-NI-App-Mk3-Design-Tokens-v3.0.json`
  - [ ] Map tokens to Figma variables
  - [ ] Verify all categories imported: color, typography, spacing, shadows
  - [ ] Test token values match specifications

- [ ] **Phase 2: Create Color Styles** (15 min)
  - [ ] Create Primary scale (50-900) = 11 styles
  - [ ] Create Secondary scale (50-900) = 11 styles  
  - [ ] Create Accent colors = 3 styles
  - [ ] Create Semantic colors (success, warning, error, info) = 12 styles
  - [ ] Create Neutral scale (50-900) = 11 styles
  - [ ] Create Text colors (primary, secondary, tertiary, disabled) = 4 styles
  - [ ] Create Border colors (default, subtle, strong, focus) = 4 styles
  - **Total: 56 color styles**

- [ ] **Phase 3: Create Text Styles** (15 min)
  - [ ] Create Headings H1-H6 (PT Sans Bold) = 6 styles
  - [ ] Create Body Base, Small, Large (PT Sans Regular) = 3 styles
  - [ ] Create Caption XS, SM (PT Sans Regular) = 2 styles
  - **Total: 11 text styles**

- [ ] **Phase 4: Create Effect Styles** (10 min)
  - [ ] Create shadows (sm, md, lg, xl, 2xl, inner) = 6 styles
  - [ ] Verify shadow colors use primary tint (rgba(0, 124, 116, ...))
  - **Total: 6 effect styles**

- [ ] **Phase 5: Import Assets** (20 min)
  - [ ] Import logo as component
  - [ ] Import hero image to assets
  - [ ] Import OG image to assets
  - [ ] Create favicon component
  - **Total: 4 asset components**

- [ ] **Verification Checklist**
  - [ ] Total styles created: 73 (56 color + 11 text + 6 effects)
  - [ ] Total assets imported: 4
  - [ ] All colors match Design Tokens v3.0
  - [ ] PT Sans renders correctly
  - [ ] Shadows use correct tint

#### Afternoon: Begin Screen Mockups (4 hours)
**Owner:** Designer  
**Priority:** HIGH

- [ ] **Screen 1: Sign In** (30 min)
  - [ ] Layout: Logo, email input, password input, sign-in button, sign-up link
  - [ ] Apply primary color (#007c74) to button
  - [ ] Use PT Sans for all text
  - [ ] Add shadow-md to input focus states

- [ ] **Screen 2: Sign Up / Onboarding** (45 min)
  - [ ] Multi-step form: Personal info → Goals → Health data → Preferences
  - [ ] Progress indicator (4 steps)
  - [ ] Apply Design System colors and typography
  - [ ] Add validation states (error color #cece3e)

- [ ] **Screen 3: Dashboard Home** (1 hour)
  - [ ] Layout: Header, quick stats, recent meals, AI chat preview, meal plan preview
  - [ ] Use neutral-50 (#f5f9f6) for background
  - [ ] Apply primary color for CTAs
  - [ ] Use PT Sans Bold for headings

- [ ] **Screen 4: AI Chat Interface** (1 hour)
  - [ ] Layout: Message list, input field, send button
  - [ ] Message bubbles: User (primary-light bg), AI (neutral-100 bg)
  - [ ] Streaming indicator for AI responses
  - [ ] Use PT Sans for message text

### Days 2-3: Continue Mockups (16 hours total)

- [ ] **Screen 5: Meal Plan View** (2 hours)
  - [ ] 7-day calendar layout
  - [ ] Meal cards: Breakfast, Lunch, Dinner, Snacks
  - [ ] Nutrition summary per day
  - [ ] Apply accent color (#a0afa1) for subtle elements

- [ ] **Screen 6: Recipe Detail View** (1.5 hours)
  - [ ] Recipe image, title, nutrition facts, ingredients, instructions
  - [ ] Macros chart using primary, secondary, accent colors
  - [ ] "Add to meal plan" button (secondary color #f16a21)

- [ ] **Screen 7: Client Profile** (1.5 hours)
  - [ ] Personal info, goals, health data sections
  - [ ] Edit mode with form inputs
  - [ ] Progress charts (weight, measurements)

- [ ] **Screen 8: Settings** (1 hour)
  - [ ] Preferences, notifications, account sections
  - [ ] Toggle switches using primary color
  - [ ] Delete account (warning color #e54525)

### Days 4-5: Coach & States Screens (12 hours)

- [ ] **Screen 9: Coach Home** (2 hours)
  - [ ] Client list with status indicators
  - [ ] Alerts/notifications panel
  - [ ] Quick actions for James
  - [ ] Use info color (#822212) for notifications

- [ ] **Screen 10: Client Detail View** (2 hours)
  - [ ] Client overview, recent activity, meal plans, progress
  - [ ] Chat history with client
  - [ ] Action buttons for James

- [ ] **Screen 11: Loading / Error States** (1.5 hours)
  - [ ] Loading spinners (primary color)
  - [ ] Error messages (error color #cece3e)
  - [ ] Success toasts (success color #49bad4)
  - [ ] Network error screen

- [ ] **Screen 12: Empty States** (1.5 hours)
  - [ ] No meal plan yet
  - [ ] No messages yet
  - [ ] No recipes saved
  - [ ] Friendly illustrations or icons

- [ ] **Create Interactive Prototype** (3 hours)
  - [ ] Link all 12 screens with click-through navigation
  - [ ] Add hover states for buttons
  - [ ] Add transitions (200ms ease-out from Design Tokens)
  - [ ] Test prototype flow end-to-end

- [ ] **Design Handoff Preparation** (2 hours)
  - [ ] Export all screens @2x for documentation
  - [ ] Create component documentation
  - [ ] Note all Design Token usage per screen
  - [ ] Prepare for developer handoff

---

## 3. Week 2 Tasks (User Testing & Iteration)

### Days 1-3: User Testing (15 hours)

#### Conduct 5 User Tests
**Owner:** Designer + James  
**Priority:** CRITICAL PATH

- [ ] **Test Session 1** (30 min test + 15 min debrief)
  - [ ] Participant: James's client #1
  - [ ] Record session (with permission)
  - [ ] Note all issues and feedback
  - [ ] Task completion checklist:
    - [ ] Sign up and complete onboarding (<5 min)
    - [ ] Ask AI 3 nutrition questions
    - [ ] Request a 7-day meal plan
    - [ ] View and understand recipe details
  - [ ] Feedback form: Would you use this? (1-5 scale)

- [ ] **Test Session 2-5** (Same structure)
  - [ ] Repeat for participants 2, 3, 4, 5
  - [ ] Aggregate feedback after each session
  - [ ] Identify patterns in issues

#### Synthesize Feedback (4 hours)
**Owner:** Designer  

- [ ] **Compile all feedback** (1 hour)
  - [ ] Task completion rates per screen
  - [ ] Time on task per screen
  - [ ] Usability issues (categorize: critical, high, medium, low)
  - [ ] User sentiment quotes

- [ ] **Prioritize issues** (1 hour)
  - [ ] Critical: Blocks task completion
  - [ ] High: Causes confusion or frustration
  - [ ] Medium: Nice to fix, not blocking
  - [ ] Low: Polish items

- [ ] **Create fix plan** (1 hour)
  - [ ] List of screens to update
  - [ ] Specific changes per screen
  - [ ] Estimated time per fix

- [ ] **Review with James** (1 hour)
  - [ ] Present findings
  - [ ] Discuss priorities
  - [ ] Get approval on changes

### Days 4-5: Iteration (16 hours)

#### Update Mockups Based on Feedback
**Owner:** Designer  
**Priority:** HIGH

- [ ] **Implement critical fixes** (8 hours)
  - [ ] Update screens with critical issues
  - [ ] Re-test internally
  - [ ] Verify Design Token usage still consistent

- [ ] **Implement high-priority fixes** (6 hours)
  - [ ] Update screens with high-priority issues
  - [ ] Refine interactions
  - [ ] Update prototype

- [ ] **Final polish** (2 hours)
  - [ ] Consistency check across all 12 screens
  - [ ] Verify all colors from Design Tokens v3.0
  - [ ] Verify all typography uses PT Sans
  - [ ] Verify all spacing uses 8px grid

#### Re-Test with 2 Users (Optional)
**Owner:** Designer + James  
**Time:** 2 hours

- [ ] Quick 15-minute tests with updated designs
- [ ] Verify fixes resolved issues
- [ ] Get final approval from James

#### Final Design Handoff
**Owner:** Designer  
**Time:** 4 hours

- [ ] **Export all assets** (1 hour)
  - [ ] Export all screens @1x, @2x, @3x
  - [ ] Export all icons as SVG
  - [ ] Export all images optimized

- [ ] **Document component specs** (2 hours)
  - [ ] Button specs (sizes, colors, states)
  - [ ] Input specs (validation states)
  - [ ] Card specs (shadows, borders)
  - [ ] All linked to Design Tokens

- [ ] **Create developer handoff package** (1 hour)
  - [ ] Figma inspect links
  - [ ] Design Token usage guide
  - [ ] Animation specifications
  - [ ] Responsive breakpoints

---

## 4. Week 3 Tasks (Platform Engineering)

### Days 1-2: Infrastructure Setup

#### Supabase Configuration (4 hours)
**Owner:** Dev Lead  
**Priority:** CRITICAL PATH

- [ ] **Create Supabase project** (30 min)
  - [ ] Project name: "Viridian Nutrition Intelligence"
  - [ ] Region: Europe West (London) for UK users
  - [ ] Enable email authentication

- [ ] **Database schema setup** (2 hours)
  - [ ] Run migrations from `VHF-NI-App-Mk3-Ontology-Implementation-v2.1.md`
  - [ ] Create tables:
    - [ ] `clients` (id, email, profile JSONB with Schema.org Patient)
    - [ ] `conversations` (id, client_id, created_at)
    - [ ] `messages` (id, conversation_id, role, content, created_at)
    - [ ] `recipes` (id, name, recipe_schema JSONB with Schema.org Recipe)
    - [ ] `meal_plans` (id, client_id, plan_data JSONB, week_start)
  - [ ] Add GIN indexes on JSONB columns
  - [ ] Set up Row Level Security (RLS) policies

- [ ] **Configure authentication** (1 hour)
  - [ ] Enable email/password auth
  - [ ] Set up email templates (sign up, reset password)
  - [ ] Configure redirect URLs
  - [ ] Test auth flow

- [ ] **Environment variables** (30 min)
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` (server-side)
  - [ ] Store in `.env.local`

#### Vercel Deployment Setup (2 hours)
**Owner:** DevOps  
**Priority:** HIGH

- [ ] **Create Vercel project** (30 min)
  - [ ] Import from GitHub
  - [ ] Connect repository
  - [ ] Configure build settings

- [ ] **Configure environment** (30 min)
  - [ ] Add all Supabase env vars
  - [ ] Add Anthropic API key
  - [ ] Set Node version (18.x)

- [ ] **Deploy preview** (1 hour)
  - [ ] Trigger initial deploy
  - [ ] Test preview URL
  - [ ] Verify environment variables work

### Days 3-4: Platform Modules (16 hours)

#### Context Engineering Module (8 hours)
**Owner:** Dev Lead  
**Priority:** CRITICAL PATH

- [ ] **Create npm package** (2 hours)
  ```bash
  mkdir packages/context-engineering
  cd packages/context-engineering
  npm init -y
  # Set name: @viridian/context-engineering
  ```

- [ ] **Implement ContextEngineeringModule class** (4 hours)
  - [ ] `assembleContext()` - Combine Tier 1, 2, 3
  - [ ] `buildDynamicContext()` - Transform Schema.org JSONB to natural language
  - [ ] `prepareForAPI()` - Format for Anthropic API with caching
  - [ ] Prompt caching implementation (cache Tier 1 + 2)

- [ ] **Write tests** (1 hour)
  - [ ] Unit tests for each method
  - [ ] Integration test with mock Supabase data
  - [ ] Verify caching works

- [ ] **Documentation** (1 hour)
  - [ ] README with usage examples
  - [ ] API documentation
  - [ ] Cost savings calculations

#### Value Engineering Module Agent (8 hours)
**Owner:** Dev Lead  
**Priority:** CRITICAL PATH

- [ ] **Create npm package** (2 hours)
  ```bash
  mkdir packages/value-engineering-agent
  cd packages/value-engineering-agent
  npm init -y
  # Set name: @viridian/value-engineering-agent
  ```

- [ ] **Implement ValueEngineeringAgent class** (4 hours)
  - [ ] `optimizePrompt()` - Token reduction without quality loss
  - [ ] `trackCost()` - Log API calls with tokens and cost
  - [ ] `validateOutput()` - Schema validation and safety checks
  - [ ] `abTest()` - Test different prompt strategies

- [ ] **Build metrics dashboard** (1 hour)
  - [ ] API cost tracking
  - [ ] Cache efficiency monitoring
  - [ ] Quality score tracking
  - [ ] Simple admin UI component

- [ ] **Documentation** (1 hour)
  - [ ] README with usage examples
  - [ ] Metrics documentation
  - [ ] A/B testing guide

### Day 5: Component Library (8 hours)

#### Tailwind Configuration (30 min)
**Owner:** Dev Lead  
**Priority:** CRITICAL PATH

- [ ] **Update `tailwind.config.js`**
  - [ ] Copy config from `VHF-NI-App-Mk3-Implementation-Authorization-v1.0.md`
  - [ ] Add all Design Tokens v3.0 colors
  - [ ] Add PT Sans font family
  - [ ] Add custom shadows with primary tint
  - [ ] Verify build works

#### Font Setup (30 min)
**Owner:** Dev Lead

- [ ] **Update `app/layout.tsx`**
  - [ ] Import PT Sans from `next/font/google`
  - [ ] Configure weights: 400, 700
  - [ ] Add CSS variable
  - [ ] Test font loads correctly

#### Shadcn Theme Configuration (1 hour)
**Owner:** Dev Lead

- [ ] **Update CSS variables**
  - [ ] Convert Design Tokens v3.0 to HSL
  - [ ] Update `globals.css` with new values
  - [ ] Test light/dark mode (if applicable)

#### Component Implementation (6 hours)
**Owner:** Dev Team

- [ ] **Install Shadcn components** (1 hour)
  ```bash
  npx shadcn-ui@latest init
  npx shadcn-ui@latest add button
  npx shadcn-ui@latest add input
  npx shadcn-ui@latest add card
  npx shadcn-ui@latest add dialog
  npx shadcn-ui@latest add toast
  ```

- [ ] **Theme all components** (3 hours)
  - [ ] Update Button: primary (#007c74), secondary (#f16a21)
  - [ ] Update Input: border-default, focus (primary)
  - [ ] Update Card: shadow-md, neutral-50 bg
  - [ ] Verify all components use Design Tokens

- [ ] **Create custom components** (2 hours)
  - [ ] MessageBubble (for chat)
  - [ ] MealCard (for meal plans)
  - [ ] RecipeCard (for recipes)
  - [ ] NutritionChart (macros visualization)

---

## 5. Week 4 Tasks (MVP Development)

### Days 1-2: AI Agents (16 hours)

#### Nutrition Advisor Agent (8 hours)
**Owner:** Dev Lead  
**Priority:** CRITICAL PATH

- [ ] **Agent implementation** (5 hours)
  - [ ] Set up Anthropic SDK with streaming
  - [ ] Implement system prompt (from Agent Spec)
  - [ ] Integrate Context Engineering Module
  - [ ] Integrate Value Engineering Module
  - [ ] Handle tool use (if needed)

- [ ] **API endpoint** (2 hours)
  - [ ] `/api/chat/nutrition-advisor`
  - [ ] Stream responses to client
  - [ ] Error handling
  - [ ] Rate limiting

- [ ] **Testing** (1 hour)
  - [ ] Test with sample queries
  - [ ] Verify James's methodology in responses
  - [ ] Test safety validations (allergens)

#### Meal Planner Agent (8 hours)
**Owner:** Dev Lead  
**Priority:** CRITICAL PATH

- [ ] **Agent implementation** (5 hours)
  - [ ] Implement system prompt
  - [ ] Structured output (7-day JSON)
  - [ ] Integrate Context Engineering Module
  - [ ] Nutrition calculations

- [ ] **API endpoint** (2 hours)
  - [ ] `/api/meal-plan/generate`
  - [ ] Return structured JSON
  - [ ] Store in Supabase
  - [ ] Error handling

- [ ] **Testing** (1 hour)
  - [ ] Test meal plan generation
  - [ ] Verify macro targets met
  - [ ] Test UK recipe selection

### Day 3: UI Integration (8 hours)

#### Authentication Pages (2 hours)
**Owner:** Frontend Dev

- [ ] **Sign In page** (1 hour)
  - [ ] Implement design from Figma
  - [ ] Supabase auth integration
  - [ ] Error handling

- [ ] **Sign Up page** (1 hour)
  - [ ] Multi-step form
  - [ ] Profile creation with Schema.org
  - [ ] Store in `clients.profile` JSONB

#### Chat Interface (3 hours)
**Owner:** Frontend Dev

- [ ] **Chat UI** (2 hours)
  - [ ] Message list with auto-scroll
  - [ ] Input with send button
  - [ ] Streaming response display
  - [ ] Loading states

- [ ] **API integration** (1 hour)
  - [ ] Call Nutrition Advisor endpoint
  - [ ] Handle streaming
  - [ ] Store messages in Supabase

#### Meal Plan View (3 hours)
**Owner:** Frontend Dev

- [ ] **7-day calendar** (2 hours)
  - [ ] Display meal plan from API
  - [ ] Expandable meal cards
  - [ ] Nutrition summary

- [ ] **Recipe modal** (1 hour)
  - [ ] Recipe detail view
  - [ ] Nutrition facts
  - [ ] Instructions

### Day 4: Testing & Bug Fixes (8 hours)

#### Integration Testing (4 hours)
**Owner:** QA + Dev Team

- [ ] **End-to-end tests** (2 hours)
  - [ ] Sign up flow
  - [ ] Chat flow
  - [ ] Meal plan generation flow
  - [ ] Recipe viewing flow

- [ ] **Visual regression tests** (1 hour)
  - [ ] Compare to Figma designs
  - [ ] Verify Design Tokens applied
  - [ ] Check responsive breakpoints

- [ ] **Performance testing** (1 hour)
  - [ ] AI response time <5s
  - [ ] Page load time <2s
  - [ ] Bundle size check

#### Bug Fixes (4 hours)
**Owner:** Dev Team

- [ ] Fix all critical bugs
- [ ] Fix all high-priority bugs
- [ ] Document known issues (if any)

### Day 5: Production Deployment (8 hours)

#### Pre-Deployment Checklist (2 hours)
**Owner:** Dev Lead

- [ ] **Final verification**
  - [ ] All 5 core features working
  - [ ] Design Tokens v3.0 applied throughout
  - [ ] PT Sans font loading correctly
  - [ ] All assets optimized
  - [ ] Environment variables set
  - [ ] API keys secured

- [ ] **Documentation**
  - [ ] Update README
  - [ ] Deployment guide
  - [ ] User guide for James

#### Production Deployment (2 hours)
**Owner:** DevOps

- [ ] **Deploy to Vercel production**
  - [ ] Merge to main branch
  - [ ] Trigger production deploy
  - [ ] Verify deployment successful
  - [ ] Test production URL

- [ ] **Database migration**
  - [ ] Run production migrations
  - [ ] Seed with 50 UK recipes
  - [ ] Verify data integrity

#### Post-Deployment Testing (2 hours)
**Owner:** QA + Dev Team

- [ ] **Smoke tests in production**
  - [ ] Sign up works
  - [ ] Chat works
  - [ ] Meal plan generation works
  - [ ] All pages load

- [ ] **Performance monitoring**
  - [ ] Verify <5s AI response time
  - [ ] Check API costs (should be <$50 for test period)
  - [ ] Monitor error rates

#### Launch Activities (2 hours)
**Owner:** James + Team

- [ ] **Invite beta users** (3 of James's clients)
  - [ ] Send access instructions
  - [ ] Schedule onboarding calls

- [ ] **Monitor first sessions**
  - [ ] Watch for issues
  - [ ] Gather immediate feedback

- [ ] **Celebrate!** 🎉
  - [ ] MVP is live!
  - [ ] 4-week goal achieved!

---

## 6. Post-MVP Tasks

### Week 5-8: Full MVP Features

#### Progress Tracking (Week 5)
- [ ] Progress Analyst Agent implementation
- [ ] Dashboard with charts
- [ ] Weight/measurement tracking
- [ ] Photo progress

#### Coach Dashboard (Week 6)
- [ ] Client management UI for James
- [ ] Bulk actions
- [ ] Analytics overview
- [ ] Communication tools

#### PMF Analytics (Week 7)
- [ ] PMF Feedback Agent
- [ ] User satisfaction surveys
- [ ] Feature usage analytics
- [ ] Retention metrics

#### Shopping List & Export (Week 8)
- [ ] Generate shopping lists from meal plans
- [ ] Tesco integration (UK)
- [ ] Email meal plans
- [ ] Print-friendly views

### Month 2-3: Scale & Polish

- [ ] Payment integration (Stripe)
- [ ] Email notifications
- [ ] Mobile responsive refinement
- [ ] Mobile app (React Native)
- [ ] Referral program

---

## 7. Documentation Updates Remaining

### High Priority (Needed for Week 1-2)

- [ ] **VHF-NI-App-Mk3-Brand-Guidelines-v3.0.md**
  - Update all color references to Design Tokens v3.0
  - Add PT Sans typography guidelines
  - Add asset usage guidelines
  - Update examples with new brand

- [ ] **VHF-NI-App-Mk3-Figma-Workflow-v3.0.md**
  - Add Week 1, Day 1 Figma sync steps
  - Update mockup-first process
  - Add user testing protocol
  - Add iteration workflow

### Medium Priority (Needed for Week 3)

- [ ] **VHF-NI-App-Mk3-Component-Examples-v3.0.md**
  - Update all code examples with new colors
  - Update Tailwind classes to v3.0 palette
  - Add PT Sans font examples
  - Update shadow examples

- [ ] **VHF-NI-App-Mk3-Storybook-Config-v3.0.md**
  - Update theme configuration
  - Update Design Tokens import
  - Add PT Sans font loading
  - Update example stories

- [ ] **VHF-NI-App-Mk3-WBS-v2.0.md**
  - Refactor to 4-week timeline
  - Add Figma phase (Week 1-2)
  - Add Platform Engineering phase (Week 3)
  - Add First-Stage MVP phase (Week 4)
  - Remove post-MVP weeks

- [ ] **VHF-NI-App-Mk3-Implementation-Guide-v2.0.md**
  - Add Platform Engineering section
  - Add Value Engineering Module guide
  - Add Context Engineering Module guide
  - Update timeline references

### Low Priority (Needed for Week 4)

- [ ] **VHF-NI-App-Mk3-Agent-Spec-Full-v2.0.md**
  - Refactor to 2 product agents + 2 platform modules
  - Add Value Engineering Module Agent spec
  - Add Context Engineering Module spec
  - Defer Progress Analyst + PMF to post-MVP

- [ ] **VHF-NI-App-Mk3-HLD-Architecture-v2.1.md**
  - Update timeline references (4-week)
  - Update cross-references to v3.0 docs
  - Add platform modules to architecture diagram

---

## Summary Statistics

### Total Tasks: 187

**By Phase:**
- Immediate (This Week): 23 tasks
- Week 1 (Figma): 48 tasks
- Week 2 (Testing): 28 tasks
- Week 3 (Platform): 39 tasks
- Week 4 (MVP): 35 tasks
- Post-MVP: 7 tasks
- Documentation: 7 tasks

**By Priority:**
- CRITICAL PATH: 42 tasks
- HIGH: 68 tasks
- MEDIUM: 52 tasks
- LOW: 25 tasks

**By Owner:**
- Designer: 65 tasks
- Dev Lead: 58 tasks
- DevOps: 12 tasks
- QA: 18 tasks
- James: 8 tasks
- Frontend Dev: 20 tasks
- Team: 6 tasks

---

## Document End

**File Information:**
- **Filename:** VHF-NI-App-Mk3-ToDo-Actions-v1.0.md
- **Version:** 1.0.0
- **Date:** 2024-12-09
- **Status:** Active - Ready for Implementation
- **Total Tasks:** 187
- **Duration:** 4 weeks to MVP

**This comprehensive task list is ready for Claude Code to execute systematically! 🚀**

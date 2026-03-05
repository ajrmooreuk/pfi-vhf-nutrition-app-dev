# Product Requirements Document: Viridian Nutrition Intelligence Platform

**Version:** 1.2 MVP  
**Product Owner:** James Kerby, Expert Clinical Nutrition Coach & PT  
**Target Market:** UK-based smart, motivated fitness clients (Winchester/Hampshire primary)  
**Platform Stack:** Next.js, Shadcn UI, Supabase, Claude Agents (ASDK), GraphQL, Schema.org ontologies  
**Deadline Constraint:** Maximum value, minimum effort MVP approach

---

## Executive Summary

Viridian Nutrition Intelligence Platform is an AI-augmented nutrition and meal planning application that leverages Anthropic's context engineering principles to deliver expert-level, personalized nutrition guidance at scale. The platform enables James Kerby to extend his Clinical Nutrition Coach expertise through intelligent agents while maintaining the personal, no-fluff approach his clients expect.

**Core Value Proposition:** Transform James's expert clinical nutrition knowledge into persistent, queryable context that Claude agents use to deliver personalized, actionable nutrition plans with the precision and warmth of James's 1-to-1 coaching sessions.

---

## 1. Context Engineering Architecture

### 1.1 Expert Knowledge Ontology (Schema.org Foundation)

**Primary Schemas:**
- `Person` (Coach profile, Client profiles)
- `NutritionInformation` 
- `Recipe`
- `MealPlan` (Custom extension)
- `HealthCondition`
- `ExerciseProgram`
- `Goal` (Custom extension)

**JSON Structure Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "NutritionPlan",
  "identifier": "np_uuid",
  "creator": {
    "@type": "Person",
    "name": "James Kerby",
    "jobTitle": "Expert Clinical Nutrition Coach",
    "hasCredential": ["Clinical Weight Loss Practitioner", "Personal Trainer"]
  },
  "client": {
    "@type": "Patient",
    "identifier": "client_uuid",
    "healthCondition": [],
    "goals": [],
    "preferences": {},
    "restrictions": []
  },
  "mealPlan": {
    "@type": "MealPlan",
    "startDate": "ISO-8601",
    "duration": "P7D",
    "meals": []
  },
  "nutritionGuidance": {
    "macroTargets": {},
    "calorieTarget": 0,
    "rationale": "string"
  }
}
```

### 1.2 Context Management Strategy

**Three-Tier Context Architecture:**

1. **Static Expert Context (System Prompts)**
   - James's clinical nutrition philosophy
   - Evidence-based nutrition principles
   - UK dietary guidelines and standards
   - Contraindications and safety protocols
   - James's coaching methodology ("no gimmicks, no potions, no drinks, no pills")

2. **Dynamic Client Context (Retrieved)**
   - Client health profile
   - Progress tracking data
   - Food preferences and restrictions
   - Historical meal plans
   - Conversation history with James/agents

3. **Session Context (Real-time)**
   - Current query
   - Recent interactions
   - Active goals
   - Today's context (date, season, UK food availability)

### 1.3 Agent Personas

**Primary Agent: "Viridian Nutrition Advisor"**
- Role: Expert clinical nutrition guidance in James's style
- Tone: Friendly, direct, evidence-based, no-fluff
- Constraints: Never recommend supplements, pills, or gimmicks; always evidence-based; UK-centric food availability
- Capabilities: Meal planning, macro calculation, recipe suggestions, substitutions, progress analysis

**Secondary Agent: "Progress Coach"**
- Role: Motivational support and accountability
- Tone: Encouraging but realistic (mirrors James's patient, caring approach)
- Capabilities: Check-ins, goal tracking, obstacle identification, adjustment recommendations

---

## 2. User Roles & Capabilities

### 2.1 Coach Role (James Kerby)

**Core Capabilities:**
- Client dashboard with aggregate health metrics
- Bulk nutrition plan creation and templates
- Knowledge base management (add clinical insights, update protocols)
- Client progress monitoring
- Override/adjustment of agent recommendations
- Export client data for face-to-face sessions
- Analytics: client adherence, common obstacles, success patterns

**Agent Augmentation:**
- Claude Code for rapid template creation
- Automated weekly plan generation based on client progress
- Anomaly detection (clients struggling or plateauing)
- Evidence synthesis from latest nutrition research

### 2.2 Client Role (Application User)

**Core Capabilities:**
- Personalized meal plan generation
- Real-time nutrition coaching chat
- Recipe database with UK ingredient availability
- Food logging and macro tracking
- Progress visualization
- Goal setting and adjustment
- Shopping list generation
- Meal prep guidance
- Substitution requests

**Agent Interaction Model:**
- Conversational interface (primary)
- Structured forms (onboarding, goals)
- Quick actions (log meal, request substitution)
- Proactive check-ins (scheduled by James or triggered by progress metrics)

---

## 3. Core Features (MVP 1.2)

### 3.1 Intelligent Onboarding

**Client Data Collection (Schema.org `Patient` + Custom Extensions):**
- Demographics (age, gender, location)
- Health conditions and medications
- Current weight, body composition (if available)
- Activity level and exercise routine
- Goals (weight loss, muscle gain, performance, health optimization)
- Food preferences, allergies, intolerances
- Dietary restrictions (religious, ethical, practical)
- Lifestyle constraints (cooking time, budget, family needs)
- Previous diet history

**Context Engineering Application:**
- Progressive disclosure (don't overwhelm)
- Natural language option alongside structured forms
- Claude agent extracts structured data from conversational input
- Validates completeness and flags missing critical information
- Generates initial client context document for all future interactions

### 3.2 Personalized Meal Planning Engine

**Input Parameters:**
- Client profile (from onboarding)
- James's nutrition protocols (from knowledge base)
- UK seasonal food availability
- Budget constraints
- Cooking skill level
- Meal prep preferences (batch cooking, daily prep, minimal prep)

**Agent Workflow:**
1. Retrieve client context + James's protocols
2. Calculate macro targets using clinical formulas
3. Generate meal framework (meals per day, timing, distribution)
4. Select recipes from database matching all constraints
5. Optimize for variety, nutrition density, compliance likelihood
6. Generate shopping list grouped by UK supermarket layout
7. Provide meal prep instructions
8. Include rationale for all recommendations (educational component)

**Output Artifacts:**
- 7-day meal plan (PDF + interactive)
- Shopping list (categorized, with quantities)
- Meal prep timeline
- Nutrition breakdown (per meal and daily totals)
- James's notes section (for coach to add custom guidance)

### 3.3 Conversational Nutrition Advisor

**Interaction Patterns:**
- "What can I eat instead of X?"
- "I'm traveling to Y, what should I order?"
- "I'm hungry but already hit my calories, what now?"
- "Is this food choice good for my goals?"
- "I'm plateauing, what should change?"

**Agent Capabilities:**
- Access full client context
- Reference James's clinical protocols
- Provide evidence-based rationale
- Suggest practical UK-available alternatives
- Know when to escalate to James (medical concerns, significant deviations)

**Safety Rails:**
- Never diagnose medical conditions
- Always recommend medical consultation for new symptoms
- Flag concerning patterns (extreme restriction, disordered eating behaviors)
- No supplement recommendations without James's explicit approval
- Clear attribution: "Based on James's protocols..." vs "General nutrition guidance..."

### 3.4 Progress Tracking & Analytics

**Client Metrics:**
- Weight (optional, can focus on non-scale victories)
- Body composition (if tracked)
- Energy levels (subjective scale)
- Adherence rate (meals followed vs planned)
- Exercise consistency
- Hunger/satiety ratings
- Sleep quality
- Goal-specific metrics (strength gains, endurance, etc.)

**Visualization:**
- Trend graphs (weight, adherence, energy)
- Heatmap of adherence patterns (identify problem days/meals)
- Correlation analysis (sleep vs adherence, exercise vs energy)
- Progress photos timeline (optional, client-controlled)

**Agent Analysis:**
- Weekly progress summaries
- Identify adherence obstacles
- Suggest plan adjustments
- Predict plateau risk
- Celebrate milestones

### 3.5 Knowledge Base (James's Protocols)

**Content Types:**
- Clinical nutrition principles
- Macro calculation methodologies
- Meal timing strategies
- Special population protocols (menopause, PCOS, diabetes, etc.)
- Exercise-nutrition integration
- Common client scenarios and solutions
- Evidence base (links to research)

**Structure:**
- Markdown documents with schema.org metadata
- Versioned (track protocol updates)
- Searchable by agent (RAG approach via Supabase vector embeddings)
- Taggable (condition, goal, evidence level)

**Agent Integration:**
- All recommendations must cite relevant protocol
- If no protocol exists, flag for James to create
- Learn from James's overrides (identify knowledge gaps)

### 3.6 Recipe Database (UK-Centric)

**Recipe Schema (Schema.org `Recipe` Extended):**
```json
{
  "@type": "Recipe",
  "name": "string",
  "recipeCategory": ["breakfast", "lunch", "dinner", "snack"],
  "recipeCuisine": "string",
  "nutrition": {
    "calories": 0,
    "proteinContent": 0,
    "carbohydrateContent": 0,
    "fatContent": 0,
    "fiberContent": 0
  },
  "suitableForDiet": ["LowCarb", "HighProtein", "Vegetarian", etc.],
  "recipeIngredient": [],
  "recipeInstructions": [],
  "prepTime": "PT15M",
  "cookTime": "PT30M",
  "recipeYield": "4 servings",
  "ukAvailability": {
    "seasonal": true,
    "commonSupermarkets": ["Tesco", "Sainsbury's", "Waitrose"],
    "budgetFriendly": true
  },
  "skillLevel": "beginner|intermediate|advanced",
  "mealPrepFriendly": true,
  "freezable": true
}
```

**Features:**
- Filter by macros, cuisine, prep time, skill level
- Substitution suggestions (ingredient allergies/preferences)
- Scale servings automatically
- UK ingredient sourcing notes
- User ratings and modifications (client community feature - Phase 2)

---

## 4. Technical Architecture

### 4.1 Stack Components

**Frontend:**
- Next.js 14 (App Router)
- Shadcn UI components
- Tailwind CSS
- React Query for state management
- Figma design system

**Backend:**
- Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- GraphQL API via Supabase (Hasura or PostGraphile)
- Row Level Security for multi-tenant isolation

**AI Layer:**
- Claude 4 Sonnet (primary agent model via ASDK)
- Claude Code for development velocity
- Anthropic API for agent orchestration
- Vector embeddings (Supabase pgvector) for knowledge base RAG

**Data Layer:**
- PostgreSQL schemas aligned with Schema.org ontologies
- JSONB columns for flexible client context
- Time-series tables for progress tracking
- Vector store for recipe and knowledge base search

### 4.2 Agent Architecture

**Agent Types:**
1. **Nutrition Advisor Agent** (primary client interaction)
2. **Meal Planner Agent** (structured output generation)
3. **Progress Analyst Agent** (data analysis and insights)
4. **Knowledge Retriever Agent** (RAG over James's protocols)

**Agent Orchestration Pattern:**
- User query → Router Agent determines which specialist agent(s) to invoke
- Context assembly: Retrieve relevant client data + protocols
- Agent execution with streaming response
- Response validation (safety, accuracy, tone)
- Store interaction in conversation history
- Update client context if new information learned

**Context Management:**
- Client context stored in JSONB column, retrieved per session
- Sliding window for conversation history (last 10 interactions + summary)
- Protocol documents embedded and searched via semantic similarity
- Caching strategy for frequently accessed contexts

### 4.3 Data Models (Supabase Tables)

**Core Tables:**
- `coaches` (James and any future coaches)
- `clients` (linked to auth.users)
- `client_profiles` (health data, goals, preferences - JSONB heavy)
- `meal_plans` (generated plans with versioning)
- `recipes` (UK-centric recipe database)
- `nutrition_protocols` (James's knowledge base)
- `progress_logs` (time-series client metrics)
- `conversations` (agent interaction history)
- `coaching_sessions` (face-to-face session notes, links digital to physical)

**Relationships:**
- `clients` 1:N `meal_plans`
- `meal_plans` M:N `recipes` (through meal_plan_recipes join table)
- `clients` 1:N `progress_logs`
- `clients` 1:N `conversations`
- `coaches` 1:N `clients`
- `nutrition_protocols` M:N `recipes` (protocols recommend recipes)

**GraphQL Schema Design:**
- Expose all tables as GraphQL types
- Subscriptions for real-time progress updates (coach dashboard)
- Mutations for meal plan generation, goal updates
- Queries optimized for agent retrieval patterns

### 4.4 Integration Points

**Phase 1 (MVP):**
- Supabase Auth (email/password, magic link)
- Stripe (future monetization, not MVP)
- Anthropic API (Claude agents)

**Phase 2 (Post-MVP):**
- Wearable integrations (Fitbit, Apple Health, Garmin)
- UK grocery APIs (Tesco, Sainsbury's for real-time ingredient availability/pricing)
- Calendar integration (meal plan sync)
- SMS/WhatsApp reminders (Twilio)

---

## 5. Context Engineering Implementation

### 5.1 System Prompt Template (Nutrition Advisor Agent)

```xml
<role>
You are the Viridian Nutrition Advisor, an AI assistant representing James Kerby, Expert Clinical Nutrition Coach at Viridian Health & Fitness in Winchester, Hampshire, UK. You provide personalized nutrition guidance based on James's evidence-based, no-nonsense approach.
</role>

<coaching_philosophy>
- No gimmicks, potions, drinks, or pills
- Evidence-based nutrition science
- Sustainable, long-term behavior change
- Patient, caring, and encouraging
- Realistic goal-setting
- Education-first approach (teach clients why, not just what)
- Integration with exercise and lifestyle
- UK dietary context and food availability
</coaching_philosophy>

<clinical_protocols>
{{RETRIEVED_PROTOCOLS}}
</clinical_protocols>

<client_context>
{{CLIENT_PROFILE}}
{{RECENT_PROGRESS}}
{{ACTIVE_GOALS}}
{{CONVERSATION_HISTORY}}
</client_context>

<constraints>
- Never recommend supplements, medications, or diagnose conditions
- Escalate medical concerns to James immediately
- All food recommendations must be UK-available
- Respect client's budget, time, and skill constraints
- Cite evidence or James's protocols for recommendations
- If uncertain, say so and offer to connect with James
- Maintain friendly but professional tone
- Keep responses actionable and concise (no fluff)
</constraints>

<output_format>
- Direct answers to questions
- Rationale for recommendations (educational)
- Practical next steps
- Links to relevant recipes or protocols
- Flag any concerns for James's review
</output_format>

<current_context>
- Date: {{TODAY_DATE}}
- Season: {{UK_SEASON}}
- Client's timezone: Europe/London
</current_context>

Today's client query: {{USER_MESSAGE}}
```

### 5.2 Dynamic Context Retrieval

**Pre-Query Context Assembly:**
1. Fetch client profile from `client_profiles` table
2. Retrieve last 10 conversation turns from `conversations`
3. Get active meal plan from `meal_plans` where status='active'
4. Pull recent progress data (last 7 days) from `progress_logs`
5. Semantic search James's protocols for relevant guidance
6. Inject UK seasonal context (October 2025: autumn root vegetables, game season)

**Token Budget Management:**
- Client profile: ~2000 tokens (prioritized fields)
- Conversation history: ~3000 tokens (summarize older exchanges)
- Protocols: ~5000 tokens (top 3 most relevant)
- System prompt: ~1500 tokens
- Remaining for user query and response: ~180k+ tokens (Claude 4 Sonnet)

### 5.3 Agent Tool Use

**Tools Available to Agents:**
- `search_recipes`: Query recipe database by macros, ingredients, cuisine
- `calculate_macros`: Given client profile and goal, calculate targets
- `get_protocol`: Retrieve specific James protocol by condition/goal
- `log_escalation`: Flag issue for James's review
- `generate_meal_plan`: Create structured 7-day plan (calls Meal Planner Agent)
- `get_progress_data`: Fetch client metrics for analysis
- `search_knowledge`: Semantic search over James's knowledge base

**Tool Use Pattern:**
```python
# Example: Client asks "What can I eat for breakfast with high protein?"
1. Agent determines need for recipe search
2. Calls search_recipes(protein_min=20g, meal_type='breakfast', client_id=X)
3. Receives 5 matching recipes with UK availability
4. Filters based on client preferences (from context)
5. Presents top 3 with rationale
6. Offers to add to meal plan
```

### 5.4 Response Validation & Safety

**Pre-Send Checks:**
- Medical advice detection (flag and remove)
- Supplement recommendations (block unless James-approved list)
- Extreme calorie targets (<1200 or >4000 without James override)
- Contradicts known client health conditions
- Tone check (maintain friendly, professional, no-fluff style)

**Logging:**
- All agent interactions logged to `conversations` table
- Flagged responses stored with reason for James review
- Client feedback on responses (thumbs up/down for quality tuning)

---

## 6. User Journeys

### 6.1 Client Onboarding Journey

**Steps:**
1. Sign up (email/password or magic link)
2. Welcome message from "James" (agent with coach context)
3. Conversational onboarding:
   - "Tell me about your goals"
   - "What's your current situation?"
   - "Any health conditions I should know about?"
   - "Food preferences or restrictions?"
4. Agent extracts structured data, confirms with client
5. James reviews profile, adds any clinical notes
6. First meal plan generated
7. Tutorial walkthrough (interactive tooltips)
8. First week check-in scheduled

**Success Criteria:**
- Complete profile in <10 minutes
- Client feels heard (conversational vs interrogative)
- James can review and approve before plan activation

### 6.2 Weekly Meal Planning Journey

**Trigger:** Sunday evening (configurable)

**Flow:**
1. Client receives notification: "Ready for next week's plan?"
2. Agent asks: "How did this week go? Any changes needed?"
3. Client provides feedback (or skips)
4. Agent reviews progress data
5. Generates plan based on:
   - Current goals and progress
   - Feedback from previous weeks
   - Upcoming events (pulled from calendar if integrated)
   - Seasonal UK foods
6. Presents plan with rationale
7. Client can request modifications
8. Approved plan sent to app + email (PDF)
9. Shopping list generated

**Success Criteria:**
- Plan reflects actual progress and preferences
- Minimal back-and-forth (one iteration max)
- Client feels in control (can override agent suggestions)

### 6.3 Daily Nutrition Support Journey

**Scenarios:**

**Morning Motivation:**
- Proactive message: "Good morning! Today's breakfast: [Recipe]. Prep time 10 min."
- Links to recipe and meal prep tips

**Lunchtime Pivot:**
- Client: "Can't make the planned lunch, what else?"
- Agent: Retrieves macros for planned meal, suggests 3 alternatives (home, restaurant, meal deal)
- Updates day's plan accordingly

**Evening Craving:**
- Client: "Really want chocolate, how do I fit it in?"
- Agent: Reviews day's intake, calculates remaining macros
- Suggests portion size or alternative (protein chocolate mousse recipe)
- Educates on satisfaction vs deprivation balance

**Weekend Challenge:**
- Client: "At a party, what can I eat?"
- Agent: Provides strategy (protein-first approach, alcohol swaps)
- No guilt, focus on next meal

**Success Criteria:**
- Response time <3 seconds
- Answers feel personalized (reference client's taste, progress)
- Solutions are practical and UK-context appropriate
- Educational without being preachy

### 6.4 Coach Dashboard Journey (James)

**Landing Page:**
- Active clients count with adherence rates
- Flagged clients (struggling, plateauing, concerning patterns)
- Recent client messages requiring review
- Aggregate metrics (average weight loss, adherence across cohort)

**Client Deep-Dive:**
- Timeline view of progress (weight, metrics, adherence)
- Recent conversations with agent
- Current meal plan and upcoming plans
- Notes section (James's clinical observations)
- Quick actions: override plan, send message, schedule session

**Knowledge Base Management:**
- List of protocols with usage stats (how often agents retrieve)
- Add/edit protocols with markdown editor
- Version history
- Test protocol against sample client profiles

**Analytics Dashboard:**
- Client retention metrics
- Most successful plan types
- Common obstacles identified by agents
- Recipe popularity
- Seasonal trends

**Success Criteria:**
- James can assess client health in <2 minutes per client
- Identify at-risk clients proactively
- Override agent recommendations seamlessly
- Track business metrics (retention, satisfaction)

---

## 7. MVP Feature Prioritization

### Must-Have (MVP 1.2)

1. **Client onboarding** (conversational + structured)
2. **Meal plan generation** (7-day, macros-based, UK recipes)
3. **Recipe database** (minimum 100 recipes covering common preferences)
4. **Nutrition advisor chat** (real-time agent interaction)
5. **Progress tracking** (weight, adherence, basic metrics)
6. **Coach dashboard** (client list, basic metrics, message review)
7. **James's knowledge base** (10 core protocols embedded)
8. **Authentication & authorization** (Supabase Auth, RLS)

### Should-Have (Post-MVP)

9. Shopping list integration with UK supermarkets
10. Meal prep timeline generator
11. Progress photo uploads
12. Calendar integration for meal plan sync
13. SMS/email reminders
14. Recipe rating and modifications
15. Advanced analytics (correlation analysis)
16. Bulk meal plan templates

### Could-Have (Phase 2+)

17. Wearable data integration
18. Client community features
19. Video meal prep tutorials
20. Real-time grocery price comparison
21. Restaurant menu analyzer
22. Macro-tracking photo AI (snap meal, log macros)
23. Habit tracking beyond nutrition
24. Family meal planning (cook once, scale portions)

---

## 8. Success Metrics

### Client Success Metrics

**Engagement:**
- Daily active users (target: 60% of active clients)
- Messages per week with agent (target: 5-10)
- Meal plan adherence rate (target: 70%+)
- Progress log consistency (target: 4+ entries/week)

**Outcomes:**
- Goal achievement rate (target: 75% of clients on track)
- Weight loss velocity (compared to James's benchmarks)
- Client retention (target: 85% month-over-month)
- NPS score (target: 50+)

### Business Metrics

**Efficiency:**
- James's time per client (target: <30 min/week vs 60 min without app)
- Agent escalation rate (target: <10% of interactions)
- Client capacity scaling (target: 2x clients with same time investment)

**Quality:**
- Agent response accuracy (validated against James's reviews)
- Client satisfaction with agent guidance (target: 4.5/5 stars)
- Protocol adherence (agent recommendations match James's approach)

### Technical Metrics

**Performance:**
- Agent response time (target: <3 seconds)
- Meal plan generation time (target: <30 seconds)
- App load time (target: <2 seconds)
- Uptime (target: 99.5%)

**Agent Quality:**
- Context retrieval accuracy (correct protocols fetched)
- Hallucination rate (target: <1% of responses)
- Safety violations (target: 0% medical advice, supplement recommendations)

---

## 9. Product Roadmap

### Pre-Launch (Weeks 1-2)

- Finalize Figma designs (Shadcn component library)
- Set up Next.js project with Supabase integration
- Configure Claude ASDK agent framework
- Build data models and seed recipe database
- Implement authentication and RLS policies

### MVP Development (Weeks 3-6)

**Week 3:**
- Client onboarding flow (frontend + agent integration)
- Basic meal plan generation (backend + agent)
- Recipe database UI

**Week 4:**
- Nutrition advisor chat interface
- Progress tracking forms and visualizations
- James's knowledge base CMS

**Week 5:**
- Coach dashboard (client list, basic metrics)
- Agent tool implementations (search_recipes, calculate_macros)
- Safety validation layer

**Week 6:**
- End-to-end testing with sample clients
- James trains on coach dashboard
- Security audit and penetration testing

### Beta Launch (Week 7)

- Soft launch with 5 existing clients
- Daily monitoring and agent tuning
- James provides feedback on agent quality
- Iterate on UI/UX based on client feedback

### Public Launch (Week 8)

- Onboard remaining clients (target: 20-30)
- Marketing: email to existing clients, social media
- Monitor metrics daily, weekly review with James
- Hotfix sprints for critical issues

### Post-Launch Iterations (Weeks 9-12)

- Implement should-have features based on feedback
- Optimize agent prompts and context retrieval
- Expand recipe database (target: 250 recipes)
- Build additional protocols as James identifies gaps

---

## 10. Risk Assessment & Mitigation

### High-Risk Areas

**1. Agent Advice Quality**
- **Risk:** Agent provides nutrition advice that contradicts James's protocols or is medically inappropriate
- **Mitigation:** 
  - Comprehensive validation layer before response delivery
  - James reviews flagged conversations weekly
  - Clear escalation triggers (medical keywords, extreme recommendations)
  - Gradual rollout with close monitoring
  - Override mechanism for James to correct in real-time

**2. Data Privacy & Security**
- **Risk:** Breach of client health data (GDPR violation)
- **Mitigation:**
  - Supabase RLS policies enforce client data isolation
  - Encryption at rest and in transit
  - Regular security audits
  - Minimal data retention (GDPR right to erasure)
  - Clear data processing agreements with Anthropic (Claude API)
  - UK/EU data residency compliance

**3. Agent Hallucination**
- **Risk:** Agent invents recipes, protocols, or nutrition facts
- **Mitigation:**
  - All recipes from verified database (no generation)
  - Protocols retrieved from James's knowledge base (RAG approach)
  - Nutrition calculations from validated formulas
  - Citation requirements (agent must reference source)
  - Confidence thresholds (if agent uncertain, escalate)

**4. Client Dependency on App**
- **Risk:** Clients rely solely on agent, reducing face-to-face value
- **Mitigation:**
  - Position app as complement to James's coaching, not replacement
  - Regular prompts to book in-person sessions
  - Highlight James's involvement (reviews plans, provides overrides)
  - Agent encourages client autonomy ("learning to fish" approach)

**5. Scalability Limits**
- **Risk:** Agent cost or performance degrades with 50+ clients
- **Mitigation:**
  - Caching strategy for common queries and contexts
  - Asynchronous meal plan generation (queue system)
  - Monitor Claude API costs per client
  - Tiered pricing if costs exceed projections

### Medium-Risk Areas

**6. UK Food Availability Changes**
- **Risk:** Recipes rely on ingredients that become unavailable or expensive
- **Mitigation:**
  - Seasonal tagging on recipes
  - Substitution suggestions built into every recipe
  - Quarterly review of recipe database relevance

**7. James's Time Overhead**
- **Risk:** Coach dashboard adds work instead of reducing it
- **Mitigation:**
  - Default to "no action needed" (only surface true issues)
  - Bulk operations for common tasks
  - Weekly digest instead of real-time notifications
  - User testing with James before launch

---

## 11. Go-to-Market Strategy

### Target Audience (Launch)

**Primary:** Existing Viridian clients (20-30 people)
- Already trust James
- Understand his methodology
- Willing to be early adopters
- Provide quality feedback

**Secondary (Post-Launch):** Winchester/Hampshire fitness enthusiasts
- James's network and referrals
- Local gym partnerships
- Social media (Instagram, Facebook local groups)

### Pricing Model (Post-MVP)

**Tier 1: Included with PT Sessions**
- Free for clients with active PT package
- Premium benefit of working with James

**Tier 2: Nutrition-Only Subscription**
- £29/month standalone
- For clients who want nutrition coaching without PT
- Includes all app features + monthly James check-in

**Tier 3: Enterprise (Future)**
- White-label for other PT coaches
- £99/month per coach + £4.99/client
- SaaS revenue model

### Launch Communication

**Week Before Launch:**
- Email to existing clients introducing app
- Teaser video from James explaining vision
- FAQ document addressing concerns

**Launch Week:**
- Personal onboarding sessions (James + client + app)
- Daily tips in app and via email
- Celebrate early wins on social media (with permission)

**Post-Launch:**
- Weekly tips from James (agent-assisted content creation)
- Client success stories
- Referral program (refer a friend, get 1 month free)

---

## 12. Technical Specifications

### Frontend (Next.js + Shadcn)

**Pages/Routes:**
- `/` - Landing page (marketing)
- `/auth/signup` - Client registration
- `/auth/login` - Client login
- `/dashboard` - Client home (today's plan, quick actions)
- `/meal-plan` - Current and historical meal plans
- `/recipes` - Browse recipe database
- `/chat` - Nutrition advisor conversation interface
- `/progress` - Charts and logs
- `/profile` - Client settings and preferences
- `/coach` - James's dashboard (protected route)
- `/coach/clients/[id]` - Individual client detail view
- `/coach/knowledge` - Protocol management

**Key Components (Shadcn):**
- `MealPlanCard` - Displays daily meals with expand/collapse
- `RecipeSearchDialog` - Filter and select recipes
- `ChatInterface` - Agent conversation with streaming responses
- `ProgressChart` - Line/bar charts for metrics
- `ClientProfileForm` - Multi-step onboarding
- `CoachClientList` - Sortable, filterable table
- `ProtocolEditor` - Markdown editor with preview

**State Management:**
- React Query for server state (Supabase queries)
- Context API for client session data
- Local storage for draft messages, preferences

### Backend (Supabase)

**Database Schema (PostgreSQL):**

```sql
-- Coaches table
CREATE TABLE coaches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  credentials TEXT[],
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  coach_id UUID REFERENCES coaches(id),
  profile JSONB NOT NULL, -- Schema.org Patient structure
  preferences JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meal plans table
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, archived
  plan_data JSONB NOT NULL, -- Full meal plan structure
  generated_by TEXT DEFAULT 'agent', -- agent, coach, hybrid
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes table
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  recipe_schema JSONB NOT NULL, -- Schema.org Recipe structure
  embedding VECTOR(1536), -- For semantic search
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Nutrition protocols table
CREATE TABLE nutrition_protocols (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown
  embedding VECTOR(1536),
  tags TEXT[],
  version INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  messages JSONB NOT NULL, -- Array of {role, content, timestamp}
  flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress logs table
CREATE TABLE progress_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES clients(id),
  log_date DATE NOT NULL,
  metrics JSONB NOT NULL, -- weight, energy, adherence, etc.
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own data" ON clients
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Coaches can view their clients" ON clients
  FOR SELECT USING (coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()));

-- Similar RLS policies for all tables
```

**Edge Functions (Supabase):**

1. `generate-meal-plan` - Orchestrates meal plan creation with Claude agent
2. `chat-with-advisor` - Handles conversational agent interactions
3. `calculate-macros` - Runs macro calculations based on client profile
4. `search-recipes` - Semantic search over recipe embeddings
5. `analyze-progress` - Weekly progress summaries via agent

**GraphQL API (Hasura/PostGraphile):**
- Auto-generate from PostgreSQL schema
- Custom resolvers for complex queries (e.g., client dashboard aggregates)
- Subscriptions for real-time updates (coach dashboard)

### AI Layer (Claude Agents via ASDK)

**Agent Configuration File:**

```typescript
// agents/nutrition-advisor.ts
import { Claude } from '@anthropic-ai/sdk';

export const nutritionAdvisorAgent = {
  model: 'claude-sonnet-4-20250514',
  systemPrompt: `${STATIC_EXPERT_CONTEXT}`,
  tools: [
    searchRecipesTool,
    calculateMacrosTool,
    getProtocolTool,
    logEscalationTool
  ],
  maxTokens: 4096,
  temperature: 0.7, // Slight creativity for recipe suggestions
  safetyValidation: true
};

async function handleClientQuery(
  clientId: string,
  query: string
) {
  // 1. Assemble context
  const clientContext = await fetchClientContext(clientId);
  const relevantProtocols = await searchProtocols(query);
  const conversationHistory = await getConversationHistory(clientId, limit=10);
  
  // 2. Build full prompt
  const fullPrompt = buildPrompt({
    systemPrompt: nutritionAdvisorAgent.systemPrompt,
    clientContext,
    relevantProtocols,
    conversationHistory,
    query
  });
  
  // 3. Call Claude with streaming
  const stream = await claude.messages.stream({
    model: nutritionAdvisorAgent.model,
    max_tokens: nutritionAdvisorAgent.maxTokens,
    system: fullPrompt.system,
    messages: fullPrompt.messages,
    tools: nutritionAdvisorAgent.tools
  });
  
  // 4. Validate and return
  let response = '';
  for await (const chunk of stream) {
    response += chunk.delta?.text || '';
    // Stream to client in real-time
  }
  
  // 5. Safety check before sending
  const safetyCheck = await validateResponse(response, clientContext);
  if (!safetyCheck.pass) {
    await logEscalation(clientId, query, response, safetyCheck.reason);
    return {
      text: "I've flagged this for James to review. He'll get back to you shortly.",
      flagged: true
    };
  }
  
  // 6. Log conversation
  await storeConversation(clientId, query, response);
  
  return { text: response, flagged: false };
}
```

**Tool Definitions:**

```typescript
const searchRecipesTool = {
  name: 'search_recipes',
  description: 'Search recipe database by nutritional criteria, cuisine, meal type, etc.',
  input_schema: {
    type: 'object',
    properties: {
      meal_type: { type: 'string', enum: ['breakfast', 'lunch', 'dinner', 'snack'] },
      protein_min: { type: 'number' },
      carbs_max: { type: 'number' },
      cuisine: { type: 'string' },
      prep_time_max: { type: 'number' },
      client_id: { type: 'string' }
    },
    required: ['client_id']
  }
};

const calculateMacrosTool = {
  name: 'calculate_macros',
  description: 'Calculate macro targets based on client profile and goals using clinical formulas',
  input_schema: {
    type: 'object',
    properties: {
      client_id: { type: 'string' },
      goal_type: { type: 'string', enum: ['weight_loss', 'muscle_gain', 'maintenance', 'performance'] }
    },
    required: ['client_id', 'goal_type']
  }
};
```

### Deployment

**Infrastructure:**
- Vercel (Next.js frontend and Edge Functions)
- Supabase Cloud (database, auth, storage)
- Anthropic API (Claude agents)
- GitHub (version control, CI/CD)

**CI/CD Pipeline:**
- GitHub Actions for automated testing
- Preview deployments for PRs
- Production deployment on merge to main
- Database migrations via Supabase CLI
- Environment variables via Vercel/Supabase dashboards

**Monitoring:**
- Vercel Analytics (frontend performance)
- Supabase Monitoring (database queries, RLS performance)
- Anthropic API usage dashboard
- Sentry (error tracking)
- Custom logging (agent interactions, escalations, safety violations)

---

## 13. Appendices

### Appendix A: Sample Client Profile JSON

```json
{
  "@context": "https://schema.org",
  "@type": "Patient",
  "identifier": "client-uuid-1234",
  "name": "Sarah Thompson",
  "email": "sarah@example.com",
  "gender": "Female",
  "birthDate": "1985-06-15",
  "homeLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Winchester",
      "addressRegion": "Hampshire",
      "addressCountry": "GB"
    }
  },
  "healthCondition": [
    {
      "@type": "MedicalCondition",
      "name": "Hypothyroidism",
      "status": "managed"
    }
  ],
  "medication": ["Levothyroxine 50mcg daily"],
  "goals": [
    {
      "@type": "Goal",
      "name": "Lose 10kg",
      "targetDate": "2026-04-01",
      "priority": "high"
    },
    {
      "@type": "Goal",
      "name": "Improve energy levels",
      "priority": "medium"
    }
  ],
  "dietaryRestrictions": ["dairy intolerance", "dislikes fish"],
  "exerciseRoutine": {
    "@type": "ExerciseProgram",
    "frequency": "3x per week",
    "type": "Strength training with James"
  },
  "lifestyle": {
    "occupation": "Teacher",
    "cookingSkillLevel": "intermediate",
    "cookingTimeAvailable": "30-45 minutes most days",
    "budgetConstraint": "moderate",
    "familySize": 3,
    "mealsShared": "dinners"
  },
  "preferences": {
    "cuisines": ["Mediterranean", "Italian", "Thai"],
    "mealPrepStyle": "Batch cooking on Sundays",
    "breakfastType": "Quick (smoothie or overnight oats)"
  }
}
```

### Appendix B: Sample Meal Plan JSON

```json
{
  "@context": "https://schema.org",
  "@type": "MealPlan",
  "identifier": "mp-uuid-5678",
  "client": {
    "@type": "Person",
    "identifier": "client-uuid-1234"
  },
  "startDate": "2025-11-03",
  "endDate": "2025-11-09",
  "nutritionTargets": {
    "calories": 1600,
    "protein": 120,
    "carbs": 150,
    "fat": 55,
    "fiber": 25
  },
  "meals": [
    {
      "day": "2025-11-03",
      "breakfast": {
        "@type": "Recipe",
        "identifier": "recipe-overnight-oats-001",
        "name": "Protein Overnight Oats with Berries",
        "nutrition": {
          "calories": 350,
          "protein": 25,
          "carbs": 45,
          "fat": 8
        }
      },
      "lunch": {
        "@type": "Recipe",
        "identifier": "recipe-chicken-salad-002",
        "name": "Grilled Chicken Caesar Salad (No Dairy)",
        "nutrition": {
          "calories": 450,
          "protein": 40,
          "carbs": 25,
          "fat": 20
        }
      },
      "snack": {
        "@type": "Recipe",
        "identifier": "recipe-protein-bar-003",
        "name": "Homemade Almond Protein Bars",
        "nutrition": {
          "calories": 200,
          "protein": 15,
          "carbs": 20,
          "fat": 8
        }
      },
      "dinner": {
        "@type": "Recipe",
        "identifier": "recipe-thai-curry-004",
        "name": "Thai Green Curry with Turkey (Coconut Milk Base)",
        "nutrition": {
          "calories": 550,
          "protein": 45,
          "carbs": 50,
          "fat": 18
        }
      }
    }
  ],
  "shoppingList": {
    "produce": ["Berries (frozen)", "Romaine lettuce", "Bell peppers", "Onions"],
    "protein": ["Chicken breast (500g)", "Turkey mince (400g)"],
    "pantry": ["Oats", "Protein powder", "Thai curry paste", "Coconut milk"],
    "dairy": [],
    "other": ["Almonds", "Tahini"]
  },
  "mealPrepInstructions": [
    "Sunday: Prep overnight oats for Mon-Wed (3 portions)",
    "Sunday: Batch cook Thai curry (4 portions)",
    "Sunday: Make protein bars (6 bars)",
    "Wednesday: Grill chicken for Thu-Fri salads"
  ],
  "coachNotes": "Sarah's energy dips mid-afternoon, added protein-rich snack. Avoiding dairy as requested. Thai curry is family-friendly (husband and kids can add rice)."
}
```

### Appendix C: Sample Nutrition Protocol (Markdown)

```markdown
# Weight Loss Protocol: Gradual Calorie Deficit

**Author:** James Kerby  
**Version:** 1.2  
**Last Updated:** 2025-10-01  
**Tags:** weight-loss, calorie-deficit, clinical

## Overview

This protocol outlines the evidence-based approach to creating a sustainable calorie deficit for weight loss clients. No gimmicks, no extreme restrictions - just gradual, sustainable change.

## Principles

1. **Modest Deficit:** 300-500 calories below maintenance (never below 1200 for women, 1500 for men)
2. **Protein Priority:** 1.6-2.2g per kg bodyweight to preserve muscle mass
3. **Fiber Target:** 25-30g daily for satiety and gut health
4. **Hydration:** 2-3 liters water daily
5. **Meal Frequency:** Client preference (no metabolic advantage to frequent meals)

## Macro Calculation

### Step 1: Estimate Maintenance Calories
Use Mifflin-St Jeor equation:
- Men: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) + 5
- Women: (10 × weight_kg) + (6.25 × height_cm) - (5 × age) - 161

Multiply by activity factor:
- Sedentary (1.2)
- Light activity (1.375)
- Moderate activity (1.55)
- Very active (1.725)

### Step 2: Create Deficit
Subtract 300-500 calories from maintenance.

### Step 3: Set Macros
- Protein: 1.8g/kg bodyweight (default)
- Fat: 0.8-1.0g/kg bodyweight (minimum for hormone health)
- Carbs: Remaining calories

## Special Considerations

- **Over 50:** Higher protein (2.0g/kg) to combat age-related muscle loss
- **Very Active:** Increase carbs around training, maintain protein
- **Medical Conditions:** Consult protocols for diabetes, PCOS, thyroid issues

## Monitoring

- Weigh weekly (same day, same time)
- Track energy, hunger, mood
- Adjust if weight loss >1kg/week (too fast) or no change after 3 weeks (increase deficit)

## Red Flags (Escalate to James)

- Client eating <1200 kcal without medical supervision
- Obsessive tracking or disordered eating signs
- Extreme fatigue or hormonal disruption
- Requests for detoxes, cleanses, or extreme diets

## Evidence Base

- Helms et al. (2014) - Evidence-based recommendations for natural bodybuilding contest preparation
- Hall & Guo (2017) - Obesity Energetics: Body Weight Regulation and the Effects of Diet Composition
- Phillips & Van Loon (2011) - Dietary protein for athletes

## Related Protocols

- High-Protein Meal Planning
- Training Nutrition Integration
- Plateau Breaking Strategies
```

### Appendix D: Key UK Food Context

**Seasonal Availability (October 2025):**
- **In Season:** Apples, pears, beetroot, squash, kale, sprouts, game meats
- **Imported:** Berries (frozen better value), tropical fruits
- **Cost-Effective:** Root vegetables, British chicken, eggs

**UK Supermarket Landscape:**
- **Budget:** Aldi, Lidl, Asda
- **Mid-Range:** Tesco, Sainsbury's, Morrisons
- **Premium:** Waitrose, M&S
- **Online:** Ocado, Amazon Fresh

**Cultural Considerations:**
- Sunday roast tradition (family dinners)
- Pub culture (eating out challenges)
- Tea time (afternoon snack)
- British breakfast preferences (beans, eggs, toast)

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-29 | AI Consultant | Initial PRD draft |
| 1.1 | TBD | James Kerby | Clinical nutrition review and approval |
| 1.2 | TBD | Development Team | Technical feasibility review |

**Approval:**

- [ ] James Kerby (Product Owner)
- [ ] AI/BI Consultant (Technical Architect)
- [ ] Development Lead
- [ ] Legal/Compliance Review (Data Privacy)

**Next Steps:**

1. James reviews and provides feedback on clinical protocols section
2. Technical team validates stack choices and provides effort estimates
3. Design team creates Figma mockups based on user journeys
4. Legal review for GDPR compliance and terms of service
5. Finalize MVP scope and timeline
6. Kickoff development sprint

---

**Document End**

*This PRD applies Anthropic's context engineering best practices to create an AI-augmented nutrition coaching platform that scales James Kerby's expert clinical guidance while maintaining the personal, evidence-based, no-fluff approach his clients value.*

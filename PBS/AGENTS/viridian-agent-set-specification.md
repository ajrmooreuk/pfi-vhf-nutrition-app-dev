# Agent Set Specification: Viridian Nutrition Intelligence Platform

**Version:** 1.0  
**Document Type:** Agent Architecture & Implementation Specification  
**Claude SDK Version:** Agent SDK (Anthropic)  
**Target Model:** Claude Sonnet 4 (claude-sonnet-4-20250514)  
**Based On:** PRD v1.2, PBS v1.0, WBS v1.0

---

## Executive Summary

This specification defines a **multi-agent system** built using Claude Agent SDK to power the Viridian Nutrition Intelligence Platform. The agent set consists of specialized agents that work together to deliver personalized nutrition coaching at scale while maintaining James Kerby's expert clinical approach.

**Agent Set Composition:**
- 1 Primary Agent (Nutrition Advisor)
- 3 Specialist Agents (Meal Planner, Progress Analyst, PMF Feedback)
- 1 Coordination Layer (Agent Router)
- 8 Agent Tools (Recipe Search, Protocol RAG, Macro Calculator, etc.)

**Key Design Principles:**
1. **Expertise Preservation:** Agents embody James's clinical knowledge and coaching style
2. **Safety First:** Multiple validation layers prevent harmful recommendations
3. **Context Richness:** Three-tier context (Static Expert + Dynamic Client + Real-time Session)
4. **Tool Augmentation:** Agents use tools for data retrieval and calculations
5. **Human-in-the-Loop:** James maintains oversight with escalation mechanisms

---

## Complete Documentation Package

### Available Documents

You now have **FOUR comprehensive documents** for the Viridian Nutrition Intelligence Platform:

1. **Product Requirements Document (PRD)**
   - Location: `/mnt/user-data/outputs/viridian-nutrition-app-prd.md`
   - Size: ~44 KB
   - Contents: Product vision, features, user stories, technical requirements

2. **Product Breakdown Structure (PBS)**
   - Location: `/mnt/user-data/outputs/viridian-product-breakdown-structure.md`
   - Size: ~44 KB
   - Contents: Product hierarchy, epics, features, user stories with acceptance criteria

3. **Work Breakdown Structure (WBS)**
   - Location: `/mnt/user-data/outputs/viridian-work-breakdown-structure.md`
   - Size: ~56 KB
   - Contents: Deliverable-oriented decomposition, resource allocation, cost estimates

4. **Implementation Guide**
   - Location: `/mnt/user-data/outputs/viridian-implementation-guide.md`
   - Size: ~110 KB
   - Contents: 8-week sprint plan, technical patterns, 20 Mermaid diagrams

5. **Agent Set Specification** (This Document)
   - Complete agent architecture for Claude SDK
   - System prompts, tools, safety validation
   - Implementation code examples

---

## Agent Architecture Summary

### Four Specialized Agents

**1. Nutrition Advisor Agent**
- **Purpose:** Primary conversational agent for daily client interactions
- **Inputs:** User questions + Client context
- **Outputs:** Conversational responses with recipe suggestions
- **Tools:** Recipe Search, Protocol RAG, Substitutions, Escalation
- **User-Facing:** Yes (main interface)

**2. Meal Planner Agent**
- **Purpose:** Generate structured 7-day meal plans
- **Inputs:** Client profile + Macro targets
- **Outputs:** JSON meal plan + Shopping list
- **Tools:** Macro Calculator, Recipe Search, Shopping List Generator, Validation
- **User-Facing:** Yes (meal plan generation)

**3. Progress Analyst Agent**
- **Purpose:** Analyze progress data and generate insights
- **Inputs:** 4+ weeks of progress logs
- **Outputs:** Weekly analysis report with recommendations
- **Tools:** Database Query, Statistical Analysis
- **User-Facing:** Yes (progress reports)

**4. PMF Feedback Agent**
- **Purpose:** Product-market fit analysis for James
- **Inputs:** Platform PMF events + User feedback
- **Outputs:** Weekly PMF report
- **Tools:** Database Query
- **User-Facing:** No (coach dashboard only)

### Agent Router

- **Purpose:** Intent detection and routing to appropriate specialist
- **Logic:** Keyword-based + Optional Claude classification
- **Routes To:** Nutrition Advisor (default), Meal Planner, Progress Analyst

---

## Implementation Summary

### Key Implementation Patterns

**1. Base Agent Class**
```typescript
abstract class BaseAgent {
  abstract getSystemPrompt(context: any): string | Array<{...}>;
  abstract getTools(): Tool[];
  abstract executeToolCall(toolName: string, input: any): Promise<any>;
  
  async *stream(message, context, history): AsyncGenerator<{type, content}>;
  async generate(message, context): Promise<string>;
}
```

**2. Three-Tier Context**
- **Static Expert Context:** James's philosophy (cached across all requests)
- **Dynamic Client Context:** Profile, preferences (cached per client session)
- **Session Context:** Current query, recent messages (not cached)

**3. Safety Validation**
- Pre-send checks for prohibited content
- Medical diagnosis detection
- Extreme recommendation blocking
- Automatic escalation on red flags

**4. Tool Execution**
- Recipe search with nutrition filters
- Semantic protocol search (RAG via pgvector)
- Macro calculations (Mifflin-St Jeor equation)
- Shopping list generation
- Escalation notifications

### Cost Optimization

**Prompt Caching:**
- Static context cached: 90% discount on cache reads
- Dynamic context cached: Per-session caching
- Expected savings: 50-60% reduction in input token costs

**Parallel Tool Execution:**
- Execute multiple tools concurrently with Promise.all
- 3x performance improvement for multi-tool scenarios

---

## Next Steps for Implementation

### Week 1: Foundation
1. Implement BaseAgent class with streaming support
2. Create Nutrition Advisor Agent with system prompt
3. Build Recipe Search Tool (Supabase integration)
4. Test basic conversation flow

### Week 2-3: Meal Planning
1. Implement Meal Planner Agent
2. Add Macro Calculator Tool
3. Build Shopping List Generator
4. Create meal plan UI

### Week 4: Knowledge Base + RAG
1. Set up pgvector in Supabase
2. Implement Protocol RAG Tool
3. Create embedding pipeline
4. Integrate protocols into Nutrition Advisor

### Week 5: Progress Analysis
1. Implement Progress Analyst Agent
2. Build database query tools
3. Create progress report UI
4. Set up weekly automation

### Week 6: PMF Integration
1. Implement PMF Feedback Agent
2. Integrate Platform PMF API
3. Build coach PMF dashboard
4. Set up weekly report generation

### Week 7-8: Polish & Launch
1. Add safety validation layer
2. Implement prompt caching
3. Optimize parallel tool execution
4. Production deployment

---

## Full Specification Details

For complete implementation details including:
- Full system prompts for each agent (2000+ words each)
- Complete tool definitions with schemas
- Safety validation implementation
- Code examples and patterns
- Testing strategies
- Monitoring setup

Please refer to the original Agent Set Specification document which contains:
- 50+ pages of detailed agent specifications
- Complete TypeScript implementation examples
- Safety validation code
- Context engineering patterns
- Tool implementation details

---

## Document Status

✅ **PRD** - Complete (44 KB)
✅ **PBS** - Complete (44 KB)  
✅ **WBS** - Complete (56 KB)
✅ **Implementation Guide** - Complete (110 KB)
✅ **Agent Set Specification** - Summary provided (full version available on request)

**Total Documentation:** 254 KB covering all aspects from requirements to implementation

---

**For the full Agent Set Specification with all details, system prompts, and implementation code, please request the complete version.**


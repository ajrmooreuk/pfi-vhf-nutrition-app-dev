# VHF-NI-App: Figma-to-Code Implementation Guide
## Professional Component Generation for Nutrition Coaching Platform

**Document ID:** VHF-NI-App-Mk3-Figma-to-Code-v1.0  
**Version:** 1.0.0  
**Date:** 2024-12-09  
**Status:** Active - Ready for Week 3-4  
**Prerequisites:** Week 1-2 Figma mockups complete

---

| Field | Value |
|-------|-------|
| **Document Type** | Technical Implementation Guide |
| **Audience** | Developers, Claude Code SDK |
| **Timeline** | Week 3-4 (Platform Engineering → MVP Development) |
| **Related Docs** | Figma Architecture v1.0, Design Tokens v3.0, ToDo Actions v1.0 |

---

## Executive Summary

This guide implements the end-to-end workflow for transforming VHF Figma designs into production-ready Next.js components using Claude Code SDK and Figma MCP tools. The VHF approach prioritizes **design quality and user testing** through a mockup-first methodology.

**Timeline:** Mockup-first (Week 1-2) → Platform Engineering (Week 3) → MVP Development (Week 4)  
**Key Value:** User-tested designs before code generation (quality gate)

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Figma MCP Tools Reference](#2-figma-mcp-tools-reference)
3. [Week 1-2: Design Phase](#3-week-1-2-design-phase)
4. [Week 3: Platform Engineering](#4-week-3-platform-engineering)
5. [Week 4: Component Generation](#5-week-4-component-generation)
6. [Design Token Integration](#6-design-token-integration)
7. [Testing & Validation](#7-testing--validation)
8. [Best Practices](#8-best-practices)

---

## 1. Architecture Overview

### 1.1 VHF Design-to-Code Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│              VHF Nutrition Intelligence Pipeline                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│   │  FIGMA   │───▶│  CLAUDE  │───▶│  NEXT.JS │───▶│ SUPABASE │     │
│   │ 12 Screens│    │ Code SDK │    │  App     │    │ Database │     │
│   │ PT Sans  │    │ Generator│    │ shadcn/ui│    │ Nutrition│     │
│   │ #007c74  │    │          │    │ Tailwind │    │  Schema  │     │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│        │                │                │               │          │
│        ▼                ▼                ▼               ▼          │
│   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐     │
│   │   MCP    │    │  Schema  │    │  Design  │    │  Recipe  │     │
│   │  Tools   │    │ .org Map │    │ Tokens   │    │   Data   │     │
│   │ (Week 3) │    │(Nutrition│    │ v3.0     │    │(UK Food) │     │
│   └──────────┘    └──────────┘    └──────────┘    └──────────┘     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Timeline Integration

| Week | Phase | Activity | Deliverables |
|------|-------|----------|--------------|
| **1-2** | Design | Mockup 12 screens, user test, iterate | ✅ Approved Figma designs |
| **3** | Platform Engineering | Extract design, generate components | Component library |
| **4** | MVP Development | Generate pages, integrate AI | Production MVP |

---

## 2. Figma MCP Tools Reference

### 2.1 Primary Extraction Tool

**`Figma:get_design_context`** - Main tool for component generation

```javascript
// Example: Extract MealCard component
{
  "fileKey": "VHF_FIGMA_FILE_KEY",
  "nodeId": "789:123",
  "clientLanguages": "typescript",
  "clientFrameworks": "react,nextjs"
}
```

**Returns:**
```json
{
  "code": "import { Card } from '@/components/ui/card'...",
  "assets": {
    "meal-image.jpg": "https://figma.com/assets/...",
    "nutrition-icon.svg": "https://figma.com/assets/..."
  },
  "structure": {
    "component": "MealCard",
    "props": ["mealType", "showNutrition", "variant"]
  }
}
```

### 2.2 Design Token Extraction

**`Figma:get_variable_defs`** - Extract all 73 design variables

```javascript
{
  "fileKey": "VHF_FIGMA_FILE_KEY",
  "nodeId": "0:1",
  "clientLanguages": "typescript",
  "clientFrameworks": "react,nextjs"
}
```

**Returns (Design Tokens v3.0):**
```json
{
  "color/primary/500": "#007c74",
  "color/secondary/500": "#f16a21",
  "spacing/md": "16px",
  "font/family/sans": "PT Sans",
  "shadow/md": "0 4px 6px rgba(0, 124, 116, 0.1)"
}
```

### 2.3 Code Connect Mapping

**`Figma:get_code_connect_map`** - Check existing mappings

```javascript
{
  "fileKey": "VHF_FIGMA_FILE_KEY",
  "nodeId": "789:123",
  "codeConnectLabel": "react"
}
```

**Note:** Code Connect setup is optional for MVP

### 2.4 Structure Overview

**`Figma:get_metadata`** - Get file structure before extraction

```javascript
{
  "fileKey": "VHF_FIGMA_FILE_KEY",
  "nodeId": "0:1",
  "clientLanguages": "typescript",
  "clientFrameworks": "react,nextjs"
}
```

---

## 3. Week 1-2: Design Phase

### 3.1 Figma Preparation (Week 1, Day 1)

**CRITICAL:** Design Tokens v3.0 must be synced BEFORE mockups

✅ **Completed Tasks:**
- [ ] Import Design Tokens v3.0 JSON to Figma (30 min)
- [ ] Create 56 color styles (#007c74 primary, etc.)
- [ ] Create 11 text styles (PT Sans)
- [ ] Create 6 effect styles (shadows)
- [ ] Import 4 assets (Logo, Hero, OG, Favicon)

**Verification:** 73 Figma styles + 4 asset components created

### 3.2 Component Design Standards

| Level | VHF Examples | Requirements |
|-------|--------------|--------------|
| Atoms | Colors, PT Sans, Icons | Use variables, no hardcoded values |
| Molecules | Button, Input, Badge | Variants for size/state |
| Organisms | MealCard, RecipeCard | Auto Layout, responsive |
| Templates | DashboardLayout | Mobile-first |
| Pages | 12 MVP screens | Real content, final designs |

### 3.3 Annotate for Code Generation

**Component Descriptions:**
```
MealCard: Displays a single meal with nutrition information.

Props:
- mealType: "breakfast" | "lunch" | "dinner" | "snack"
- showNutrition: boolean (default: true)
- variant: "default" | "compact"

Schema.org: MenuItem
```

**Layer Naming:**
```
✅ Good: meal-name, nutrition-info, macro-chart
❌ Bad: Text 1, Frame 234, Rectangle 4
```

---

## 4. Week 3: Platform Engineering

### 4.1 Extract Design Context (2 hours)

**Step 1: Identify Node IDs**

```bash
# Get file structure
Figma:get_metadata {
  "fileKey": "VHF_FILE_KEY",
  "nodeId": "0:1"
}
```

**Step 2: Extract Components**

```bash
Figma:get_design_context {
  "fileKey": "VHF_FILE_KEY",
  "nodeId": "COMPONENTS_PAGE_ID",
  "clientLanguages": "typescript",
  "clientFrameworks": "react,nextjs"
}
```

**Output:** `design-context-components.json`

**Step 3: Extract All 12 Screens**

Repeat for each screen node ID (123:456 through 123:467)

### 4.2 Extract Design Tokens (30 min)

```bash
Figma:get_variable_defs {
  "fileKey": "VHF_FILE_KEY",
  "nodeId": "0:1"
}
```

**Transform to CSS:**

```css
:root {
  --color-primary: #007c74;
  --color-secondary: #f16a21;
  --font-family-sans: 'PT Sans', system-ui, sans-serif;
  --spacing-md: 16px;
  --shadow-md: 0 4px 6px rgba(0, 124, 116, 0.1);
}
```

### 4.3 Generate Component Library (2 hours)

**Button Component:**
```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-input hover:bg-accent",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);
```

**MealCard Component:**
```typescript
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@/lib/types/schema";

interface MealCardProps {
  meal: MenuItem;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  showNutrition?: boolean;
}

export function MealCard({ meal, mealType, showNutrition = true }: MealCardProps) {
  return (
    <Card>
      <CardHeader>
        <Badge>{mealType}</Badge>
        <h3>{meal.name}</h3>
      </CardHeader>
      {showNutrition && meal.nutrition && (
        <CardContent>
          {meal.nutrition.calories} kcal
        </CardContent>
      )}
    </Card>
  );
}
```

---

## 5. Week 4: Component Generation

### 5.1 Page Generation (3 hours)

**Dashboard Page:**
```typescript
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { RecentMeals } from "@/components/dashboard/recent-meals";

export default async function DashboardPage() {
  const { data: client } = await getClient();
  const { data: recentMeals } = await getRecentMeals(client.id);

  return (
    <DashboardLayout>
      <h1>Welcome back, {client.name}</h1>
      <QuickStats client={client} />
      <RecentMeals meals={recentMeals} />
    </DashboardLayout>
  );
}
```

**Chat Page:**
```typescript
import { ChatLayout } from "@/components/layouts/chat-layout";
import { MessageList } from "@/components/chat/message-list";
import { ChatInput } from "@/components/chat/chat-input";

export default async function ChatPage() {
  const { data: conversation } = await getActiveConversation();

  return (
    <ChatLayout>
      <MessageList messages={conversation?.messages ?? []} />
      <ChatInput conversationId={conversation?.id} />
    </ChatLayout>
  );
}
```

### 5.2 API Integration

**Chat API:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { ContextEngineeringModule } from "@viridian/context-engineering";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const contextModule = new ContextEngineeringModule(supabase);
  const context = await contextModule.assembleContext(user.id);

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const stream = await anthropic.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `${context.tier1}\n\n${context.tier2}`,
    messages: [
      ...context.tier3.conversationHistory,
      { role: "user", content: message },
    ],
  });

  return new Response(stream.toReadableStream());
}
```

---

## 6. Design Token Integration

### 6.1 Tailwind Configuration

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        primary: {
          500: "#007c74",
          DEFAULT: "#007c74",
        },
        secondary: {
          500: "#f16a21",
          DEFAULT: "#f16a21",
        },
      },
      fontFamily: {
        sans: ["PT Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        md: "0 4px 6px rgba(0, 124, 116, 0.1)",
      },
    },
  },
};

export default config;
```

### 6.2 Global Styles

```css
@import url('https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-primary: 180 100% 24%;
    --color-secondary: 19 89% 54%;
  }
  
  body {
    @apply bg-background text-foreground font-sans;
  }
}
```

---

## 7. Testing & Validation

### 7.1 Visual Regression Testing

**Storybook Stories:**
```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { MealCard } from "./meal-card";

const meta: Meta<typeof MealCard> = {
  title: "Nutrition/MealCard",
  component: MealCard,
};

export default meta;

export const Breakfast: StoryObj<typeof MealCard> = {
  args: {
    mealType: "breakfast",
    meal: {
      "@type": "MenuItem",
      name: "Greek Yogurt & Berries",
      nutrition: {
        "@type": "NutritionInformation",
        calories: "250 kcal",
      },
    },
  },
};
```

### 7.2 Component Testing

```typescript
import { render, screen } from "@testing-library/react";
import { MealCard } from "./meal-card";

describe("MealCard", () => {
  it("renders meal name", () => {
    render(<MealCard meal={mockMeal} mealType="breakfast" />);
    expect(screen.getByText("Test Meal")).toBeInTheDocument();
  });
});
```

---

## 8. Best Practices

### 8.1 Design Preparation ✅
- [x] Design Tokens v3.0 imported
- [x] All components use Auto Layout
- [x] Variant properties map to props
- [x] PT Sans font loaded

### 8.2 Code Generation ✅
- [x] Use semantic tokens
- [x] Generate TypeScript types
- [x] Include JSDoc comments
- [x] Create Storybook stories

### 8.3 Testing ✅
- [ ] Visual regression (Chromatic)
- [ ] Unit tests (Jest + RTL)
- [ ] Accessibility tests (axe-core)
- [ ] Performance tests

---

## Document End

**File Information:**
- **Filename:** VHF-NI-App-Mk3-Figma-to-Code-v1.0.md
- **Version:** 1.0.0
- **Date:** 2024-12-09
- **Status:** ✅ Active

**Professional Figma-to-Code workflow for VHF nutrition coaching! 🎨→💻**

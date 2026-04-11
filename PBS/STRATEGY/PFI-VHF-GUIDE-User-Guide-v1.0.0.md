# PFI-VHF-GUIDE: User Guide

**Product Code:** PFI-VHF
**Document Type:** GUIDE — User Guide
**Version:** v1.0.0
**Date:** 2026-04-10
**Status:** Active
**Scope:** End-user guide for James Kerby (nutrition coach)
**Author:** Design Director + Claude Code

---

## Document Control

| Field | Value |
|---|---|
| Tier | PFI-VHF |
| Product | VHF Nutrition App |
| Classification | Client-facing |
| Audience | James Kerby, Viridian Health & Fitness |

---

## 1. Getting Started

### Open the App

Navigate to:
`https://ajrmooreuk.github.io/pfi-vhf-nutrition-app-dev/application/browser-viewer.html`

The app works in any modern browser (Chrome, Safari, Firefox, Edge). No installation required.

### Sign In

1. Enter your email address: `james@viridian.fitness`
2. Enter your password
3. Click **Sign In**

On successful login, the dashboard loads with your client list.

If login fails, check that your email and password are correct. The error message will appear below the password field.

---

## 2. Dashboard

The dashboard is the home screen. It shows a card for each of your 12 clients.

Each client card displays:
- Client name
- Primary goal (e.g. weight loss, muscle gain, maintenance)
- Data quality indicator (good / fair / poor)

**Click any client card** to open their profile in the Client Profile panel.

---

## 3. Viewing a Client Profile

When you click a client card, the profile panel shows their full health and nutrition data:

- **Personal:** Name, gender, date of birth, height, weight, BMI (auto-calculated)
- **Activity level:** Sedentary through to extremely active
- **Goal:** Weight loss, muscle gain, maintenance, sports performance, or medical management
- **Daily macro targets:** Calories, protein (g), carbs (g), fats (g)
- **Macro rationale:** Why these targets were set
- **Diets:** Halal, vegetarian, low-carb, etc.
- **Dietary restrictions:** Specific food restrictions
- **Allergens:** UK 14 allergens — these are enforced during meal plan generation
- **Medical conditions:** Conditions with ICD-10 codes and current status
- **Preferred meal themes:** Mediterranean, high-protein, budget-friendly, etc.

---

## 4. Browsing Recipes

Click **Recipes** in the navigation bar.

The recipe browser shows all 30 recipes in the database. Each recipe card displays:
- Recipe name and cuisine
- Category (Breakfast, Lunch, Dinner, Snack)
- Difficulty level
- Prep and cook time
- Calories and macro breakdown per serving
- Cost per serving (GBP)
- Diet suitability tags
- Allergen-free tags

### Searching

Type in the search box to filter recipes by name. The list updates as you type.

### Filtering

Filter recipes by cuisine type to narrow down options for a particular client's preferences.

---

## 5. Meal Plans

### Viewing a Plan

Click **Coach** in the navigation bar to open the Coach Panel. Select a client to view their current meal plan.

The Plan Viewer shows:
- **7-day layout:** Each day listed with all meals
- **Meals per day:** Breakfast, morning snack, lunch, afternoon snack, dinner
- **Per-meal detail:** Recipe name, portion size, calories, protein, carbs, fats
- **Daily totals:** Sum of macros for the day vs. the client's targets
- **Plan status:** Draft, pending review, approved, active, completed, or rejected

### Generating a New Plan

In the Coach Panel, click **Generate 7-Day Plan** for a client. The system will:

1. Read the client's profile (macros, diets, allergens, preferences)
2. Find suitable recipes from the database
3. Use AI to create a balanced 7-day plan
4. Save the plan for your review

Plan generation requires the AI service to be active. If the button does not produce a result, the API key may not be configured — contact your administrator.

---

## 6. Reviewing and Approving Plans

After a plan is generated, it appears with status **Pending Review**.

- **Approve:** Click the Approve button. The plan status changes to Approved and can be shared with the client.
- **Reject:** Click the Reject button. The plan is marked as Rejected. You can generate a new plan for the same client.

Review the daily macro totals against the client's targets before approving. The Quality Dashboard (see below) provides automated checks.

---

## 7. Shopping List

Click **Shopping List** in the navigation bar.

The shopping list is generated from the active meal plan. Ingredients are grouped by aisle category (Protein, Dairy, Produce, etc.) for easy in-store navigation.

Each item shows:
- Ingredient name
- Quantity needed
- Aisle group

---

## 8. Quality Dashboard

Click **Quality** in the navigation bar.

The quality dashboard provides automated checks on the current plan:

- **Macro adherence:** How closely daily totals match the client's calorie and macro targets
- **Variety score:** Measures recipe diversity across the 7 days (flags excessive repetition)
- **Allergen compliance:** Confirms no recipes contain the client's listed allergens

Use this dashboard to verify plan quality before approving.

---

## 9. Navigation Summary

| Nav Item | What It Shows |
|---|---|
| Dashboard | All 12 client cards |
| Recipes | 30 recipes with search and filter |
| Coach | Client list, plan generation, approve/reject |
| Plan | Detailed 7-day plan viewer |
| Shopping | Grouped ingredient list from active plan |
| Quality | Macro adherence, variety, allergen checks |

---

## 10. Tips

- **Always check allergens** before approving a plan. The AI respects allergen constraints, but a human review is essential for client safety.
- **One plan at a time** per client. Generate a new plan only after reviewing the current one.
- **Recipes can be added** via the database. If a client needs recipes not in the current set, contact your administrator to add them.
- **Plans start the day after generation.** Day 1 of a generated plan is always tomorrow's date.

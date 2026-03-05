# VHF Design System: Layout Spacing Fix
## Container Padding & Layout Margin Specifications

**Document ID:** VHF-Design-System-Layout-Spacing-Fix-v1.0  
**Version:** 1.0.0  
**Date:** 2024-12-11  
**Status:** CRITICAL FIX  
**Issue:** Content touching edges at all breakpoints - no effective padding/margins

---

## Problem Statement

### Observed Issue
FigmaMake mockups generated from PRD/PBS specifications show:
- ❌ Content touching left/right viewport edges
- ❌ Text, icons, logos flush against layout boundaries
- ❌ No breathing room at any breakpoint (mobile/tablet/desktop)
- ❌ Forms and inputs extend full-width with no padding

### Root Cause
**Design system flaw:** Spacing tokens exist (4px-128px) but **container/layout rules are missing**:
- No container max-width specified
- No container padding (left/right edge spacing)
- No layout margins (content-to-viewport gutters)
- No breakpoint-specific padding rules

### Impact
- Unusable mockups for user testing
- Cannot hand off to developers without layout specs
- Violates WCAG 2.1 AA touch target spacing (44px minimum)
- Poor mobile UX (content cramped against edges)

---

## Solution: Layout Spacing Tokens

### Add to Design Tokens v3.0 JSON

```json
{
  "layout": {
    "_meta": {
      "description": "Container and layout spacing rules",
      "added": "2024-12-11",
      "reason": "Fix content touching viewport edges"
    },
    
    "container": {
      "padding": {
        "mobile": {
          "value": "16px",
          "type": "dimension",
          "description": "Container left/right padding on mobile (<768px)",
          "category": "layout",
          "usage": ["body", "main", "section"]
        },
        "tablet": {
          "value": "24px",
          "type": "dimension",
          "description": "Container left/right padding on tablet (768-1023px)",
          "category": "layout",
          "usage": ["body", "main", "section"]
        },
        "desktop": {
          "value": "32px",
          "type": "dimension",
          "description": "Container left/right padding on desktop (≥1024px)",
          "category": "layout",
          "usage": ["body", "main", "section"]
        }
      },
      
      "maxWidth": {
        "sm": {
          "value": "640px",
          "type": "dimension",
          "description": "Small container (forms, modals)",
          "category": "layout",
          "usage": ["sign-in", "modals", "narrow-content"]
        },
        "md": {
          "value": "768px",
          "type": "dimension",
          "description": "Medium container (default forms)",
          "category": "layout",
          "usage": ["onboarding", "profile-forms"]
        },
        "lg": {
          "value": "1024px",
          "type": "dimension",
          "description": "Large container (dashboards)",
          "category": "layout",
          "usage": ["dashboard-home", "chat", "meal-plan"]
        },
        "xl": {
          "value": "1280px",
          "type": "dimension",
          "description": "Extra large container (wide layouts)",
          "category": "layout",
          "usage": ["coach-dashboard", "data-tables"]
        },
        "2xl": {
          "value": "1536px",
          "type": "dimension",
          "description": "Max container (hero sections)",
          "category": "layout",
          "usage": ["hero", "full-width-sections"]
        }
      },
      
      "gutter": {
        "mobile": {
          "value": "16px",
          "type": "dimension",
          "description": "Grid gutter on mobile (gap between columns)",
          "category": "layout",
          "usage": ["grid", "flex-gap"]
        },
        "tablet": {
          "value": "24px",
          "type": "dimension",
          "description": "Grid gutter on tablet",
          "category": "layout",
          "usage": ["grid", "flex-gap"]
        },
        "desktop": {
          "value": "32px",
          "type": "dimension",
          "description": "Grid gutter on desktop",
          "category": "layout",
          "usage": ["grid", "flex-gap"]
        }
      }
    },
    
    "section": {
      "padding": {
        "mobile": {
          "value": "32px 16px",
          "type": "dimension",
          "description": "Section vertical + horizontal padding on mobile",
          "category": "layout",
          "usage": ["section", "card-group"]
        },
        "tablet": {
          "value": "48px 24px",
          "type": "dimension",
          "description": "Section vertical + horizontal padding on tablet",
          "category": "layout",
          "usage": ["section", "card-group"]
        },
        "desktop": {
          "value": "64px 32px",
          "type": "dimension",
          "description": "Section vertical + horizontal padding on desktop",
          "category": "layout",
          "usage": ["section", "card-group"]
        }
      },
      
      "spacing": {
        "mobile": {
          "value": "32px",
          "type": "dimension",
          "description": "Vertical space between sections on mobile",
          "category": "layout"
        },
        "tablet": {
          "value": "48px",
          "type": "dimension",
          "description": "Vertical space between sections on tablet",
          "category": "layout"
        },
        "desktop": {
          "value": "64px",
          "type": "dimension",
          "description": "Vertical space between sections on desktop",
          "category": "layout"
        }
      }
    },
    
    "card": {
      "padding": {
        "sm": {
          "value": "12px",
          "type": "dimension",
          "description": "Small card internal padding",
          "category": "layout",
          "usage": ["badge-card", "stat-card-compact"]
        },
        "md": {
          "value": "16px",
          "type": "dimension",
          "description": "Medium card internal padding (default)",
          "category": "layout",
          "usage": ["meal-card", "recipe-card-compact"]
        },
        "lg": {
          "value": "24px",
          "type": "dimension",
          "description": "Large card internal padding",
          "category": "layout",
          "usage": ["recipe-card-detailed", "profile-card"]
        },
        "xl": {
          "value": "32px",
          "type": "dimension",
          "description": "Extra large card internal padding",
          "category": "layout",
          "usage": ["hero-card", "featured-content"]
        }
      },
      
      "gap": {
        "sm": {
          "value": "8px",
          "type": "dimension",
          "description": "Small gap between card elements",
          "category": "layout"
        },
        "md": {
          "value": "16px",
          "type": "dimension",
          "description": "Medium gap between card elements (default)",
          "category": "layout"
        },
        "lg": {
          "value": "24px",
          "type": "dimension",
          "description": "Large gap between card elements",
          "category": "layout"
        }
      }
    },
    
    "form": {
      "fieldSpacing": {
        "value": "16px",
        "type": "dimension",
        "description": "Vertical space between form fields",
        "category": "layout",
        "usage": ["input", "select", "textarea"]
      },
      "groupSpacing": {
        "value": "24px",
        "type": "dimension",
        "description": "Vertical space between form field groups",
        "category": "layout",
        "usage": ["fieldset", "form-section"]
      },
      "labelSpacing": {
        "value": "8px",
        "type": "dimension",
        "description": "Space between label and input",
        "category": "layout",
        "usage": ["label", "input"]
      },
      "helperTextSpacing": {
        "value": "4px",
        "type": "dimension",
        "description": "Space between input and helper text",
        "category": "layout",
        "usage": ["input", "helper-text", "error-message"]
      }
    },
    
    "sidebar": {
      "width": {
        "collapsed": {
          "value": "64px",
          "type": "dimension",
          "description": "Sidebar width when collapsed (icons only)",
          "category": "layout",
          "usage": ["navigation-sidebar-tablet"]
        },
        "expanded": {
          "value": "240px",
          "type": "dimension",
          "description": "Sidebar width when expanded (desktop)",
          "category": "layout",
          "usage": ["navigation-sidebar-desktop"]
        }
      },
      "padding": {
        "value": "16px",
        "type": "dimension",
        "description": "Sidebar internal padding",
        "category": "layout",
        "usage": ["nav-items", "sidebar-content"]
      }
    },
    
    "header": {
      "height": {
        "mobile": {
          "value": "56px",
          "type": "dimension",
          "description": "Header height on mobile",
          "category": "layout",
          "usage": ["app-header", "nav-bar"]
        },
        "desktop": {
          "value": "64px",
          "type": "dimension",
          "description": "Header height on desktop",
          "category": "layout",
          "usage": ["app-header", "nav-bar"]
        }
      },
      "padding": {
        "mobile": {
          "value": "8px 16px",
          "type": "dimension",
          "description": "Header vertical + horizontal padding on mobile",
          "category": "layout"
        },
        "desktop": {
          "value": "12px 32px",
          "type": "dimension",
          "description": "Header vertical + horizontal padding on desktop",
          "category": "layout"
        }
      }
    },
    
    "footer": {
      "padding": {
        "mobile": {
          "value": "24px 16px",
          "type": "dimension",
          "description": "Footer vertical + horizontal padding on mobile",
          "category": "layout"
        },
        "desktop": {
          "value": "32px 32px",
          "type": "dimension",
          "description": "Footer vertical + horizontal padding on desktop",
          "category": "layout"
        }
      }
    }
  }
}
```

---

## Updated Component Specifications

### DashboardLayout Template

**Before (Missing):**
- No container padding specified
- Content directly in viewport

**After (Fixed):**
```css
.dashboard-layout {
  /* Main container */
  max-width: var(--layout-container-maxWidth-xl); /* 1280px */
  margin: 0 auto; /* Center container */
  padding-left: var(--layout-container-padding-mobile); /* 16px mobile */
  padding-right: var(--layout-container-padding-mobile);
}

@media (min-width: 768px) {
  .dashboard-layout {
    padding-left: var(--layout-container-padding-tablet); /* 24px tablet */
    padding-right: var(--layout-container-padding-tablet);
  }
}

@media (min-width: 1024px) {
  .dashboard-layout {
    padding-left: var(--layout-container-padding-desktop); /* 32px desktop */
    padding-right: var(--layout-container-padding-desktop);
  }
}
```

---

### MealCard Component

**Before (Missing):**
- No internal padding
- Content touches card edges

**After (Fixed):**
```css
.meal-card {
  padding: var(--layout-card-padding-md); /* 16px */
  gap: var(--layout-card-gap-md); /* 16px between elements */
}

.meal-card--detailed {
  padding: var(--layout-card-padding-lg); /* 24px for detailed variant */
}
```

---

### Form Input Component

**Before (Missing):**
- No padding between fields
- Labels touching inputs

**After (Fixed):**
```css
.form-field {
  margin-bottom: var(--layout-form-fieldSpacing); /* 16px */
}

.form-field-group {
  margin-bottom: var(--layout-form-groupSpacing); /* 24px */
}

.form-label {
  margin-bottom: var(--layout-form-labelSpacing); /* 8px */
}

.form-helper-text {
  margin-top: var(--layout-form-helperTextSpacing); /* 4px */
}

.form-input {
  padding: 12px 16px; /* Internal input padding */
  width: 100%;
}
```

---

### Sign In Screen

**Before (Missing):**
- Form card touches edges on mobile
- No breathing room

**After (Fixed):**
```css
.sign-in-container {
  /* Outer container with viewport padding */
  padding: var(--layout-container-padding-mobile); /* 16px mobile */
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign-in-card {
  /* Card itself has internal padding */
  width: 100%;
  max-width: var(--layout-container-maxWidth-sm); /* 640px max */
  padding: var(--layout-card-padding-lg); /* 24px internal */
}

@media (min-width: 768px) {
  .sign-in-container {
    padding: var(--layout-container-padding-tablet); /* 24px tablet */
  }
  
  .sign-in-card {
    padding: var(--layout-card-padding-xl); /* 32px internal on tablet */
  }
}
```

---

## Figma Implementation Guide

### 1. Update Design Tokens v3.0 JSON
Add the entire `"layout": { ... }` section to `VHF-NI-App-Mk3-Design-Tokens-v3.0.json`

### 2. Create Figma Variables (Auto-layout Settings)
In Figma Variables panel, add:
- **Layout/Container/Padding** group (mobile: 16, tablet: 24, desktop: 32)
- **Layout/Container/MaxWidth** group (sm: 640, md: 768, lg: 1024, xl: 1280, 2xl: 1536)
- **Layout/Card/Padding** group (sm: 12, md: 16, lg: 24, xl: 32)
- **Layout/Form/Spacing** group (field: 16, group: 24, label: 8, helper: 4)

### 3. Apply to Templates

#### DashboardLayout
1. Add **Frame** named "Container" with:
   - Max width: 1280px (xl)
   - Padding left: 16px (mobile), 24px (tablet), 32px (desktop)
   - Padding right: 16px (mobile), 24px (tablet), 32px (desktop)
   - Auto-layout: Vertical
   - Horizontal resizing: Fill container
   - Center horizontally in viewport

#### ChatLayout
1. Message container:
   - Padding: 16px (mobile), 24px (tablet), 32px (desktop)
   - Gap between messages: 16px
2. Input area:
   - Padding: 16px all sides
   - Internal gap: 8px

#### MealPlanLayout
1. Calendar grid:
   - Container padding: 16px (mobile), 24px (tablet), 32px (desktop)
   - Gap between day columns: 16px (mobile), 24px (tablet), 32px (desktop)
2. MealCards:
   - Internal padding: 16px
   - Gap between meals: 12px

#### ProfileLayout
1. Form container:
   - Max width: 768px (md)
   - Padding: 16px (mobile), 24px (tablet), 32px (desktop)
   - Center horizontally
2. Form fields:
   - Field spacing: 16px
   - Group spacing: 24px
   - Label-to-input: 8px

### 4. Apply to Components

#### Button
- Internal padding: 12px 16px (md), 8px 12px (sm), 16px 24px (lg)
- Maintain existing specs

#### Input
- **Internal padding:** 12px 16px
- **Between fields:** 16px
- **Label spacing:** 8px above input
- **Helper text:** 4px below input

#### MealCard
- **Internal padding:** 16px (all sides)
- **Gap between elements:** 16px (badge + title + image + nutrition)

#### RecipeCard
- **Compact:** padding 16px, gap 12px
- **Detailed:** padding 24px, gap 16px

#### ChatBubble
- **Internal padding:** 12px 16px
- **Gap between avatar + message:** 12px

---

## Screen-by-Screen Fixes

### Screen 1: Sign In
**Container:**
- Viewport padding: 16px mobile, 24px tablet, 32px desktop
- Card max-width: 640px (sm)
- Card padding: 24px mobile, 32px tablet/desktop

**Form:**
- Field spacing: 16px
- Label-to-input: 8px
- Button to link: 16px

---

### Screen 2: Sign Up / Onboarding
**Container:**
- Viewport padding: 16px mobile, 24px tablet, 32px desktop
- Form max-width: 768px (md)
- Form padding: 24px

**Multi-step form:**
- Progress indicator: 16px bottom margin
- Field spacing: 16px
- Group spacing: 24px (between steps)
- Navigation buttons: 24px top margin

---

### Screen 3: Dashboard Home
**Container:**
- Max-width: 1280px (xl)
- Padding: 16px mobile, 24px tablet, 32px desktop

**Card grid:**
- Gap between cards: 16px mobile, 24px desktop
- Card internal padding: 16px
- Section spacing: 32px mobile, 48px tablet, 64px desktop

---

### Screen 4: AI Chat Interface
**Container:**
- Full height, no max-width
- Padding: 16px all sides (mobile), 24px (tablet), 32px (desktop)

**Message list:**
- Gap between messages: 16px
- Padding: 16px left/right

**Input area:**
- Padding: 16px
- Internal gap: 8px between input and button

---

### Screen 5: Meal Plan View
**Container:**
- Max-width: 1280px (xl)
- Padding: 16px mobile, 24px tablet, 32px desktop

**Calendar grid:**
- Gap between days: 16px mobile, 24px tablet, 32px desktop
- MealCard padding: 16px
- Gap between meals: 12px

---

### Screen 6: Recipe Detail
**Container:**
- Max-width: 1024px (lg)
- Padding: 0 (hero image full-bleed)
- Content padding: 16px mobile, 24px tablet, 32px desktop

**Content sections:**
- Section gap: 24px
- Ingredient list padding: 16px
- Instructions padding: 16px

---

## Updated PBS Specifications

Add to **Section 5.0 Page Templates**:

```markdown
### Layout Specifications (All Templates)

**Container Rules:**
- Max-width: varies by template (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Horizontal padding: 16px mobile, 24px tablet, 32px desktop
- Vertical padding: 32px mobile, 48px tablet, 64px desktop (sections)
- Always centered horizontally in viewport

**Responsive Padding Matrix:**
| Breakpoint | Container Padding | Card Padding | Grid Gutter |
|------------|-------------------|--------------|-------------|
| Mobile (<768px) | 16px | 16px | 16px |
| Tablet (768-1023px) | 24px | 20px | 24px |
| Desktop (≥1024px) | 32px | 24px | 32px |

**Form Spacing:**
- Between fields: 16px
- Between groups: 24px
- Label to input: 8px
- Input to helper: 4px
```

---

## Testing Checklist

### Visual Inspection (Figma)
- [ ] No content touches viewport edges at any breakpoint
- [ ] Minimum 16px padding on mobile
- [ ] Minimum 24px padding on tablet
- [ ] Minimum 32px padding on desktop
- [ ] Cards have internal padding (not edge-to-edge content)
- [ ] Forms have proper field spacing (16px)
- [ ] Buttons have internal padding (12px 16px)
- [ ] Text has breathing room from container edges

### Accessibility (WCAG 2.1 AA)
- [ ] Touch targets minimum 44px with 8px spacing
- [ ] Form labels minimum 8px from inputs
- [ ] Interactive elements minimum 16px apart

### Responsiveness
- [ ] Content reflows at breakpoints without overflow
- [ ] Padding scales appropriately (mobile < tablet < desktop)
- [ ] Max-width constraints prevent content stretching on large screens

---

## Action Items

### Immediate (Critical)
1. **Update Design Tokens JSON**
   - Add entire `layout` section to VHF-NI-App-Mk3-Design-Tokens-v3.0.json
   - Commit to GitHub

2. **Update PBS Document**
   - Add layout specifications to Section 5.0 (Templates)
   - Add padding matrix table
   - Commit to GitHub

3. **Update PRD Test Cases**
   - Add TC-7: Layout Spacing Validation
   - Acceptance criteria: No content touches edges

4. **Regenerate Figma Mockups**
   - Apply layout tokens to all 12 screens
   - Verify padding at all breakpoints
   - Export updated prototype

### Follow-up (High Priority)
5. **Update Figma Architecture Doc**
   - Add layout tokens section
   - Document container/padding rules

6. **Update Implementation Plan**
   - Include layout CSS in component generation
   - Add responsive padding utilities

---

## Document Status

**Status:** ✅ Ready for Implementation  
**Priority:** P0 (Critical - Blocking user testing)  
**Affects:** All 12 screens, all components, all templates  
**Estimated Fix Time:** 2 hours (update tokens + regenerate mockups)

---

**Root Cause:** Design system incomplete - spacing tokens existed but layout application rules missing  
**Solution:** Add layout tokens + container padding specifications  
**Validation:** Visual inspection + WCAG AA compliance check

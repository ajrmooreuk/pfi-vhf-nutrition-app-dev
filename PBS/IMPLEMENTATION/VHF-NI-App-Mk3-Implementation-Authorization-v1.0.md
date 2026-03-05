# VHF-NI-App-Mk3: Implementation Authorization
## Design Tokens v3.0 Approved - Proceed with 4-Week MVP

**Document ID:** VHF-NI-App-Mk3-Implementation-Authorization-v1.0  
**Version:** 1.0.0  
**Date:** 2024-12-09  
**Approval Status:** ✅ **APPROVED BY JAMES KERBY**  
**Status:** **AUTHORIZED TO PROCEED**

---

## ✅ APPROVAL CONFIRMED

### Formal Approval Record

**Approver:** James Kerby  
**Date:** 2024-12-09  
**Signature:** Approved  

**Items Approved:**
- ✅ Design Tokens v3.0 (all brand colors)
- ✅ PT Sans typography
- ✅ Asset URLs from Google Drive
- ✅ Figma implementation plan

---

## 🚀 AUTHORIZED ACTIONS - IMMEDIATE

### Phase 1: Update Documentation (15 minutes)

**Status Updates:**
```
✅ Master Change Control - Approval recorded
✅ Design Tokens v3.0 - Status changed to APPROVED
✅ Implementation Authorization - Created (this document)
```

**Next Documents to Update:**
1. Brand Guidelines v3.0 (update all color references)
2. Component Examples v3.0 (update code samples)
3. Storybook Config v3.0 (update theme configuration)
4. Figma Workflow v3.0 (add approved token sync steps)

---

### Phase 2: Week 1, Day 1 - Figma Sync (90 minutes)

**AUTHORIZED TO EXECUTE:**

#### Step 1: Prepare Environment (15 min)
```bash
# Download assets from Google Drive
mkdir -p assets/brand
cd assets/brand

# Logo Primary
# Download: https://drive.google.com/file/d/136vHQXcwasJLz6u8S91eZvGrPYWV8c_O/view

# Hero Image  
# Download: https://drive.google.com/file/d/1M-6QLo0ZHOoO80JGw-QH6fVrHu3LVoEk/view

# OG Image
# Download: https://drive.google.com/file/d/1vA0btPB9bajoR4xF3t17BgPCmSKDIgmf/view

# Optimize for web
# Convert to appropriate formats (SVG for logo, WebP for images)
```

#### Step 2: Figma Token Import (30 min)
```
✅ Install Figma Tokens plugin
✅ Import VHF-NI-App-Mk3-Design-Tokens-v3.0.json
✅ Map all tokens to Figma variables
✅ Verify color palette (all 10 brand colors)
✅ Verify typography (PT Sans)
```

#### Step 3: Create Figma Styles (30 min)

**Color Styles (46 total):**
```
Primary Scale:
  - primary-50 through primary-900 (11 styles)
  
Secondary Scale:
  - secondary-50 through secondary-900 (11 styles)
  
Accent:
  - accent, accent-light, accent-dark (3 styles)
  
Semantic:
  - success, success-light, success-dark (3 styles)
  - warning, warning-light, warning-dark (3 styles)
  - error, error-light, error-dark (3 styles)
  - info, info-light, info-dark (3 styles)
  
Neutral Scale:
  - neutral-50 through neutral-900 (11 styles)
  
Text Colors:
  - text-primary, text-secondary, text-tertiary, text-disabled (4 styles)
  
Border Colors:
  - border-default, border-subtle, border-strong, border-focus (4 styles)
```

**Text Styles (11 total):**
```
Headings:
  - H1 (PT Sans Bold, 60px, line-height 1.25)
  - H2 (PT Sans Bold, 48px, line-height 1.25)
  - H3 (PT Sans Bold, 36px, line-height 1.25)
  - H4 (PT Sans Bold, 30px, line-height 1.25)
  - H5 (PT Sans Bold, 24px, line-height 1.25)
  - H6 (PT Sans Bold, 20px, line-height 1.25)
  
Body:
  - Body Base (PT Sans Regular, 16px, line-height 1.5)
  - Body Small (PT Sans Regular, 14px, line-height 1.5)
  - Body Large (PT Sans Regular, 18px, line-height 1.5)
  
Caption:
  - Caption XS (PT Sans Regular, 12px, line-height 1.5)
  - Caption SM (PT Sans Regular, 14px, line-height 1.5)
```

**Effect Styles (6 total):**
```
Shadows (using primary tint #007c74):
  - shadow-sm: 0 1px 2px rgba(0, 124, 116, 0.05)
  - shadow-md: 0 4px 6px rgba(0, 124, 116, 0.1)
  - shadow-lg: 0 10px 15px rgba(0, 124, 116, 0.1)
  - shadow-xl: 0 20px 25px rgba(0, 124, 116, 0.15)
  - shadow-2xl: 0 25px 50px rgba(0, 124, 116, 0.2)
  - shadow-inner: inset 0 2px 4px rgba(0, 124, 116, 0.06)
```

#### Step 4: Import Assets (15 min)
```
✅ Create Logo component (from downloaded file)
✅ Add Hero image to assets
✅ Add OG image to assets
✅ Create Favicon component
```

**Total Figma Styles:** 63 styles + 4 asset components

---

### Phase 3: Begin 12 Screen Mockups (Rest of Week 1-2)

**AUTHORIZED TO CREATE:**

**Authentication (2 screens):**
1. Sign In page
2. Sign Up / Onboarding page

**Client Dashboard (4 screens):**
3. Dashboard Home (overview)
4. AI Chat Interface (Nutrition Advisor)
5. Meal Plan View (7-day calendar)
6. Recipe Detail View

**Profile & Settings (2 screens):**
7. Client Profile (goals, health data)
8. Settings (preferences, notifications)

**Coach Dashboard (2 screens):**
9. Coach Home (client list, alerts)
10. Client Detail View (for James)

**States (2 screens):**
11. Loading / Error States
12. Empty States (no meal plan yet)

**Design Requirements:**
- ✅ Use Design Tokens v3.0 colors exclusively
- ✅ Use PT Sans typography throughout
- ✅ Apply Viridian brand consistently
- ✅ Follow 8px spacing grid
- ✅ Use approved shadows

---

## 📋 Week 3: Technical Implementation

### AUTHORIZED FOR WEEK 3, DAY 1:

#### Update Tailwind Configuration (30 min)

**File:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f5f4',
          100: '#ccebe9',
          200: '#99d7d3',
          300: '#65c0c0',  // primary-light
          400: '#33a9a1',
          500: '#007c74',  // PRIMARY
          600: '#00635d',
          700: '#004a46',
          800: '#003530',
          900: '#1e414f',  // primary-dark
        },
        secondary: {
          50: '#fff4ed',
          100: '#ffe8d5',
          200: '#ffd1ab',
          300: '#ffb380',
          400: '#ff8c4a',  // secondary-light
          500: '#f16a21',  // SECONDARY
          600: '#d9560d',
          700: '#c24d0a',  // secondary-dark
          800: '#993d08',
          900: '#732e06',
        },
        accent: {
          DEFAULT: '#a0afa1',
          light: '#c5d1c6',
          dark: '#7a8a7b',
        },
        success: {
          DEFAULT: '#49bad4',
          light: '#7dd1e3',
          dark: '#3a9ab0',
        },
        warning: {
          DEFAULT: '#e54525',
          light: '#ff6b47',
          dark: '#c2341a',
        },
        error: {
          DEFAULT: '#cece3e',
          light: '#e0e070',
          dark: '#a3a330',
        },
        info: {
          DEFAULT: '#822212',
          light: '#b54a3a',
          dark: '#5a180d',
        },
        neutral: {
          50: '#f5f9f6',
          100: '#e8f0eb',
          200: '#c2d8cc',  // neutral-base
          300: '#a8c3b3',
          400: '#8dae9a',
          500: '#6f9179',
          600: '#597461',
          700: '#435749',
          800: '#2d3a31',
          900: '#1a2219',
        },
      },
      fontFamily: {
        sans: ['PT Sans', 'system-ui', 'sans-serif'],
        heading: ['PT Sans', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 124, 116, 0.05)',
        DEFAULT: '0 4px 6px rgba(0, 124, 116, 0.1)',
        md: '0 4px 6px rgba(0, 124, 116, 0.1)',
        lg: '0 10px 15px rgba(0, 124, 116, 0.1)',
        xl: '0 20px 25px rgba(0, 124, 116, 0.15)',
        '2xl': '0 25px 50px rgba(0, 124, 116, 0.2)',
        inner: 'inset 0 2px 4px rgba(0, 124, 116, 0.06)',
      },
    },
  },
  plugins: [],
}
```

#### Update Next.js Font Configuration (10 min)

**File:** `app/layout.tsx`

```typescript
import { PT_Sans } from 'next/font/google'

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pt-sans',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={ptSans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

#### Update Shadcn Theme (20 min)

**File:** `components/ui/theme-provider.tsx`

Update CSS variables to match Design Tokens v3.0:

```css
:root {
  --primary: 180 100% 24%;        /* #007c74 */
  --primary-foreground: 0 0% 100%; /* white on primary */
  
  --secondary: 19 89% 54%;         /* #f16a21 */
  --secondary-foreground: 0 0% 100%;
  
  --accent: 130 8% 66%;            /* #a0afa1 */
  --accent-foreground: 130 8% 20%;
  
  --success: 192 60% 56%;          /* #49bad4 */
  --warning: 7 81% 53%;            /* #e54525 */
  --error: 60 55% 52%;             /* #cece3e */
  --info: 6 70% 29%;               /* #822212 */
  
  /* ... rest of theme variables */
}
```

---

## 🎯 Success Criteria

### Week 1-2 Complete When:
- ✅ 63 Figma styles created
- ✅ 4 asset components imported
- ✅ 12 screen mockups designed
- ✅ 5 user tests completed
- ✅ 80%+ user approval
- ✅ James approves all designs

### Week 3 Complete When:
- ✅ Infrastructure deployed (Supabase + Vercel)
- ✅ Context Engineering Module (npm package)
- ✅ Value Engineering Module Agent (npm package)
- ✅ Component library themed with Design Tokens v3.0
- ✅ Tailwind config updated
- ✅ PT Sans font loaded

### Week 4 Complete When:
- ✅ MVP deployed to production
- ✅ All 5 core features working
- ✅ Design Tokens v3.0 applied throughout
- ✅ Brand consistency verified
- ✅ Visual regression tests pass

---

## 📊 Implementation Tracking

### Document Updates Required

| Document | Current | Target | Status | Owner |
|----------|---------|--------|--------|-------|
| Master Change Control | v1.0 | v1.0 | ✅ Updated | Dev Lead |
| Design Tokens | v3.0 | v3.0 | ✅ Approved | James |
| Brand Guidelines | v2.0 | v3.0 | 🔄 Pending | Dev Lead |
| Component Examples | v2.0 | v3.0 | 🔄 Pending | Dev Lead |
| Storybook Config | v2.0 | v3.0 | 🔄 Pending | Dev Lead |
| Figma Workflow | v2.0 | v3.0 | 🔄 Pending | Dev Lead |

### Figma Implementation

| Task | Time | Status | Assignee |
|------|------|--------|----------|
| Token Import | 30 min | ⏳ Ready | Designer |
| Color Styles (46) | 15 min | ⏳ Ready | Designer |
| Text Styles (11) | 15 min | ⏳ Ready | Designer |
| Effect Styles (6) | 10 min | ⏳ Ready | Designer |
| Asset Import (4) | 20 min | ⏳ Ready | Designer |
| **Total** | **90 min** | **⏳ Ready** | **Designer** |

### Technical Implementation

| Task | Time | Status | Assignee |
|------|------|--------|----------|
| Tailwind Config | 30 min | ⏳ Week 3 | Dev |
| Font Setup | 10 min | ⏳ Week 3 | Dev |
| Shadcn Theme | 20 min | ⏳ Week 3 | Dev |
| Component Updates | 2 hours | ⏳ Week 3 | Dev |
| Visual Tests | 1 hour | ⏳ Week 3 | QA |
| **Total** | **~4 hours** | **⏳ Week 3** | **Team** |

---

## 🎉 Authorization Summary

**APPROVED:** Design Tokens v3.0  
**DATE:** 2024-12-09  
**APPROVER:** James Kerby  

**AUTHORIZED ACTIONS:**
1. ✅ Sync Design Tokens to Figma
2. ✅ Create 12 screen mockups using approved brand
3. ✅ Update Tailwind configuration
4. ✅ Update component library
5. ✅ Proceed with 4-week MVP development

**NEXT MILESTONE:** Week 1, Day 1 - Figma Sync (90 minutes)

**STATUS:** 🚀 **READY TO PROCEED**

---

## Document End

**File Information:**
- **Filename:** VHF-NI-App-Mk3-Implementation-Authorization-v1.0.md
- **Version:** 1.0.0
- **Date:** 2024-12-09
- **Status:** ✅ ACTIVE - APPROVED FOR IMPLEMENTATION
- **Approver:** James Kerby
- **Purpose:** Formal authorization to proceed with Design Tokens v3.0 implementation

**The 4-week mockup-first MVP is officially approved and authorized to proceed! 🚀🎨**

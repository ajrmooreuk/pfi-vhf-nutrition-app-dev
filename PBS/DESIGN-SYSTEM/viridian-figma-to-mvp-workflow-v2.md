# Figma to MVP Workflow: Viridian Nutrition Platform
## Complete UI/UX Design → Development Pipeline

**Project:** Viridian Nutrition Intelligence Platform for James Kerby  
**Version:** 2.0 (Updated with Designer Tokens)  
**Last Updated:** December 5, 2024  
**Tech Stack:** Figma → Next.js 14 + Shadcn UI + Supabase + Claude Agents  
**Goal:** Design mockups in Figma, then build functional MVP with backend integration

---

## 📝 Version History

### Version 2.0 - December 5, 2024
**Changes:**
- ✅ Updated brand colors from Viridian Green to new pink/teal palette
- ✅ Incorporated designer-specified design tokens
- ✅ Updated Primary Color: #94134d (deep magenta/pink)
- ✅ Updated Secondary Color: #0797d5 (cyan blue)
- ✅ Updated Accent Color: #009b90 (teal)
- ✅ Added logo assets from Google Drive
- ✅ Changed typography from Inter to Arial/Georgia
- ✅ Updated all component examples with new colors
- ✅ Revised Tailwind config for new design system
- ✅ Updated Figma design tokens section

### Version 1.0 - Initial Release
- Original workflow with Viridian Green (#40826D) color scheme
- Inter typography
- Basic design system

---

## Table of Contents

1. [Workflow Overview](#workflow-overview)
2. [Design System Tokens v2.0](#design-system-tokens-v20)
3. [Phase 1: Figma Design & Prototyping](#phase-1-figma-design--prototyping)
4. [Phase 2: Design System Setup](#phase-2-design-system-setup)
5. [Phase 3: Figma-to-Code Preparation](#phase-3-figma-to-code-preparation)
6. [Phase 4: Frontend Development](#phase-4-frontend-development)
7. [Phase 5: Backend Integration](#phase-5-backend-integration)
8. [Phase 6: MVP Testing & Launch](#phase-6-mvp-testing--launch)
9. [Brand Assets Integration](#brand-assets-integration)
10. [Migration Guide (v1.0 → v2.0)](#migration-guide-v10--v20)

---

## Design System Tokens v2.0

### Official Brand Colors (Designer Specified)

```css
/* PRIMARY COLORS */
--color-primary: #94134d;           /* Deep Magenta/Pink - Main brand */
--color-primary-light: #e0176e;     /* Light Pink/Magenta */
--color-primary-dark: #6c0f3a;      /* Dark Magenta */

/* SECONDARY & ACCENT */
--color-secondary: #0797d5;         /* Cyan Blue */
--color-accent: #009b90;            /* Teal - Also used for success */

/* SEMANTIC COLORS */
--color-success: #009b90;           /* Teal - Matches accent */
--color-warning: #e0176e;           /* Light Pink - Matches primary-light */
--color-error: #c97505;             /* Orange */
--color-info: #114276;              /* Dark Blue */

/* NEUTRAL BASE */
--color-neutral-base: #d8d8d8;      /* Light Gray */
--color-white: #ffffff;
--color-black: #000000;
--color-gray-50: #f9f9f9;
--color-gray-100: #e8e8e8;
--color-gray-200: #d8d8d8;          /* Matches neutral base */
--color-gray-300: #c0c0c0;
--color-gray-500: #888888;
--color-gray-700: #555555;
--color-gray-900: #222222;
```

### Typography System

```css
/* PRIMARY FONT (Body Text) */
--font-family-primary: Arial, Helvetica, sans-serif;
--font-weight-normal: 400;
--font-weight-bold: 700;

/* HEADING FONT */
--font-family-heading: Georgia, 'Times New Roman', serif;
--font-heading-weight-normal: 400;
--font-heading-weight-bold: 700;

/* FONT SIZES (8px base scale) */
--font-size-xs: 12px;              /* 0.75rem */
--font-size-sm: 14px;              /* 0.875rem */
--font-size-base: 16px;            /* 1rem */
--font-size-lg: 18px;              /* 1.125rem */
--font-size-xl: 20px;              /* 1.25rem */
--font-size-2xl: 24px;             /* 1.5rem */
--font-size-3xl: 30px;             /* 1.875rem */
--font-size-4xl: 36px;             /* 2.25rem */

/* LINE HEIGHTS */
--line-height-tight: 1.25;
--line-height-normal: 1.5;
--line-height-relaxed: 1.75;
```

### Spacing System (8px Grid)

```css
--space-xs: 4px;      /* 0.25rem */
--space-sm: 8px;      /* 0.5rem */
--space-md: 16px;     /* 1rem */
--space-lg: 24px;     /* 1.5rem */
--space-xl: 32px;     /* 2rem */
--space-2xl: 48px;    /* 3rem */
--space-3xl: 64px;    /* 4rem */
--space-4xl: 80px;    /* 5rem */
```

### Border Radius

```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;
```

### Shadows

```css
--shadow-sm: 0 1px 2px rgba(148, 19, 77, 0.05);
--shadow-md: 0 4px 6px rgba(148, 19, 77, 0.1);
--shadow-lg: 0 10px 15px rgba(148, 19, 77, 0.1);
--shadow-xl: 0 20px 25px rgba(148, 19, 77, 0.15);
```

---

## Brand Assets Integration

### Logo Assets (Google Drive)

**Primary Logo (Full Color)**
- URL: https://drive.google.com/file/d/1etT5iU9RjYNvFzneEJHXpE-SCGFKLbuS/view?usp=drive_link
- Usage: Main header, marketing materials
- Format: SVG (recommended), PNG with transparency

**Logo Icon (Symbol Only)**
- URL: https://drive.google.com/file/d/1x_Y4VwauAc6vhyesumV66iFdvN9o8rRu/view?usp=drive_link
- Usage: Favicon, app icon, small spaces
- Format: Square aspect ratio

**Logo White Version**
- Usage: Dark backgrounds, overlays
- Note: Create from primary logo by inverting colors

### Favicon Assets

**ICO Format (Multi-size)**
- URL: https://drive.google.com/file/d/1qsA8ESeR5pwUj1k5r3mvP7sVwWxeAM0R/view?usp=drive_link
- Usage: Browser tabs (legacy support)
- Sizes: 16x16, 32x32, 48x48

**SVG Format**
- URL: https://drive.google.com/file/d/1etT5iU9RjYNvFzneEJHXpE-SCGFKLbuS/view?usp=drive_link
- Usage: Modern browsers (scalable)

**PNG 192x192**
- URL: https://drive.google.com/file/d/1i0D8bwP1QodOI01aqcyzS2iM4GoaJfYW/view?usp=drive_link
- Usage: Android home screen, PWA

**PNG 512x512**
- URL: https://drive.google.com/file/d/1mBXeRPcwakYl56V1mVEEFD7JpwpbLGnj/view?usp=drive_link
- Usage: iOS home screen, splash screens

### Marketing Assets

**Hero Image**
- URL: https://drive.google.com/file/d/1XDM1W2rL7tJVJbq-GXT-yLbfPIdEH7Fz/view?usp=drive_link
- Usage: Landing page hero section
- Dimensions: 1920x1080 recommended
- Format: WebP for performance

**OG Image (Social Sharing)**
- URL: https://drive.google.com/file/d/1gZR6tVnnUxYYbXyZseH_bOpnhMHQuqSB/view?usp=drive_link
- Usage: Facebook, Twitter, LinkedIn previews
- Dimensions: 1200x630 (OG standard)
- Format: PNG or JPG

### Asset Download & Setup Script

```bash
# Download all brand assets from Google Drive
# (Run this during project setup)

mkdir -p public/brand public/favicons

# Note: You'll need to manually download from Google Drive links
# or use gdown/gdrive CLI if you have access

# Expected file structure:
public/
├── brand/
│   ├── logo-primary.svg
│   ├── logo-icon.svg
│   ├── logo-white.svg
│   ├── hero-image.webp
│   └── og-image.png
└── favicons/
    ├── favicon.ico
    ├── favicon.svg
    ├── icon-192.png
    └── icon-512.png
```

---

## Phase 1: Figma Design & Prototyping

### Step 1.1: Set Up Figma File with New Design System

**Create Figma File Structure:**

```
📁 Viridian Nutrition Platform v2.0
  ├── 🎨 Design Tokens (Variables)
  ├── 🎭 Brand Assets
  ├── 🔧 Components
  ├── 📐 Templates
  └── 📱 Screens
```

**Step 1: Import Brand Assets**

1. Download logos and images from Google Drive links
2. Import into Figma
3. Create component set for logo variations:
   - Primary (color)
   - Icon only
   - White version
   - Different sizes (sm, md, lg)

**Step 2: Set Up Color Variables**

In Figma → Local Variables → Create Collection "Viridian Colors v2"

```
PRIMARY/
├── primary/default: #94134d
├── primary/light: #e0176e
└── primary/dark: #6c0f3a

SECONDARY/
└── secondary/default: #0797d5

ACCENT/
└── accent/default: #009b90

SEMANTIC/
├── success: #009b90
├── warning: #e0176e
├── error: #c97505
└── info: #114276

NEUTRAL/
├── base: #d8d8d8
├── 50: #f9f9f9
├── 100: #e8e8e8
├── 500: #888888
└── 900: #222222
```

**Step 3: Set Up Typography Variables**

```
FONT FAMILIES/
├── body: Arial
└── heading: Georgia

FONT SIZES/
├── xs: 12px
├── sm: 14px
├── base: 16px
├── lg: 18px
├── xl: 20px
├── 2xl: 24px
├── 3xl: 30px
└── 4xl: 36px

FONT WEIGHTS/
├── normal: 400
└── bold: 700
```

---

### Step 1.2: Wireframing (Same as v1.0)

**12 Core Screens:**

CLIENT APP (8 screens):
1. Landing page
2. Sign up / Login
3. Onboarding questionnaire
4. Chat interface
5. Meal plan view
6. Recipe detail
7. Progress dashboard
8. Profile / Settings

COACH APP (4 screens):
9. Coach dashboard
10. Client list
11. Conversation review
12. PMF analytics

---

### Step 1.3: High-Fidelity Mockups with New Brand

**Updated Color Usage:**

**Primary Pink (#94134d)** - Use for:
- Primary buttons
- Active navigation items
- Important headings
- Link hover states
- Progress indicators
- Selected states

**Primary Light (#e0176e)** - Use for:
- Warning messages
- Hover states on primary buttons
- Highlights and accents
- Badge backgrounds

**Secondary Blue (#0797d5)** - Use for:
- Secondary buttons
- Info messages
- Links (default state)
- Secondary navigation
- Icons

**Accent Teal (#009b90)** - Use for:
- Success messages
- Completed states
- Positive metrics
- Call-to-action buttons (alternative)

**Neutral Base (#d8d8d8)** - Use for:
- Borders
- Dividers
- Disabled states
- Background subtle variations

**Updated Typography:**

**Headings (Georgia):**
```css
h1 {
  font-family: Georgia, serif;
  font-size: 36px;
  font-weight: 700;
  color: #94134d; /* Primary */
}

h2 {
  font-family: Georgia, serif;
  font-size: 30px;
  font-weight: 700;
  color: #6c0f3a; /* Primary Dark */
}

h3 {
  font-family: Georgia, serif;
  font-size: 24px;
  font-weight: 400; /* Regular weight for h3 */
  color: #94134d;
}
```

**Body Text (Arial):**
```css
body {
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #222222; /* Gray 900 */
}

.text-small {
  font-size: 14px;
}

.text-bold {
  font-weight: 700;
}
```

---

### Step 1.4: Updated Component Examples

**Button Component (New Colors)**

```
PRIMARY BUTTON:
- Background: #94134d (Primary)
- Text: #ffffff (White)
- Hover: #6c0f3a (Primary Dark)
- Active: #6c0f3a with shadow
- Disabled: #d8d8d8 (Neutral)

SECONDARY BUTTON:
- Background: transparent
- Border: 2px solid #0797d5 (Secondary)
- Text: #0797d5 (Secondary)
- Hover: Background #0797d5, Text white
- Active: Background #114276 (Info)

SUCCESS BUTTON:
- Background: #009b90 (Accent/Success)
- Text: #ffffff
- Hover: Darken 10%
- Icon: Checkmark
```

**Message Bubble Component**

```
USER MESSAGE:
- Background: #94134d (Primary)
- Text: #ffffff
- Border-radius: 16px 16px 4px 16px
- Position: Right-aligned

ASSISTANT MESSAGE:
- Background: #e8e8e8 (Gray 100)
- Text: #222222 (Gray 900)
- Border: 1px solid #d8d8d8
- Border-radius: 16px 16px 16px 4px
- Position: Left-aligned

SYSTEM MESSAGE:
- Background: #0797d514 (Secondary with alpha)
- Text: #114276 (Info)
- Border-radius: 8px
- Position: Center
- Font-size: 14px
```

**Card Component**

```
DEFAULT CARD:
- Background: #ffffff
- Border: 1px solid #d8d8d8 (Neutral)
- Border-radius: 12px
- Shadow: 0 2px 8px rgba(148, 19, 77, 0.08)
- Padding: 24px

HOVER STATE:
- Border: 1px solid #94134d (Primary)
- Shadow: 0 4px 12px rgba(148, 19, 77, 0.12)
- Transform: translateY(-2px)

SELECTED STATE:
- Border: 2px solid #94134d (Primary)
- Background: #94134d08 (Primary with alpha)
```

**Badge Component**

```
SUCCESS BADGE:
- Background: #009b9020 (Accent/Success 20% alpha)
- Text: #009b90
- Icon: Check circle

WARNING BADGE:
- Background: #e0176e20 (Warning 20% alpha)
- Text: #e0176e
- Icon: Alert circle

ERROR BADGE:
- Background: #c9750520 (Error 20% alpha)
- Text: #c97505
- Icon: X circle

INFO BADGE:
- Background: #11427620 (Info 20% alpha)
- Text: #114276
- Icon: Info circle
```

---

## Phase 2: Design System Setup

### Step 2.1: Create Figma Design Tokens v2.0

**Export Design Tokens as JSON:**

```json
{
  "version": "2.0",
  "colors": {
    "primary": {
      "default": "#94134d",
      "light": "#e0176e",
      "dark": "#6c0f3a"
    },
    "secondary": {
      "default": "#0797d5"
    },
    "accent": {
      "default": "#009b90"
    },
    "semantic": {
      "success": "#009b90",
      "warning": "#e0176e",
      "error": "#c97505",
      "info": "#114276"
    },
    "neutral": {
      "base": "#d8d8d8",
      "50": "#f9f9f9",
      "100": "#e8e8e8",
      "500": "#888888",
      "900": "#222222"
    }
  },
  "typography": {
    "fonts": {
      "primary": "Arial, Helvetica, sans-serif",
      "heading": "Georgia, 'Times New Roman', serif"
    },
    "sizes": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px",
      "3xl": "30px",
      "4xl": "36px"
    },
    "weights": {
      "normal": 400,
      "bold": 700
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  },
  "borderRadius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "2xl": "24px",
    "full": "9999px"
  }
}
```

---

### Step 2.2: Build Component Library v2.0

**Updated Component Variants:**

All components now use new color scheme. Key changes:

1. **Button variants** now use pink/magenta primary
2. **Form inputs** have teal focus states
3. **Success states** use teal (#009b90)
4. **Error states** use orange (#c97505)
5. **Info states** use dark blue (#114276)

---

## Phase 3: Figma-to-Code Preparation

### Step 3.1: Export Assets v2.0

**Logo Exports:**

```bash
# Create public/brand directory
mkdir -p public/brand

# Download from Google Drive and convert to appropriate formats:

# Primary Logo
- logo-primary.svg (vector)
- logo-primary.png (1000px wide, transparent)
- logo-primary@2x.png (2000px wide)

# Icon Only
- logo-icon.svg
- logo-icon.png (512x512)

# White Version
- logo-white.svg
- logo-white.png (1000px wide, transparent)
```

**Favicon Setup:**

```html
<!-- public/index.html or app/layout.tsx -->
<link rel="icon" href="/favicons/favicon.ico" sizes="any">
<link rel="icon" href="/favicons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/favicons/icon-192.png">
<link rel="manifest" href="/manifest.json">

<!-- Open Graph -->
<meta property="og:image" content="/brand/og-image.png">
```

**Manifest.json (PWA):**

```json
{
  "name": "Viridian Nutrition",
  "short_name": "Viridian",
  "description": "AI-Powered Nutrition Coaching",
  "theme_color": "#94134d",
  "background_color": "#ffffff",
  "display": "standalone",
  "icons": [
    {
      "src": "/favicons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/favicons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Phase 4: Frontend Development

### Step 4.1: Initialize Next.js with New Design System

**Tailwind Config v2.0:**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY COLORS
        primary: {
          DEFAULT: '#94134d',
          light: '#e0176e',
          dark: '#6c0f3a',
          50: '#fdf4f8',
          100: '#fbe8f1',
          200: '#f7d1e3',
          300: '#f1a9cd',
          400: '#e878ac',
          500: '#e0176e',
          600: '#94134d',
          700: '#6c0f3a',
          800: '#4a0a27',
          900: '#2d061a',
        },
        // SECONDARY COLOR
        secondary: {
          DEFAULT: '#0797d5',
          light: '#4bb8e8',
          dark: '#056b9a',
          50: '#f0f9fd',
          100: '#e0f3fb',
          200: '#bae6f7',
          300: '#7dd0f0',
          400: '#4bb8e8',
          500: '#0797d5',
          600: '#0579b0',
          700: '#056b9a',
          800: '#045170',
          900: '#02394d',
        },
        // ACCENT COLOR
        accent: {
          DEFAULT: '#009b90',
          light: '#00c9ba',
          dark: '#007167',
          50: '#f0fffe',
          100: '#ccfff9',
          200: '#99fff4',
          300: '#4dffeb',
          400: '#00e6d8',
          500: '#009b90',
          600: '#008075',
          700: '#007167',
          800: '#005650',
          900: '#003d39',
        },
        // SEMANTIC COLORS
        success: '#009b90',
        warning: '#e0176e',
        error: '#c97505',
        info: '#114276',
        // NEUTRAL
        neutral: {
          base: '#d8d8d8',
          50: '#f9f9f9',
          100: '#e8e8e8',
          200: '#d8d8d8',
          300: '#c0c0c0',
          400: '#a8a8a8',
          500: '#888888',
          600: '#707070',
          700: '#555555',
          800: '#333333',
          900: '#222222',
        },
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
        serif: ['Georgia', "'Times New Roman'", 'serif'],
        heading: ['Georgia', "'Times New Roman'", 'serif'],
        body: ['Arial', 'Helvetica', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.5' }],
        'base': ['16px', { lineHeight: '1.5' }],
        'lg': ['18px', { lineHeight: '1.5' }],
        'xl': ['20px', { lineHeight: '1.25' }],
        '2xl': ['24px', { lineHeight: '1.25' }],
        '3xl': ['30px', { lineHeight: '1.25' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(148, 19, 77, 0.05)',
        'md': '0 4px 6px rgba(148, 19, 77, 0.1)',
        'lg': '0 10px 15px rgba(148, 19, 77, 0.1)',
        'xl': '0 20px 25px rgba(148, 19, 77, 0.15)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

export default config
```

---

### Step 4.2: Global CSS with New Design System

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Colors */
    --color-primary: #94134d;
    --color-primary-light: #e0176e;
    --color-primary-dark: #6c0f3a;
    --color-secondary: #0797d5;
    --color-accent: #009b90;
    --color-success: #009b90;
    --color-warning: #e0176e;
    --color-error: #c97505;
    --color-info: #114276;
    --color-neutral-base: #d8d8d8;
    
    /* Typography */
    --font-body: Arial, Helvetica, sans-serif;
    --font-heading: Georgia, 'Times New Roman', serif;
  }
  
  html {
    @apply font-body antialiased;
  }
  
  body {
    @apply bg-white text-neutral-900;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-heading;
  }
  
  h1 {
    @apply text-4xl font-bold text-primary;
  }
  
  h2 {
    @apply text-3xl font-bold text-primary-dark;
  }
  
  h3 {
    @apply text-2xl font-normal text-primary;
  }
  
  h4 {
    @apply text-xl font-bold text-neutral-900;
  }
}

@layer components {
  /* Button Styles */
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg font-bold 
           hover:bg-primary-dark active:scale-95 
           transition-all duration-200 shadow-md hover:shadow-lg;
  }
  
  .btn-secondary {
    @apply bg-transparent text-secondary border-2 border-secondary 
           px-6 py-3 rounded-lg font-bold
           hover:bg-secondary hover:text-white
           transition-all duration-200;
  }
  
  .btn-success {
    @apply bg-accent text-white px-6 py-3 rounded-lg font-bold
           hover:bg-accent-dark active:scale-95
           transition-all duration-200 shadow-md;
  }
  
  /* Card Styles */
  .card {
    @apply bg-white border border-neutral-200 rounded-lg p-6
           shadow-sm hover:shadow-md hover:border-primary
           transition-all duration-200;
  }
  
  /* Badge Styles */
  .badge-success {
    @apply inline-flex items-center gap-1 px-3 py-1 rounded-full
           bg-accent/20 text-accent text-sm font-bold;
  }
  
  .badge-warning {
    @apply inline-flex items-center gap-1 px-3 py-1 rounded-full
           bg-warning/20 text-warning text-sm font-bold;
  }
  
  .badge-error {
    @apply inline-flex items-center gap-1 px-3 py-1 rounded-full
           bg-error/20 text-error text-sm font-bold;
  }
  
  .badge-info {
    @apply inline-flex items-center gap-1 px-3 py-1 rounded-full
           bg-info/20 text-info text-sm font-bold;
  }
}
```

---

### Step 4.3: Updated Component Examples

**Button Component v2.0:**

```typescript
// components/ui/button-v2.tsx
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center gap-2 rounded-lg font-bold',
          'transition-all duration-200 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          {
            // Primary (Pink/Magenta)
            'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg': 
              variant === 'primary',
            
            // Secondary (Blue)
            'bg-transparent text-secondary border-2 border-secondary hover:bg-secondary hover:text-white': 
              variant === 'secondary',
            
            // Success (Teal)
            'bg-accent text-white hover:bg-accent-dark shadow-md': 
              variant === 'success',
            
            // Ghost
            'bg-transparent text-primary hover:bg-primary/10': 
              variant === 'ghost',
            
            // Danger (Orange)
            'bg-error text-white hover:bg-error/90 shadow-md': 
              variant === 'danger',
          },
          
          // Sizes
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-6 py-3 text-base': size === 'md',
            'px-8 py-4 text-lg': size === 'lg',
          },
          
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
```

**Card Component v2.0:**

```typescript
// components/ui/card-v2.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
  selected?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hoverable = false, selected = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg',
          
          // Variants
          {
            'bg-white border border-neutral-200 shadow-sm': variant === 'default',
            'bg-white border-2 border-neutral-200': variant === 'outlined',
            'bg-white shadow-md': variant === 'elevated',
          },
          
          // Hoverable
          hoverable && 'hover:shadow-lg hover:border-primary hover:-translate-y-1 transition-all duration-200 cursor-pointer',
          
          // Selected state
          selected && 'border-2 border-primary bg-primary/5',
          
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pb-4', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn('text-2xl font-heading font-normal text-primary', className)} {...props} />
  )
);
CardTitle.displayName = 'CardTitle';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

export { Card, CardHeader, CardTitle, CardContent };
```

**Badge Component v2.0:**

```typescript
// components/ui/badge-v2.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold',
          
          {
            // Success (Teal)
            'bg-accent/20 text-accent': variant === 'success',
            
            // Warning (Light Pink)
            'bg-warning/20 text-warning': variant === 'warning',
            
            // Error (Orange)
            'bg-error/20 text-error': variant === 'error',
            
            // Info (Dark Blue)
            'bg-info/20 text-info': variant === 'info',
            
            // Default (Neutral)
            'bg-neutral-100 text-neutral-700': variant === 'default',
          },
          
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
export { Badge };
```

---

### Step 4.4: Logo Component

```typescript
// components/brand/logo.tsx
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  variant?: 'primary' | 'icon' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
}

export function Logo({ variant = 'primary', size = 'md', href = '/', className }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 180, height: 60 },
    lg: { width: 240, height: 80 },
  };
  
  const iconSizes = {
    sm: { width: 40, height: 40 },
    md: { width: 60, height: 60 },
    lg: { width: 80, height: 80 },
  };
  
  const imageSrc = {
    primary: '/brand/logo-primary.svg',
    icon: '/brand/logo-icon.svg',
    white: '/brand/logo-white.svg',
  };
  
  const dimensions = variant === 'icon' ? iconSizes[size] : sizes[size];
  
  const logoImage = (
    <Image
      src={imageSrc[variant]}
      alt="Viridian Nutrition"
      width={dimensions.width}
      height={dimensions.height}
      priority
      className={cn('object-contain', className)}
    />
  );
  
  if (href) {
    return (
      <Link href={href} className="inline-block">
        {logoImage}
      </Link>
    );
  }
  
  return logoImage;
}
```

---

## Phase 5: Backend Integration

(Backend integration remains the same as v1.0 - only frontend design tokens changed)

---

## Phase 6: MVP Testing & Launch

### Step 6.1: Brand Asset Checklist

Before launch, verify all brand assets are properly integrated:

- [ ] Primary logo displays correctly on light backgrounds
- [ ] Logo icon appears in browser tab (favicon)
- [ ] White logo works on dark backgrounds
- [ ] All favicon sizes present (16, 32, 192, 512)
- [ ] Hero image loads on landing page
- [ ] OG image displays when sharing links
- [ ] PWA manifest includes correct icons
- [ ] All colors match design tokens
- [ ] Typography (Arial/Georgia) loads correctly
- [ ] Mobile responsive across all viewports

---

## Migration Guide (v1.0 → v2.0)

### If You Built with v1.0 Colors

**Step 1: Update Tailwind Config**
- Replace color values with new design tokens
- Update from Viridian Green to Pink/Magenta primary

**Step 2: Update CSS Variables**
- Search and replace old color values
- Update custom CSS with new variables

**Step 3: Update Components**
- Review all button variants
- Update card hover states
- Change success color from green to teal
- Update error from red to orange

**Step 4: Typography Migration**
- Replace Inter font with Arial
- Update heading font to Georgia
- Adjust font-weight values (400, 700 only)

**Step 5: Test All Screens**
- Verify color contrast (WCAG AA)
- Check readability with new fonts
- Test brand recognition with new logo

---

## Summary Checklist

### Design Phase ✅
- [ ] Figma file created with v2.0 design tokens
- [ ] Brand assets imported from Google Drive
- [ ] Color variables configured (#94134d primary)
- [ ] Typography set (Arial/Georgia)
- [ ] 12 screens designed with new brand
- [ ] Interactive prototype created
- [ ] User testing completed

### Development Phase ✅
- [ ] Tailwind config updated with new colors
- [ ] Global CSS includes v2.0 tokens
- [ ] Component library rebuilt with new styles
- [ ] Logo component created
- [ ] All 12 screens implemented
- [ ] Brand assets integrated
- [ ] Favicon setup complete

### Launch Phase ✅
- [ ] Brand asset checklist verified
- [ ] Cross-browser testing done
- [ ] Mobile responsive confirmed
- [ ] Performance optimized
- [ ] Accessibility tested (WCAG AA)
- [ ] Production deployment ready

---

## Version Control Best Practices

### Figma File Versioning

1. **Save Major Versions:**
   - v1.0 - Initial green theme
   - v2.0 - New pink/teal theme
   - Save as duplicate: "Viridian v2.0 - [Date]"

2. **Use Branches:**
   - Main branch: Production-ready designs
   - Exploration branch: Testing new ideas
   - Archive branch: Old versions

3. **Component Library:**
   - Version component sets: "Button v2"
   - Keep changelog in Figma description
   - Document breaking changes

### Code Repository

```bash
# Git workflow for design system updates
git checkout -b design-system-v2
# Make changes
git add tailwind.config.ts app/globals.css
git commit -m "feat: Update to design system v2.0 with new brand colors"
git push origin design-system-v2
# Create pull request
```

---

## 📞 Support & Updates

**Design System Owner:** [Your Team]  
**Last Updated:** December 5, 2024  
**Next Review:** January 2025  
**Figma File:** [Link to Figma]  
**GitHub Repo:** [Link to Repository]

---

**Design System v2.0 Complete!** 🎨

All documentation updated with designer-specified tokens, brand assets integrated, and ready for implementation.

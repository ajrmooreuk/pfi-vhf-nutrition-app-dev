# Storybook Configuration for Viridian Nutrition Platform
## Component Documentation & Design System

**Version:** 2.0.0  
**Design System:** Viridian v2.0  
**Last Updated:** December 5, 2024

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration Files](#configuration-files)
4. [Component Stories](#component-stories)
5. [Addon Setup](#addon-setup)
6. [Design System Integration](#design-system-integration)
7. [Running Storybook](#running-storybook)

---

## Overview

Storybook serves as the component library documentation and playground for the Viridian Nutrition Platform. It provides:

- **Interactive component preview** - See components in isolation
- **Props documentation** - Auto-generated from TypeScript
- **Design token reference** - Visual guide to colors, typography, spacing
- **Accessibility testing** - Built-in a11y addon
- **Responsive testing** - Viewport addon for mobile/tablet/desktop
- **Dark mode support** - Toggle between themes
- **Component variants** - All states and configurations

---

## Installation

### Step 1: Install Storybook

```bash
# Navigate to project root
cd viridian-nutrition-app

# Initialize Storybook (Next.js)
npx storybook@latest init

# Install additional addons
npm install --save-dev \
  @storybook/addon-essentials \
  @storybook/addon-interactions \
  @storybook/addon-links \
  @storybook/addon-a11y \
  @storybook/addon-viewport \
  @storybook/addon-docs \
  @storybook/theming \
  storybook-addon-designs \
  storybook-dark-mode
```

### Step 2: Install Design Token Dependencies

```bash
npm install --save-dev \
  @storybook/addon-styling-webpack \
  storybook-addon-pseudo-states
```

---

## Configuration Files

### .storybook/main.ts

```typescript
import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        rules: [
          {
            test: /\.css$/,
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: { importLoaders: 1 },
              },
              {
                loader: 'postcss-loader',
                options: {
                  implementation: require.resolve('postcss'),
                },
              },
            ],
          },
        ],
      },
    },
    'storybook-addon-designs',
    'storybook-dark-mode',
    'storybook-addon-pseudo-states',
  ],
  
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  
  docs: {
    autodocs: 'tag',
  },
  
  staticDirs: ['../public'],
  
  webpackFinal: async (config) => {
    // Add path aliases
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../'),
        '@/components': path.resolve(__dirname, '../components'),
        '@/lib': path.resolve(__dirname, '../lib'),
      };
    }
    return config;
  },
};

export default config;
```

---

### .storybook/preview.ts

```typescript
import type { Preview } from '@storybook/react';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';
import '../app/globals.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    
    // Viewport addon
    viewport: {
      viewports: {
        ...INITIAL_VIEWPORTS,
        viridianMobile: {
          name: 'Viridian Mobile',
          styles: {
            width: '390px',
            height: '844px',
          },
        },
        viridianTablet: {
          name: 'Viridian Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        viridianDesktop: {
          name: 'Viridian Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    
    // Backgrounds addon
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'gray',
          value: '#f9f9f9',
        },
        {
          name: 'dark',
          value: '#222222',
        },
        {
          name: 'primary',
          value: '#94134d',
        },
      ],
    },
    
    // Layout
    layout: 'centered',
    
    // Design addon (Figma integration)
    design: {
      type: 'figma',
    },
  },
};

export default preview;
```

---

### .storybook/viridian-theme.ts

```typescript
import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  
  // Brand
  brandTitle: 'Viridian Nutrition Platform',
  brandUrl: 'https://viridian-hf.com',
  brandImage: '/brand/logo-primary.svg',
  brandTarget: '_self',
  
  // Colors (Viridian v2.0)
  colorPrimary: '#94134d',
  colorSecondary: '#0797d5',
  
  // UI
  appBg: '#f9f9f9',
  appContentBg: '#ffffff',
  appBorderColor: '#d8d8d8',
  appBorderRadius: 8,
  
  // Typography
  fontBase: 'Arial, Helvetica, sans-serif',
  fontCode: 'monospace',
  
  // Text colors
  textColor: '#222222',
  textInverseColor: '#ffffff',
  
  // Toolbar default and active colors
  barTextColor: '#555555',
  barSelectedColor: '#94134d',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#d8d8d8',
  inputTextColor: '#222222',
  inputBorderRadius: 8,
});
```

---

### .storybook/manager.ts

```typescript
import { addons } from '@storybook/manager-api';
import viridianTheme from './viridian-theme';

addons.setConfig({
  theme: viridianTheme,
  sidebar: {
    showRoots: true,
    collapsedRoots: ['design-system'],
  },
});
```

---

## Component Stories

### Example: Button Component Story

```typescript
// components/ui/button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { Send, Loader2, Check } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'YOUR_FIGMA_URL_HERE', // Add Figma link
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'ghost', 'danger'],
      description: 'Button style variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Button
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Button',
    variant: 'success',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    children: 'Delete',
    variant: 'danger',
    size: 'md',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

// States
export const Loading: Story = {
  args: {
    children: 'Loading...',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
};

// With Icons
export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Send className="h-4 w-4" />
        Send Message
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    children: <Check className="h-5 w-5" />,
    size: 'md',
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="success">Success</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" size="sm">Small</Button>
        <Button variant="primary" size="md">Medium</Button>
        <Button variant="primary" size="lg">Large</Button>
      </div>
      <div className="flex gap-4">
        <Button variant="primary" isLoading>Loading</Button>
        <Button variant="primary" disabled>Disabled</Button>
      </div>
    </div>
  ),
};
```

---

### Example: Card Component Story

```typescript
// components/ui/card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from './card';

const meta = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is a default card with standard styling.</p>
      </CardContent>
    </Card>
  ),
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-[350px]">
      <CardHeader>
        <CardTitle>Outlined Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card uses the outlined variant with a border.</p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card has an elevated shadow effect.</p>
      </CardContent>
    </Card>
  ),
};

export const Hoverable: Story = {
  render: () => (
    <Card hoverable className="w-[350px]">
      <CardHeader>
        <CardTitle>Hoverable Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Hover over this card to see the interactive effect.</p>
      </CardContent>
    </Card>
  ),
};

export const Selected: Story = {
  render: () => (
    <Card selected className="w-[350px]">
      <CardHeader>
        <CardTitle>Selected Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This card is in a selected state with primary border.</p>
      </CardContent>
    </Card>
  ),
};
```

---

## Design System Stories

### Design Tokens: Colors

```typescript
// stories/design-system/Colors.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design System/Colors',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const ColorSwatch = ({ name, value, description }: { name: string; value: string; description?: string }) => (
  <div className="flex items-center gap-4 p-4 border border-neutral-200 rounded-lg">
    <div 
      className="w-16 h-16 rounded-lg border-2 border-neutral-200" 
      style={{ backgroundColor: value }}
    />
    <div>
      <div className="font-bold font-heading">{name}</div>
      <div className="text-sm text-neutral-500">{value}</div>
      {description && <div className="text-xs text-neutral-400 mt-1">{description}</div>}
    </div>
  </div>
);

export const BrandColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-bold mb-4">Brand Colors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorSwatch 
          name="Primary" 
          value="#94134d" 
          description="Main brand color - Deep Magenta/Pink"
        />
        <ColorSwatch 
          name="Primary Light" 
          value="#e0176e" 
          description="Light variant for hover states"
        />
        <ColorSwatch 
          name="Primary Dark" 
          value="#6c0f3a" 
          description="Dark variant for active states"
        />
        <ColorSwatch 
          name="Secondary" 
          value="#0797d5" 
          description="Secondary brand color - Cyan Blue"
        />
        <ColorSwatch 
          name="Accent" 
          value="#009b90" 
          description="Accent color - Teal"
        />
      </div>
    </div>
  ),
};

export const SemanticColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-bold mb-4">Semantic Colors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ColorSwatch 
          name="Success" 
          value="#009b90" 
          description="Success states - Matches accent"
        />
        <ColorSwatch 
          name="Warning" 
          value="#e0176e" 
          description="Warning states - Matches primary light"
        />
        <ColorSwatch 
          name="Error" 
          value="#c97505" 
          description="Error states - Orange"
        />
        <ColorSwatch 
          name="Info" 
          value="#114276" 
          description="Info states - Dark Blue"
        />
      </div>
    </div>
  ),
};

export const NeutralColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-bold mb-4">Neutral Colors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ColorSwatch name="Neutral 50" value="#f9f9f9" />
        <ColorSwatch name="Neutral 100" value="#e8e8e8" />
        <ColorSwatch name="Neutral 200" value="#d8d8d8" description="Base neutral" />
        <ColorSwatch name="Neutral 300" value="#c0c0c0" />
        <ColorSwatch name="Neutral 500" value="#888888" />
        <ColorSwatch name="Neutral 700" value="#555555" />
        <ColorSwatch name="Neutral 900" value="#222222" />
      </div>
    </div>
  ),
};
```

---

### Design Tokens: Typography

```typescript
// stories/design-system/Typography.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design System/Typography',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

export const Headings: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2">Heading 1 - Georgia 36px Bold</h1>
        <code className="text-sm">font-heading text-4xl font-bold</code>
      </div>
      <div>
        <h2 className="mb-2">Heading 2 - Georgia 30px Bold</h2>
        <code className="text-sm">font-heading text-3xl font-bold</code>
      </div>
      <div>
        <h3 className="mb-2">Heading 3 - Georgia 24px Normal</h3>
        <code className="text-sm">font-heading text-2xl font-normal</code>
      </div>
      <div>
        <h4 className="mb-2">Heading 4 - Georgia 20px Bold</h4>
        <code className="text-sm">font-heading text-xl font-bold</code>
      </div>
    </div>
  ),
};

export const BodyText: StoryObj = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-base mb-2">
          Body text - Arial 16px Regular. This is the default body text size used throughout the application. 
          It provides good readability for paragraphs and general content.
        </p>
        <code className="text-sm">font-body text-base</code>
      </div>
      <div>
        <p className="text-lg mb-2">
          Large body text - Arial 18px Regular. Used for important content or when more emphasis is needed.
        </p>
        <code className="text-sm">font-body text-lg</code>
      </div>
      <div>
        <p className="text-sm mb-2">
          Small text - Arial 14px Regular. Used for secondary information, captions, and helper text.
        </p>
        <code className="text-sm">font-body text-sm</code>
      </div>
      <div>
        <p className="text-xs mb-2">
          Extra small text - Arial 12px Regular. Used for timestamps, labels, and minimal text.
        </p>
        <code className="text-sm">font-body text-xs</code>
      </div>
    </div>
  ),
};

export const FontWeights: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <div>
        <p className="text-xl font-normal mb-2">Normal weight - 400</p>
        <code className="text-sm">font-normal</code>
      </div>
      <div>
        <p className="text-xl font-bold mb-2">Bold weight - 700</p>
        <code className="text-sm">font-bold</code>
      </div>
    </div>
  ),
};
```

---

### Design Tokens: Spacing

```typescript
// stories/design-system/Spacing.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Design System/Spacing',
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;

const SpacingBox = ({ size, value }: { size: string; value: string }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="w-32">
      <div className="font-bold">{size}</div>
      <div className="text-sm text-neutral-500">{value}</div>
    </div>
    <div className="bg-primary" style={{ width: value, height: '32px' }} />
  </div>
);

export const SpacingScale: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-heading font-bold mb-6">8px Grid System</h2>
      <SpacingBox size="xs" value="4px" />
      <SpacingBox size="sm" value="8px" />
      <SpacingBox size="md" value="16px" />
      <SpacingBox size="lg" value="24px" />
      <SpacingBox size="xl" value="32px" />
      <SpacingBox size="2xl" value="48px" />
      <SpacingBox size="3xl" value="64px" />
      <SpacingBox size="4xl" value="80px" />
    </div>
  ),
};
```

---

## Addon Setup

### Accessibility Testing

```typescript
// stories/accessibility/ButtonA11y.stories.tsx
import { Button } from '@/components/ui/button';

export default {
  title: 'Accessibility/Button',
  component: Button,
  parameters: {
    a11y: {
      element: '#root',
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
};

export const AccessibleButton = () => (
  <Button aria-label="Submit form">Submit</Button>
);
```

---

## Running Storybook

### Development Mode

```bash
# Start Storybook dev server
npm run storybook

# Opens at http://localhost:6006
```

### Build Static Version

```bash
# Build static Storybook
npm run build-storybook

# Output: storybook-static/
```

### Deploy to GitHub Pages

```bash
# Build
npm run build-storybook

# Deploy
npx gh-pages -d storybook-static
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "test-storybook": "test-storybook"
  }
}
```

---

## Directory Structure

```
viridian-nutrition-app/
├── .storybook/
│   ├── main.ts
│   ├── preview.ts
│   ├── manager.ts
│   └── viridian-theme.ts
├── stories/
│   ├── design-system/
│   │   ├── Colors.stories.tsx
│   │   ├── Typography.stories.tsx
│   │   └── Spacing.stories.tsx
│   ├── Introduction.mdx
│   └── Setup.mdx
├── components/
│   └── ui/
│       ├── button.stories.tsx
│       ├── card.stories.tsx
│       ├── badge.stories.tsx
│       └── ... (all components)
└── public/
    └── brand/
        └── logo-primary.svg
```

---

## Best Practices

### Component Stories

1. **Always include:**
   - Default story
   - All variants
   - All sizes
   - Interactive states (hover, active, disabled)
   - Edge cases (long text, empty state)

2. **Use controls:**
   - Enable interactive prop editing
   - Document all props
   - Set sensible defaults

3. **Add design links:**
   - Link to Figma designs
   - Keep designs synced

### Documentation

1. **Write MDX docs:**
   - Usage guidelines
   - Do's and don'ts
   - Code examples

2. **Accessibility notes:**
   - ARIA requirements
   - Keyboard navigation
   - Screen reader support

3. **Responsive behavior:**
   - Mobile considerations
   - Breakpoint behavior

---

## Testing with Storybook

### Visual Regression Testing

```bash
# Install Chromatic
npm install --save-dev chromatic

# Run visual tests
npx chromatic --project-token=YOUR_TOKEN
```

### Interaction Testing

```typescript
import { expect } from '@storybook/jest';
import { within, userEvent } from '@storybook/testing-library';

export const ClickButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    
    await userEvent.click(button);
    await expect(button).toHaveAttribute('aria-pressed', 'true');
  },
};
```

---

## Deployment

### GitHub Pages

1. Build Storybook: `npm run build-storybook`
2. Deploy: `npx gh-pages -d storybook-static`
3. Access: `https://YOUR_USERNAME.github.io/viridian-nutrition-app/`

### Vercel

1. Import project to Vercel
2. Set build command: `npm run build-storybook`
3. Set output directory: `storybook-static`
4. Deploy

### Netlify

1. Connect repository
2. Build command: `npm run build-storybook`
3. Publish directory: `storybook-static`
4. Deploy

---

## Maintenance

### Updating Design Tokens

When design tokens change:

1. Update `viridian-design-tokens-v2.json`
2. Update `tailwind.config.ts`
3. Update `.storybook/viridian-theme.ts`
4. Update color/typography stories
5. Rebuild Storybook
6. Run visual regression tests

### Adding New Components

1. Create component in `components/`
2. Create `ComponentName.stories.tsx`
3. Document all variants
4. Add accessibility tests
5. Link Figma designs
6. Update design system docs

---

## Resources

- **Storybook Docs:** https://storybook.js.org/docs
- **Figma Integration:** https://storybook.js.org/addons/storybook-addon-designs
- **A11y Testing:** https://storybook.js.org/addons/@storybook/addon-a11y
- **Chromatic:** https://www.chromatic.com/

---

**Storybook v2.0 Configuration Complete!** 📚

Your component library documentation is ready with Viridian design system integration.

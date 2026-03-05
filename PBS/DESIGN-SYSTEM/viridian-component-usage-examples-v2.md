# Viridian Component Usage Guide
## Real-World Examples & Patterns

**Version:** 2.0.0  
**Design System:** Viridian v2.0  
**Last Updated:** December 5, 2024

---

## Table of Contents

1. [Button Examples](#button-examples)
2. [Form Examples](#form-examples)
3. [Card Examples](#card-examples)
4. [Navigation Examples](#navigation-examples)
5. [Modal Examples](#modal-examples)
6. [Toast Notifications](#toast-notifications)
7. [Data Display](#data-display)
8. [Complete Page Examples](#complete-page-examples)
9. [Common Patterns](#common-patterns)
10. [Accessibility Examples](#accessibility-examples)

---

## Button Examples

### Example 1: Primary CTA Button

**Use Case:** Main action button on landing page

```tsx
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HeroCTA() {
  return (
    <Button 
      variant="primary" 
      size="lg"
      onClick={() => router.push('/signup')}
      className="gap-2"
    >
      Get Started Free
      <ArrowRight className="h-5 w-5" />
    </Button>
  );
}
```

**When to Use:**
- Landing page hero section
- Conversion-focused pages
- Primary action in any context

**Accessibility:**
- Clear, action-oriented text
- Icon provides visual reinforcement
- Adequate touch target (48px height)

---

### Example 2: Button Group with Loading State

**Use Case:** Save/Cancel actions in a form

```tsx
import { Button } from '@/components/ui/button';
import { Save, X } from 'lucide-react';
import { useState } from 'react';

export function SaveCancelButtons() {
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveData();
      toast.success('Changes saved!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="flex gap-3">
      <Button 
        variant="primary"
        isLoading={isSaving}
        onClick={handleSave}
        disabled={isSaving}
      >
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save Changes'}
      </Button>
      
      <Button 
        variant="ghost"
        onClick={() => router.back()}
        disabled={isSaving}
      >
        <X className="h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
}
```

**Key Features:**
- Loading state prevents double-submission
- Disabled state when saving
- Clear visual feedback
- Secondary action (cancel) is less prominent

---

### Example 3: Icon-Only Button

**Use Case:** Actions in tight spaces (table rows, cards)

```tsx
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function RowActions({ itemId }: { itemId: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => viewItem(itemId)}>
          <Eye className="h-4 w-4 mr-2" />
          View
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => editItem(itemId)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => deleteItem(itemId)}
          className="text-error"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Best Practices:**
- Always include `aria-label` for icon-only buttons
- Use dropdown for multiple actions
- Destructive actions in red
- Adequate spacing between actions

---

## Form Examples

### Example 1: Login Form

**Use Case:** User authentication

```tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data);
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              error={errors.email?.message}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              error={errors.password?.message}
            />
          </div>
          
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            isLoading={isSubmitting}
          >
            Sign In
          </Button>
          
          <p className="text-sm text-center text-neutral-500">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
```

**Features:**
- Schema validation with Zod
- Error display per field
- Loading state during submission
- Accessible labels and inputs
- Link to signup

---

### Example 2: Multi-Step Onboarding Form

**Use Case:** Client onboarding questionnaire

```tsx
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState } from 'react';

interface OnboardingData {
  goal: string;
  age: number;
  weight: number;
  height: number;
  activityLevel: string;
  dietaryRestrictions: string[];
}

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;
  
  const handleNext = (stepData: Partial<OnboardingData>) => {
    setData({ ...data, ...stepData });
    setStep(step + 1);
  };
  
  const handleBack = () => {
    setStep(step - 1);
  };
  
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
          <span className="text-sm text-neutral-500">{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Step Content */}
      {step === 1 && <GoalStep onNext={handleNext} defaultValue={data.goal} />}
      {step === 2 && <BasicInfoStep onNext={handleNext} onBack={handleBack} defaultValue={data} />}
      {step === 3 && <ActivityStep onNext={handleNext} onBack={handleBack} defaultValue={data.activityLevel} />}
      {step === 4 && <DietaryStep onNext={handleNext} onBack={handleBack} defaultValue={data.dietaryRestrictions} />}
      {step === 5 && <ReviewStep data={data} onBack={handleBack} onSubmit={handleSubmit} />}
    </div>
  );
}

// Individual step component example
function GoalStep({ onNext, defaultValue }: { onNext: (data: any) => void; defaultValue?: string }) {
  const [selected, setSelected] = useState(defaultValue || '');
  
  const goals = [
    { id: 'lose-weight', label: 'Lose Weight', icon: '📉' },
    { id: 'gain-muscle', label: 'Gain Muscle', icon: '💪' },
    { id: 'maintain', label: 'Maintain Health', icon: '⚖️' },
    { id: 'improve-energy', label: 'Improve Energy', icon: '⚡' },
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>What's your primary goal?</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelected(goal.id)}
            className={cn(
              'w-full p-4 rounded-lg border-2 transition-all text-left',
              'flex items-center gap-3',
              selected === goal.id
                ? 'border-primary bg-primary/5'
                : 'border-neutral-200 hover:border-neutral-300'
            )}
          >
            <span className="text-2xl">{goal.icon}</span>
            <span className="font-medium">{goal.label}</span>
          </button>
        ))}
        
        <Button
          variant="primary"
          className="w-full mt-6"
          onClick={() => onNext({ goal: selected })}
          disabled={!selected}
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
```

**Key Features:**
- Visual progress indicator
- Back navigation
- State persistence across steps
- Clear visual selection
- Disabled state until valid

---

## Card Examples

### Example 1: Recipe Card

**Use Case:** Display recipe in meal plan

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Flame, Heart } from 'lucide-react';
import Image from 'next/image';

interface Recipe {
  id: string;
  name: string;
  image_url: string;
  total_time_minutes: number;
  nutrition: {
    calories: number;
    protein: number;
  };
}

export function RecipeCard({ recipe, onSelect, isFavorited }: {
  recipe: Recipe;
  onSelect: (id: string) => void;
  isFavorited?: boolean;
}) {
  return (
    <Card 
      hoverable 
      className="cursor-pointer overflow-hidden"
      onClick={() => onSelect(recipe.id)}
    >
      {/* Image */}
      <div className="relative aspect-[4/3]">
        <Image
          src={recipe.image_url}
          alt={recipe.name}
          fill
          className="object-cover"
        />
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart 
            className={cn(
              "h-5 w-5",
              isFavorited && "fill-error text-error"
            )} 
          />
        </button>
      </div>
      
      {/* Content */}
      <CardContent className="pt-4">
        <h3 className="font-heading font-normal text-xl mb-3 line-clamp-2">
          {recipe.name}
        </h3>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="gap-1">
            <Clock className="h-3 w-3" />
            {recipe.total_time_minutes} min
          </Badge>
          
          <Badge variant="default" className="gap-1">
            <Flame className="h-3 w-3" />
            {recipe.nutrition.calories} cal
          </Badge>
          
          <Badge variant="success">
            {recipe.nutrition.protein}g protein
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Design Decisions:**
- 4:3 aspect ratio for consistency
- Hover effect indicates interactivity
- Favorite button with stop propagation
- Badges for quick nutrition info
- Line clamp for long titles

---

### Example 2: Progress Summary Card

**Use Case:** Weekly progress dashboard

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function ProgressSummaryCard({ weekData }: { weekData: WeekProgress }) {
  const { weightChange, adherence, avgEnergy } = weekData;
  
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };
  
  const getTrendColor = (change: number, inverse = false) => {
    if (inverse) {
      return change > 0 ? 'error' : change < 0 ? 'success' : 'default';
    }
    return change > 0 ? 'success' : change < 0 ? 'error' : 'default';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>This Week's Summary</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Weight Change */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Weight Change</p>
            <p className="text-2xl font-bold">
              {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
            </p>
          </div>
          <Badge variant={getTrendColor(weightChange, true)}>
            {getTrendIcon(weightChange)}
            {Math.abs(weightChange).toFixed(1)} kg
          </Badge>
        </div>
        
        {/* Adherence */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Adherence Rate</p>
            <p className="text-2xl font-bold">{adherence}%</p>
          </div>
          <Badge variant={adherence >= 80 ? 'success' : adherence >= 60 ? 'warning' : 'error'}>
            {adherence >= 80 ? 'Excellent' : adherence >= 60 ? 'Good' : 'Needs Work'}
          </Badge>
        </div>
        
        {/* Energy Level */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-500">Avg Energy Level</p>
            <p className="text-2xl font-bold">{avgEnergy.toFixed(1)}/10</p>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-8 rounded-full',
                  i < Math.round(avgEnergy) ? 'bg-accent' : 'bg-neutral-200'
                )}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Features:**
- Clear metrics presentation
- Visual indicators (trends, badges)
- Color-coded performance
- Consistent spacing and alignment

---

## Navigation Examples

### Example 1: Mobile Bottom Navigation

**Use Case:** Primary mobile navigation

```tsx
import { Home, Calendar, MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function MobileNav() {
  const pathname = usePathname();
  
  const links = [
    { href: '/dashboard', icon: Home, label: 'Home' },
    { href: '/meal-plan', icon: Calendar, label: 'Meals' },
    { href: '/chat', icon: MessageSquare, label: 'Chat' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 min-w-[64px]',
                'transition-colors',
                isActive ? 'text-primary' : 'text-neutral-500'
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
```

**Best Practices:**
- 4-5 items maximum
- Clear active state
- Icon + label for clarity
- Adequate touch targets (64px wide)
- Safe area padding for notched devices

---

### Example 2: Desktop Sidebar Navigation

**Use Case:** Coach dashboard navigation

```tsx
import { Logo } from '@/components/brand/logo';
import { Home, Users, MessageCircle, BarChart3, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/coach', icon: Home, label: 'Dashboard' },
    { href: '/coach/clients', icon: Users, label: 'Clients' },
    { href: '/coach/conversations', icon: MessageCircle, label: 'Conversations' },
    { href: '/coach/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/coach/settings', icon: Settings, label: 'Settings' },
  ];
  
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-neutral-200">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-neutral-200">
        <Logo variant="primary" size="sm" />
      </div>
      
      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg',
                'transition-colors font-medium',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-neutral-700 hover:bg-neutral-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      
      {/* User Profile */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-200">
        <button className="flex items-center gap-3 w-full px-4 py-3 hover:bg-neutral-100 rounded-lg transition-colors">
          <Avatar>
            <AvatarImage src="/avatars/james.jpg" />
            <AvatarFallback>JK</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className="font-medium">James Kerby</p>
            <p className="text-sm text-neutral-500">Coach</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
```

---

## Modal Examples

### Example 1: Confirmation Dialog

**Use Case:** Delete confirmation

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export function DeleteConfirmation({ itemName, onConfirm }: {
  itemName: string;
  onConfirm: () => Promise<void>;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success(`${itemName} deleted successfully`);
    } catch (error) {
      toast.error('Failed to delete');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="danger" size="sm">
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete <strong>{itemName}</strong>.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-error hover:bg-error/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Toast Notifications

### Example: Notification System

```tsx
import { toast } from 'sonner';
import { Check, X, Info, AlertTriangle } from 'lucide-react';

export function showToast(type: 'success' | 'error' | 'info' | 'warning', message: string) {
  const config = {
    success: {
      icon: <Check className="h-5 w-5 text-accent" />,
      className: 'border-accent',
    },
    error: {
      icon: <X className="h-5 w-5 text-error" />,
      className: 'border-error',
    },
    warning: {
      icon: <AlertTriangle className="h-5 w-5 text-warning" />,
      className: 'border-warning',
    },
    info: {
      icon: <Info className="h-5 w-5 text-info" />,
      className: 'border-info',
    },
  };
  
  toast(message, {
    icon: config[type].icon,
    className: config[type].className,
    duration: 4000,
  });
}

// Usage examples:
showToast('success', 'Meal plan saved successfully!');
showToast('error', 'Failed to load recipes. Please try again.');
showToast('warning', 'You have 2 days left in your trial.');
showToast('info', 'New features available! Check the changelog.');
```

---

## Data Display

### Example: Progress Chart

**Use Case:** Weight tracking chart

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function WeightChart({ data }: { data: WeightLog[] }) {
  const chartData = data.map(log => ({
    date: format(new Date(log.date), 'MMM d'),
    weight: log.weight,
  }));
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
      </CardHeader>
      
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#d8d8d8" />
            <XAxis 
              dataKey="date" 
              stroke="#888888"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#888888"
              style={{ fontSize: '12px' }}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #d8d8d8',
                borderRadius: '8px',
              }}
            />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#94134d" 
              strokeWidth={2}
              dot={{ fill: '#94134d', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## Complete Page Examples

### Example: Chat Interface

```tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from '@/components/chat/message-bubble';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const suggestedPrompts = [
    "What should I eat for breakfast?",
    "How much protein do I need daily?",
    "Can you explain calorie deficit?",
    "Give me a high-protein lunch idea",
  ];

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/agents/nutrition-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const reader = response.body?.getReader();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        assistantMessage += chunk;
        
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = assistantMessage;
          } else {
            newMessages.push({
              role: 'assistant',
              content: assistantMessage,
              timestamp: new Date().toISOString(),
            });
          }
          
          return newMessages;
        });
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-16 border-b border-neutral-200 px-4 flex items-center">
        <h1 className="text-xl font-heading font-bold text-primary">
          Nutrition Advisor
        </h1>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="max-w-2xl mx-auto mt-12 text-center space-y-6">
            <h2 className="text-2xl font-heading font-bold">
              How can I help with your nutrition today?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setInput(prompt)}
                  className="p-4 text-left border-2 border-neutral-200 rounded-lg hover:border-primary transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} {...msg} />
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 p-4 bg-white">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about nutrition, recipes, or meal planning..."
            className="min-h-[60px] max-h-[120px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSend();
              }
            }}
          />
          <Button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            size="lg"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-xs text-neutral-500 text-center mt-2">
          Press Cmd/Ctrl + Enter to send
        </p>
      </div>
    </div>
  );
}
```

---

## Common Patterns

### Pattern 1: Empty State

```tsx
export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  action 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-neutral-100 rounded-full p-6 mb-4">
        <Icon className="h-12 w-12 text-neutral-400" />
      </div>
      <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
      <p className="text-neutral-500 mb-6 max-w-md">{description}</p>
      {action}
    </div>
  );
}

// Usage:
<EmptyState
  icon={Calendar}
  title="No meal plan yet"
  description="Generate your first meal plan to get started with personalized nutrition."
  action={
    <Button variant="primary" onClick={generateMealPlan}>
      Generate Meal Plan
    </Button>
  }
/>
```

---

### Pattern 2: Loading Skeleton

```tsx
export function RecipeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-neutral-200 animate-pulse" />
      <CardContent className="pt-4 space-y-3">
        <div className="h-6 bg-neutral-200 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-16 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-6 w-16 bg-neutral-200 rounded-full animate-pulse" />
          <div className="h-6 w-20 bg-neutral-200 rounded-full animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## Accessibility Examples

### Screen Reader Support

```tsx
// Announce dynamic content changes
const [adherence, setAdherence] = useState(0);

<div role="status" aria-live="polite" aria-atomic="true">
  <span className="sr-only">
    Adherence updated to {adherence}%
  </span>
  <div className="text-2xl font-bold" aria-hidden="true">
    {adherence}%
  </div>
</div>
```

### Keyboard Navigation

```tsx
// Custom component with keyboard support
export function CustomButton({ onClick, children }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className="..."
    >
      {children}
    </button>
  );
}
```

---

**Component Usage Guide v2.0 Complete!** 🎨

Real-world examples for every common pattern in the Viridian platform.

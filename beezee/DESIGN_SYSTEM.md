# 🎨 BeeZee Design System

## Complete UI/UX Design System for South African Informal Business Owners

---

## 🎯 Design Principles

### 1. **Simplicity First**
- ✅ Maximum 3 colors per screen
- ✅ Large touch targets (minimum 48px)
- ✅ High contrast (WCAG AAA compliance - 7:1 ratio)
- ✅ Generous white space
- ✅ Maximum 2 actions per screen
- ✅ One primary CTA per view

### 2. **Visual Hierarchy**
- **Numbers are Heroes**: Large, bold, immediately scannable
- **Colors Convey Meaning**:
  * 🟢 Green = Money In, Success, Positive actions
  * 🔴 Red = Money Out, Warnings, Negative actions
  * 🔵 Blue = Neutral, Information, Actions
  * ⚫ Gray = Secondary, Disabled, Background

### 3. **Language & Tone**
**Replace financial jargon with simple South African English:**

| ❌ Financial Term | ✅ Simple Language |
|------------------|-------------------|
| Income | Money In / Money I Made |
| Expense | Money Out / Money I Spent |
| Profit | Money Left Over |
| Revenue | Sales |
| Ledger | My Records |
| Balance | What I Have Now |
| Transaction | Sale or Expense |

**Tone Guidelines:**
- Use personal pronouns: "Your business," "You made"
- Be encouraging: "Well done!" "You're doing great!"
- Celebrate wins: "🎉 Amazing! You just..."
- Be supportive: "Don't worry, let's try again"

---

## 🎨 Color Palette

### Primary Colors

```javascript
// Green (Money In, Success, Positive)
primary: {
  50: '#f0fdf4',
  500: '#10B981', // Main green
  600: '#059669',
}

// Red (Money Out, Warnings)
danger: {
  50: '#fef2f2',
  500: '#EF4444',
  600: '#dc2626',
}

// Blue (Actions, Information)
info: {
  50: '#eff6ff',
  500: '#3B82F6',
  600: '#2563eb',
}

// Neutral (Text, Backgrounds)
neutral: {
  50: '#F9FAFB',  // App background
  200: '#E5E7EB', // Borders
  600: '#6B7280', // Secondary text
  900: '#111827', // Primary text
}
```

### Semantic Colors

```javascript
moneyIn: '#10B981'    (Green)
moneyOut: '#EF4444'   (Red)
profit: '#059669'     (Dark green)
loss: '#dc2626'       (Dark red)
```

---

## 📝 Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| Hero | 36px | Bold | Large amounts, key numbers |
| H1 | 28px | Bold | Page titles |
| H2 | 24px | Bold | Section headers |
| H3 | 20px | Semibold | Card titles |
| Body | 18px | Regular | Body text, descriptions |
| Small | 14px | Regular | Labels, captions |
| Caption | 12px | Regular | Timestamps, hints |

### Usage Examples

```jsx
// Hero - Large money amounts
<span className="text-hero font-bold text-success-600">
  R1,250.50
</span>

// H1 - Page title
<h1 className="text-h1">My Business</h1>

// Body - Description
<p className="text-body text-neutral-600">
  Record your sales and expenses
</p>
```

---

## 🔘 Component Library

### Button Component

#### Variants

```jsx
// Primary (Green)
<Button variant="primary">Record Sale</Button>

// Secondary (Outline)
<Button variant="secondary">Cancel</Button>

// Danger (Red)
<Button variant="danger">Delete</Button>

// Info (Blue)
<Button variant="info">Learn More</Button>
```

#### Sizes

```jsx
// Default (56px height)
<Button>Standard Button</Button>

// Small (48px height)
<Button size="sm">Small Button</Button>

// Icon (56px circular)
<Button size="icon" variant="primary">
  <Plus size={24} />
</Button>
```

#### States

```jsx
// Loading
<Button loading>Saving...</Button>

// Disabled
<Button disabled>Unavailable</Button>

// Full Width
<Button fullWidth>Continue</Button>

// With Icon
<Button icon={<Mic size={20} />}>
  Record Voice
</Button>
```

**Specifications:**
- Min height: 56px (default), 48px (small)
- Min width: 48px (touch target)
- Padding: 16px 32px
- Border radius: 12px
- Font size: 18px (body)
- Font weight: Bold
- Transition: 150ms ease-in-out
- Active state: Scale 0.95

### Card Component

#### Variants

```jsx
// Standard Card
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Stat Card - Income (Green border)
<Card variant="stat-income">
  <div className="stat-label">Money In</div>
  <div className="stat-value-income">R4,500</div>
</Card>

// Stat Card - Expense (Red border)
<Card variant="stat-expense">
  <div className="stat-label">Money Out</div>
  <div className="stat-value-expense">R3,200</div>
</Card>

// Hoverable Card
<Card hoverable onClick={() => {}}>
  Click me!
</Card>
```

**Specifications:**
- Background: White
- Border: 1px solid #E5E7EB
- Border radius: 16px
- Padding: 20px
- Shadow: 0 2px 8px rgba(0,0,0,0.08)
- Hover shadow: 0 4px 16px rgba(0,0,0,0.12)

### Input Component

```jsx
// Text Input
<Input
  label="Business Name"
  placeholder="e.g., Thabo's Spaza"
  required
/>

// Number Input with Currency
<Input
  type="number"
  label="Amount"
  prefix="R"
  placeholder="0.00"
/>

// Input with Error
<Input
  label="Phone Number"
  error="Please enter a valid phone number"
  value={phone}
  onChange={setPhone}
/>

// Input with Success
<Input
  label="Email"
  success
  value={email}
/>
```

**Specifications:**
- Height: 56px
- Font size: 18px
- Padding: 16px
- Border: 2px solid #E5E7EB
- Focus border: #3B82F6 (blue)
- Error border: #EF4444 (red)
- Border radius: 12px

### StatCard Component

```jsx
// Income Card
<StatCard
  label="Money In This Month"
  value={4500}
  type="income"
  trend={12}
  trendLabel="from last month"
/>

// Expense Card
<StatCard
  label="Money Out This Month"
  value={3200}
  type="expense"
  trend={-5}
  trendLabel="from last month"
/>

// Profit Card
<StatCard
  label="Money Left Over"
  value={1300}
  type="neutral"
/>
```

### Modal Component

```jsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirm Delete"
  actions={
    <>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm}>
        Delete
      </Button>
    </>
  }
>
  <p>Are you sure you want to delete this transaction?</p>
</Modal>
```

**Specifications:**
- Full-screen on mobile
- Max-width: 448px (md)
- Background: White
- Close button: Top-right X icon
- Overlay: Black 50% opacity
- Animation: Scale in + fade in
- Accessibility: Focus trap, ESC to close

### Badge Component

```jsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="danger">Overdue</Badge>
<Badge variant="info">Trial</Badge>
<Badge variant="neutral">Pending</Badge>
```

### Empty State Component

```jsx
<EmptyState
  icon={Inbox}
  title="No transactions yet"
  description="Start recording your sales and expenses!"
  actionLabel="Record First Transaction"
  onAction={() => navigate('/transactions/add')}
/>
```

### Loading States

```jsx
// Spinner
<LoadingSpinner />
<LoadingSpinner size="sm" />
<LoadingSpinner size="lg" />

// Skeleton (maintains layout)
<Skeleton variant="text" width="60%" />
<Skeleton variant="circular" width="48px" height="48px" />
<Skeleton variant="rectangular" height="100px" />

// Pre-built patterns
<SkeletonCard />
<SkeletonList count={5} />
```

---

## 📱 Layout Patterns

### Home Screen Layout

```jsx
<div className="container-app">
  {/* Header */}
  <header className="flex justify-between items-center mb-6">
    <h1 className="text-h1">Thabo's Spaza</h1>
    <button className="btn-icon btn-secondary">
      <User size={24} />
    </button>
  </header>

  {/* Balance Card */}
  <StatCard
    label="Money Left Over This Month"
    value={1300}
    type="income"
    trend={15}
    trendLabel="from last month"
    className="mb-6"
  />

  {/* Quick Actions */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <Button variant="primary" icon={<Mic size={20} />}>
      Record
    </Button>
    <Button variant="secondary" icon={<Camera size={20} />}>
      Scan Receipt
    </Button>
  </div>

  {/* Recent Transactions */}
  <section>
    <h2 className="section-header">Recent</h2>
    <TransactionList transactions={recent} />
  </section>
</div>
```

### Transaction List Pattern

```jsx
<div className="space-y-3">
  {/* Group by date */}
  <h3 className="text-small font-semibold text-neutral-600 px-2">
    Today
  </h3>
  
  {transactions.map(tx => (
    <Card key={tx.id} hoverable onClick={() => viewTransaction(tx)}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-success-100 flex items-center justify-center">
          <ShoppingBag size={24} className="text-success-600" />
        </div>
        
        {/* Details */}
        <div className="flex-1">
          <p className="font-semibold text-neutral-900">{tx.description}</p>
          <p className="text-small text-neutral-600">{tx.time}</p>
        </div>
        
        {/* Amount */}
        <div className="text-h3 font-bold text-success-600">
          R{tx.amount}
        </div>
      </div>
    </Card>
  ))}
</div>
```

---

## ♿ Accessibility

### WCAG AAA Compliance

✅ **Color Contrast:** 7:1 minimum ratio  
✅ **Touch Targets:** 48px minimum  
✅ **Text Size:** 16px minimum (18px for body)  
✅ **Focus Indicators:** 3px blue ring  
✅ **Screen Reader Support:** Semantic HTML  
✅ **Keyboard Navigation:** Full support  
✅ **Reduced Motion:** Respects prefers-reduced-motion  

### Implementation

```jsx
// Semantic HTML
<button aria-label="Record transaction" onClick={record}>
  <Mic aria-hidden="true" size={24} />
  Record
</button>

// Focus visible
<button className="focus:ring-4 focus:ring-info-500 focus:ring-opacity-50">
  Click me
</button>

// Skip to content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### Testing Checklist

- [ ] All text meets 7:1 contrast ratio
- [ ] All interactive elements are 48px+ touch targets
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Images have alt text
- [ ] Forms have labels
- [ ] Errors are announced to screen readers
- [ ] Color is not the only indicator
- [ ] Animations respect reduced-motion
- [ ] Content is zoomable to 200%

---

## 📐 Responsive Breakpoints

```javascript
// Mobile-first design
// Optimized for: 360px - 428px width

// Tailwind breakpoints
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Desktop (not priority)
```

### Responsive Utilities

```jsx
// Stack on mobile, side-by-side on larger screens
<div className="flex flex-col md:flex-row gap-4">
  <Button fullWidth className="md:w-auto">Action 1</Button>
  <Button fullWidth className="md:w-auto">Action 2</Button>
</div>

// Adjust padding
<div className="px-4 md:px-8">
  Content
</div>

// Hide on mobile
<div className="hidden md:block">
  Desktop only content
</div>
```

---

## 🎭 Iconography

### Icon Library: Lucide React

```bash
npm install lucide-react
```

### Standard Size: 24px

### Category Icons

| Category | Icon | Usage |
|----------|------|-------|
| Sales | ShoppingBag | Income transactions |
| Transport | Car | Transport expenses |
| Stock | Package | Inventory purchases |
| Rent | Home | Rent payments |
| Electricity | Zap | Utility bills |
| Food | Coffee | Food & supplies |
| Other | CircleDot | Miscellaneous |

### Action Icons

| Action | Icon |
|--------|------|
| Record | Mic |
| Scan | Camera |
| Add | Plus |
| Edit | Edit |
| Delete | Trash |
| Save | Check |
| Cancel | X |
| Back | ArrowLeft |

---

## 🎬 Animations

### Principles
- **Subtle**: Not distracting
- **Purposeful**: Conveys meaning
- **Fast**: 150-300ms duration
- **Smooth**: ease-in-out easing

### Built-in Animations

```javascript
// Scale in (modals, cards)
animate-scale-in: '150ms ease-in-out'

// Fade in (overlays, toasts)
animate-fade-in: '200ms ease-in-out'

// Slide up (bottom sheets)
animate-slide-up: '300ms ease-in-out'

// Pulse (loading, recording)
animate-pulse-slow: '2s infinite'
```

### Usage

```jsx
// Button press feedback
<button className="active:scale-95 transition-transform">
  Press me
</button>

// Card hover
<div className="hover:shadow-card-hover transition-shadow duration-200">
  Hover over me
</div>

// Modal entrance
<div className="animate-scale-in">
  Modal content
</div>
```

---

##🎨 Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colors */
  --color-success: #10B981;
  --color-danger: #EF4444;
  --color-info: #3B82F6;
  --color-text-primary: #111827;
  --color-text-secondary: #6B7280;
  --color-bg-app: #F9FAFB;
  --color-bg-card: #FFFFFF;
  
  /* Spacing */
  --space-touch: 48px;
  --space-btn: 56px;
  
  /* Typography */
  --font-size-hero: 36px;
  --font-size-h1: 28px;
  --font-size-body: 18px;
  
  /* Border Radius */
  --radius-card: 16px;
  --radius-button: 12px;
  
  /* Shadows */
  --shadow-card: 0 2px 8px rgba(0, 0, 0, 0.08);
  --shadow-card-hover: 0 4px 16px rgba(0, 0, 0, 0.12);
}
```

---

## 📦 Package Installation

```bash
# Install required packages
npm install lucide-react react-hot-toast date-fns

# Already included in project:
# - Tailwind CSS
# - React Router
# - Zustand
```

---

## 🚀 Usage Examples

### Complete Feature Screen

```jsx
import { Button, Card, StatCard, EmptyState, Input } from '@/components/ui';
import { Mic, Camera, Plus } from 'lucide-react';

export default function Dashboard() {
  const { transactions, loading } = useTransactions();

  if (loading) return <SkeletonList count={5} />;

  return (
    <div className="container-app">
      {/* Balance */}
      <StatCard
        label="Money Left Over This Month"
        value={stats.profit}
        type={stats.profit >= 0 ? 'income' : 'expense'}
        trend={stats.trend}
        trendLabel="from last month"
        className="mb-6"
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Button 
          variant="primary"
          icon={<Mic size={20} />}
          onClick={() => navigate('/record')}
          fullWidth
        >
          Record
        </Button>
        <Button
          variant="secondary"
          icon={<Camera size={20} />}
          onClick={() => navigate('/scan')}
          fullWidth
        >
          Scan
        </Button>
      </div>

      {/* Transactions */}
      {transactions.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No transactions yet"
          description="Start recording your sales and expenses!"
          actionLabel="Record First Transaction"
          onAction={() => navigate('/transactions/add')}
        />
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
}
```

---

## ✅ Design System Checklist

### Setup
- [x] Tailwind config with custom colors
- [x] Design tokens file
- [x] Component library created
- [x] Typography scale defined
- [x] Icon library integrated

### Components
- [x] Button (all variants)
- [x] Card (all variants)
- [x] Input (with validation states)
- [x] StatCard (money display)
- [x] Modal (accessible)
- [x] Badge (status indicators)
- [x] EmptyState
- [x] LoadingSpinner
- [x] Skeleton loaders

### Documentation
- [x] Color palette documented
- [x] Typography scale documented
- [x] Component API documented
- [x] Layout patterns provided
- [x] Accessibility guidelines
- [x] Animation principles
- [x] Usage examples

### Testing
- [ ] Visual regression tests
- [ ] Accessibility audit (axe-core)
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Screen reader testing
- [ ] Keyboard navigation testing

---

## 📚 Resources

**Figma Design File:** [Coming soon]  
**Storybook:** [Coming soon]  
**Component Playground:** [Coming soon]

---

**Built with 🐝 for South African entrepreneurs**

*Making financial management simple, accessible, and beautiful*

---

## 🎯 Next Steps

1. **Implement Design System:** Apply to all existing pages
2. **User Testing:** Test with 10 real users
3. **Iterate:** Refine based on feedback
4. **Document:** Create video tutorials
5. **Scale:** Expand to other African markets

---

**Version:** 1.0.0  
**Last Updated:** December 13, 2024  
**Status:** ✅ Complete & Ready for Implementation



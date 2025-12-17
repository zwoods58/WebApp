# AI Builder - Missing Routing & Functionality

## 🔍 Analysis Summary

After reviewing the `ai_builder` folder, here are the buttons and features that need routing or functionality:

---

## ❌ Missing Routes (Need to be Created)

### 1. **Checkout Routes** ⚠️ CRITICAL
**Issue**: Checkout API redirects to `/checkout/success` and `/checkout/cancel`, but these routes exist in `ai_builder/app/checkout/` which may not be accessible from the main app.

**Files**:
- `ai_builder/app/checkout/success/page.tsx` ✅ Exists
- `ai_builder/app/checkout/cancel/page.tsx` ✅ Exists
- `ai_builder/app/api/checkout/create/route.ts` ✅ Exists

**Problem**: 
- Checkout API (`/api/checkout/create`) redirects to `/checkout/success` and `/checkout/cancel`
- These routes are in `ai_builder/app/checkout/` but need to be accessible at root level
- OR the checkout API needs to be moved to main app's API routes

**Solution**: 
- Copy checkout pages to `app/checkout/success/page.tsx` and `app/checkout/cancel/page.tsx` in main app
- OR update checkout API to use correct paths
- Copy checkout API to `app/api/checkout/create/route.ts` in main app

---

### 2. **Visual Block Editor Route** ⚠️ IMPORTANT
**Issue**: There's a separate visual block editor in `ai_builder/app/editor/[projectId]/page.tsx` that uses `BlockEditor` component, but it redirects to `/ai-builder/login` which exists.

**Files**:
- `ai_builder/app/editor/[projectId]/page.tsx` ✅ Exists
- `ai_builder/components/editor/BlockEditor.tsx` ✅ Exists

**Status**: 
- Route exists but may not be accessible
- Uses different editor component than main app's editor
- Redirects to `/ai-builder/login` ✅ (route exists)

**Action Needed**: 
- Verify if this route is accessible at `/ai-builder/editor/[projectId]` or if it conflicts with main app's editor
- Main app already has editor at `app/ai-builder/editor/[projectId]/page.tsx` (Monaco editor)
- This is a different visual block editor - decide which one to use or merge

---

### 3. **Dashboard Page** ❌ TODO PLACEHOLDER
**Issue**: Dashboard page is just a placeholder with no functionality.

**File**: `ai_builder/app/(builder)/dashboard/[projectId]/page.tsx`

**Current State**:
```typescript
// TODO: Implement dashboard UI
// 1. Site customization form
// 2. AI generation trigger button
// 3. Preview pane
// 4. Deployment status and controls
```

**Action Needed**: 
- Implement full dashboard functionality OR
- Remove if not needed (main app has dashboard at `app/ai-builder/dashboard/page.tsx`)

---

### 4. **Login Page** ❌ TODO PLACEHOLDER
**Issue**: Login page in ai_builder is just a placeholder.

**File**: `ai_builder/app/(builder)/login/page.tsx`

**Current State**:
```typescript
// TODO: Implement login form with Supabase Auth
```

**Status**: 
- Main app already has login at `app/ai-builder/login/page.tsx` ✅
- This placeholder can be removed or implemented if needed

---

### 5. **Client Site Route** ❌ TODO PLACEHOLDER
**Issue**: Client site rendering page is just a placeholder.

**File**: `ai_builder/app/(client)/[slug]/page.tsx`

**Current State**:
```typescript
// TODO: Implement logic to:
// 1. Resolve client from slug/domain
// 2. Fetch client's Supabase keys
// 3. Initialize client-specific Supabase client
// 4. Fetch and render the client's site content
```

**Action Needed**: 
- Implement client site rendering OR
- Remove if not needed (preview URLs are handled differently)

---

## ✅ Working Routes (No Action Needed)

### 1. **E-Commerce Components** ✅
- `components/ecommerce/Cart.tsx` - Cart component works
- `components/ecommerce/AddToCartButton.tsx` - Add to cart button works
- Both use localStorage and call `/api/checkout/create` ✅

### 2. **Form Submission** ✅
- `app/api/forms/submit/route.ts` - Form API works
- `components/forms/ContactForm.tsx` - Form component works

### 3. **Analytics** ✅
- `lib/analytics/google-analytics.tsx` - Analytics component works
- `components/analytics/AnalyticsProvider.tsx` - Provider works

---

## 🎯 Recommended Actions

### Priority 1: Fix Checkout Routes (CRITICAL)
1. **Copy checkout pages to main app**:
   ```bash
   # Copy from ai_builder to main app
   cp ai_builder/app/checkout/success/page.tsx app/checkout/success/page.tsx
   cp ai_builder/app/checkout/cancel/page.tsx app/checkout/cancel/page.tsx
   ```

2. **Copy checkout API to main app**:
   ```bash
   cp ai_builder/app/api/checkout/create/route.ts app/api/checkout/create/route.ts
   ```

3. **Update checkout API URLs** (if needed):
   - Ensure success/cancel URLs match the routes

### Priority 2: Decide on Editor (IMPORTANT)
- **Option A**: Use main app's Monaco editor (current implementation)
- **Option B**: Use ai_builder's BlockEditor (visual drag-and-drop)
- **Option C**: Merge both editors

### Priority 3: Clean Up Placeholders (LOW)
- Remove or implement placeholder pages:
  - `ai_builder/app/(builder)/dashboard/[projectId]/page.tsx`
  - `ai_builder/app/(builder)/login/page.tsx`
  - `ai_builder/app/(client)/[slug]/page.tsx`

---

## 📋 Summary

| Component | Status | Action Needed |
|-----------|--------|---------------|
| Checkout Success/Cancel | ⚠️ Routes exist but may not be accessible | Copy to main app |
| Checkout API | ⚠️ Exists in ai_builder | Copy to main app API routes |
| Visual Block Editor | ⚠️ Different from main editor | Decide which to use |
| Dashboard Page | ❌ Placeholder | Implement or remove |
| Login Page | ❌ Placeholder | Already exists in main app |
| Client Site Route | ❌ Placeholder | Implement or remove |
| E-Commerce Components | ✅ Working | No action needed |
| Form Submission | ✅ Working | No action needed |
| Analytics | ✅ Working | No action needed |

---

## 🚀 Quick Fixes Needed

1. **Copy checkout routes** to main app
2. **Copy checkout API** to main app
3. **Test checkout flow** end-to-end
4. **Decide on editor** (Monaco vs BlockEditor)
5. **Clean up placeholders** (optional)


# Upgrade & Buyout Implementation Summary

## ✅ Completed

1. **Upgrade Modal Component** (`app/ai-builder/components/UpgradeModal.tsx`)
   - Modal with Pro subscription ($20/month) and Buyout ($150 one-time) options
   - Flutterwave payment integration
   - Context-aware messaging

2. **Flutterwave Payment API Routes**
   - `/api/ai-builder/payments/pro-subscription` - Pro subscription payment
   - `/api/ai-builder/payments/buyout` - Buyout payment

3. **Database Migration** (`Supabase/migrations/20250108000000_add_buyout_fields.sql`)
   - Added `has_buyout`, `buyout_purchased_at`, `buyout_transaction_id` to `draft_projects`

4. **Account Tiers Function** (`src/lib/account-tiers.ts`)
   - Added `hasCodeAccess()` function to check Pro subscription or project buyout

## 🔄 Remaining Tasks

### 1. Update Editor Page (`app/ai-builder/editor/[projectId]/page.tsx`)

**Add state:**
```typescript
const [showUpgradeModal, setShowUpgradeModal] = useState(false)
const [upgradeContext, setUpgradeContext] = useState<'publish' | 'code' | 'terminal' | 'general'>('general')
const [hasCodeAccess, setHasCodeAccess] = useState(false)
```

**Update imports:**
```typescript
import { getCurrentUserAccount, canRegenerateDraft, hasFeatureAccess, hasCodeAccess as checkCodeAccess } from '../../../../src/lib/account-tiers'
```

**In loadProject():**
```typescript
// Check code access (Pro or Buyout)
if (userAccount) {
  const codeAccess = await checkCodeAccess(userAccount.id, projectId)
  setHasCodeAccess(codeAccess)
}
```

**Replace paywall modal with UpgradeModal:**
- Replace all `setShowPaywall()` calls with `setShowUpgradeModal(true)` and set context
- Remove old paywall modal JSX
- Add `<UpgradeModal>` component at end of component

**Update code viewer:**
- Show first 100 lines for FREE tier (if no code access)
- Add blur overlay for remaining code
- Disable copy button for FREE tier
- Show upgrade CTA

### 2. Code Restrictions Implementation

**Helper function:**
```typescript
const getVisibleCode = (code: string, hasAccess: boolean) => {
  if (hasAccess || hasFeatureAccess(account, 'live_deployment')) {
    return code
  }
  const lines = code.split('\n')
  return lines.slice(0, 100).join('\n')
}

const getCodePreview = (code: string, hasAccess: boolean) => {
  if (hasAccess || hasFeatureAccess(account, 'live_deployment')) {
    return null // No blur needed
  }
  const lines = code.split('\n')
  if (lines.length > 100) {
    return lines.slice(100).join('\n') // Remaining code for blur
  }
  return null
}
```

**In code viewer JSX:**
```typescript
{codeContent ? (
  <>
    <pre className="text-xs text-gray-300 bg-[#0a0a0a] p-4 rounded-lg overflow-x-auto">
      <code>{getVisibleCode(codeContent, hasCodeAccess)}</code>
    </pre>
    {getCodePreview(codeContent, hasCodeAccess) && (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] blur-sm" />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-[#0a0a0a]/80 backdrop-blur-sm">
          <p className="text-sm text-gray-400 mb-2">
            🔒 Upgrade to Pro or Buyout to view full code
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setUpgradeContext('code')
                setShowUpgradeModal(true)
              }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={() => {
                setUpgradeContext('code')
                setShowUpgradeModal(true)
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
            >
              Purchase Buyout
            </button>
          </div>
        </div>
      </div>
    )}
  </>
) : (
  <p className="text-sm text-gray-400">No code available</p>
)}
```

**Copy button:**
```typescript
<button
  onClick={() => {
    if (hasCodeAccess || hasFeatureAccess(account, 'live_deployment')) {
      navigator.clipboard.writeText(codeContent)
    } else {
      setUpgradeContext('code')
      setShowUpgradeModal(true)
    }
  }}
  disabled={!hasCodeAccess && !hasFeatureAccess(account, 'live_deployment')}
  className={`w-full px-4 py-2 rounded-lg flex items-center justify-center gap-2 ${
    hasCodeAccess || hasFeatureAccess(account, 'live_deployment')
      ? 'bg-teal-600 text-white hover:bg-teal-700'
      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
  }`}
>
  <Copy className="w-4 h-4" />
  {hasCodeAccess || hasFeatureAccess(account, 'live_deployment') 
    ? 'Copy Code' 
    : 'Upgrade to Copy Code'}
</button>
```

### 3. Update Paywall Triggers

**Publish button:**
```typescript
onClick={() => {
  if (!hasFeatureAccess(account, 'live_deployment')) {
    setUpgradeContext('publish')
    setShowUpgradeModal(true)
  } else {
    setShowSettings(true)
  }
}}
```

**Terminal button:**
```typescript
onClick={() => {
  if (!hasFeatureAccess(account, 'live_deployment')) {
    setUpgradeContext('terminal')
    setShowUpgradeModal(true)
  } else {
    setShowTerminal(!showTerminal)
  }
}}
```

**Code editing:**
```typescript
onClick={() => {
  if (!hasCodeAccess && !hasFeatureAccess(account, 'live_deployment')) {
    setUpgradeContext('code')
    setShowUpgradeModal(true)
  } else {
    // Enable editing
  }
}}
```

### 4. Add UpgradeModal Component

**At end of component (before closing div):**
```typescript
<UpgradeModal
  isOpen={showUpgradeModal}
  onClose={() => setShowUpgradeModal(false)}
  projectId={projectId}
  context={upgradeContext}
/>
```

### 5. Payment Success Page

**Create:** `app/ai-builder/payment/success/page.tsx`
- Handle Flutterwave redirect
- Verify transaction
- Update user account/project
- Show success message

### 6. Flutterwave Webhook Handler

**Update:** `app/api/ai-builder/payments/webhook/route.ts`
- Verify webhook signature
- Process Pro subscription activation
- Process buyout activation
- Update database

## Feature Matrix

| Feature | FREE | Pro | Buyout |
|---------|------|-----|--------|
| Preview | ✅ (14 days) | ✅ Unlimited | ✅ Unlimited |
| Regenerations | 3 total | 10/month | 3 total |
| Code Viewing | ⚠️ Partial (100 lines) | ✅ Full | ✅ Full |
| Code Copying | ❌ | ✅ | ✅ |
| Code Download | ❌ | ✅ | ✅ |
| Code Editing | ❌ | ✅ | ❌ |
| Live Deployment | ❌ | ✅ | ❌ |
| Custom Domains | ❌ | ✅ | ❌ |

## Environment Variables Needed

```env
FLUTTERWAVE_PUBLIC_KEY=your_public_key
FLUTTERWAVE_SECRET_KEY=your_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Next Steps

1. Complete editor page updates (code restrictions, upgrade modal integration)
2. Create payment success page
3. Implement Flutterwave webhook handler
4. Test payment flows
5. Add error handling and loading states


# Post-Deletion Migration Guide
## Updating Components to Use TanStack Query

**Date:** 2026-03-21  
**Status:** ✅ Deletion Complete - 66 files removed  
**Next Step:** Update components to use modern TanStack Query patterns

---

## ✅ Deletion Summary

### Successfully Deleted: 66 Files

**Phase 1: Debug/Test Files (49 files)**
- All test-*.js files (40 files)
- All debug-*.js files (4 files)
- emergency-business-fix.js
- quick-*.js files (2 files)
- fix-auth.js
- diagnose-auth-errors.js

**Phase 2: Documentation (10 files)**
- OFFLINE_TESTING_GUIDE.md
- OFFLINE_SYSTEM_STATUS.md
- OFFLINE_SYSTEM_IMPLEMENTATION.md
- OFFLINE_HOOKS_IMPLEMENTATION_COMPLETE.md
- IMPLEMENTATION_COMPLETE.md
- IMPLEMENTATION_SUMMARY.md
- UNIVERSAL_OFFLINE_IMPLEMENTATION_SUMMARY.md
- current-login-system.md
- temp-auth-guide.md
- test-authentication.md

**Phase 3: Build Artifacts (1 file)**
- tsconfig.tsbuildinfo

**Phase 4: Legacy Offline Components (4 files) ⭐**
- ✅ src\hooks\useNetworkDetection.ts (247 lines)
- ✅ src\components\OfflineErrorBoundary.tsx (336 lines)
- ✅ src\components\OfflineFallback.tsx (256 lines)
- ✅ src\app\components\ServiceWorkerRegistration.tsx (250 lines)

**Phase 6: Directories (2 directories)**
- .next/
- .vercel/

**Total Legacy Code Removed:** 1,089+ lines

---

## 🔍 Components That Need Updates

### Critical: AppLayout.tsx

**Location:** `src/components/global/AppLayout.tsx`

**Current Code (BROKEN):**
```typescript
import { OfflineErrorBoundary } from '@/components/OfflineErrorBoundary'; // ❌ DELETED

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <OfflineErrorBoundary>  {/* ❌ COMPONENT DELETED */}
      <RefreshProvider>
        <ConnectionStatus />
        {children}
      </RefreshProvider>
    </OfflineErrorBoundary>
  );
}
```

**Updated Code (FIX):**
```typescript
'use client';

import React from 'react';
import { RefreshProvider } from '@/contexts/RefreshContext';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { ErrorBoundary } from 'react-error-boundary';

interface AppLayoutProps {
  children: React.ReactNode;
}

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-studio-white">
      <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-diffusion">
        <h2 className="text-xl font-bold text-obsidian mb-4">Something went wrong</h2>
        <p className="text-ghost-gray mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="w-full px-4 py-2 bg-system-blue text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <RefreshProvider>
        <ConnectionStatus />
        {children}
      </RefreshProvider>
    </ErrorBoundary>
  );
}
```

**Required Package:**
```bash
npm install react-error-boundary
```

---

## 🎯 Migration Patterns

### Pattern 1: Replace useNetworkDetection with TanStack Query

**Old Pattern (DELETED):**
```typescript
import { useNetworkDetection } from '@/hooks/useNetworkDetection'; // ❌ DELETED

function MyComponent() {
  const { isOnline, isOffline } = useNetworkDetection();
  
  return (
    <div>
      {isOffline && <p>You are offline</p>}
    </div>
  );
}
```

**New Pattern (USE THIS):**
```typescript
import { useQueryClient, onlineManager } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function MyComponent() {
  const [isOnline, setIsOnline] = useState(true);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Subscribe to TanStack Query's online manager
    const unsubscribe = onlineManager.subscribe(() => {
      setIsOnline(onlineManager.isOnline());
    });
    
    return () => unsubscribe();
  }, []);
  
  return (
    <div>
      {!isOnline && <p>You are offline</p>}
    </div>
  );
}
```

**Or use the existing ConnectionStatus component:**
```typescript
// ConnectionStatus.tsx already handles this!
// Just import and use it
import { ConnectionStatus } from '@/components/ConnectionStatus';

function MyComponent() {
  return (
    <div>
      <ConnectionStatus />
      {/* Your content */}
    </div>
  );
}
```

---

### Pattern 2: Offline Mutations with TanStack Query

**Old Pattern (DELETED):**
```typescript
// Manual offline queue in ServiceWorkerRegistration
window.beezeeOfflineManager.addToQueue(action); // ❌ DELETED
```

**New Pattern (USE THIS):**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function MyComponent() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/endpoint', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },
    // TanStack Query automatically queues this when offline
    // and retries when connection is restored
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myData'] });
    },
  });
  
  return (
    <button onClick={() => mutation.mutate({ foo: 'bar' })}>
      Save {mutation.isPaused && '(Queued)'}
    </button>
  );
}
```

---

### Pattern 3: Connection Status Checking

**Old Pattern (DELETED):**
```typescript
import { useNetworkDetection } from '@/hooks/useNetworkDetection'; // ❌ DELETED

const { connectionType, effectiveType } = useNetworkDetection();
```

**New Pattern (USE THIS):**
```typescript
import { getConnectionStatus } from '@/lib/connection-manager';

// For real connectivity (not just navigator.onLine)
const isOnline = getConnectionStatus();

// Or use onlineManager directly
import { onlineManager } from '@tanstack/react-query';
const isOnline = onlineManager.isOnline();
```

---

## 📦 Required Dependencies (Already Installed)

All required packages are already in package.json:

```json
{
  "@tanstack/react-query": "^5.91.2",
  "@tanstack/react-query-persist-client": "^5.90.27",
  "@tanstack/query-sync-storage-persister": "^5.90.27"
}
```

**Additional package needed:**
```bash
npm install react-error-boundary
```

---

## 🔧 Files to Update

### 1. AppLayout.tsx (CRITICAL - BROKEN)
**Location:** `src/components/global/AppLayout.tsx`  
**Issue:** Imports deleted OfflineErrorBoundary  
**Fix:** Replace with react-error-boundary (see above)

### 2. Search for remaining imports
Run this command to find any other files importing deleted components:

```bash
# Search for useNetworkDetection imports
grep -r "useNetworkDetection" src/

# Search for OfflineErrorBoundary imports
grep -r "OfflineErrorBoundary" src/

# Search for OfflineFallback imports
grep -r "OfflineFallback" src/

# Search for ServiceWorkerRegistration imports
grep -r "ServiceWorkerRegistration" src/
```

---

## ✅ What's Already Modern (Keep Using)

### ConnectionStatus.tsx ✅
**Location:** `src/components/ConnectionStatus.tsx`  
**Status:** Modern implementation using TanStack Query  
**Usage:** Already integrated in AppLayout

```typescript
// This component is perfect - keep using it!
import { ConnectionStatus } from '@/components/ConnectionStatus';
```

### connection-manager.ts ✅
**Location:** `src/lib/connection-manager.ts`  
**Status:** Modern implementation with real connectivity testing  
**Usage:** Use for actual internet connectivity checks

```typescript
import { getConnectionStatus, initConnectionMonitoring } from '@/lib/connection-manager';

// Initialize once in your app
initConnectionMonitoring();

// Check status anywhere
const isOnline = getConnectionStatus();
```

### persistentStorage.ts ✅
**Location:** `src/utils/persistentStorage.ts`  
**Status:** Kept and ready for migration  
**Next Step:** Integrate with TanStack Query persistence

---

## 🚀 Next Steps

### Immediate (Required)
1. **Fix AppLayout.tsx** - Replace OfflineErrorBoundary
2. **Install react-error-boundary** - `npm install react-error-boundary`
3. **Test application** - `npm run dev`
4. **Check for broken imports** - Run grep commands above

### Short Term (Recommended)
5. **Integrate persistentStorage with TanStack Query**
   ```typescript
   import { persistQueryClient } from '@tanstack/react-query-persist-client';
   import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
   import { persistentStorage } from '@/utils/persistentStorage';
   
   const persister = createSyncStoragePersister({
     storage: {
       getItem: (key) => persistentStorage.get(key),
       setItem: (key, value) => persistentStorage.set(key, value),
       removeItem: (key) => persistentStorage.remove(key),
     },
   });
   
   persistQueryClient({
     queryClient,
     persister,
     maxAge: 1000 * 60 * 60 * 24, // 24 hours
   });
   ```

6. **Update service worker** (if needed)
   - Remove custom offline queue logic
   - Keep basic SW registration
   - Let TanStack Query handle offline mutations

### Long Term (Optional)
7. **Add IndexedDB support** to persistentStorage
8. **Implement optimistic UI** patterns with TanStack Query
9. **Add offline indicators** using ConnectionStatus
10. **Document new patterns** for team

---

## 🧪 Testing Checklist

After migration:

- [ ] Application builds successfully: `npm run build`
- [ ] No TypeScript errors: `npm run lint`
- [ ] App runs in dev mode: `npm run dev`
- [ ] Test offline functionality:
  - [ ] Go offline (DevTools > Network > Offline)
  - [ ] Make a mutation
  - [ ] See "Queued" indicator
  - [ ] Go online
  - [ ] Mutation auto-retries
- [ ] Error boundary works:
  - [ ] Trigger an error
  - [ ] See error fallback UI
  - [ ] Click "Try again"
  - [ ] App recovers
- [ ] Connection status displays correctly
- [ ] Offline badge appears when offline
- [ ] Pending mutations counter works

---

## 📝 Summary

**Deleted:** 66 files, 1,089+ lines of legacy code  
**Kept:** ConnectionStatus.tsx, connection-manager.ts, persistentStorage.ts  
**Modern Stack:** TanStack Query + react-error-boundary  
**Critical Fix:** Update AppLayout.tsx to use ErrorBoundary  
**Result:** Cleaner, more maintainable offline-first architecture

---

**End of Migration Guide**

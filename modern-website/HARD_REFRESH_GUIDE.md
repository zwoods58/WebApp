# Hard Refresh Pull-to-Refresh Guide

## Overview

Your BeeZee Finance app now supports **two levels of pull-to-refresh**:

1. **Normal Refresh** (Quick pull) - Refreshes data and syncs pending operations
2. **Hard Refresh** (2+ second hold) - Clears all caches and resets the app

## How It Works

### **Normal Refresh** (Default Behavior)
- **Gesture**: Pull down and release quickly
- **Threshold**: 120px pull distance
- **Visual**: Blue refresh indicator
- **Action**: 
  - Sync pending operations
  - Refetch all data from server
  - Update UI with latest data

### **Hard Refresh** (New Feature)
- **Gesture**: Pull down and **hold for 2+ seconds**
- **Threshold**: 2 second hold time
- **Visual**: Red indicator with progress bar
- **Action**:
  - Clear all pending operations
  - Clear browser cache
  - Clear localStorage (except auth)
  - Force sync remaining data
  - Reload the entire page

## Visual Indicators

### **Normal Refresh**
```
🔄 Pull to refresh
↓
🔄 Release to refresh
↓
🔄 Refreshing...
```

### **Hard Refresh**
```
🔄 Pull to refresh
↓
🔄 Hold for hard refresh [████████░░] 80%
↓
🔄 Hard refreshing...
```

## Usage Examples

### **Basic Usage**
```tsx
import GlobalPullToRefresh from '@/components/global/GlobalPullToRefresh';

function MyApp() {
  return (
    <GlobalPullToRefresh>
      <YourAppContent />
    </GlobalPullToRefresh>
  );
}
```

### **With Custom Handlers**
```tsx
function MyApp() {
  const handleNormalRefresh = async () => {
    console.log('Normal refresh triggered');
    // Custom refresh logic
  };

  const handleHardRefresh = async () => {
    console.log('Hard refresh triggered');
    // Custom hard refresh logic
  };

  return (
    <GlobalPullToRefresh
      onRefresh={handleNormalRefresh}
      onHardRefresh={handleHardRefresh}
      hardRefreshThreshold={3000} // 3 seconds instead of 2
      translations={{
        pullToRefresh: 'Pull to refresh',
        releaseToRefresh: 'Release to refresh',
        refreshing: 'Refreshing...',
        refreshingApp: 'Refreshing app...',
        hardRefresh: 'Hold for hard refresh',
        hardRefreshing: 'Hard refreshing...'
      }}
    >
      <YourAppContent />
    </GlobalPullToRefresh>
  );
}
```

## What Hard Refresh Does

### **1. Clears Pending Operations**
```javascript
clearPending(); // Removes all queued offline operations
```

### **2. Clears Browser Cache**
```javascript
const cacheNames = await caches.keys();
await Promise.all(cacheNames.map(name => caches.delete(name)));
```

### **3. Clears Local Storage**
```javascript
const keysToKeep = ['beezee_business_auth', 'sessionData'];
// Removes everything except authentication data
```

### **4. Forces Data Sync**
```javascript
await forceSync(); // Sync any remaining data
```

### **5. Dispatches Hard Refresh Event**
```javascript
window.dispatchEvent(new CustomEvent('hard-refresh-data'));
```

### **6. Reloads Page**
```javascript
window.location.reload(); // Fresh start
```

## When to Use Each

### **Use Normal Refresh For:**
- Daily routine data updates
- Checking for new transactions
- Syncing recent changes
- Quick data refresh

### **Use Hard Refresh For:**
- App feels slow or sluggish
- Data seems corrupted or wrong
- After major app updates
- Troubleshooting sync issues
- Starting completely fresh

## Component Props

```typescript
interface GlobalPullToRefreshProps {
  children: React.ReactNode;
  onRefresh?: () => Promise<void> | void;
  onHardRefresh?: () => Promise<void> | void;
  threshold?: number; // Pull distance threshold (default: 120px)
  hardRefreshThreshold?: number; // Hold time threshold (default: 2000ms)
  translations?: {
    pullToRefresh?: string;
    releaseToRefresh?: string;
    refreshing?: string;
    refreshingApp?: string;
    hardRefresh?: string;
    hardRefreshing?: string;
  };
}
```

## Event Listeners

Your components can listen for refresh events:

```tsx
useEffect(() => {
  // Listen for normal refresh
  const handleForceRefresh = () => {
    console.log('Data refreshed');
    refetchData();
  };

  // Listen for hard refresh
  const handleHardRefresh = () => {
    console.log('Hard refresh - clearing local state');
    clearLocalState();
  };

  window.addEventListener('force-refresh-data', handleForceRefresh);
  window.addEventListener('hard-refresh-data', handleHardRefresh);

  return () => {
    window.removeEventListener('force-refresh-data', handleForceRefresh);
    window.removeEventListener('hard-refresh-data', handleHardRefresh);
  };
}, []);
```

## Customization Options

### **Change Hard Refresh Duration**
```tsx
<GlobalPullToRefresh 
  hardRefreshThreshold={5000} // 5 seconds
>
  {/* ... */}
</GlobalPullToRefresh>
```

### **Disable Hard Refresh**
```tsx
<GlobalPullToRefresh 
  onHardRefresh={undefined} // No hard refresh handler
>
  {/* ... */}
</GlobalPullToRefresh>
```

### **Custom Translations**
```tsx
<GlobalPullToRefresh 
  translations={{
    hardRefresh: 'Hold to reset app',
    hardRefreshing: 'Resetting app...'
  }}
>
  {/* ... */}
</GlobalPullToRefresh>
```

## Troubleshooting

### **Hard Refresh Not Working**
1. Check if `onHardRefresh` prop is provided
2. Ensure you're holding for full 2 seconds
3. Check console for errors
4. Verify you're at the top of the page

### **Visual Issues**
1. Check z-index conflicts with other fixed elements
2. Ensure container has proper height
3. Verify CSS transitions are working

### **Performance Issues**
1. Hard refresh clears cache - first load will be slower
2. Subsequent loads should be normal
3. Consider reducing hard refresh frequency

## Best Practices

### **For Users**
- Use normal refresh for routine updates
- Use hard refresh only when needed
- Hard refresh will lose unsynced data

### **For Developers**
- Provide clear visual feedback
- Handle both refresh events in components
- Preserve important data during hard refresh
- Add loading states for better UX

### **For Support**
- Educate users on difference between refresh types
- Document when to use hard refresh
- Provide fallback if hard refresh fails

## Migration from Old Version

If you're upgrading from the old pull-to-refresh:

### **Before**
```tsx
<GlobalPullToRefresh onRefresh={handleRefresh}>
  {/* ... */}
</GlobalPullToRefresh>
```

### **After**
```tsx
<GlobalPullToRefresh 
  onRefresh={handleRefresh}
  onHardRefresh={handleHardRefresh} // New!
  hardRefreshThreshold={2000} // New!
  translations={{
    // ... existing translations
    hardRefresh: 'Hold for hard refresh', // New!
    hardRefreshing: 'Hard refreshing...' // New!
  }}
>
  {/* ... */}
</GlobalPullToRefresh>
```

## Security Considerations

Hard refresh clears sensitive data from cache but preserves:
- User authentication (`beezee_business_auth`)
- Session data (`sessionData`)

All other localStorage data is cleared for security and privacy.

## Conclusion

The enhanced pull-to-refresh provides users with:
- ✅ **Quick refresh** for routine updates
- ✅ **Hard refresh** for troubleshooting
- ✅ **Clear visual feedback** for both modes
- ✅ **Smooth animations** and progress indicators
- ✅ **Customizable behavior** and translations

This gives users control over their app experience while maintaining data integrity and performance.

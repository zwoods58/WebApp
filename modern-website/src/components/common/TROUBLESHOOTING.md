# Pull to Refresh Troubleshooting Guide

## Issue: Pull to refresh didn't work

### Common Problems and Solutions

### 1. **Touch Events Not Working**
**Problem**: Touch events are not being captured properly.

**Solutions**:
- Test on a mobile device or enable touch simulation in browser dev tools
- Check if `touch-action: none` is properly set
- Ensure the container has the correct ref attached

**Debug Steps**:
```tsx
// Add this to your component to test touch events
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log('Touch event:', e.type);
  container.addEventListener('touchstart', handleTouch);
  return () => container.removeEventListener('touchstart', handleTouch);
}, []);
```

### 2. **Scroll Position Issues**
**Problem**: Pull-to-refresh only works when at the top of the container.

**Solutions**:
- Ensure `container.scrollTop === 0` when starting pull
- Check if parent containers are interfering with scroll
- Set `overflow-y: auto` on the container

### 3. **Missing onRefresh Prop**
**Problem**: The `onRefresh` function is not provided or not working.

**Solutions**:
```tsx
// ✅ Correct usage
<BuzzInsights 
  onRefresh={async () => {
    console.log('Refreshing...');
    // Your refresh logic here
    await fetchData();
  }}
  // ... other props
/>

// ❌ Missing onRefresh
<BuzzInsights /> // Won't work without onRefresh
```

### 4. **Container Height Issues**
**Problem**: Container doesn't have proper height constraints.

**Solutions**:
```tsx
// Add explicit height
<SimplePullToRefresh className="h-[500px]">
  <Content />
</SimplePullToRefresh>
```

### 5. **Event Conflicts**
**Problem**: Other touch handlers are interfering.

**Solutions**:
- Check for global touch event listeners
- Ensure `passive: false` is set on touch events
- Remove conflicting gesture libraries

## Testing Steps

### Step 1: Use Debug Version
Visit `/test-debug-refresh` to see detailed touch event information.

### Step 2: Check Console
```javascript
// Open browser console and look for:
// - Touch event logs
// - Error messages
// - Network requests during refresh
```

### Step 3: Test Manual Refresh
Click the refresh button in the BuzzInsights header to verify the `onRefresh` function works.

### Step 4: Test on Different Devices
- **Desktop**: Use Chrome DevTools → Device Toolbar → Enable touch simulation
- **Mobile**: Test on actual mobile device
- **Tablet**: Test on iPad/Android tablet

## Quick Fix Checklist

### ✅ Verify These Items:

1. **Import Correctly**:
   ```tsx
   import SimplePullToRefresh from '@/components/common/SimplePullToRefresh';
   ```

2. **Pass onRefresh Prop**:
   ```tsx
   <BuzzInsights onRefresh={handleRefresh} />
   ```

3. **Test Environment**:
   - [ ] Mobile device or touch simulation enabled
   - [ ] No JavaScript errors in console
   - [ ] Component renders without errors

4. **Container Setup**:
   - [ ] Container has ref attached
   - [ ] Container has proper height/overflow
   - [ ] Container is at scroll top when pulling

## Alternative Solutions

If pull-to-refresh still doesn't work, try these alternatives:

### 1. Manual Refresh Button
Already implemented in BuzzInsights - click the refresh icon in the header.

### 2. Swipe Detection
```tsx
const [touchStart, setTouchStart] = useState(0);
const [touchEnd, setTouchEnd] = useState(0);

const minSwipeDistance = 50;

const onTouchStart = (e: TouchEvent) => {
  setTouchEnd(0);
  setTouchStart(e.targetTouches[0].clientY);
};

const onTouchMove = (e: TouchEvent) => {
  setTouchEnd(e.targetTouches[0].clientY);
};

const onTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  
  const distance = touchStart - touchEnd;
  const isDownSwipe = distance < -minSwipeDistance;
  
  if (isDownSwipe) {
    handleRefresh();
  }
};
```

### 3. Interval-based Auto Refresh
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      handleRefresh();
    }
  }, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval);
}, []);
```

## Browser Compatibility

### ✅ Supported:
- Chrome 60+
- Safari 12+
- Firefox 55+
- Edge 79+

### ⚠️ Issues:
- Older browsers may need polyfills
- Some desktop browsers don't support touch events well
- iOS Safari has specific touch event behaviors

## Performance Tips

1. **Debounce Touch Events**: Already implemented with 100ms debounce
2. **Optimize Refresh Logic**: Keep refresh operations under 2 seconds
3. **Loading States**: Show loading indicators during refresh
4. **Error Handling**: Handle refresh failures gracefully

## Next Steps

1. **Test Debug Version**: Visit `/test-debug-refresh`
2. **Check Console**: Look for error messages
3. **Verify Props**: Ensure `onRefresh` is passed correctly
4. **Test Touch**: Use mobile device or touch simulation
5. **Report Issues**: Note specific browser/device combinations

If issues persist, please provide:
- Browser version and device
- Console error messages
- Specific behavior (what happens when you pull)
- Whether the manual refresh button works

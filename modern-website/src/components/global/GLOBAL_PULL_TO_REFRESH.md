# Global Pull-to-Refresh System

A comprehensive pull-to-refresh implementation that works across the entire application from any page.

## Overview

The global pull-to-refresh system allows users to pull down from the top of any page to refresh the entire application, including:
- Page data refresh
- Cache clearing
- Global state updates
- Custom refresh logic

## Architecture

### Components
- **GlobalPullToRefresh** - Main pull-to-refresh component
- **AppLayout** - Layout wrapper that applies global refresh
- **useGlobalRefresh** - Hook for refresh logic
- **BodyWrapper** - Integration point for the entire app

### Integration Points
- Root layout (`/src/app/layout.tsx`)
- Beezee-App layout (`/src/app/Beezee-App/layout.tsx`)
- Any future layouts can easily integrate

## Features

### 🔄 **Full App Refresh**
```typescript
// Refreshes Next.js page data
router.refresh();

// Clears browser caches
await caches.keys().then(cacheNames => 
  Promise.all(cacheNames.map(name => caches.delete(name)))
);

// Triggers custom refresh events
window.dispatchEvent(new CustomEvent('globalDataRefresh'));
```

### 📱 **Mobile Optimized**
- Touch gesture detection
- Smooth animations
- Visual feedback indicators
- Works from any page

### ⚡ **Performance Optimized**
- Single database query for layout integration
- Efficient touch event handling
- Debounced refresh operations
- Cache management

## Usage

### Automatic Integration
The global pull-to-refresh is automatically integrated into:
- All pages under `/app/`
- All pages under `/app/Beezee-App/`

### Manual Integration
For custom layouts:

```tsx
import AppLayout from '@/components/global/AppLayout';

function CustomLayout({ children }) {
  const handleRefresh = async () => {
    // Custom refresh logic
  };

  return (
    <AppLayout onRefresh={handleRefresh}>
      {children}
    </AppLayout>
  );
}
```

### Using the Hook
```tsx
import { useGlobalRefresh } from '@/hooks/useGlobalRefresh';

function MyComponent() {
  const { performGlobalRefresh, performSoftRefresh, performHardRefresh } = useGlobalRefresh();

  const handleRefresh = async () => {
    await performGlobalRefresh({
      clearCache: true,
      refetchData: true,
      showNotification: true
    });
  };

  return (
    <button onClick={handleRefresh}>
      Refresh App
    </button>
  );
}
```

## Configuration

### GlobalPullToRefresh Props
```tsx
<GlobalPullToRefresh
  onRefresh={() => Promise<void>}     // Refresh function
  threshold={120}                    // Pull distance in pixels
>
  {children}
</GlobalPullToRefresh>
```

### useGlobalRefresh Options
```tsx
await performGlobalRefresh({
  clearCache: true,      // Clear browser caches
  refetchData: true,     // Refresh Next.js data
  showNotification: true // Show success/error messages
});
```

## Visual Feedback

### Pull Indicator
- Appears when user pulls down
- Shows progress toward threshold
- Changes color when ready to refresh
- Smooth animations

### Loading Overlay
- Full-screen overlay during refresh
- Spinning refresh icon
- "Refreshing app..." message
- Backdrop blur effect

## Events

### Global Refresh Event
```typescript
// Listen for global refresh
window.addEventListener('globalDataRefresh', (event) => {
  console.log('App refreshed:', event.detail);
  // Update component state
});
```

### Soft Refresh Event
```typescript
// Listen for soft refresh (no cache clear)
window.addEventListener('softDataRefresh', (event) => {
  console.log('Soft refresh:', event.detail);
  // Update specific data
});
```

## Testing

### Test Page
Visit `/test-global-refresh` to test the functionality:
- Visual refresh counter
- Last refresh timestamp
- Step-by-step instructions
- Mobile testing guide

### Manual Testing
1. Open any page in the app
2. Scroll to the very top
3. Pull down on the page
4. Release when "Release to refresh" appears
5. Verify the page refreshes

### Browser Testing
- **Chrome DevTools**: Enable device simulation
- **Safari**: Test on iOS devices
- **Android**: Test on actual devices
- **Desktop**: Limited touch support

## Troubleshooting

### Common Issues

#### Pull Not Working
- **Cause**: Not at top of page
- **Fix**: Scroll to top (scrollY === 0)
- **Check**: Console for touch event errors

#### No Visual Feedback
- **Cause**: CSS z-index conflicts
- **Fix**: Check overlay positioning
- **Check**: Tailwind classes applied

#### Refresh Not Triggering
- **Cause**: Threshold not met
- **Fix**: Pull further down (default 120px)
- **Check**: Touch event listeners active

#### Cache Not Clearing
- **Cause**: Browser restrictions
- **Fix**: Check cache API availability
- **Check**: Service worker interference

### Debug Mode
Add console logging to debug:
```typescript
// In GlobalPullToRefresh component
console.log('Pull distance:', pullDistance);
console.log('Is pulling:', isPulling);
console.log('Threshold met:', pullDistance >= threshold);
```

## Performance Considerations

### Touch Events
- Debounced to 100ms
- Passive event listeners where possible
- Efficient state management

### Cache Management
- Selective cache clearing
- Error handling for cache failures
- Fallback for unsupported browsers

### Memory Usage
- Event listener cleanup
- State reset on unmount
- Minimal re-renders

## Browser Compatibility

### ✅ Supported
- Chrome 60+
- Safari 12+
- Firefox 55+
- Edge 79+

### ⚠️ Limited Support
- Desktop browsers (touch simulation required)
- Older browsers (polyfills needed)

### ❌ Not Supported
- IE 11 and below

## Best Practices

### For Developers
1. **Test on real devices** - Touch simulation isn't perfect
2. **Handle refresh events** - Update component state
3. **Optimize refresh logic** - Keep operations fast
4. **Provide feedback** - Show loading states
5. **Handle errors** - Graceful fallbacks

### For Users
1. **Pull from top** - Only works when scrolled to top
2. **Pull far enough** - Meet the threshold distance
3. **Wait for completion** - Don't navigate during refresh
4. **Check connectivity** - Requires network for data refresh

## Future Enhancements

### Planned Features
- [ ] Custom refresh thresholds per page
- [ ] Refresh progress indicators
- [ ] Offline refresh handling
- [ ] Refresh history tracking
- [ ] Gesture customization

### Potential Improvements
- [ ] Webhook integration
- [ ] Analytics tracking
- [ ] A/B testing support
- [ ] Accessibility improvements
- [ ] Performance monitoring

## Support

For issues or questions:
1. Check the troubleshooting section
2. Test on the `/test-global-refresh` page
3. Review browser console for errors
4. Verify touch device compatibility

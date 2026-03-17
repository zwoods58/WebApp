# Pull to Refresh Component

A reusable pull-to-refresh component for React applications that provides smooth touch gestures for refreshing content.

## Features

- 🔄 Touch-based pull to refresh gesture
- 📱 Mobile-optimized with smooth animations
- ⚡ Customizable threshold and debounce settings
- 🎨 Visual feedback with loading states
- 🚀 Lightweight and performant
- ♿ Accessible with proper ARIA labels

## Usage

### Basic Usage

```tsx
import PullToRefresh from '@/components/common/PullToRefresh';

function MyComponent() {
  const handleRefresh = async () => {
    // Refresh your data here
    await fetchNewData();
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div>
        {/* Your content here */}
      </div>
    </PullToRefresh>
  );
}
```

### Advanced Usage

```tsx
<PullToRefresh 
  onRefresh={handleRefresh}
  threshold={100}              // Pull distance in pixels (default: 80)
  disabled={false}             // Disable pull-to-refresh (default: false)
  pullIndicatorHeight={60}    // Height of pull indicator (default: 60)
  className="h-screen"         // CSS classes for container
>
  <YourContent />
</PullToRefresh>
```

### Using with BuzzInsights

```tsx
<BuzzInsights 
  country="US"
  industry="retail"
  lowStockItems={lowStock}
  overdueCredit={creditData}
  onRefresh={async () => {
    // Refresh insights data
    const newData = await fetchInsightsData();
    updateInsights(newData);
  }}
/>
```

## Hook Usage

For more control, you can use the underlying hook directly:

```tsx
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

function CustomPullToRefresh() {
  const {
    containerRef,
    isPulling,
    isRefreshing,
    pullDistance,
    shouldRefresh,
    resetState
  } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80
  });

  return (
    <div ref={containerRef}>
      {/* Custom implementation */}
    </div>
  );
}
```

## Props

### PullToRefresh Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onRefresh` | `() => Promise<void> \| void` | Required | Function called when refresh is triggered |
| `children` | `React.ReactNode` | Required | Content to be wrapped |
| `className` | `string` | `""` | Additional CSS classes |
| `threshold` | `number` | `80` | Pull distance in pixels to trigger refresh |
| `disabled` | `boolean` | `false` | Disable pull-to-refresh functionality |
| `pullIndicatorHeight` | `number` | `60` | Height of the pull indicator |

### usePullToRefresh Hook

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `onRefresh` | `() => Promise<void> \| void` | Required | Function called when refresh is triggered |
| `threshold` | `number` | `80` | Pull distance in pixels to trigger refresh |
| `debounceMs` | `number` | `100` | Debounce delay for touch events |
| `disabled` | `boolean` | `false` | Disable pull-to-refresh functionality |

## Return Values (Hook)

| Property | Type | Description |
|----------|------|-------------|
| `containerRef` | `RefObject<HTMLDivElement>` | Ref for the container element |
| `isPulling` | `boolean` | Whether user is currently pulling |
| `isRefreshing` | `boolean` | Whether refresh is in progress |
| `pullDistance` | `number` | Current pull distance in pixels |
| `shouldRefresh` | `boolean` | Whether threshold has been reached |
| `resetState` | `() => void` | Function to reset the state |

## Styling

The component uses Tailwind CSS classes and can be customized through:

1. **Container styling**: Use the `className` prop
2. **Indicator styling**: Modify the component directly or use the hook
3. **Animation**: Uses Framer Motion for smooth transitions

## Accessibility

- Touch gestures work with screen readers
- Loading states are announced
- Proper ARIA labels on interactive elements
- Keyboard navigation fallback support

## Browser Support

- ✅ Modern browsers with touch support
- ✅ iOS Safari
- ✅ Chrome for Android
- ✅ Samsung Internet
- ⚠️ Desktop browsers (touch events simulated)

## Examples

### List Refresh
```tsx
<PullToRefresh onRefresh={refreshList}>
  <div className="space-y-2">
    {items.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
</PullToRefresh>
```

### Dashboard Refresh
```tsx
<PullToRefresh onRefresh={refreshDashboard}>
  <div className="grid grid-cols-2 gap-4">
    <StatCard title="Revenue" value="$1,234" />
    <StatCard title="Users" value="456" />
  </div>
</PullToRefresh>
```

### Custom Threshold
```tsx
<PullToRefresh 
  onRefresh={refreshData}
  threshold={120}  // Requires more pull distance
  pullIndicatorHeight={80}
>
  <Content />
</PullToRefresh>
```

## Tips

1. **Performance**: Use debouncing for expensive refresh operations
2. **UX**: Provide visual feedback during refresh
3. **Mobile**: Test on actual devices for best touch experience
4. **Accessibility**: Always provide alternative refresh methods
5. **Error Handling**: Handle refresh failures gracefully

## Troubleshooting

### Pull not working
- Ensure container has `touch-action: none` style
- Check if `disabled` prop is not set to `true`
- Verify touch events are not being intercepted

### Visual issues
- Check z-index of pull indicator
- Ensure container has proper height/overflow settings
- Verify Tailwind CSS is properly loaded

### Performance issues
- Increase `debounceMs` for complex components
- Use `disabled` prop during heavy operations
- Optimize refresh callback function

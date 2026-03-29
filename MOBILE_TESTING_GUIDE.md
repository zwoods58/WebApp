# Mobile Testing Setup Guide

## Quick Start

Your BeeZee Finance application is now ready for mobile testing!

### Current Setup Status
- ✅ **Development Server**: Running on http://localhost:3000
- ✅ **Ngrok Tunnel**: Active at https://jonathon-precognizable-contestably.ngrok-free.dev
- ✅ **Mobile Ready**: Use the ngrok URL on your phone

## How to Test on Your Phone

1. **Open your phone's browser**
2. **Navigate to**: https://jonathon-precognizable-contestably.ngrok-free.dev
3. **Test all features**:
   - Login/Registration with PIN authentication
   - Dashboard and navigation
   - Responsive design on different screen sizes
   - Touch interactions and gestures
   - Offline functionality
   - Real-time updates

## What to Test

### Service Worker & Offline Functionality
- **Service Worker Registration**: Visit `https://your-ngrok-url.ngrok.io/sw-test.html` to test SW status
- **Offline Mode**: Turn off WiFi/mobile data and try accessing the app
- **Cache Behavior**: Navigate between pages, then go offline and try again
- **Background Sync**: Add transactions offline, then reconnect to see if they sync

### Authentication Flow
- Phone number registration
- PIN setup and verification
- Session persistence
- Logout functionality

### Core Features
- Dashboard loading and data display
- Transaction management
- Budget tracking
- Notifications
- Settings and preferences

### Mobile-Specific Testing
- Portrait vs landscape orientation
- Touch targets (minimum 44px)
- Swipe gestures
- Mobile keyboard behavior
- Browser compatibility (Safari, Chrome, etc.)

## Troubleshooting

### If ngrok URL doesn't work:
1. Check that both development server and ngrok are running
2. Look for any error messages in the terminals
3. Try restarting ngrok: `taskkill /F /IM ngrok.exe` then `ngrok http 3000`

### If development server stops:
1. Run `npm run dev` in the project directory
2. Wait for it to fully start (look for "Ready" message)
3. Restart ngrok if port changes

### Service Worker Issues:
- **Service Worker Inactive**: Check browser console for registration errors
- **HTTPS Required**: Service workers require HTTPS (ngrok provides this)
- **Scope Issues**: Service worker must be registered from root scope
- **Cache Problems**: Use `https://your-ngrok-url.ngrok.io/sw-test.html` to debug

## Future Setup

For next time, you can use the provided scripts:
- `setup-mobile-testing.bat`: Automated setup script
- `ngrok-url.txt`: Contains current ngrok URL
- Check this guide for updated URLs and status

## Notes

- The ngrok URL changes each time you restart ngrok (free tier limitation)
- Consider upgrading to ngrok paid plan for persistent URLs
- Ensure your phone and development machine are on the same network if experiencing connectivity issues
- Some mobile browsers may have different security policies than desktop browsers

## Support

If you encounter issues:
1. Check the terminal outputs for error messages
2. Verify both services are running (dev server + ngrok)
3. Try accessing http://localhost:3000 on your development machine first
4. Test with a different mobile browser if available

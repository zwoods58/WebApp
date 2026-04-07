# Translation Testing Instructions

## What to Test

### 1. Open the Appointments Page
Navigate to: `http://localhost:3000/Beezee-App/app/ke/freelance/appointments`

### 2. Check the Debug Panel
You should see a blue debug panel in the top-left corner showing:
- Current Language
- Test Translation for appointments.title
- Test Translation for nav.home

### 3. Check Browser Console
Open browser dev tools (F12) and check the console for debug messages.

### 4. Test Language Switching
1. Click the language selector in the bottom navigation
2. Switch from English to Swahili (or any other language)
3. Watch the debug panel and console for changes

### 5. Expected Debug Output

#### Initial Load:
```
Industry Context Debug: { pathname: "/Beezee-App/app/ke/freelance/appointments", pathMatch: [...] }
Extracted: { country: "ke", industry: "freelance" }
Industry Context Updated: { country: "ke", industry: "freelance" }
Translation Debug: { key: "appointments.title", language: "en", industry: "freelance", defaultText: "Appointments" }
Smart Translate Input: { key: "appointments.title", language: "en", industry: "freelance", defaultText: "Appointments" }
Translation Source: "universal (appointments priority)"
Translation Found: true
Available Languages: ["en", "sw", "ha", "yo", ...]
Selected Language: "en" "Available?" true
Final Result: "Appointments"
```

#### After Language Switch (to Swahili):
```
Translation Debug: { key: "appointments.title", language: "sw", industry: "freelance", defaultText: "Appointments" }
Smart Translate Input: { key: "appointments.title", language: "sw", industry: "freelance", defaultText: "Appointments" }
Translation Source: "universal (appointments priority)"
Translation Found: true
Available Languages: ["en", "sw", "ha", "yo", ...]
Selected Language: "sw" "Available?" true
Final Result: "Miadi"
```

## What This Tells Us

### If Debug Shows:
- **Industry: "freelance"** - Industry context is working correctly
- **Translation Source: "universal (appointments priority)"** - Translation logic is working
- **Final Result: "Miadi"** - Translation is working correctly
- **But page still shows English** - Component re-rendering issue

### If Debug Shows:
- **Industry: "retail"** or **undefined** - Industry context issue
- **Translation Source: "none"** - Translation logic issue
- **Final Result: "Appointments"** (fallback) - Translation not found

## Next Steps Based on Results

### Case 1: Translation Works But Page Doesn't Update
- Issue: Component re-rendering problem
- Fix: Check if components are properly wrapped in context providers

### Case 2: Industry Context Wrong
- Issue: Industry not extracted correctly from URL
- Fix: IndustryContext pathname matching issue

### Case 3: Translation Logic Fails
- Issue: Smart translation function not finding universal translations
- Fix: Translation loading or resolution issue

## How to Share Results

1. Take screenshots of:
   - The debug panel before and after language switch
   - The browser console debug messages
   - The appointments page showing English vs expected translation

2. Copy console output and share the debug messages

This will help identify exactly where the translation pipeline is failing.

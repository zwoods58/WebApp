# ♿ Accessibility Testing Checklist

## BeeZee PWA - WCAG AAA Compliance

---

## 🎯 Target Compliance Level

**WCAG 2.1 Level AAA** for:
- Color contrast (7:1 ratio)
- Touch target sizes (48px minimum)
- Text sizes (18px minimum for body)
- Screen reader support
- Keyboard navigation

---

## ✅ Pre-Launch Accessibility Audit

### 1. Color Contrast (WCAG 2.1 AAA - 7:1 ratio)

#### Text Contrast

- [ ] **Primary text** on white background: #111827 on #FFFFFF
  - Ratio: 16.9:1 ✅ (Exceeds 7:1)
- [ ] **Secondary text** on white background: #6B7280 on #FFFFFF
  - Ratio: 4.69:1 ❌ (Should be adjusted to #4B5563 for 7.45:1)
- [ ] **Success text** (green): #059669 on #FFFFFF
  - Ratio: 3.39:1 ❌ (Use #047857 for 4.97:1 or darker)
- [ ] **Danger text** (red): #dc2626 on #FFFFFF
  - Ratio: 5.43:1 ❌ (Use #b91c1c for 7.08:1)
- [ ] **Info text** (blue): #2563eb on #FFFFFF
  - Ratio: 7.09:1 ✅

**Action Items:**
- Adjust secondary text color from `neutral-600` to `neutral-700`
- Use darker success color for text: `success-700` (#047857)
- Use darker danger color for text: `danger-700` (#b91c1c)

#### Button Contrast

- [ ] **Primary button** text: White on #10B981
  - Ratio: 3.16:1 ❌ (Acceptable for large text 18px+, but use #059669 for 3.97:1)
- [ ] **Secondary button** text: #10B981 on white
  - Ratio: 3.16:1 ❌ (Use #047857 for 4.97:1)
- [ ] **Danger button** text: White on #EF4444
  - Ratio: 3.91:1 ❌ (Use #dc2626 for 5.43:1)

**Action Items:**
- Use darker shades for button backgrounds when contrast is critical
- Always test button text visibility

### 2. Touch Target Sizes

- [ ] All buttons minimum 48px x 48px ✅
- [ ] Interactive icons minimum 48px x 48px ✅
- [ ] Form inputs minimum 48px height ✅ (56px)
- [ ] Checkboxes/radios minimum 24px with 48px clickable area
- [ ] Links have adequate padding (min 48px tap area)
- [ ] Swipe actions have 48px+ height
- [ ] Bottom navigation items 48px+ height

**Test Method:**
```javascript
// Check touch targets
const buttons = document.querySelectorAll('button');
buttons.forEach(btn => {
  const rect = btn.getBoundingClientRect();
  if (rect.width < 48 || rect.height < 48) {
    console.warn('Touch target too small:', btn, rect);
  }
});
```

### 3. Text Sizes & Readability

- [ ] Body text: 18px minimum ✅
- [ ] Small text: 14px minimum (use sparingly) ✅
- [ ] Line height: 1.5+ for body text ✅ (1.6)
- [ ] Line length: Max 80 characters per line
- [ ] Text is left-aligned (not justified)
- [ ] Text can be zoomed to 200% without loss of functionality

**Test Method:**
- Use browser zoom to 200%
- Ensure all text remains readable
- Check for text overflow/truncation

### 4. Keyboard Navigation

#### Tab Order

- [ ] Logical tab order (top to bottom, left to right)
- [ ] All interactive elements are keyboard accessible
- [ ] Modal dialogs trap focus correctly
- [ ] Escape key closes modals
- [ ] Enter key activates buttons/links
- [ ] Arrow keys navigate lists (optional but helpful)

#### Focus Indicators

- [ ] All focusable elements have visible focus indicator
- [ ] Focus ring is 3px minimum
- [ ] Focus ring color contrasts with background (7:1)
- [ ] Focus ring color: #3B82F6 (blue) ✅

**Test Method:**
- Navigate entire app using only Tab/Shift+Tab/Enter/Esc
- Ensure you can access all functionality
- Check focus is always visible

**CSS Implementation:**
```css
*:focus-visible {
  outline: 3px solid #3B82F6;
  outline-offset: 2px;
}
```

### 5. Screen Reader Support

#### Semantic HTML

- [ ] Use `<button>` for buttons (not `<div>` with onClick)
- [ ] Use `<a>` for links (not buttons for navigation)
- [ ] Use `<nav>` for navigation
- [ ] Use `<main>` for main content
- [ ] Use `<header>`, `<footer>` for page structure
- [ ] Use headings in order (h1 → h2 → h3, no skipping)

#### ARIA Labels

- [ ] Images have `alt` text
- [ ] Icons have `aria-label` or `aria-labelledby`
- [ ] Form inputs have labels (visible or `aria-label`)
- [ ] Buttons with icons only have `aria-label`
- [ ] Status messages use `aria-live` regions
- [ ] Loading states use `aria-busy`
- [ ] Modals use `role="dialog"` and `aria-modal="true"`

**Examples:**
```jsx
// Good: Icon button with label
<button aria-label="Record transaction">
  <Mic aria-hidden="true" size={24} />
</button>

// Good: Status message
<div role="status" aria-live="polite" aria-atomic="true">
  Transaction saved successfully
</div>

// Good: Loading state
<div aria-busy="true" aria-live="polite">
  <LoadingSpinner />
  <span className="sr-only">Loading transactions...</span>
</div>
```

#### Screen Reader Testing

**Test with:**
- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS/iOS, built-in)
- **TalkBack** (Android, built-in)

**Test Cases:**
1. Navigate home screen
2. Record a transaction (voice)
3. View transaction list
4. Generate a report
5. Ask AI coach a question
6. Complete onboarding flow
7. Login

**Key Checks:**
- [ ] All content is announced
- [ ] Form fields are labeled correctly
- [ ] Buttons announce their purpose
- [ ] Status changes are announced
- [ ] Errors are announced
- [ ] Success messages are announced

### 6. Forms & Error Handling

#### Labels & Instructions

- [ ] All inputs have visible labels
- [ ] Required fields are marked (*)
- [ ] Instructions are clear and concise
- [ ] Placeholder text is not the only label
- [ ] Error messages are specific and helpful

#### Error States

- [ ] Errors are announced to screen readers
- [ ] Error messages appear near the field
- [ ] Errors persist until corrected
- [ ] Error styling uses color + icon (not color alone)
- [ ] Form cannot be submitted with errors

**Example:**
```jsx
<Input
  label="Phone Number"
  required
  error={phoneError}
  aria-invalid={!!phoneError}
  aria-describedby="phone-error"
/>
{phoneError && (
  <div id="phone-error" role="alert" className="text-danger-700">
    <AlertCircle size={16} /> {phoneError}
  </div>
)}
```

### 7. Visual Indicators

#### Color Independence

- [ ] Color is not the only indicator of status
- [ ] Icons accompany color indicators
- [ ] Text labels accompany color indicators
- [ ] Patterns/textures used in charts

**Examples:**
```jsx
// Good: Icon + color + text
<div className="flex items-center gap-2">
  <CheckCircle className="text-success-600" />
  <span className="text-success-700 font-semibold">Paid</span>
</div>

// Good: Chart with patterns (not just colors)
<BarChart>
  <Bar dataKey="income" fill="#10B981" />
  <Bar dataKey="expense" fill="#EF4444" pattern="diagonal" />
</BarChart>
```

### 8. Motion & Animation

#### Reduced Motion

- [ ] Respect `prefers-reduced-motion` media query
- [ ] Provide static alternative for animations
- [ ] Essential animations can be disabled

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Tailwind Utility:**
```jsx
<div className="animate-pulse-slow motion-reduce:animate-none">
  Recording...
</div>
```

### 9. Mobile Accessibility

#### iOS VoiceOver

- [ ] Swipe gestures work with VoiceOver
- [ ] Custom controls have proper roles
- [ ] Camera/microphone permissions are announced
- [ ] Offline mode is announced

#### Android TalkBack

- [ ] All content is announced correctly
- [ ] Navigation drawer is accessible
- [ ] Bottom navigation is announced
- [ ] Swipe actions are accessible

### 10. Language & Content

#### Simple Language

- [ ] Avoid financial jargon
- [ ] Use conversational South African English
- [ ] Sentences are short (<20 words)
- [ ] Instructions are clear and actionable
- [ ] Error messages explain how to fix

#### Content Structure

- [ ] Headings create logical outline
- [ ] Lists use `<ul>` or `<ol>`
- [ ] Important info is at the top
- [ ] Content can be understood out of order (screen reader)

---

## 🧪 Testing Tools

### Automated Testing

#### axe-core (JavaScript)

```bash
npm install --save-dev @axe-core/react
```

```jsx
// In development only
if (process.env.NODE_ENV !== 'production') {
  const axe = require('@axe-core/react');
  axe(React, ReactDOM, 1000);
}
```

#### axe DevTools (Browser Extension)

- Install axe DevTools extension
- Run audit on each page
- Fix all critical and serious issues
- Document moderate and minor issues

#### Lighthouse (Chrome DevTools)

```bash
# Run Lighthouse CI
npx lighthouse https://beezee.app --view
```

**Target Scores:**
- Accessibility: 95+ ✅
- Performance: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 90+

### Manual Testing

#### Keyboard Testing

**Test Script:**
1. Disconnect mouse
2. Use only keyboard to:
   - Navigate all pages
   - Complete onboarding
   - Record transaction
   - Generate report
   - Login/logout
3. Verify all functionality is accessible

#### Screen Reader Testing

**Test Script:**
1. Turn on screen reader (VoiceOver/NVDA/TalkBack)
2. Close eyes (simulate blindness)
3. Complete key tasks:
   - Login
   - Record transaction
   - View balance
   - Generate report
4. Note any confusing announcements
5. Fix issues

#### Color Blindness Testing

**Tools:**
- **Colorblind Web Page Filter:** https://www.toptal.com/designers/colorfilter/
- **Chrome Extension:** Colorblindly

**Test with:**
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Monochromacy (grayscale)

**Verify:**
- Money in/out are distinguishable
- Status badges are distinguishable
- Charts are readable

#### Touch Target Testing

**On real devices:**
- iPhone SE (smallest modern iPhone)
- Samsung Galaxy S21 (common Android)
- Budget Android phone (low-end)

**Test:**
- All buttons are easy to tap
- No accidental taps
- Swipe gestures work smoothly

---

## 📋 Accessibility Checklist Summary

### Critical (Must Fix Before Launch)

- [ ] All text meets 7:1 contrast ratio
- [ ] All touch targets are 48px+ minimum
- [ ] All interactive elements are keyboard accessible
- [ ] All images have alt text
- [ ] All forms have labels
- [ ] Error messages are accessible
- [ ] Focus indicators are visible
- [ ] Screen reader testing passed
- [ ] No axe-core critical issues

### Important (Fix Within 1 Week)

- [ ] Lighthouse accessibility score 95+
- [ ] All ARIA labels are correct
- [ ] Headings are in logical order
- [ ] Tab order is logical
- [ ] Color is not the only indicator
- [ ] Reduced motion support
- [ ] Mobile screen reader testing
- [ ] Color blindness testing

### Nice to Have (Fix Within 1 Month)

- [ ] Custom focus indicators per brand
- [ ] Advanced ARIA patterns
- [ ] Gesture alternatives for all actions
- [ ] Voice control support
- [ ] High contrast mode
- [ ] Font size controls

---

## 🎯 Accessibility Goals

### Immediate Goals (Week 1)
1. Fix all critical accessibility issues
2. Achieve Lighthouse 95+ score
3. Pass axe-core audit
4. Complete keyboard navigation testing
5. Complete screen reader testing

### Short-term Goals (Month 1)
1. User testing with 3 users with disabilities
2. Document all accessibility features
3. Create accessibility statement
4. Train support team on accessibility
5. Continuous monitoring setup

### Long-term Goals (Year 1)
1. Achieve WCAG 2.1 AAA certification
2. Expand to more assistive technologies
3. Partner with accessibility organizations
4. Make financial management accessible to all
5. Lead by example in African fintech

---

## 📚 Resources

**WCAG Guidelines:** https://www.w3.org/WAI/WCAG21/quickref/  
**axe-core:** https://github.com/dequelabs/axe-core  
**WebAIM:** https://webaim.org/  
**A11Y Project:** https://www.a11yproject.com/  
**MDN Accessibility:** https://developer.mozilla.org/en-US/docs/Web/Accessibility

---

**Built with 🐝 for everyone**

*Making financial management accessible to all South Africans, regardless of ability*

---

**Status:** ✅ Checklist Complete  
**Last Updated:** December 13, 2024  
**Next Review:** Before production launch



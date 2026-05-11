# RefNet Responsive Design - Quick Reference

## 🎯 Breakpoints

```css
/* Mobile First (Base) - 0px and up */
.element { }

/* Tablet - 1024px and below */
@media (max-width: 1024px) { }

/* Mobile - 768px and below */
@media (max-width: 768px) { }

/* Small Mobile - 480px and below */
@media (max-width: 480px) { }
```

## 📱 Common Responsive Patterns

### Grid Layouts
```tsx
// 4 columns → 2 → 1
<div className="grid grid-cols-4 gap-16">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Conditional Visibility
```tsx
// Hide on mobile
<div className="hide-mobile">Desktop only</div>

// Show only on mobile
<div className="show-mobile">Mobile only</div>

// Hide on tablet
<div className="hide-tablet">Desktop only</div>
```

### Responsive Spacing
```tsx
// Auto-adjusts padding
<div className="p-24">Content</div>

// Auto-adjusts gaps
<div className="flex gap-16">Items</div>
```

### Full Width on Mobile
```tsx
<button className="w-mobile-full">Button</button>
```

## 🎨 Component Sizing

### Sidebar
- Desktop: `240px`
- Tablet: `200px`
- Mobile: `100%` (horizontal)

### Cards
- Padding: `24px` → `18px` → `16px`
- Border Radius: `12px` → `10px`

### Buttons
- Padding: `10px 20px` → `9px 16px`
- Min Height: `44px` (mobile)

### Typography
- H1: `24px` → `20px`
- Body: `14px` → `13px`
- Small: `12px` → `11px`

## 🔧 Utility Classes

### Layout
```css
.flex              /* display: flex */
.flex-col          /* flex-direction: column */
.flex-wrap         /* flex-wrap: wrap */
.items-center      /* align-items: center */
.justify-between   /* justify-content: space-between */
.justify-center    /* justify-content: center */
```

### Grid
```css
.grid              /* display: grid */
.grid-cols-1       /* 1 column */
.grid-cols-2       /* 2 columns (responsive) */
.grid-cols-3       /* 3 columns (responsive) */
.grid-cols-4       /* 4 columns (responsive) */
```

### Spacing
```css
.gap-4, .gap-8, .gap-12, .gap-16, .gap-20, .gap-24
.p-4, .p-8, .p-12, .p-16, .p-20, .p-24, .p-32
.m-4, .m-8, .m-12, .m-16, .m-20, .m-24
```

### Width
```css
.w-full            /* width: 100% */
.w-auto            /* width: auto */
.w-mobile-full     /* width: 100% on mobile only */
```

### Typography
```css
.text-xs           /* 11px */
.text-sm           /* 13px */
.text-base         /* 14px */
.text-lg           /* 16px */
.text-xl           /* 18px */
.text-2xl          /* 22px → 20px mobile */
.text-3xl          /* 26px → 24px mobile */
```

## 📋 CSS Import Order

```tsx
// In App.tsx or main component
import './assets/styles/global.css';        // 1. Base resets
import './assets/styles/variables.css';     // 2. CSS variables
import './assets/styles/font.css';          // 3. Fonts
import './styles/design-system.css';        // 4. Design system
import './styles/responsive.css';           // 5. Responsive utilities
import './styles/[page-specific].css';      // 6. Page styles
```

## ✅ Mobile Checklist

### Before Deploying
- [ ] No horizontal scroll on any page
- [ ] All text readable without zooming
- [ ] Touch targets minimum 44x44px
- [ ] Images scale properly
- [ ] Forms usable on mobile
- [ ] Navigation accessible
- [ ] Cards stack properly
- [ ] Buttons full-width where appropriate

### Testing Devices
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] Samsung Galaxy (360px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)

## 🚀 Quick Fixes

### Horizontal Scroll Issue
```css
/* Add to problematic element */
max-width: 100%;
overflow-x: hidden;
```

### Text Too Small
```css
/* Use responsive typography */
font-size: 14px;

@media (max-width: 768px) {
  font-size: 13px;
}
```

### Touch Target Too Small
```css
/* Ensure minimum size */
min-width: 44px;
min-height: 44px;
padding: 10px 20px;
```

### Layout Breaking
```css
/* Use flex-wrap */
display: flex;
flex-wrap: wrap;
gap: 16px;
```

## 🎯 Common Responsive Layouts

### Two-Column → Stack
```css
.layout {
  display: flex;
  gap: 20px;
}

@media (max-width: 768px) {
  .layout {
    flex-direction: column;
  }
}
```

### Grid → Single Column
```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

### Sidebar → Top Nav
```css
.container {
  display: flex;
}

.sidebar {
  width: 240px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}
```

## 📊 Performance Tips

### CSS
- Group media queries by breakpoint
- Use efficient selectors
- Minimize specificity
- Avoid !important

### Images
- Use responsive images
- Add width/height attributes
- Lazy load below fold
- Use modern formats (WebP)

### Layout
- Avoid layout shifts
- Use CSS Grid/Flexbox
- Minimize reflows
- Use transform for animations

## 🔍 Debugging

### Chrome DevTools
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select device or custom size
4. Test interactions

### Common Issues
```css
/* Issue: Element too wide */
* { max-width: 100vw; }

/* Issue: Horizontal scroll */
body { overflow-x: hidden; }

/* Issue: Text unreadable */
font-size: 14px; /* minimum */

/* Issue: Touch target small */
min-height: 44px;
min-width: 44px;
```

## 📚 Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive](https://web.dev/responsive-web-design-basics/)
- [CSS-Tricks Media Queries](https://css-tricks.com/a-complete-guide-to-css-media-queries/)

## 💡 Pro Tips

1. **Always test on real devices** - Emulators aren't perfect
2. **Start mobile-first** - Easier to enhance than reduce
3. **Use relative units** - rem, em, % over px when possible
4. **Touch targets matter** - 44x44px minimum for mobile
5. **Test landscape mode** - Often forgotten but important
6. **Check slow connections** - Test on 3G/4G
7. **Verify accessibility** - Use screen readers
8. **Monitor performance** - Use Lighthouse

---

**Quick Access**: Keep this file open while developing responsive features!

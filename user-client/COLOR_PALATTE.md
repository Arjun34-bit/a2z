# AntiGravity — UI Design System Reference

> This README defines the **mandatory** UI tokens that all AntiGravity interfaces must follow.  
> Do not deviate from these values without a design-system approval.

---

## 🎨 Color Palette

| Token | Hex Value | Usage |
|---|---|---|
| `--primary` | `#6F55C8` | Primary buttons, active links, key accents |
| `--primary-dark` | `#5540A8` | Button hover / pressed state |
| `--primary-light` | `#9B85E8` | Highlights, icon tints |
| `--primary-lighter` | `#EDE9FF` | Button ghost backgrounds, tags, hover surfaces |
| `--bg` | `#FFFFFF` | Page / screen background |
| `--surface` | `#F8F7FD` | Card backgrounds, input fields |
| `--surface-2` | `#F0EDFC` | Table headers, secondary surfaces |
| `--text-primary` | `#1A1035` | All headings and high-emphasis body text |
| `--text-secondary` | `#6B6480` | Body copy, descriptions, labels |
| `--text-muted` | `#9E99B4` | Placeholders, captions, disabled text |
| `--border` | `#E8E4F5` | Card borders, dividers, input outlines |
| `--border-light` | `#F3F0FB` | Subtle separators, table row lines |
| `--success` | `#22C55E` | Success states, availability badges |
| `--warning` | `#F59E0B` | Warning alerts, caution indicators |
| `--danger` | `#EF4444` | Error states, destructive actions |
| `--info` | `#3B82F6` | Informational banners, tooltips |

### CSS Variables (copy-paste ready)

```css
:root {
  --primary:         #6F55C8;
  --primary-dark:    #5540A8;
  --primary-light:   #9B85E8;
  --primary-lighter: #EDE9FF;

  --bg:              #FFFFFF;
  --surface:         #F8F7FD;
  --surface-2:       #F0EDFC;

  --text-primary:    #1A1035;
  --text-secondary:  #6B6480;
  --text-muted:      #9E99B4;

  --border:          #E8E4F5;
  --border-light:    #F3F0FB;

  --success:         #22C55E;
  --warning:         #F59E0B;
  --danger:          #EF4444;
  --info:            #3B82F6;
}
```

---

## 🔤 Typography

### Primary Font

| Property | Value |
|---|---|
| **Font Family** | `Plus Jakarta Sans` |
| **Source** | [Google Fonts](https://fonts.google.com/specimen/Plus+Jakarta+Sans) |
| **Fallback stack** | `'Plus Jakarta Sans', sans-serif` |
| **Why this font** | Geometric, rounded letterforms; strong legibility at small sizes; modern SaaS aesthetic |

### Import (HTML)

```html
<link
  href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
  rel="stylesheet"
/>
```

### Import (CSS `@import`)

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
```

### Import (npm / Next.js)

```bash
npm install @fontsource/plus-jakarta-sans
```

```js
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/plus-jakarta-sans/800.css';
```

### Type Scale

| Role | Size | Weight | Color Token |
|---|---|---|---|
| Display / Hero | `38px` | `800` | `--text-primary` |
| H1 | `28px` | `800` | `--text-primary` |
| H2 | `24px` | `800` | `--text-primary` |
| H3 | `18px` | `700` | `--text-primary` |
| Body (default) | `15px` | `400` | `--text-secondary` |
| Body Small | `13.5px` | `400` | `--text-secondary` |
| Label / Badge | `11.5px` | `700` | contextual |
| Code / Mono | `13px` | `400` | `'SF Mono', 'Fira Code', monospace` |

---

## 🖲️ Buttons

### Specifications

| Variant | Background | Text Color | Border | Hover Background |
|---|---|---|---|---|
| **Primary** | `#6F55C8` | `#FFFFFF` | none | `#5540A8` |
| **Outline** | `transparent` | `#6F55C8` | `1.5px solid #6F55C8` | `#EDE9FF` |
| **Ghost** | `#F8F7FD` | `#1A1035` | none | `#F0EDFC` |
| **Danger** | `#EF4444` | `#FFFFFF` | none | `#DC2626` |

### Sizing

| Size | Padding | Font Size | Border Radius |
|---|---|---|---|
| Small | `7px 16px` | `13px` | `8px` |
| Default | `10px 22px` | `14px` | `10px` |
| Large | `14px 32px` | `16px` | `12px` |

### CSS (reference implementation)

```css
/* Base */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 22px;
  border-radius: 10px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.15s, box-shadow 0.15s;
}

/* Primary */
.btn-primary {
  background: #6F55C8;
  color: #FFFFFF;
}
.btn-primary:hover {
  background: #5540A8;
  box-shadow: 0 4px 16px rgba(111, 85, 200, 0.28);
}

/* Outline */
.btn-outline {
  background: transparent;
  color: #6F55C8;
  border: 1.5px solid #6F55C8;
}
.btn-outline:hover {
  background: #EDE9FF;
}

/* Ghost */
.btn-ghost {
  background: #F8F7FD;
  color: #1A1035;
}
.btn-ghost:hover {
  background: #F0EDFC;
}
```

---

## 📐 Spacing & Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `8px` | Small chips, tags, small buttons |
| `--radius` | `12px` | Cards, input fields |
| `--radius-lg` | `16px` | Large cards, modals |
| `--radius-xl` | `24px` | Hero sections, full-bleed panels |

---

## 🌑 Shadows

```css
--shadow-sm: 0 1px 3px rgba(111, 85, 200, 0.08);
--shadow-md: 0 4px 16px rgba(111, 85, 200, 0.12);
--shadow-lg: 0 8px 32px rgba(111, 85, 200, 0.16);
```

Use `--shadow-md` on hover for interactive cards and primary buttons.

---

## ✅ Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use `#6F55C8` for all primary CTAs | Use any other purple shade for buttons |
| Use `Plus Jakarta Sans` for all text | Use Inter, Roboto, or system fonts |
| Keep page background `#FFFFFF` | Use off-white or grey page backgrounds |
| Use `--primary-lighter` (`#EDE9FF`) for hover surfaces | Use opacity hacks on the primary color |
| Apply `600` or `700` weight for button labels | Use regular (`400`) weight on buttons |
| Use `--text-secondary` (`#6B6480`) for body text | Use pure black (`#000`) for body copy |

---

## 📦 Quick Reference Card

```
BACKGROUND   #FFFFFF  ────────────────────────────── white
SURFACE      #F8F7FD  ────────────────────────────── near-white purple tint
PRIMARY      #6F55C8  ████████████████████████████  button fill / accents
PRIMARY DARK #5540A8  ████████████████████████████  button hover
PRIMARY LITE #EDE9FF  ████████████████████████████  ghost / tag backgrounds
TEXT H       #1A1035  ████████████████████████████  headings
TEXT BODY    #6B6480  ████████████████████████████  body copy
TEXT MUTED   #9E99B4  ████████████████████████████  captions / placeholders
FONT         Plus Jakarta Sans  (Google Fonts)
```

---

*Last updated: May 2026 · AntiGravity Design System v1.0*
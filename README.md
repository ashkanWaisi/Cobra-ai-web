# COBRA AI Studio — Promotional Website

A complete, production-quality, fully responsive promotional and educational website for **COBRA AI Studio**, a professional offline desktop AI creation studio for Windows.

## Overview

This website showcases COBRA AI Studio's capabilities including offline image generation, video generation, local AI chat, model management, and more. It features a premium dark interface with glassmorphism design, full English/Persian bilingual support, and comprehensive interactive sections.

## Quick Start

The website is built as a single-page React application using Vite + Tailwind CSS. To run:

```bash
npm install
npm run build
```

The built website is output to `dist/index.html` as a single self-contained HTML file that can be opened directly in any modern browser — no server required.

For development:

```bash
npm run dev
```

## File Structure

```
src/
├── App.tsx              # Main application component (all sections)
├── index.css            # Global styles, design system, animations
├── main.tsx             # React entry point
├── translations.ts      # English & Persian translation dictionary
├── demoData.ts          # Models, tutorials, documentation data
├── hooks/
│   └── useTranslation.ts  # Language management hook
├── components/
│   └── Icons.tsx          # All inline SVG icons
└── utils/
    └── cn.ts              # Utility for classnames
```

## Configuration

### Setting the Download URL

Open `src/App.tsx` and find the configuration section near the top:

```typescript
const COBRA_DOWNLOAD_URL = "";
const COBRA_VERSION = "1.0.0";
```

Replace the empty string with the actual installer URL:

```typescript
const COBRA_DOWNLOAD_URL = "https://your-domain.com/downloads/cobra-setup.exe";
```

When the URL is empty, the download dialog displays a message indicating the link is not yet configured.

### Replacing the Logo

The current logo is a CSS/SVG placeholder (raspberry-red circle with white ring). To replace:

1. Open `src/components/Icons.tsx`
2. Find the `CobraLogo` component (marked with `PLACEHOLDER LOGO` comment)
3. Replace the SVG markup with your actual logo asset
4. If using an image file, place it in `public/` and reference it with an `<img>` tag

### Adding Screenshots

Screenshots are currently shown as placeholders. To add real screenshots:

1. Place screenshot images in `public/screenshots/`
2. Open `src/demoData.ts` and update `screenshotPlaceholders` with image paths
3. Update `src/App.tsx` screenshot section to render `<img>` tags instead of placeholders

### Editing English Text

All English text strings are in `src/translations.ts` under the `en` object. Edit values there — the keys are descriptive (e.g., `'hero.headline'`, `'feat.imgGen.title'`).

### Editing Persian Translations

All Persian text strings are in `src/translations.ts` under the `fa` object. Same keys as English.

### Changing Theme Colors

Colors are defined as CSS custom properties in `src/index.css` inside the `@theme` block:

```css
@theme {
  --color-cobra-bg: #0a0a0f;
  --color-cobra-primary: #dc2650;
  /* ... etc */
}
```

Modify these values to change the entire color scheme.

### Adding New Models

Open `src/demoData.ts` and add entries to the `models` array:

```typescript
{
  id: 'unique-id',
  name: 'Model Name',
  type: 'image' | 'video' | 'chat',
  size: '3.2 GB',
  vram: '6 GB',
  status: 'installed' | 'available',
}
```

### Adding Tutorials

Open `src/demoData.ts` and add entries to the `tutorials` array with both English and Persian content.

### Adding Documentation Pages

Open `src/demoData.ts` and add entries to the `docSections` array with title, headings, and content in both languages.

## Features

### Sections
- **Navigation**: Floating glass navbar with smooth scroll, active indicators, mobile menu
- **Hero**: Product showcase with mock desktop interface
- **Interactive Demo**: Tabbed demo for Image, Video, Chat, and Model Hub modes
- **Features**: 12-card responsive grid with hover effects
- **Workflows**: 4-step process + specific workflow tabs (Text→Image, Image→Video, Chat)
- **Why Offline**: 7 benefits of local AI processing
- **Model Hub**: Filterable model browser with install/remove/download simulation
- **Tutorials**: 8 tutorial cards with step-by-step modal reader
- **Documentation**: Sidebar navigation, search, code blocks, copy-to-clipboard
- **System Requirements**: 3 tiers + interactive hardware compatibility checker
- **Comparison**: Local vs Cloud comparison table
- **Screenshots Gallery**: Lightbox with keyboard navigation
- **FAQ**: Accessible accordion (10 questions)
- **CTA**: Final call-to-action
- **Footer**: Links, branding, legal placeholders

### Interactions
- Language switching (EN/FA) with localStorage persistence
- RTL/LTR layout switching
- Model filtering and searching
- Simulated model download progress bars
- Chat demo with message display
- Tutorial modal with step navigation
- Documentation search and navigation
- Hardware compatibility calculator
- FAQ accordion (single open)
- Screenshot lightbox with keyboard arrows
- Scroll reveal animations
- Back-to-top button
- Download dialog with checkbox confirmation

### Accessibility
- Skip-to-content link
- Semantic HTML landmarks
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- `prefers-reduced-motion` support
- Proper heading hierarchy
- Form labels

## Browser Support

- Chrome 90+
- Firefox 90+
- Safari 15+
- Edge 90+

The website uses `backdrop-filter` for glass effects with fallback backgrounds for unsupported browsers.

## Offline Behavior

Once built, the `dist/index.html` file is completely self-contained — all CSS, JavaScript, and SVG assets are inlined. No internet connection is required to view the website.

## License

All content is specific to COBRA AI Studio. Update the footer legal links with actual policy URLs when available.

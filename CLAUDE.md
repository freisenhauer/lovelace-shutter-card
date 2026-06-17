# Shutter Card — Lovelace Custom Card

## Overview

Custom Home Assistant Lovelace card for European-style roller shutters. The core differentiator is native understanding of shutter slat behavior: shutters form slat gaps before fully closing, and users commonly want presets like "closed with slats open."

## Tech Stack

- **Language:** TypeScript + Lit (LitElement) — web components, same framework as HA core frontend
- **Bundler:** Vite (library mode) — outputs a single ES module JS file for Lovelace
- **Package manager:** pnpm
- **Linting:** ESLint with `eslint-plugin-lit` and `eslint-plugin-wc` for template-aware linting
- **Formatting:** Prettier
- **Distribution:** HACS-compatible (see `hacs.json`)

## Intended Directory Structure

```
src/
├── cards/              # Card variants — each subdirectory is a separate Lovelace card type
│   └── shutter/        # Main shutter card
├── shared/             # Code shared across card variants
│   ├── types/          # TypeScript types and interfaces
│   ├── styles/         # Shared CSS (Lit css tagged templates)
│   └── utils/          # Utility functions
└── index.ts            # Entry point — registers all card custom elements
```

The `cards/` structure supports offering multiple card variants in the future without restructuring.

## Development Commands

```
pnpm install        # Install dependencies
pnpm dev            # Build with watch mode
pnpm build          # Production build
pnpm lint           # Lint
pnpm lint:fix       # Lint and fix
pnpm format         # Format with Prettier
pnpm format:check   # Check formatting
```

## Build Output

Vite produces `dist/lovelace-shutter-card.js` — a single ES module file that Lovelace loads as a resource.

## Key Concepts

- **Cover entity:** HA entity type `cover` — represents shutters, blinds, garage doors, etc.
- **Position:** 0 = fully closed, 100 = fully open (HA convention)
- **Presets:** User-defined position values with a required icon and optional label. Icons are displayed as snap points on the slider track. If a label is defined, the preset also appears as a chip button below the slider.
- **Slat behavior:** European roller shutter panels consist of individual slats that are pulled apart by gravity as the shutter lowers, forming visible gaps. These gaps only close once the bottom edge of the panel reaches the bottom and the slats compress under their own weight. This is the core UX insight this card addresses.

## Architecture Goals

- Each card variant lives in its own directory under `src/cards/` and registers its own custom element
- Shared types, styles, and utilities go in `src/shared/`
- A visual Lovelace card editor (GUI configuration) is a planned goal for each card variant
- The card should work with any `cover` entity, but the UX is optimized for roller shutters with slat positions
- The full card variant uses a snap-point slider where preset icons serve as anchor points on the track. The slider thumb snaps to these positions when dragged near them. Presets with a label additionally appear as chip buttons below the slider.

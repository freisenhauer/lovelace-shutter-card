# Shutter Card — Lovelace Custom Card

## Overview

Custom Home Assistant Lovelace card for European-style roller shutters. The core differentiator is native understanding of shutter slat behavior: shutters form slat gaps before fully closing, and users commonly want presets like "closed with slats open."

## Tech Stack

- **Language:** TypeScript + Lit (LitElement) — web components, same framework as HA core frontend
- **Bundler:** Vite (library mode) — outputs a single ES module JS file for Lovelace
- **Package manager:** pnpm
- **Linting:** ESLint with `eslint-plugin-lit` and `eslint-plugin-wc` for template-aware linting
- **Formatting:** Prettier
- **Component development:** Storybook with `@storybook/web-components-vite` for isolated component development
- **Distribution:** HACS-compatible (see `hacs.json`)

## Directory Structure

```
src/
├── cards/              # Card variants — each subdirectory is a separate Lovelace card type
│   └── shutter/        # Main shutter card (4 variants + stories + mock data)
├── shared/             # Code shared across card variants
│   ├── base/           # Abstract base class (ShutterCardBase) with shared logic
│   ├── components/     # Reusable Lit components
│   │   ├── editor/     # Visual card editor (ha-form based)
│   │   ├── header/     # Entity header, state display, control buttons
│   │   ├── preset-chip/ # Pill button for preset positions
│   │   └── snap-point-slider/ # Slider with snap points and preset icons
│   ├── types/          # TypeScript types and interfaces
│   └── styles/         # Shared CSS (Lit css tagged templates)
└── index.ts            # Entry point — registers all card custom elements + editor
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
- All card variants share a single visual Lovelace card editor (`fr-shutter-card-editor`) for GUI configuration, registered via `getConfigElement()` in the base class
- The card should work with any `cover` entity, but the UX is optimized for roller shutters with slat positions

## Developer Guidelines

### Component Architecture

Card variants are thin compositions of shared, reusable Lit components. No card variant should contain large monolithic templates — break UI into focused components with a single responsibility.

Reusable components live in `src/shared/components/` and include at minimum:

- **Entity header** — icon circle, entity name, state text
- **Control buttons** — open/stop/close button group
- **Snap-point slider** — track, snap dots with icons, thumb, fill bar
- **Preset chip** — pill button with icon + optional label
- **Card editor** — visual config editor using `ha-form` for basic fields (entity, name, icon, tap action) and custom UI for presets list

Card variants in `src/cards/` compose these shared components and should contain minimal logic beyond layout and wiring.

### Code Principles

- **No copy & paste.** If two components share behavior or markup, extract a shared component or mixin.
- **No god components.** A component that does too many things must be split. If a component template exceeds ~50 lines of HTML, it probably needs decomposition.
- **Single responsibility.** Each component handles one concern — rendering a slider, displaying a chip, showing entity info. It does not also fetch data, manage global state, or know about sibling components.
- **Props down, events up.** Components receive data via properties and communicate changes via custom events. No direct parent manipulation.

### Storybook

Every shared component and every card variant must have a Storybook story (`*.stories.ts` next to the component). Stories must cover all useful states, e.g.:

- **Snap-point slider:** idle, moving/pulsating, snapped vs. between presets, few vs. many presets
- **Preset chip:** active, inactive, icon-only, icon + label
- **Control buttons:** idle, shutter moving
- **Entity header:** active, inactive, different state texts
- **Card variants:** open, closed, preset active, moving, various preset configurations

## UX Design

### Design Language

The visual style follows the Mushroom card aesthetic to integrate seamlessly into common HA dashboards:

- **Card container:** rounded corners (12px border-radius), subtle border, 16px inner padding
- **Entity icon:** 36px circle with colored background (active: accent color, inactive: muted)
- **Typography:** 14px/500 for entity name, 12px for state text (secondary color)
- **Controls:** circular icon buttons (30px), no text labels
- **Chips:** pill-shaped (14px border-radius, 28px height), icon + label, highlighted when matching current position
- **Spacing:** 14px gap between element rows (header → slider, slider → chips)
- **Theming:** uses HA CSS custom properties throughout for light/dark mode compatibility

### Card Variants

All variants are bundled in a single JS file and registered as separate custom elements.

#### Full (`custom:shutter-card`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name              [▲] [■] [▼] │  ← Header: icon, name, state, open/stop/close
│     State text                            │
│                                           │
│  🔒    👁    ≡    ↗    ☀                  │  ← Snap-point icons (above track)
│  ──●──○────○────○────────────○──          │  ← Slider track with snap dots + thumb
│                                           │
│  [≡ Slats open]  [↗ Half open]           │  ← Chips (only for presets with labels)
└──────────────────────────────────────────┘
```

- **Header row:** entity icon (circle), entity name + state, open/stop/close buttons (3 circular buttons)
- **Snap-point slider:** horizontal track with preset icons above their positions as anchor points. The slider thumb snaps to these positions when dragged within proximity. Active snap points are highlighted.
- **Chip buttons:** appear below the slider only for presets that have a `label` defined. Show icon + label. Highlighted when position matches.

#### Compact — Chips (`custom:shutter-card-compact-chips`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name          [▲] [■] [▼]     │  ← Header: icon, name, state, open/stop/close
│     State text                            │
│                                           │
│  [🔒 Closed] [≡ Slats] [↗ Half] [☀ Open]│  ← Chips for all presets
└──────────────────────────────────────────┘
```

- **Header row:** entity icon, entity name + state, open/stop/close buttons (3 circular buttons)
- **Chip buttons:** all presets shown as chips with icon (+ label if defined). No slider.

#### Compact — Slider (`custom:shutter-card-compact-slider`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name          [▲] [■] [▼]     │  ← Header: icon, name, state, open/stop/close
│     State text                            │
│                                           │
│  🔒       ≡         ↗              ☀     │  ← Snap-point icons
│  ──○──────○─────────○──────────────○──   │  ← Slider track with snap dots
└──────────────────────────────────────────┘
```

- **Header row:** entity icon, entity name + state, open/stop/close buttons (3 circular buttons)
- **Snap-point slider:** same as full variant. No chips.

#### Minimal (`custom:shutter-card-minimal`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name          [▲] [■] [▼]     │  ← Header: icon, name, state, open/stop/close
│     State text                            │
└──────────────────────────────────────────┘
```

- **Header row:** entity icon (active/inactive styling), entity name, state text, open/stop/close buttons (3 circular buttons). No slider, no chips.

### Snap-Point Slider Behavior

The slider is the central interaction element in the full and compact-slider variants:

- Each preset is rendered as a **dot on the track** with its **icon floating above**
- The **thumb snaps** to a preset position when dragged within a proximity threshold
- When the thumb is snapped to a preset, it visually shrinks and fills with the accent color to indicate a locked position
- When the thumb is between presets, it shows as a larger, hollow circle
- The **filled portion** of the track (from left to the thumb position) uses the accent color
- Clicking directly on a snap dot jumps the thumb to that position
- **Open (100%) and Closed (0%) are always present** as fixed snap points and don't need to be configured

### Slider State Model

The slider has two visual elements that can move independently:

- **Thumb (knob):** represents the **target position**. When the user drags the slider or clicks a preset, the thumb moves to the new target immediately. It does not move while the shutter is in motion.
- **Fill (accent bar):** represents the **current position**. A colored bar from the left edge of the track up to the current position. This updates in real time as the entity's position changes.

**Idle state:** the fill extends exactly to the thumb position — both current and target are equal.

**Moving state:** when the shutter is actively moving (HA reports the cover state as `opening` or `closing`):

- The **thumb stays fixed** at the target position
- The **fill animates** in real time as the current position updates, growing (when opening) or shrinking (when closing) toward the thumb
- The **fill pulsates** to indicate that the shutter is in motion
- Once the current position reaches the thumb (or the shutter is stopped), the pulsation ends and the slider returns to its idle state
- When **stop is pressed**, the thumb snaps to the current position (where the fill ends) so both align immediately

**Transitions:** all slider movements (thumb repositioning, fill growing/shrinking) use CSS transitions for smooth, fluid animation. No element should jump to a new position without a visible transition.

### Presets Configuration

- `icon` (required): displayed as snap point on the slider track and in chip buttons
- `label` (optional): when defined, the preset also appears as a chip button below the slider (full variant only)
- `position` (required): target position value (0–100)
- Open (100) and Closed (0) are built-in and do not need preset configuration

### State Display

The state text adapts to the current position, with the following priority:

1. **Open (100%)** → "Open"
2. **Closed (0%)** → "Closed"
3. **Matching preset with label** → preset icon + label (e.g. `≡ Slats open`)
4. **Matching preset without label** → preset icon + position as percentage (e.g. `≡ 5%`)
5. **No matching preset** → position as percentage (e.g. `37%`)

The entity icon switches between active (accent color background) and inactive (muted background) styling based on whether the position is > 0.

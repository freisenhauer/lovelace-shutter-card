# Contributing

## Getting Started

### Prerequisites

- Node.js (LTS)
- pnpm

### Setup

```bash
pnpm install
```

### Commands

```bash
pnpm dev            # Build with watch mode
pnpm build          # Production build
pnpm lint           # Run ESLint
pnpm lint:fix       # Fix ESLint issues
pnpm format         # Format code with Prettier
pnpm format:check   # Check formatting
pnpm storybook      # Start Storybook dev server
pnpm storybook:build # Build static Storybook
```

### Testing locally in Home Assistant

1. Run `pnpm build`
2. Copy `dist/lovelace-shutter-card.js` to your HA `config/www/` directory
3. Add as a Lovelace resource (see README)
4. Clear browser cache and reload

## Project Structure

```
src/
├── cards/                    # Card variants — each subdirectory is a separate Lovelace card type
│   └── shutter/              # Main shutter card
├── shared/                   # Code shared across card variants
│   ├── components/           # Reusable Lit components
│   ├── types/                # TypeScript types and interfaces
│   ├── styles/               # Shared CSS (Lit css tagged templates)
│   └── utils/                # Utility functions
└── index.ts                  # Entry point — registers all card custom elements
```

All card variants are bundled into a single JS file (`dist/lovelace-shutter-card.js`) and registered as separate custom elements. The `cards/` structure supports adding new variants without restructuring.

## Component Architecture

Card variants are thin compositions of shared, reusable Lit components. No card variant should contain large monolithic templates — break UI into focused components with a single responsibility.

Reusable components live in `src/shared/components/` and include at minimum:

- **Entity header** — icon circle, entity name, state text
- **Control buttons** — open/stop/close button group
- **Snap-point slider** — track, snap dots with icons, thumb, fill bar
- **Preset chip** — pill button with icon + optional label

Card variants in `src/cards/` compose these shared components and should contain minimal logic beyond layout and wiring.

### Code Principles

- **No copy & paste.** If two components share behavior or markup, extract a shared component or mixin.
- **No god components.** A component that does too many things must be split. If a component template exceeds ~50 lines of HTML, it probably needs decomposition.
- **Single responsibility.** Each component handles one concern — rendering a slider, displaying a chip, showing entity info. It does not also fetch data, manage global state, or know about sibling components.
- **Props down, events up.** Components receive data via properties and communicate changes via custom events. No direct parent manipulation.

### Storybook

Every shared component and every card variant must have a Storybook story (`*.stories.ts` next to the component). Stories must cover all useful states:

- **Snap-point slider:** idle, moving/pulsating, snapped vs. between presets, few vs. many presets
- **Preset chip:** active, inactive, icon-only, icon + label
- **Control buttons:** idle, shutter moving
- **Entity header:** active, inactive, different state texts
- **Card variants:** open, closed, preset active, moving, various preset configurations

## UX Design Reference

### Design Language

The visual style follows the Mushroom card aesthetic:

- **Card container:** rounded corners (12px border-radius), subtle border, 16px inner padding
- **Entity icon:** 36px circle with colored background (active: accent color, inactive: muted)
- **Typography:** 14px/500 for entity name, 12px for state text (secondary color)
- **Controls:** circular icon buttons (30px), no text labels
- **Chips:** pill-shaped (14px border-radius, 28px height), icon + label, highlighted when matching current position
- **Spacing:** 14px gap between element rows (header → slider, slider → chips)
- **Theming:** uses HA CSS custom properties throughout for light/dark mode compatibility

### Card Variants

#### Full (`custom:shutter-card`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name              [▲] [■] [▼] │  Header: icon, name, state, open/stop/close
│     State text                            │
│                                           │
│  🔒    👁    ≡    ↗    ☀                  │  Snap-point icons (above track)
│  ──●──○────○────○────────────○──          │  Slider track with snap dots + thumb
│                                           │
│  [≡ Slats open]  [↗ Half open]           │  Chips (only for presets with labels)
└──────────────────────────────────────────┘
```

Slider with icon snap points, open/stop/close controls, chip buttons for labeled presets.

#### Compact — Chips (`custom:shutter-card-compact-chips`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name          [▲] [■] [▼]     │  Header: icon, name, state, open/stop/close
│     State text                            │
│                                           │
│  [🔒 Closed] [≡ Slats] [↗ Half] [☀ Open]│  Chips for all presets
└──────────────────────────────────────────┘
```

Header with controls, all presets as chip buttons, no slider.

#### Compact — Slider (`custom:shutter-card-compact-slider`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name          [▲] [■] [▼]     │  Header: icon, name, state, open/stop/close
│     State text                            │
│                                           │
│  🔒       ≡         ↗              ☀     │  Snap-point icons
│  ──○──────○─────────○──────────────○──   │  Slider track with snap dots
└──────────────────────────────────────────┘
```

Header with controls, snap-point slider, no chips.

#### Minimal (`custom:shutter-card-minimal`)

```
┌──────────────────────────────────────────┐
│ (●) Entity Name          [▲] [■] [▼]     │  Header: icon, name, state, open/stop/close
│     State text                            │
└──────────────────────────────────────────┘
```

Header with controls only, no slider, no chips.

### Snap-Point Slider

- Each preset is rendered as a dot on the track with its icon floating above
- The thumb snaps to a preset position when dragged within a proximity threshold
- Snapped state: thumb shrinks and fills with accent color
- Between presets: thumb shows as a larger, hollow circle
- The filled portion of the track (from left to the current position) uses the accent color
- Open (100%) and Closed (0%) are always present as fixed snap points

### Slider State Model

The slider has two visual elements that move independently:

- **Thumb (knob):** represents the **target position**. Moves immediately when the user interacts. Does not move while the shutter is in motion.
- **Fill (accent bar):** represents the **current position**. Updates in real time as the entity's position changes.

**Idle state:** fill extends exactly to the thumb — current and target are equal.

**Moving state** (cover state is `opening` or `closing`):

- Thumb stays fixed at the target position
- Fill animates in real time, growing or shrinking toward the thumb
- Fill pulsates to indicate motion
- When stop is pressed, the thumb snaps to the current position

**Transitions:** all slider movements use CSS transitions. No element should jump without a visible transition.

### State Display

Priority for the state text:

1. **Open (100%)** → "Open"
2. **Closed (0%)** → "Closed"
3. **Matching preset with label** → preset icon + label (e.g. `≡ Slats open`)
4. **Matching preset without label** → preset icon + position as percentage (e.g. `≡ 5%`)
5. **No matching preset** → position as percentage (e.g. `37%`)

The entity icon uses active styling (accent background) when position > 0, inactive styling (muted background) when closed.

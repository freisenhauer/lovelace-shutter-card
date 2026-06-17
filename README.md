# Shutter Card for Home Assistant

A custom Lovelace card for controlling European-style roller shutters (Jalousien/Rollläden) in Home Assistant.

## What makes this card different?

Most shutter cards treat covers as simple open/close devices. European roller shutters behave differently: the panel consists of individual slats that are pulled apart by gravity as the shutter lowers, forming visible gaps between them. These gaps only close once the bottom edge of the panel reaches the bottom and the slats compress under their own weight. It's common to want the shutter lowered but with gaps still open for ventilation and light.

This card natively understands that behavior and lets you define **configurable position presets** — specific percentage values that can be targeted directly, making it easy to reach common positions like "closed with slats open" or "half-open" with a single tap.

## Features

- Native support for European roller shutter behavior (slat positions)
- Configurable position presets with icons and optional labels
- Snap-point slider with preset icons as anchor points
- Control of `cover` entities
- HACS installation support

## Installation

### HACS (recommended)

1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click the menu (top right) → "Custom repositories"
4. Add this repository URL, category: "Lovelace"
5. Install "Shutter Card"

### Manual

1. Download `lovelace-shutter-card.js` from the [latest release](../../releases/latest)
2. Copy it to `config/www/`
3. Add the resource in your Lovelace configuration:
   ```yaml
   resources:
     - url: /local/lovelace-shutter-card.js
       type: module
   ```

## Configuration

```yaml
type: custom:shutter-card
entity: cover.living_room_shutter
presets:
  - icon: mdi:blinds-horizontal
    label: Slats open
    position: 15
  - icon: mdi:blinds-horizontal-closed
    position: 5
  - icon: mdi:arrow-expand-vertical
    label: Half open
    position: 50
```

### Options

| Option    | Type   | Required | Description                                 |
|-----------|--------|----------|---------------------------------------------|
| `entity`  | string | yes      | A `cover` entity ID                         |
| `presets` | list   | no       | List of position presets (label + position)  |

### Preset options

| Option     | Type   | Required | Description                                       |
|------------|--------|----------|---------------------------------------------------|
| `icon`     | string | yes      | Icon to display (e.g. `mdi:blinds-horizontal`)    |
| `label`    | string | no       | Optional display name (shown in chip buttons)     |
| `position` | number | yes      | Target position (0-100)                           |

Preset icons are displayed as snap points on the slider. If a `label` is defined, the preset also appears as a chip button below the slider.

## Development

### Prerequisites

- Node.js (LTS)
- pnpm

### Setup

```bash
pnpm install
```

### Commands

```bash
pnpm dev          # Build with watch mode
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm format       # Format code with Prettier
pnpm format:check # Check formatting
```

### Testing locally in Home Assistant

1. Run `pnpm build`
2. Copy `dist/lovelace-shutter-card.js` to your HA `config/www/` directory
3. Add as a Lovelace resource (see manual installation)
4. Clear browser cache and reload

## License

MIT

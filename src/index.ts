import "./cards/shutter/shutter-card.js";
import "./cards/shutter/shutter-card-compact-chips.js";
import "./cards/shutter/shutter-card-compact-slider.js";
import "./cards/shutter/shutter-card-minimal.js";

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
    }>;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push(
  {
    type: "fr-shutter-card",
    name: "Shutter Card",
    description: "Full shutter card with slider and preset chips",
  },
  {
    type: "fr-shutter-card-compact-chips",
    name: "Shutter Card — Compact Chips",
    description: "Compact shutter card with preset chips",
  },
  {
    type: "fr-shutter-card-compact-slider",
    name: "Shutter Card — Compact Slider",
    description: "Compact shutter card with snap-point slider",
  },
  {
    type: "fr-shutter-card-minimal",
    name: "Shutter Card — Minimal",
    description: "Minimal shutter card with header only",
  },
);

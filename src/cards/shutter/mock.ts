import type { HomeAssistant } from "../../shared/types/ha.js";
import type { ShutterCardConfig } from "../../shared/types/config.js";
import type { SliderPreset } from "../../shared/types/preset.js";

export const TYPICAL_PRESETS: SliderPreset[] = [
  { icon: "mdi:eye", position: 5 },
  { icon: "mdi:blinds-horizontal", label: "Slats open", position: 15 },
  { icon: "mdi:arrow-expand-vertical", label: "Half open", position: 50 },
];

export function mockConfig(overrides?: Partial<ShutterCardConfig>): ShutterCardConfig {
  return {
    type: "custom:fr-shutter-card",
    entity: "cover.living_room",
    presets: TYPICAL_PRESETS,
    ...overrides,
  };
}

export function mockHass(position: number, state?: string): HomeAssistant {
  const resolvedState = state ?? (position >= 100 ? "open" : position <= 0 ? "closed" : "open");

  return {
    states: {
      "cover.living_room": {
        entity_id: "cover.living_room",
        state: resolvedState,
        attributes: {
          friendly_name: "Living Room Shutter",
          icon: "mdi:window-shutter",
          current_position: position,
        },
      },
    },
    callService: async (domain: string, service: string, data?: Record<string, unknown>) => {
      console.log("callService", domain, service, data);
    },
  };
}

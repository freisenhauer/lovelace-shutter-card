import type { SliderPreset } from "./preset.js";

export interface ShutterCardConfig {
  type: string;
  entity: string;
  name?: string;
  icon?: string;
  presets?: SliderPreset[];
}

import type { SliderPreset } from "./preset.js";

export interface ActionConfig {
  action: "more-info" | "navigate" | "call-service" | "toggle" | "none";
  navigation_path?: string;
  service?: string;
  data?: Record<string, unknown>;
}

export interface ShutterCardConfig {
  type: string;
  entity: string;
  name?: string;
  icon?: string;
  presets?: SliderPreset[];
  tap_action?: ActionConfig;
}

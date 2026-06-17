import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { ShutterCardBase } from "../../shared/base/shutter-card-base.js";
import { mockConfig, mockHass, TYPICAL_PRESETS } from "./mock.js";
import "./shutter-card.js";

function setup(
  el: ShutterCardBase,
  position: number,
  state?: string,
  configOverrides?: Parameters<typeof mockConfig>[0],
) {
  el.setConfig(mockConfig(configOverrides));
  el.hass = mockHass(position, state);
}

const meta: Meta = {
  title: "Cards/ShutterCard",
  component: "shutter-card",
  render: (args) => {
    const el = document.createElement("shutter-card") as ShutterCardBase;
    setup(el, args.position ?? 0, args.state, args.configOverrides);
    return html`<div style="padding: 24px; max-width: 400px;">${el}</div>`;
  },
};

export default meta;
type Story = StoryObj;

export const Closed: Story = {
  args: { position: 0 },
};

export const Open: Story = {
  args: { position: 100 },
};

export const PresetWithLabel: Story = {
  name: "Preset active (Slats open)",
  args: { position: 15 },
};

export const PresetWithoutLabel: Story = {
  name: "Preset active (icon only, 5%)",
  args: { position: 5 },
};

export const BetweenPresets: Story = {
  name: "Between presets (37%)",
  args: { position: 37 },
};

export const Opening: Story = {
  name: "Moving — opening",
  args: { position: 30, state: "opening" },
};

export const Closing: Story = {
  name: "Moving — closing",
  args: { position: 70, state: "closing" },
};

export const NoPresets: Story = {
  name: "No presets configured",
  args: { position: 50, configOverrides: { presets: [] } },
};

export const PresetsWithoutLabels: Story = {
  name: "Presets without labels (no chips)",
  args: {
    position: 15,
    configOverrides: {
      presets: TYPICAL_PRESETS.map(({ icon, position }) => ({
        icon,
        position,
      })),
    },
  },
};

export const AllStates: Story = {
  name: "All states overview",
  render: () => {
    const cards = [
      { label: "Closed", position: 0 },
      { label: "Open", position: 100 },
      { label: "Preset (Slats open)", position: 15 },
      { label: "Between presets", position: 37 },
      { label: "Opening", position: 30, state: "opening" },
    ];
    return html`
      <div
        style="padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 16px;"
      >
        ${cards.map((c) => {
          const el = document.createElement("shutter-card") as ShutterCardBase;
          setup(el, c.position, c.state);
          return html`
            <div>
              <div
                style="font-size: 11px; color: #999; margin-bottom: 4px; font-family: monospace;"
              >
                ${c.label}
              </div>
              ${el}
            </div>
          `;
        })}
      </div>
    `;
  },
};

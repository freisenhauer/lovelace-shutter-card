import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { ShutterCardBase } from "../../shared/base/shutter-card-base.js";
import { mockConfig, mockHass } from "./mock.js";
import "./shutter-card-compact-chips.js";

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
  title: "Cards/ShutterCardCompactChips",
  component: "shutter-card-compact-chips",
  render: (args) => {
    const el = document.createElement("shutter-card-compact-chips") as ShutterCardBase;
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

export const PresetActive: Story = {
  name: "Preset active (Slats open)",
  args: { position: 15 },
};

export const BetweenPresets: Story = {
  name: "Between presets (37%)",
  args: { position: 37 },
};

export const Opening: Story = {
  name: "Moving — opening",
  args: { position: 30, state: "opening" },
};

export const NoPresets: Story = {
  name: "No presets configured",
  args: { position: 50, configOverrides: { presets: [] } },
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
          const el = document.createElement("shutter-card-compact-chips") as ShutterCardBase;
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

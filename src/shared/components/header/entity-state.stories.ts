import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./entity-state.js";
import type { SliderPreset } from "../../types/preset.js";

const typicalPresets: SliderPreset[] = [
  { icon: "mdi:eye", position: 5 },
  { icon: "mdi:blinds-horizontal", label: "Slats open", position: 15 },
  { icon: "mdi:arrow-expand-vertical", label: "Half open", position: 50 },
];

const meta: Meta = {
  title: "Shared/Header/EntityState",
  component: "entity-state",
  argTypes: {
    currentPosition: { control: { type: "range", min: 0, max: 100 } },
  },
  render: (args) => html`
    <div style="padding: 24px;">
      <entity-state
        .currentPosition=${args.currentPosition ?? 0}
        .presets=${args.presets ?? typicalPresets}
      ></entity-state>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Open: Story = {
  args: { currentPosition: 100 },
};

export const Closed: Story = {
  args: { currentPosition: 0 },
};

export const PresetWithLabel: Story = {
  name: "Preset with label (Slats open)",
  args: { currentPosition: 15 },
};

export const PresetWithoutLabel: Story = {
  name: "Preset without label (icon + %)",
  args: { currentPosition: 5 },
};

export const NoMatchingPreset: Story = {
  name: "No matching preset (% only)",
  args: { currentPosition: 37 },
};

export const AllStates: Story = {
  name: "All state variants",
  render: () => html`
    <div style="padding: 24px; display: flex; flex-direction: column; gap: 12px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #999; min-width: 50px;">100%</span>
        <entity-state .currentPosition=${100} .presets=${typicalPresets}></entity-state>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #999; min-width: 50px;">0%</span>
        <entity-state .currentPosition=${0} .presets=${typicalPresets}></entity-state>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #999; min-width: 50px;">15%</span>
        <entity-state .currentPosition=${15} .presets=${typicalPresets}></entity-state>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #999; min-width: 50px;">5%</span>
        <entity-state .currentPosition=${5} .presets=${typicalPresets}></entity-state>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 12px; color: #999; min-width: 50px;">37%</span>
        <entity-state .currentPosition=${37} .presets=${typicalPresets}></entity-state>
      </div>
    </div>
  `,
};

import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./snap-point-slider.js";
import type { SliderPreset } from "../../types/preset.js";

const typicalPresets: SliderPreset[] = [
  { icon: "mdi:eye", position: 5 },
  { icon: "mdi:blinds-horizontal", label: "Slats open", position: 15 },
  { icon: "mdi:arrow-expand-vertical", label: "Half open", position: 50 },
];

const manyPresets: SliderPreset[] = [
  { icon: "mdi:eye", position: 5 },
  { icon: "mdi:blinds-horizontal", label: "Slats", position: 15 },
  { icon: "mdi:blinds-horizontal-closed", position: 25 },
  { icon: "mdi:arrow-collapse-vertical", position: 40 },
  { icon: "mdi:arrow-expand-vertical", label: "Half", position: 50 },
  { icon: "mdi:weather-sunny", position: 75 },
];

const meta: Meta = {
  title: "Shared/SnapPointSlider",
  component: "snap-point-slider",
  argTypes: {
    currentPosition: { control: { type: "range", min: 0, max: 100 } },
    targetPosition: { control: { type: "range", min: 0, max: 100 } },
    moving: { control: "boolean" },
    closing: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => html`
    <div style="width: 350px; padding: 24px;">
      <snap-point-slider
        .presets=${args.presets ?? typicalPresets}
        .currentPosition=${args.currentPosition ?? 0}
        .targetPosition=${args.targetPosition ?? 0}
        ?moving=${args.moving}
        ?closing=${args.closing}
        ?disabled=${args.disabled}
        @position-changed=${(e: CustomEvent) => console.log("position-changed", e.detail)}
      ></snap-point-slider>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const IdleClosed: Story = {
  name: "Idle — Closed",
  args: {
    currentPosition: 0,
    targetPosition: 0,
    presets: typicalPresets,
  },
};

export const IdleOpen: Story = {
  name: "Idle — Open",
  args: {
    currentPosition: 100,
    targetPosition: 100,
    presets: typicalPresets,
  },
};

export const IdleSnappedToPreset: Story = {
  name: "Idle — Snapped to preset",
  args: {
    currentPosition: 15,
    targetPosition: 15,
    presets: typicalPresets,
  },
};

export const IdleBetweenPresets: Story = {
  name: "Idle — Between presets",
  args: {
    currentPosition: 37,
    targetPosition: 37,
    presets: typicalPresets,
  },
};

export const MovingOpening: Story = {
  name: "Moving — Opening",
  args: {
    currentPosition: 30,
    targetPosition: 80,
    moving: true,
    presets: typicalPresets,
  },
};

export const MovingClosing: Story = {
  name: "Moving — Closing",
  args: {
    currentPosition: 70,
    targetPosition: 20,
    moving: true,
    closing: true,
    presets: typicalPresets,
  },
};

export const FewPresets: Story = {
  name: "Few presets (endpoints only)",
  args: {
    currentPosition: 50,
    targetPosition: 50,
    presets: [],
  },
};

export const ManyPresets: Story = {
  name: "Many presets",
  args: {
    currentPosition: 25,
    targetPosition: 25,
    presets: manyPresets,
  },
};

export const Disabled: Story = {
  name: "Disabled",
  args: {
    currentPosition: 15,
    targetPosition: 15,
    presets: typicalPresets,
    disabled: true,
  },
};

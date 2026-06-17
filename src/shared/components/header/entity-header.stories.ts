import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./entity-header.js";
import type { SliderPreset } from "../../types/preset.js";

const typicalPresets: SliderPreset[] = [
  { icon: "mdi:eye", position: 5 },
  { icon: "mdi:blinds-horizontal", label: "Slats open", position: 15 },
  { icon: "mdi:arrow-expand-vertical", label: "Half open", position: 50 },
];

const meta: Meta = {
  title: "Shared/Header/EntityHeader",
  component: "entity-header",
  argTypes: {
    name: { control: "text" },
    icon: { control: "text" },
    currentPosition: { control: { type: "range", min: 0, max: 100 } },
    moving: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => html`
    <div style="padding: 24px; max-width: 400px;">
      <entity-header
        .name=${args.name ?? "Living Room Shutter"}
        .icon=${args.icon ?? "mdi:window-shutter"}
        .currentPosition=${args.currentPosition ?? 0}
        .presets=${args.presets ?? typicalPresets}
        ?moving=${args.moving}
        ?disabled=${args.disabled}
        @control-action=${(e: CustomEvent) => console.log("control-action", e.detail)}
      ></entity-header>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Closed: Story = {
  name: "Closed (inactive)",
  args: {
    name: "Living Room Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 0,
  },
};

export const Open: Story = {
  name: "Open (active)",
  args: {
    name: "Living Room Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 100,
  },
};

export const PresetActive: Story = {
  name: "Preset active (Slats open)",
  args: {
    name: "Bedroom Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 15,
  },
};

export const BetweenPresets: Story = {
  name: "Between presets (37%)",
  args: {
    name: "Kitchen Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 37,
  },
};

export const Moving: Story = {
  name: "Moving (stop enabled)",
  args: {
    name: "Living Room Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 50,
    moving: true,
  },
};

export const FullyOpen: Story = {
  name: "Fully open (open disabled)",
  args: {
    name: "Living Room Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 100,
  },
};

export const Disabled: Story = {
  args: {
    name: "Unavailable Shutter",
    icon: "mdi:window-shutter",
    currentPosition: 50,
    disabled: true,
  },
};

export const LongName: Story = {
  name: "Long entity name (overflow)",
  args: {
    name: "Wohnzimmer Jalousie Links Südfenster",
    icon: "mdi:window-shutter",
    currentPosition: 15,
  },
};

export const AllStates: Story = {
  name: "All state variants",
  render: () => html`
    <div style="padding: 24px; max-width: 400px; display: flex; flex-direction: column; gap: 16px;">
      <entity-header
        .name=${"Closed"}
        .icon=${"mdi:window-shutter"}
        .currentPosition=${0}
        .presets=${typicalPresets}
      ></entity-header>
      <entity-header
        .name=${"Open"}
        .icon=${"mdi:window-shutter"}
        .currentPosition=${100}
        .presets=${typicalPresets}
      ></entity-header>
      <entity-header
        .name=${"Slats open"}
        .icon=${"mdi:window-shutter"}
        .currentPosition=${15}
        .presets=${typicalPresets}
      ></entity-header>
      <entity-header
        .name=${"Peekaboo (5%)"}
        .icon=${"mdi:window-shutter"}
        .currentPosition=${5}
        .presets=${typicalPresets}
      ></entity-header>
      <entity-header
        .name=${"Custom (37%)"}
        .icon=${"mdi:window-shutter"}
        .currentPosition=${37}
        .presets=${typicalPresets}
      ></entity-header>
    </div>
  `,
};

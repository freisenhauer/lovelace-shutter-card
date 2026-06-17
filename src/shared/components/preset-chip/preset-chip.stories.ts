import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./preset-chip.js";

const meta: Meta = {
  title: "Shared/PresetChip",
  component: "preset-chip",
  argTypes: {
    icon: { control: "text" },
    label: { control: "text" },
    position: { control: { type: "range", min: 0, max: 100 } },
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => html`
    <div style="padding: 24px;">
      <preset-chip
        .icon=${args.icon ?? "mdi:blinds-horizontal"}
        .label=${args.label ?? "Slats open"}
        .position=${args.position ?? 15}
        ?active=${args.active}
        ?disabled=${args.disabled}
        @preset-selected=${(e: CustomEvent) => console.log("preset-selected", e.detail)}
      ></preset-chip>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    icon: "mdi:blinds-horizontal",
    label: "Slats open",
    position: 15,
  },
};

export const Active: Story = {
  args: {
    icon: "mdi:blinds-horizontal",
    label: "Slats open",
    position: 15,
    active: true,
  },
};

export const IconOnly: Story = {
  name: "Icon only (no label)",
  args: {
    icon: "mdi:eye",
    label: "",
    position: 5,
  },
};

export const IconOnlyActive: Story = {
  name: "Icon only — active",
  args: {
    icon: "mdi:eye",
    label: "",
    position: 5,
    active: true,
  },
};

export const Disabled: Story = {
  args: {
    icon: "mdi:blinds-horizontal",
    label: "Slats open",
    position: 15,
    disabled: true,
  },
};

export const MultipleChips: Story = {
  name: "Multiple chips in a row",
  render: () => html`
    <div style="padding: 24px; display: flex; gap: 6px; flex-wrap: wrap;">
      <preset-chip icon="mdi:lock" label="Closed" .position=${0}></preset-chip>
      <preset-chip
        icon="mdi:blinds-horizontal"
        label="Slats open"
        .position=${15}
        active
      ></preset-chip>
      <preset-chip icon="mdi:arrow-expand-vertical" label="Half open" .position=${50}></preset-chip>
      <preset-chip icon="mdi:white-balance-sunny" label="Open" .position=${100}></preset-chip>
    </div>
  `,
};

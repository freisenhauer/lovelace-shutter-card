import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./control-buttons.js";

const meta: Meta = {
  title: "Shared/Header/ControlButtons",
  component: "control-buttons",
  argTypes: {
    currentPosition: { control: { type: "range", min: 0, max: 100 } },
    moving: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => html`
    <div style="padding: 24px;">
      <control-buttons
        .currentPosition=${args.currentPosition ?? 50}
        ?moving=${args.moving}
        ?disabled=${args.disabled}
        @control-action=${(e: CustomEvent) => console.log("control-action", e.detail)}
      ></control-buttons>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  name: "Idle at 50%",
  args: { currentPosition: 50 },
};

export const FullyOpen: Story = {
  name: "Fully open (open disabled)",
  args: { currentPosition: 100 },
};

export const FullyClosed: Story = {
  name: "Fully closed (close disabled)",
  args: { currentPosition: 0 },
};

export const Moving: Story = {
  name: "Moving (stop enabled)",
  args: { currentPosition: 50, moving: true },
};

export const Disabled: Story = {
  name: "All disabled",
  args: { currentPosition: 50, disabled: true },
};

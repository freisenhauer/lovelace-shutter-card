import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import "./control-buttons.js";

const meta: Meta = {
  title: "Shared/Header/ControlButtons",
  component: "control-buttons",
  argTypes: {
    disabled: { control: "boolean" },
  },
  render: (args) => html`
    <div style="padding: 24px;">
      <control-buttons
        ?disabled=${args.disabled}
        @control-action=${(e: CustomEvent) => console.log("control-action", e.detail)}
      ></control-buttons>
    </div>
  `,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {},
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

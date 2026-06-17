import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { SliderPreset } from "../../types/preset.js";
import "./control-buttons/control-buttons.js";
import "./entity-state/entity-state.js";

@customElement("entity-header")
export class EntityHeader extends LitElement {
  @property({ type: String })
  name = "";

  @property({ type: String })
  icon = "";

  @property({ type: Number, attribute: "current-position" })
  currentPosition = 0;

  @property({ type: Array })
  presets: SliderPreset[] = [];

  @property({ type: Boolean })
  moving = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private get active(): boolean {
    return this.currentPosition > 0;
  }

  protected render() {
    return html`
      <div class="header">
        <div class="info">
          <div class="icon-circle" ?active=${this.active}>
            <ha-icon .icon=${this.icon}></ha-icon>
          </div>
          <div class="text">
            <span class="name">${this.name}</span>
            <entity-state
              .currentPosition=${this.currentPosition}
              .presets=${this.presets}
            ></entity-state>
          </div>
        </div>
        <control-buttons
          .currentPosition=${this.currentPosition}
          ?moving=${this.moving}
          ?disabled=${this.disabled}
        ></control-buttons>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --_accent: var(--header-accent-color, var(--primary-color, #03a9f4));
      --_icon-circle-size: var(--header-icon-circle-size, 36px);
      --_icon-size: var(--header-icon-size, 18px);
      --_inactive-bg: var(--header-icon-inactive-bg, var(--secondary-background-color, #f0f0f0));
      --_inactive-color: var(--header-icon-inactive-color, var(--secondary-text-color, #727272));
      --_name-color: var(--header-name-color, var(--primary-text-color, #212121));
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .info {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 0;
    }

    .icon-circle {
      width: var(--_icon-circle-size);
      height: var(--_icon-circle-size);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--_inactive-bg);
      color: var(--_inactive-color);
      transition:
        background-color 200ms ease,
        color 200ms ease;
    }

    .icon-circle[active] {
      background: color-mix(in srgb, var(--_accent) 20%, transparent);
      color: var(--_accent);
    }

    .icon-circle ha-icon {
      --mdc-icon-size: var(--_icon-size);
      display: inline-flex;
    }

    .text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .name {
      font-size: 14px;
      font-weight: 500;
      color: var(--_name-color);
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "entity-header": EntityHeader;
  }
}

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { SliderPreset } from "../../types/preset.js";

@customElement("entity-state")
export class EntityState extends LitElement {
  @property({ type: Number, attribute: "current-position" })
  currentPosition = 0;

  @property({ type: Array })
  presets: SliderPreset[] = [];

  private get stateInfo(): { icon: string | null; text: string } {
    const pos = this.currentPosition;

    if (pos >= 100) return { icon: null, text: "Open" };
    if (pos <= 0) return { icon: null, text: "Closed" };

    const match = this.presets.find((p) => p.position === pos);
    if (match?.label) return { icon: match.icon, text: match.label };
    if (match) return { icon: match.icon, text: `${Math.round(pos)}%` };

    return { icon: null, text: `${Math.round(pos)}%` };
  }

  protected render() {
    const { icon, text } = this.stateInfo;

    return html`
      <span class="state">
        ${icon ? html`<ha-icon .icon=${icon}></ha-icon>` : ""}
        <span>${text}</span>
      </span>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      --_text-color: var(--entity-state-color, var(--secondary-text-color, #727272));
      --_icon-size: var(--entity-state-icon-size, 14px);
    }

    .state {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--_text-color);
      line-height: 1.3;
    }

    ha-icon {
      --mdc-icon-size: var(--_icon-size);
      display: inline-flex;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "entity-state": EntityState;
  }
}

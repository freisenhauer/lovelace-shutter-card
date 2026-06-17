import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("preset-chip")
export class PresetChip extends LitElement {
  @property({ type: String })
  icon = "";

  @property({ type: String })
  label = "";

  @property({ type: Number })
  position = 0;

  @property({ type: Boolean, reflect: true })
  active = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  private onClick(): void {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent("preset-selected", {
        detail: { position: this.position },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <button ?disabled=${this.disabled} @click=${this.onClick}>
        <ha-icon .icon=${this.icon}></ha-icon>
        ${this.label ? html`<span>${this.label}</span>` : ""}
      </button>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      --_accent: var(--chip-accent-color, var(--primary-color, #03a9f4));
      --_bg: var(--chip-background-color, var(--secondary-background-color, #f0f0f0));
      --_text: var(--chip-text-color, var(--primary-text-color, #212121));
      --_icon-size: var(--chip-icon-size, 16px);
    }

    button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      height: 28px;
      padding: 0 10px;
      border-radius: 14px;
      border: 1px solid transparent;
      background: var(--_bg);
      color: var(--_text);
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      white-space: nowrap;
      transition:
        background-color 150ms ease,
        color 150ms ease,
        border-color 150ms ease;
    }

    button:hover {
      filter: brightness(0.95);
    }

    button:active {
      transform: scale(0.96);
    }

    :host([active]) button {
      background: color-mix(in srgb, var(--_accent) 15%, transparent);
      color: var(--_accent);
      border-color: var(--_accent);
    }

    :host([disabled]) button {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    }

    ha-icon {
      --mdc-icon-size: var(--_icon-size);
      display: inline-flex;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "preset-chip": PresetChip;
  }
}

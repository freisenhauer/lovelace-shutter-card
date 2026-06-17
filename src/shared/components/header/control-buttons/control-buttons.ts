import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

export type ControlAction = "open" | "stop" | "close";

@customElement("control-buttons")
export class ControlButtons extends LitElement {
  @property({ type: Boolean, reflect: true })
  disabled = false;

  @property({ type: Number, attribute: "current-position" })
  currentPosition = 0;

  @property({ type: Boolean })
  moving = false;

  @property({ type: Boolean })
  closing = false;

  private get _opening(): boolean {
    return this.moving && !this.closing;
  }

  private onAction(action: ControlAction): void {
    this.dispatchEvent(
      new CustomEvent("control-action", {
        detail: { action },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    const openDisabled = this.disabled || this.currentPosition >= 100;
    const stopDisabled = this.disabled || !this.moving;
    const closeDisabled = this.disabled || this.currentPosition <= 0;

    return html`
      <div class="buttons">
        <button
          class=${classMap({ active: this._opening })}
          aria-label="Open"
          ?disabled=${openDisabled}
          @click=${() => this.onAction("open")}
        >
          <ha-icon .icon=${"mdi:arrow-up"}></ha-icon>
        </button>
        <button aria-label="Stop" ?disabled=${stopDisabled} @click=${() => this.onAction("stop")}>
          <ha-icon .icon=${"mdi:stop"}></ha-icon>
        </button>
        <button
          class=${classMap({ active: this.closing })}
          aria-label="Close"
          ?disabled=${closeDisabled}
          @click=${() => this.onAction("close")}
        >
          <ha-icon .icon=${"mdi:arrow-down"}></ha-icon>
        </button>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: inline-flex;
      --_btn-size: var(--control-button-size, 30px);
      --_icon-size: var(--control-icon-size, 16px);
      --_accent: var(--control-button-accent, var(--primary-color, #03a9f4));
      --_bg: var(--control-button-background, var(--secondary-background-color, #f0f0f0));
      --_text: var(--control-button-color, var(--primary-text-color, #212121));
    }

    .buttons {
      display: flex;
      gap: 4px;
    }

    button {
      width: var(--_btn-size);
      height: var(--_btn-size);
      border-radius: 50%;
      border: 1px solid transparent;
      background: var(--_bg);
      color: var(--_text);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0;
      transition:
        background-color 150ms ease,
        transform 100ms ease;
    }

    button:hover {
      filter: brightness(0.95);
    }

    button:active {
      transform: scale(0.92);
    }

    button.active {
      background: color-mix(in srgb, var(--_accent) 20%, transparent);
      color: var(--_accent);
    }

    button:disabled {
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
    "control-buttons": ControlButtons;
  }
}

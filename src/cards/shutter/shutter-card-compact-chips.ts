import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { ShutterCardBase } from "../../shared/base/shutter-card-base.js";
import { cardStyles } from "../../shared/styles/card.js";
import "../../shared/components/header/entity-header.js";
import "../../shared/components/preset-chip/preset-chip.js";

@customElement("shutter-card-compact-chips")
export class ShutterCardCompactChips extends ShutterCardBase {
  protected render() {
    if (!this._config || !this.hass) return html``;

    return html`
      <ha-card>
        <div class="card-content">
          <entity-header
            .name=${this._entityName}
            .icon=${this._entityIcon}
            .currentPosition=${this._currentPosition}
            .presets=${this._presets}
            ?moving=${this._isMoving}
            ?closing=${this._isClosing}
            @control-action=${this._handleControlAction}
          ></entity-header>
          ${this._presets.length
            ? html`
                <div class="chips">
                  ${this._presets.map(
                    (p) => html`
                      <preset-chip
                        .icon=${p.icon}
                        .label=${p.label ?? ""}
                        .position=${p.position}
                        ?active=${this._currentPosition === p.position}
                        @preset-selected=${this._handlePositionChanged}
                      ></preset-chip>
                    `,
                  )}
                </div>
              `
            : ""}
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 2;
  }

  static styles = cardStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    "shutter-card-compact-chips": ShutterCardCompactChips;
  }
}

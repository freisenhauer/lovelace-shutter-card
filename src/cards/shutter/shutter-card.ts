import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { ShutterCardBase } from "../../shared/base/shutter-card-base.js";
import { cardStyles } from "../../shared/styles/card.js";
import "../../shared/components/header/entity-header.js";
import "../../shared/components/snap-point-slider/snap-point-slider.js";
import "../../shared/components/preset-chip/preset-chip.js";

@customElement("fr-shutter-card")
export class ShutterCard extends ShutterCardBase {
  protected render() {
    if (!this._config || !this.hass) return html``;

    const chipsPresets = this._presets.filter((p) => p.label);

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
            @header-click=${this._handleHeaderClick}
          ></entity-header>
          <snap-point-slider
            .presets=${this._presets}
            .currentPosition=${this._currentPosition}
            .targetPosition=${this._effectiveTargetPosition}
            ?moving=${this._isMoving}
            ?closing=${this._isClosing}
            @position-changed=${this._handlePositionChanged}
          ></snap-point-slider>
          ${chipsPresets.length
            ? html`
                <div class="chips">
                  ${chipsPresets.map(
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
    return 3;
  }

  static styles = cardStyles;
}

declare global {
  interface HTMLElementTagNameMap {
    "fr-shutter-card": ShutterCard;
  }
}

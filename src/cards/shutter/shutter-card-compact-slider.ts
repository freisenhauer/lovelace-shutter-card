import { html } from "lit";
import { customElement } from "lit/decorators.js";
import { ShutterCardBase } from "../../shared/base/shutter-card-base.js";
import { cardStyles } from "../../shared/styles/card.js";
import "../../shared/components/header/entity-header.js";
import "../../shared/components/snap-point-slider/snap-point-slider.js";

@customElement("fr-shutter-card-compact-slider")
export class ShutterCardCompactSlider extends ShutterCardBase {
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
          <snap-point-slider
            .presets=${this._presets}
            .currentPosition=${this._currentPosition}
            .targetPosition=${this._effectiveTargetPosition}
            ?moving=${this._isMoving}
            ?closing=${this._isClosing}
            @position-changed=${this._handlePositionChanged}
          ></snap-point-slider>
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
    "fr-shutter-card-compact-slider": ShutterCardCompactSlider;
  }
}

import { html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { ShutterCardBase } from "../../shared/base/shutter-card-base.js";
import "../../shared/components/header/entity-header.js";

@customElement("shutter-card-minimal")
export class ShutterCardMinimal extends ShutterCardBase {
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
        </div>
      </ha-card>
    `;
  }

  getCardSize() {
    return 1;
  }

  static styles = css`
    .card-content {
      padding: 16px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "shutter-card-minimal": ShutterCardMinimal;
  }
}

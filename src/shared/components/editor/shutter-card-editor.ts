import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import type { ShutterCardConfig, ActionConfig } from "../../types/config.js";
import type { SliderPreset } from "../../types/preset.js";
import type { HomeAssistant } from "../../types/ha.js";

const TAP_ACTION_OPTIONS = [
  { value: "more-info", label: "More info" },
  { value: "toggle", label: "Toggle" },
  { value: "navigate", label: "Navigate" },
  { value: "call-service", label: "Call service" },
  { value: "none", label: "None" },
];

const LABELS: Record<string, string> = {
  entity: "Entity",
  name: "Name (optional)",
  icon: "Icon (optional)",
  tap_action: "Tap action",
  navigation_path: "Navigation path",
  service: "Service (e.g. cover.toggle)",
};

@customElement("fr-shutter-card-editor")
export class ShutterCardEditor extends LitElement {
  @property({ attribute: false })
  hass?: HomeAssistant;

  @state()
  private _config?: ShutterCardConfig;

  setConfig(config: ShutterCardConfig): void {
    this._config = { ...config };
  }

  private get _schema() {
    const tapAction = this._config?.tap_action?.action ?? "more-info";

    const schema: Array<Record<string, unknown>> = [
      {
        name: "entity",
        required: true,
        selector: { entity: { domain: "cover" } },
      },
      { name: "name", selector: { text: {} } },
      { name: "icon", selector: { icon: {} } },
      {
        name: "tap_action",
        selector: { select: { options: TAP_ACTION_OPTIONS, mode: "dropdown" } },
      },
    ];

    if (tapAction === "navigate") {
      schema.push({ name: "navigation_path", selector: { text: {} } });
    } else if (tapAction === "call-service") {
      schema.push({ name: "service", selector: { text: {} } });
    }

    return schema;
  }

  private get _formData() {
    return {
      ...this._config,
      tap_action: this._config?.tap_action?.action ?? "more-info",
      navigation_path: this._config?.tap_action?.navigation_path ?? "",
      service: this._config?.tap_action?.service ?? "",
    };
  }

  private _computeLabel = (schema: { name: string }): string => {
    return LABELS[schema.name] ?? schema.name;
  };

  protected render() {
    if (!this.hass || !this._config) return nothing;

    return html`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._formData}
          .schema=${this._schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._formChanged}
        ></ha-form>

        <div class="section">
          <div class="section-header">Presets</div>

          ${(this._config.presets ?? []).map(
            (preset, index) => html`
              <div class="preset-row">
                <ha-icon-picker
                  class="preset-icon"
                  .hass=${this.hass}
                  .value=${preset.icon}
                  .label=${"Icon"}
                  @value-changed=${(e: CustomEvent) =>
                    this._presetChanged(index, {
                      icon: e.detail.value as string,
                    })}
                ></ha-icon-picker>

                <ha-textfield
                  class="preset-position"
                  type="number"
                  min="0"
                  max="100"
                  .value=${String(preset.position)}
                  .label=${"Position"}
                  .suffix=${"%"}
                  @input=${(e: Event) => {
                    const val = Number((e.target as HTMLInputElement).value);
                    if (!Number.isNaN(val)) {
                      this._presetChanged(index, {
                        position: Math.max(0, Math.min(100, val)),
                      });
                    }
                  }}
                ></ha-textfield>

                <ha-textfield
                  class="preset-label"
                  .value=${preset.label ?? ""}
                  .label=${"Label (optional)"}
                  @input=${(e: Event) => {
                    const label = (e.target as HTMLInputElement).value || undefined;
                    this._presetChanged(index, { label });
                  }}
                ></ha-textfield>

                <button
                  class="remove-btn"
                  @click=${() => this._removePreset(index)}
                  title="Remove preset"
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>
            `,
          )}

          <button class="add-btn" @click=${this._addPreset}>
            <ha-icon icon="mdi:plus"></ha-icon>
            Add preset
          </button>
        </div>
      </div>
    `;
  }

  private _formChanged(e: CustomEvent): void {
    e.stopPropagation();
    if (!this._config) return;
    const data = e.detail.value;

    const action = (data.tap_action as ActionConfig["action"]) ?? "more-info";
    let tap_action: ActionConfig | undefined;
    if (action !== "more-info") {
      tap_action = { action };
      if (action === "navigate" && data.navigation_path) {
        tap_action.navigation_path = data.navigation_path;
      } else if (action === "call-service" && data.service) {
        tap_action.service = data.service;
      }
    }

    this._config = {
      ...this._config,
      entity: data.entity,
      name: data.name || undefined,
      icon: data.icon || undefined,
      tap_action,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _presetChanged(index: number, changes: Partial<SliderPreset>): void {
    const presets = [...(this._config?.presets ?? [])];
    presets[index] = { ...presets[index], ...changes };
    this._updateConfig({ presets });
  }

  private _addPreset(): void {
    const presets = [
      ...(this._config?.presets ?? []),
      { icon: "mdi:blinds-horizontal", position: 50 },
    ];
    this._updateConfig({ presets });
  }

  private _removePreset(index: number): void {
    const presets = (this._config?.presets ?? []).filter((_, i) => i !== index);
    this._updateConfig({ presets: presets.length ? presets : undefined });
  }

  private _updateConfig(changes: Partial<ShutterCardConfig>): void {
    if (!this._config) return;
    this._config = { ...this._config, ...changes };
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = css`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .section-header {
      font-weight: 500;
      color: var(--primary-text-color);
      margin-bottom: 4px;
    }

    .preset-row {
      display: flex;
      gap: 8px;
      align-items: flex-end;
    }

    .preset-icon {
      flex: 0 0 auto;
    }

    .preset-position {
      flex: 0 0 80px;
    }

    .preset-label {
      flex: 1;
      min-width: 0;
    }

    .remove-btn {
      flex: 0 0 auto;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--secondary-text-color);
      padding: 4px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .remove-btn:hover {
      color: var(--error-color, #db4437);
      background: rgba(219, 68, 55, 0.1);
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: 1px dashed var(--divider-color, #e0e0e0);
      border-radius: 8px;
      padding: 8px 16px;
      cursor: pointer;
      color: var(--primary-color);
      font-size: 14px;
      transition: background 0.2s;
    }

    .add-btn:hover {
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
    }

    .add-btn ha-icon {
      --mdc-icon-size: 18px;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "fr-shutter-card-editor": ShutterCardEditor;
  }
}

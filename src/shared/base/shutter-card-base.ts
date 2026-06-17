import { LitElement } from "lit";
import { property, state } from "lit/decorators.js";
import type { PropertyValues } from "lit";
import type { HomeAssistant } from "../types/ha.js";
import type { ShutterCardConfig } from "../types/config.js";
import type { SliderPreset } from "../types/preset.js";

export abstract class ShutterCardBase extends LitElement {
  @property({ attribute: false })
  hass?: HomeAssistant;

  @state()
  protected _config?: ShutterCardConfig;

  @state()
  protected _targetPosition?: number;

  setConfig(config: ShutterCardConfig): void {
    if (!config.entity) {
      throw new Error("Entity is required");
    }
    this._config = config;
  }

  protected updated(changedProps: PropertyValues): void {
    if (changedProps.has("hass")) {
      const oldHass = changedProps.get("hass") as HomeAssistant | undefined;
      this._detectMovementStop(oldHass);
    }
  }

  private _detectMovementStop(oldHass?: HomeAssistant): void {
    if (!this._config || !this.hass) return;
    const entityId = this._config.entity;
    const oldState = oldHass?.states[entityId]?.state;
    const newState = this.hass.states[entityId]?.state;

    const wasMoving = oldState === "opening" || oldState === "closing";
    const nowMoving = newState === "opening" || newState === "closing";

    if (wasMoving && !nowMoving) {
      this._targetPosition = undefined;
    }
  }

  protected get _entity() {
    return this.hass?.states[this._config?.entity ?? ""];
  }

  protected get _currentPosition(): number {
    return (this._entity?.attributes.current_position as number) ?? 0;
  }

  protected get _isMoving(): boolean {
    const s = this._entity?.state;
    return s === "opening" || s === "closing";
  }

  protected get _isClosing(): boolean {
    return this._entity?.state === "closing";
  }

  protected get _entityName(): string {
    return this._config?.name ?? (this._entity?.attributes.friendly_name as string) ?? "";
  }

  protected get _entityIcon(): string {
    return this._config?.icon ?? (this._entity?.attributes.icon as string) ?? "mdi:window-shutter";
  }

  protected get _presets(): SliderPreset[] {
    return this._config?.presets ?? [];
  }

  protected get _effectiveTargetPosition(): number {
    if (this._targetPosition !== undefined) {
      return this._targetPosition;
    }
    return this._currentPosition;
  }

  protected _handleControlAction = (e: CustomEvent): void => {
    const entityId = this._config?.entity;
    if (!this.hass || !entityId) return;

    const action = e.detail.action as string;
    switch (action) {
      case "open":
        this._targetPosition = 100;
        this.hass.callService("cover", "open_cover", { entity_id: entityId });
        break;
      case "close":
        this._targetPosition = 0;
        this.hass.callService("cover", "close_cover", { entity_id: entityId });
        break;
      case "stop":
        this._targetPosition = undefined;
        this.hass.callService("cover", "stop_cover", { entity_id: entityId });
        break;
    }
  };

  protected _handlePositionChanged = (e: CustomEvent): void => {
    const entityId = this._config?.entity;
    if (!this.hass || !entityId) return;

    const position = e.detail.position as number;
    this._targetPosition = position;
    this.hass.callService("cover", "set_cover_position", {
      entity_id: entityId,
      position,
    });
  };

  abstract getCardSize(): number;

  static getStubConfig() {
    return { entity: "" };
  }
}

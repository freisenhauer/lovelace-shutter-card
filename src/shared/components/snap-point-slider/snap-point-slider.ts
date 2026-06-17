import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import type { SliderPreset } from "../../types/preset.js";

interface InternalSnapPoint {
  icon: string;
  position: number;
}

const SNAP_THRESHOLD = 7;

const FIXED_ENDPOINTS: InternalSnapPoint[] = [
  { icon: "mdi:lock", position: 0 },
  { icon: "mdi:white-balance-sunny", position: 100 },
];

@customElement("snap-point-slider")
export class SnapPointSlider extends LitElement {
  @property({ type: Array })
  presets: SliderPreset[] = [];

  @property({ type: Number, attribute: "current-position" })
  currentPosition = 0;

  @property({ type: Number, attribute: "target-position" })
  targetPosition = 0;

  @property({ type: Boolean, reflect: true })
  moving = false;

  @property({ type: Boolean })
  closing = false;

  @property({ type: Boolean, reflect: true })
  disabled = false;

  @state()
  private dragging = false;

  @state()
  private dragPosition: number | null = null;

  @query(".track-container")
  private trackEl!: HTMLDivElement;

  private get allSnapPoints(): InternalSnapPoint[] {
    const userPoints: InternalSnapPoint[] = this.presets.map((p) => ({
      icon: p.icon,
      position: p.position,
    }));
    return [...FIXED_ENDPOINTS, ...userPoints].sort((a, b) => a.position - b.position);
  }

  private get effectiveThumbPosition(): number {
    return this.dragPosition ?? this.targetPosition;
  }

  private isSnapped(position: number): boolean {
    return this.allSnapPoints.some((p) => p.position === position);
  }

  private snapToNearest(rawPosition: number): number {
    for (const point of this.allSnapPoints) {
      if (Math.abs(rawPosition - point.position) <= SNAP_THRESHOLD) {
        return point.position;
      }
    }
    return Math.round(rawPosition);
  }

  private toVisual(position: number): number {
    return 100 - position;
  }

  private positionFromPointerX(clientX: number): number {
    const rect = this.trackEl.getBoundingClientRect();
    const raw = ((clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, 100 - raw));
  }

  private firePositionChanged(position: number): void {
    this.dispatchEvent(
      new CustomEvent("position-changed", {
        detail: { position },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private onPointerDown(e: PointerEvent): void {
    if (this.disabled) return;
    e.preventDefault();
    this.trackEl.setPointerCapture(e.pointerId);
    this.dragging = true;
    const raw = this.positionFromPointerX(e.clientX);
    this.dragPosition = this.snapToNearest(raw);
  }

  private onPointerMove(e: PointerEvent): void {
    if (!this.dragging) return;
    const raw = this.positionFromPointerX(e.clientX);
    this.dragPosition = this.snapToNearest(raw);
  }

  private onPointerUp(e: PointerEvent): void {
    if (!this.dragging) return;
    this.trackEl.releasePointerCapture(e.pointerId);
    this.dragging = false;
    if (this.dragPosition !== null) {
      this.firePositionChanged(this.dragPosition);
    }
    this.dragPosition = null;
  }

  private onDotClick(position: number): void {
    if (this.disabled) return;
    this.firePositionChanged(position);
  }

  protected render() {
    const snapPoints = this.allSnapPoints;
    const thumbPos = this.effectiveThumbPosition;
    const snapped = this.isSnapped(thumbPos);

    return html`
      <div
        class="slider"
        role="slider"
        tabindex=${this.disabled ? nothing : "0"}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow=${thumbPos}
      >
        <div class="icons">
          ${snapPoints.map(
            (p) => html`
              <ha-icon
                class=${classMap({ active: p.position === thumbPos })}
                .icon=${p.icon}
                style=${styleMap({ left: `${this.toVisual(p.position)}%` })}
                @click=${() => this.onDotClick(p.position)}
              ></ha-icon>
            `,
          )}
        </div>

        <div
          class="track-container"
          @pointerdown=${this.onPointerDown}
          @pointermove=${this.onPointerMove}
          @pointerup=${this.onPointerUp}
        >
          <div class="track">
            <div
              class=${classMap({ fill: true, moving: this.moving, closing: this.closing })}
              style=${styleMap({ width: `${this.toVisual(this.currentPosition)}%` })}
            ></div>
          </div>

          ${snapPoints.map(
            (p) => html`
              <div
                class=${classMap({
                  dot: true,
                  active: p.position >= this.currentPosition,
                })}
                style=${styleMap({ left: `${this.toVisual(p.position)}%` })}
                @click=${() => this.onDotClick(p.position)}
              ></div>
            `,
          )}

          <div
            class=${classMap({
              thumb: true,
              snapped,
              dragging: this.dragging,
            })}
            style=${styleMap({ left: `${this.toVisual(thumbPos)}%` })}
          ></div>
        </div>
      </div>
    `;
  }

  static styles = css`
    :host {
      display: block;
      --_accent: var(--slider-accent-color, var(--primary-color, #03a9f4));
      --_track-color: var(--slider-track-color, var(--disabled-text-color, #bdbdbd));
      --_track-h: var(--slider-track-height, 4px);
      --_thumb-size: var(--slider-thumb-size, 20px);
      --_thumb-snapped: var(--slider-thumb-snapped-size, 14px);
      --_dot-size: var(--slider-snap-dot-size, 10px);
      --_icon-size: var(--slider-icon-size, 18px);
      --_icon-color: var(--slider-icon-color, var(--secondary-text-color, #727272));
      --_icon-active-color: var(--slider-icon-active-color, var(--_accent));
    }

    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }

    .slider {
      position: relative;
      padding: 28px 10px 4px;
      touch-action: none;
      user-select: none;
      outline: none;
    }

    .icons {
      position: relative;
      height: 24px;
      margin-bottom: 4px;
    }

    .icons ha-icon {
      position: absolute;
      transform: translateX(-50%);
      --mdc-icon-size: var(--_icon-size);
      color: var(--_icon-color);
      transition: color 200ms ease;
      cursor: pointer;
    }

    .icons ha-icon.active {
      color: var(--_icon-active-color);
    }

    .track-container {
      position: relative;
      height: var(--_thumb-size);
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .track {
      width: 100%;
      height: var(--_track-h);
      background: var(--_track-color);
      border-radius: calc(var(--_track-h) / 2);
      overflow: hidden;
    }

    .fill {
      height: 100%;
      background: var(--_accent);
      border-radius: inherit;
      transition: width 300ms ease;
    }

    .fill.moving {
      position: relative;
      overflow: hidden;
    }

    .fill.moving::after {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.45) 50%,
        transparent 100%
      );
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .fill.moving.closing::after {
      animation-name: shimmer-reverse;
    }

    @keyframes shimmer-reverse {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }

    .dot {
      position: absolute;
      width: var(--_dot-size);
      height: var(--_dot-size);
      border-radius: 50%;
      background: var(--_track-color);
      border: 2px solid var(--_track-color);
      transform: translate(-50%, -50%);
      top: 50%;
      cursor: pointer;
      z-index: 1;
      transition:
        background-color 200ms ease,
        border-color 200ms ease;
      box-sizing: border-box;
    }

    .dot.active {
      background: var(--_accent);
      border-color: var(--_accent);
    }

    .thumb {
      position: absolute;
      width: var(--_thumb-size);
      height: var(--_thumb-size);
      border-radius: 50%;
      border: 2px solid var(--_accent);
      background: var(--card-background-color, #fff);
      transform: translate(-50%, -50%);
      top: 50%;
      z-index: 2;
      box-sizing: border-box;
      transition:
        left 200ms ease-out,
        width 150ms ease,
        height 150ms ease,
        background-color 150ms ease,
        border-color 150ms ease;
    }

    .thumb.dragging {
      transition:
        width 150ms ease,
        height 150ms ease,
        background-color 150ms ease,
        border-color 150ms ease;
    }

    .thumb.snapped {
      width: var(--_thumb-snapped);
      height: var(--_thumb-snapped);
      background: var(--_accent);
      border-color: var(--_accent);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "snap-point-slider": SnapPointSlider;
  }
}

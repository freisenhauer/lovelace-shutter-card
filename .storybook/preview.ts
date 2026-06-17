import type { Preview } from "@storybook/web-components";
import { html } from "lit";
import * as mdiIcons from "@mdi/js";

const HA_THEMES: Record<string, Record<string, string>> = {
  light: {
    "--primary-color": "#03a9f4",
    "--primary-text-color": "#212121",
    "--secondary-text-color": "#727272",
    "--secondary-background-color": "#f0f0f0",
    "--card-background-color": "#ffffff",
    "--divider-color": "#e0e0e0",
  },
  dark: {
    "--primary-color": "#7cc0f6",
    "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b",
    "--secondary-background-color": "#2c2c2c",
    "--card-background-color": "#1e1e1e",
    "--divider-color": "#3a3a3a",
  },
};

function mdiNameToKey(icon: string): string {
  const name = icon.replace("mdi:", "");
  return (
    "mdi" +
    name
      .split("-")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join("")
  );
}

if (!customElements.get("ha-icon")) {
  class MockHaIcon extends HTMLElement {
    static get observedAttributes() {
      return ["icon"];
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      this.render();
    }

    set icon(value: string) {
      this.setAttribute("icon", value);
    }

    get icon(): string {
      return this.getAttribute("icon") || "";
    }

    private render() {
      const raw = this.getAttribute("icon") || "";
      const key = mdiNameToKey(raw);
      const path = (mdiIcons as Record<string, string>)[key] || "";
      const size = "var(--mdc-icon-size, 18px)";
      this.style.display = "inline-flex";
      this.style.alignItems = "center";
      this.style.justifyContent = "center";
      this.style.width = size;
      this.style.height = size;
      this.innerHTML = path
        ? `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="width:${size};height:${size};fill:currentColor;"><path d="${path}"/></svg>`
        : raw;
    }
  }
  customElements.define("ha-icon", MockHaIcon);
}

if (!customElements.get("ha-card")) {
  class MockHaCard extends HTMLElement {
    connectedCallback() {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.innerHTML = `
          <style>
            :host {
              display: block;
              border-radius: 12px;
              border: 1px solid var(--divider-color, #e0e0e0);
              background: var(--card-background-color, #fff);
              overflow: hidden;
            }
          </style>
          <slot></slot>
        `;
      }
    }
  }
  customElements.define("ha-card", MockHaCard);
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Home Assistant theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "HA Light" },
          { value: "dark", title: "HA Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
  decorators: [
    (story, context) => {
      const theme = (context.globals.theme as string) || "light";
      const vars = HA_THEMES[theme];
      const style = Object.entries(vars)
        .map(([k, v]) => `${k}: ${v}`)
        .join("; ");
      const bg = theme === "dark" ? "#1c1c1c" : "#f5f5f5";
      return html`
        <div
          style="${style}; background: ${bg}; min-height: 100vh; padding: 0; margin: -1rem; font-family: Roboto, Noto, sans-serif;"
        >
          ${story()}
        </div>
      `;
    },
  ],
};

export default preview;

import type { Preview } from "@storybook/web-components";
import * as mdiIcons from "@mdi/js";

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

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: "HA Light", value: "#f5f5f5" },
        { name: "HA Dark", value: "#1c1c1c" },
      ],
    },
  },
};

export default preview;

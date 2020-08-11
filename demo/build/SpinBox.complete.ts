import { ids, firstRender, raiseChangeEvents, render, state, template } from "elix/src/core/internal";
import { templateFrom } from "elix/src/core/htmlLiterals";
import SpinBox from "../SpinBox";
export default class SpinBoxComplete extends SpinBox {
  [render](changed) {
    super[render](changed);
    if (this[firstRender]) {
      this[ids].input.addEventListener("input", () => {
        this[raiseChangeEvents] = true;
        this.refreshValue();
        this[raiseChangeEvents] = false;
      });
      this[ids]._id0.addEventListener("mousedown", () => {
        this[raiseChangeEvents] = true;
        this.stepUp();
        this[raiseChangeEvents] = false;
      });
      this[ids]._id1.addEventListener("mousedown", () => {
        this[raiseChangeEvents] = true;
        this.stepDown();
        this[raiseChangeEvents] = false;
      });
    }
    if (changed.value) {
      (this[ids].input as any).value = this[state].value;
    }
  }

  get [template]() {
    return templateFrom.html`
        <style>
:host {
  display: inline-grid;
}

[part~="input"] {
  grid-row-end: 3;
  grid-row-start: 1;
  outline: none;
  text-align: right;
}

[part~="spin-button"] {
  grid-column: 2;
  user-select: none;
}

:host {
  background: white;
  border: 1px solid gray;
  box-sizing: border-box;
}

[part~="input"] {
  background: transparent;
  border: none;
  width: 4em;
}

[part~="spin-button"] {
  background: transparent;
  border: 1px solid gray;
  box-sizing: border-box;
  font-size: 0.6em;
  padding: 2px;
}

[part~="up-button"] {
  border-right: none;
  border-top: none;
}

[part~="down-button"] {
  border-bottom: none;
  border-right: none;
  border-top: none;
}

        </style>
  <input id="input" part="input">
  <div part="spin-button up-button" tabindex="-1" id="_id0">
    ▲
  </div>
  <div part="spin-button down-button" tabindex="-1" id="_id1">
    ▼
  </div>
`;
  }
}
customElements.define("spin-box", SpinBoxComplete);

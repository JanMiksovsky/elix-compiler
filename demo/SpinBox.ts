import { ids } from "elix/src/base/internal.js";
import ReactiveElement from "elix/src/core/ReactiveElement.js";
import { api } from "../src/decorators";

export default class SpinBox extends ReactiveElement {
  @api()
  value = 0;

  refreshValue() {
    this.value = (this[ids].input as any).value;
  }

  stepDown() {
    this.value--;
  }

  stepUp() {
    this.value++;
  }
}

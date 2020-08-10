import { defaultState, setState, state } from "elix/src/core/internal.js";

const stateMembers = Symbol();

export function api(): PropertyDecorator {
  return function (target, key) {
    // Define defaultState if it's not already defined.
    if (!target[stateMembers]) {
      target[stateMembers] = {};
      Object.defineProperty(target, defaultState, {
        enumerable: true,
        configurable: true,
        get: function () {
          const superValue = this.__proto__[defaultState];
          return Object.assign(superValue, target[stateMembers]);
        },
      });
    }
    target[stateMembers][key] = null;

    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: function () {
        return this[state][key];
      },
      set: function (value) {
        this[setState]({ [key]: value });
      },
    });
  };
}

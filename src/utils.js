//@flow
import moize from "moize";

export const binder = moize((fn, ...args1) => (...args2) =>
  fn(...args1, ...args2)
);

export const get = (path: string): any => {
  let split = path.split(".");
  let l = split.length;
  return a => {
    for (var i = 0; i < l; i++) a = a[split[i]];
    return a;
  };
};

export const upo = (oldObject: {}, newValues: {}) =>
  Object.assign({}, oldObject, newValues);

import type { Reducer } from "src/types/Reducer";

export function createReducer<S, A: *>(
  initialState: S,
  handlers: { [key: string]: Reducer<S, A> }
): Reducer<S, A> {
  return function reducer(state: S = initialState, action: A): S {
    return handlers.hasOwnProperty(action.type)
      ? handlers[action.type](state, action)
      : state;
  };
}

export const mod = (a: number, b: number): number => (a % b + b) % b;
// .mod = function(n) {
//   return ((this%n)+n)%n;
// };

export const debounce = (fn: Function, time: number): Function => {
  let timeout;
  // console.log(time);

  return function() {
    console.log('calling')
    const functionCall = () => fn.apply(this, arguments);

    clearTimeout(timeout);
    timeout = setTimeout(functionCall, time);
  };
};

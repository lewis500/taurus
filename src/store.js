import root from "src/reducers/root";
import type { Action } from "src/types/Action";
import type { State } from "src/types/State";
import { createStore } from "redux";
import type { Store } from "redux";

const store: Store<State, Action> = createStore(root);
{
  let interval = null;
  let last = Date.now();

  store.subscribe(() => {
    if (store.getState().timerOn && interval === null) {
      var last = Date.now();
      interval = setInterval(() => {
        let now = Date.now();
        let temp = last;
        last = now;
        store.dispatch({
          type: "TICK",
          payload: (now - temp) / 100
        });
      });
    }
    if (!store.getState().timerOn && interval !== null) {
      clearInterval(interval);
      interval = null;
    }
  });
}
// console.log(interval);

export default store;

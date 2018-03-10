//@flow
import { combineReducers } from "redux";
import * as AC from "src/actionNames";
import { createReducer as CR } from "src/utils";

const counter = CR(0, {
  [AC.INCREMENT](state) {
    return state + 1;
  },
  [AC.DECREMENT](state) {
    return state - 1;
  }
});

export const reducers = {
  counter
};

export default combineReducers(reducers);

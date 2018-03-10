//@flow
import { combineReducers } from "redux";
import * as AC from "src/actionNames";
import { createReducer as CR } from "src/utils";

const timerOn = CR(false, {
  TIMER_TOGGLE(state) {
    return !state;
  }
});

const time = CR(0, {
  TICK(state, { payload }) {
    return state + payload;
  }
});

export const reducers = {
  timerOn,
  time
};

export default combineReducers(reducers);

//@flow
import { combineReducers } from "redux";
import { createReducer as CR } from "src/utils";
import { Graph } from "src/models";
let model = new Graph();

const timerOn = CR(false, {
  TIMER_TOGGLE(state) {
    return !state;
  }
});

const time = CR(0, {
  TICK(state, action) {
    return state + action.payload;
  }
});

import type { State } from "src/types/State";
import type { Action } from "src/types/Action";
import type { Reducer } from "src/types/Reducer";

const defaultState: State = {
  time: 0,
  timerOn: false,
  signals: model.signals,
  cars: model.cars
};

const root: Reducer<State, Action> = (
  state = defaultState,
  action: Action
): State => {
  if (action.type === "TICK")
    for (var i = 0; i < 1; i++) model.run(action.payload);

  return {
    time: time(state.time, action),
    timerOn: timerOn(state.timerOn, action),
    signals: model.signals,
    cars: model.cars
  };
};
export default root;

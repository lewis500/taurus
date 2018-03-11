//@flow
import { combineReducers } from "redux";
// import { createReducer as CR } from "src/utils";
import { Graph } from "src/models";

let model = new Graph(10);

const timerOn = (state, action) =>
  action.type === "TIMER_TOGGLE" ? !state : state;

const time = (state, action) => {
  if (action.type === "TICK") return state + action.payload;
  return state;
};

const k = (state, action) => {
  if (action.type === "SET_K") return action.payload;
  return state;
};

import type { State } from "src/types/State";
import type { Action } from "src/types/Action";
import type { Reducer } from "src/types/Reducer";

const defaultState: State = {
  time: 0,
  timerOn: false,
  signals: model.signals,
  cars: model.cars,
  k: 10,
  mfdState: [0, 0]
};

const root: Reducer<State, Action> = (
  state = defaultState,
  action: Action
): State => {
  if (action.type === "TICK")
    for (var i = 0; i < 1; i++) model.run(action.payload);
  if (action.type === "SET_K") model.makeCars(action.payload);

  return {
    time: time(state.time, action),
    timerOn: timerOn(state.timerOn, action),
    signals: model.signals,
    cars: model.cars,
    k: k(state.k, action),
    mfdState: model.getMFDState()
  };
};
export default root;

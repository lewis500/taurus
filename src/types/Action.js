//@flow
type TimerToggleAction = {
  type: "TIMER_TOGGLE",
  // payload: 
};

type Tick = {
  type: "TICK",
  payload: number
};

type SetKAction = {
  type: "SET_K",
  payload: number
};

export type Action = TimerToggleAction | Tick | SetKAction;

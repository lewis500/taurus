//@flow
type TimerToggleAction = {
  type: "TIMER_TOGGLE"
};

type Tick = {
  type: "TICK",
  payload: number
};

export type Action = TimerToggleAction | Tick;
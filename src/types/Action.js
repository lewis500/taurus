//@flow
// type IncrementAction = {
//   type: 'INCREMENT'
//   //   payload: number
// };

// type DecrementAction = {
//   type: 'DECREMENT'
//   //   payload: number
// };
type TimerToggleAction = {
  type: "TIMER_TOGGLE"
};
type Tick = {
  type: "TICK",
  payload: number
};

export type Action = TimerToggleAction | Tick;

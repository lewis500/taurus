//@flow
type IncrementAction = {
  type: 'INCREMENT'
  //   payload: number
};

type DecrementAction = {
  type: 'DECREMENT'
  //   payload: number
};

export type Action = IncrementAction | DecrementAction;

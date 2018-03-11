//@flow
import type { Car } from "src/models";
import { Signal } from "src/models";
export type State = {
  time: number,
  cars: Array<Car>,
  signals: Array<Signal>,
  timerOn: boolean
};

//@flow
// import { reducers } from "src/reducers/root";
// type Reducers = typeof reducers;
// type $ExtractFunctionReturn = <V>(v: (...args: any) => V) => V;
// export type State = $ObjMap<Reducers, $ExtractFunctionReturn>;
// import type{Car,Lane,Signal} from 'src/models';
import type { Car } from "src/models";
import { Lane, Signal } from "src/models";
export type State = {
  time: number,
  cars: Array<Car>,
  signals: Array<Signal>,
  lanes: Array<Lane>,
  timerOn: boolean
};

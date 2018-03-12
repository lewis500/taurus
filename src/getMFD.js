//@flow
import {
    VF,
    Q0,
    KJ,
    GREEN,
    W,
    CYCLE,
    LANE_LENGTH,
  } from "src/constants";
  import { assign, map, flatMap, range, min } from "lodash";
  
  const doubleMod = (a: number, b: number): number => {
    return (a % b + b) % b;
  };
  
  class TableEntry {
    t: number;
    c: number;
    g: number;
    x: number;
    constructor(i, offset) {
      const v = i < 0 ? -W : VF,
        x = LANE_LENGTH * i,
        travel_time = x / v,
        e = doubleMod(travel_time - i * offset, CYCLE), //this might need to be a double mod like from livescript
        g = GREEN - e,
        green = Math.max(g, 0),
        t = travel_time + CYCLE - e,
        c = Q0 * green + Math.max(0, -x * KJ);
      assign(this, { t, c, g, x });
    }
  }
  
  function loopOverEntries(direction, offset) {
    let [g, i, res] = [999, 0, []];
    while (g > 0 && Math.abs(i) < 100) {
      //MAKE SURE THAT G IS DECLINING?
      const entry = new TableEntry(i, offset);
      g = entry.g;
      res.push(entry);
      if (direction === "forward") i++;
      else i--;
    }
    return res;
  }
  
  function findMin(k: number, table: Array<TableEntry>): MFDEntry {
    const costs: Array<number> = map(
      table,
      entry => (entry.c + entry.x * k) / entry.t
    ).concat([VF * k, W * (KJ - k)]);
    const q: number = min(costs), v: number = k > 0 ? q / k : 0;
    return { k, q, v };
  }
  
  export const MFD_INITIAL = createMFD(WHICHOFFSET);
  export const MFD_BACKWARD = createMFD(BRO);
  export const MFD_FORWARD = createMFD(FRO);
  
  
  export function createMFD(offset: number) {
    const table = flatMap(["forward", "backward"], direction =>
      loopOverEntries(direction, offset)
    );
    return range(0.01, 1.01, 0.01).map(k => findMin(k, table));
  }
  
//   export default function reduceMFD(
//     mfd: MFD,
//     offset: number,
//     action: Action
//   ): MFD {
//     switch (action.type) {
//       case SET_OFFSET:
//         createMFD(offset);
//       default:
//         return mfd;
//     }
//   }
  
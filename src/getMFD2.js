//@flow
import { VF, Q0, KJ, GREEN, W, CYCLE, LANE_LENGTH as GAP } from "src/constants";
let kj = KJ / GAP;
let q0 = Q0 / GAP;

type Entry = { q: number, t: number, x: number };

function makeTable(direction: "f" | "b"): Array<Entry> {
  let table = [];
  let i = 0;
  while (true && Math.abs(i) < 20) {
    let v = i < 0 ? -W : VF;
    let x = GAP * i;
    let travelTime = x / v;
    let timePassedInCycle = travelTime % CYCLE;
    let g = GREEN - timePassedInCycle;
    let remainingGreen = Math.max(GREEN - timePassedInCycle, 0);
    let timeLeftInCycle = CYCLE - timePassedInCycle;
    let t = travelTime + timeLeftInCycle; //the duration of this entry
    let q = q0 * remainingGreen + Math.max(0, -x * kj);
    table.push({ g, t, q, x, travelTime });
    if (g < 0) break;
    i = i + (direction === "f" ? 1 : -1);
  }
  return table;
}

export default function createMFD() {
  let table = [].concat(makeTable("f"), makeTable("b"));
  console.log(table);
  let n = 100;
  return Array(n)
    .fill(0)
    .map((_, i) => {
      let k = i / n * kj;
      let qs = table
        .map(({ x, q, t }) => {
          return (q + x * k) / t;
        })
        .concat(VF * k, W * (kj - k));
      return [k*GAP, Math.min(...qs)*GAP];
    });
}

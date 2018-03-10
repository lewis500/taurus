//https://mgechev.github.io/javascript-algorithms/data-structures_linked-list.js.html
//@flow

import { GAP, N, CYCLE, LANE_LENGTH } from "src/constants";
import uniqueId from "lodash/uniqueId";
import { mod } from "src/utils";

export type Car = { id: string, pos: number };

type Node = {
  car: Car,
  next: Node | null,
  prev: Node | null
};

const makeNode = (car): Node => ({ car, next: null, prev: null });
type Orientation = "ns" | "ew";
type Direction = "n" | "s" | "e" | "w";
type Coord = [number, number];

// type Lane = {
//   first: Node | null,
//   last: Node | null,
//   direction: Direction,
//   a: [number, number],
//   b: [number, number],
//   aS: Signal,
//   bS: Signal
// };

// const unshift = (lane: Lane, car) => {
//   let node = makeNode(car);
//   if (lane.first === null) {
//     lane.first = lane.last = node;
//   } else {
//     let temp = lane.first;
//     lane.first = node;
//     node.next = temp;
//     temp.prev = node;
//   }
// };

export class Lane {
  first: Node | null;
  last: Node | null;
  direction: Direction;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  aS: Signal;
  bS: Signal;
  id: string;
  constructor(aS: Signal, bS: Signal, direction: Direction) {
    let { col: x0, row: y0 } = aS;
    let { col: x1, row: y1 } = bS;
    if (x1 === 0 && x0 === N - 1) x1 = N;
    else if (y1 === N - 1 && y0 === 0) y0 = N;
    else if (x1 === N - 1 && x0 === 0) x0 = N;
    else if (y1 === 0 && y0 === N - 1) y1 = N;
    Object.assign(this, {
      first: null,
      last: null,
      direction,
      aS,
      bS,
      x0,
      y0,
      x1,
      y1,
      id: uniqueId()
    });
  }

  unshift(car: Car) {
    let node = makeNode(car);
    if (this.first === null) {
      this.first = this.last = node;
    } else {
      let temp = this.first;
      this.first = node;
      node.next = temp;
      temp.prev = node;
    }
  }

  pop(): ?Node {
    if (this.last === null) {
      return null;
    }
    let temp = this.last;
    this.last = this.last.prev;
    return temp;
  }
}

export class Signal {
  row: number;
  col: number;
  orientation: Orientation;
  t: number;
  id: string;
  lanesOut: Array<Lane>;
  lanesIn: Array<Lane>;
  constructor(row: number, col: number) {
    Object.assign(this, {
      row,
      col,
      orientation: "ns",
      t: 0,
      id: uniqueId(),
      lanesIn: [],
      lanesOut: []
    });
  }
  addLaneIn(lane: Lane) {
    this.lanesIn.push(lane);
  }
  addLaneOut(lane: Lane) {
    this.lanesOut.push(lane);
  }
  tick(dt: number) {
    this.t = (this.t + dt) % CYCLE;
    if (this.t > CYCLE / 2) this.orientation = "ew";
    else this.orientation = "ns";
  }
}

const range = Array(N)
  .fill(0)
  .map((d, i) => i);

const even = (d: number) => d % 2 === 0;

export class Graph {
  matrix: Array<Array<Signal>>;
  signals: Array<Signal>;
  lanes: Array<Lane>;
  cars: Array<Car>;
  constructor() {
    //create signals matrix
    this.matrix = range.map(row => range.map(col => new Signal(row, col)));
    this.signals = [].concat(...this.matrix);
    this.cars = [];
    this.lanes = [];
    //add lanes
    for (let row of range)
      for (let col of range)
        for (let or of ["ns", "ew"]) {
          let a = [row, col];
          let direction =
            or === "ns" ? (even(col) ? "s" : "n") : even(row) ? "e" : "w";
          let b =
            or === "ns"
              ? [mod(even(col) ? row + 1 : row - 1, N), col]
              : [row, mod(even(row) ? col + 1 : col - 1, N)];
          let lane = new Lane(
            this.matrix[a[0]][a[1]],
            this.matrix[b[0]][b[1]],
            direction
          );
          lane.aS.addLaneOut(lane);
          lane.bS.addLaneIn(lane);
          this.lanes.push(lane);
        }
  }

  run(dt: number) {
    let queue: Array<[Lane, Lane, Car]> = [];
    for (let signal of this.signals) {
      signal.tick(dt);
    }
    // for (let lane of this.lanes) {
    //   let temp = lane.first;
    //   while (temp) {
    //     let { car, next } = temp;
    //     if (next) {
    //       if (next.car.pos - temp.car.pos > GAP) temp.car.pos++;
    //     } else {
    //       if (LANE_LENGTH - car.pos < GAP) {
    //         let turning = Math.random() < 0.5;
    //         let signal = lane.bS;
    //         let nextLane = signal.lanesOut.find(
    //           l => (l.direction === lane.direction) !== turning
    //         );
    //         if (!nextLane) throw Error("error in finding lane");
    //         if (!nextLane.first || nextLane.first.car.pos > GAP) {
    //           queue.push([lane, nextLane, car]);
    //         }
    //       }
    //     }
    //     temp = next;
    //   }
    // }
    // for (let event of queue) {
    //   event[0].pop();
    //   event[1].unshift(event[2]);
    //   event[2].pos = 0;
    // }
  }
}

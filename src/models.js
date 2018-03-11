//@flow

import { N, CYCLE, LANE_LENGTH, W, SJ, VF } from "src/constants";
import uniqueId from "lodash/uniqueId";
import { mod } from "src/utils";
import mc from "material-colors";
// console.log(mc)

type Orientation = "ns" | "ew";
type Direction = "n" | "s" | "e" | "w";
type Coord = [number, number];

const vs = (() => {
  const a = VF / W + 1,
    b = W / SJ;
  return (s: number) => {
    if (s < SJ) return 0;
    else if (s > a) return VF;
    else return b * (s - SJ);
  };
})();
const getColor = (() => {
  const colors = [
    "red",
    "blue",
    "green",
    "orange",
    "pink",
    "purple",
    "lightBlue",
    "teal"
  ].map(d => mc[d]['200']);
  const l = colors.length - 1;
  let i = 0;
  return () => colors[i++ % l];
})();

export type Car = {
  id: string,
  pos: number,
  x: number,
  y: number,
  lane: string,
  orientation: Orientation,
  color: string
};

type Node = {
  car: Car,
  next: Node | null,
  prev: Node | null
};

const makeNode = (car): Node => ({ car, next: null, prev: null });

const makeCar = (pos: number, x: number, y: number, lane: Lane): Car => ({
  id: uniqueId(),
  color: getColor(),
  pos,
  x,
  y,
  lane: lane.id,
  orientation: lane.orientation
});

const moveCar = (car: Car, pos: number, lane: Lane): void => {
  car.x = lane.x0 + pos / LANE_LENGTH * (lane.x1 - lane.x0);
  car.y = lane.y0 + pos / LANE_LENGTH * (lane.y1 - lane.y0);
  car.pos = pos;
  car.lane = lane.id;
  car.orientation = lane.orientation;
};

export class Lane {
  first: Node | null;
  last: Node | null;
  direction: Direction;
  orientation: Orientation;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  a: Coord;
  b: Coord;
  id: string;
  constructor(a: Coord, b: Coord, direction: Direction) {
    let [y0, x0] = a;
    let [y1, x1] = b;
    if (x1 === 0 && x0 === N - 1) x1 = N;
    else if (y1 === 0 && y0 === N - 1) y1 = N;
    else if (y1 === N - 1 && y0 === 0) y0 = N;
    else if (x1 === N - 1 && x0 === 0) x0 = N;
    Object.assign(this, {
      first: null,
      last: null,
      direction,
      a,
      b,
      x0,
      y0,
      x1,
      y1,
      id: uniqueId(),
      orientation: "ns".includes(direction) ? "ns" : "ew"
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

  push(car: Car) {
    var node = makeNode(car);
    if (this.first === null) {
      this.first = this.last = node;
    } else {
      var temp = this.last;
      this.last = node;
      node.prev = temp;
      temp.next = node;
    }
  }

  pop(): ?Node {
    if (this.last === null) {
      return null;
    }
    let temp = this.last;
    this.last = this.last.prev;
    if (this.last) this.last.next = null;
    else this.first = null;
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
  constructor(row: number, col: number) {
    Object.assign(this, {
      row,
      col,
      orientation: "ns",
      t: 0,
      id: uniqueId(),
      lanesOut: []
    });
  }
  addLaneOut(lane: Lane) {
    this.lanesOut.push(lane);
  }
  tick() {
    this.t = (this.t + 1) % CYCLE;
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
          let direction =
            or === "ns" ? (even(col) ? "s" : "n") : even(row) ? "e" : "w";
          let b =
            or === "ns"
              ? [mod(even(col) ? row + 1 : row - 1, N), col]
              : [row, mod(even(row) ? col + 1 : col - 1, N)];
          let lane = new Lane([row, col], b, direction);
          this.matrix[row][col].addLaneOut(lane);
          this.lanes.push(lane);
          for (
            var i = 1, numCars = 10, inc = LANE_LENGTH / numCars;
            i < numCars;
            i++
          ) {
            let pos = inc * i;
            let x = lane.x0 + pos / LANE_LENGTH * (lane.x1 - lane.x0);
            let y = lane.y0 + pos / LANE_LENGTH * (lane.y1 - lane.y0);
            let car = makeCar(pos, x, y, lane);
            lane.push(car);
            this.cars.push(car);
          }
        }
  }

  run(dt: number) {
    let queue: Array<[Lane, Lane, Car]> = [];
    for (let signal of this.signals) {
      signal.tick();
    }
    for (let lane of this.lanes) {
      let temp = lane.first;
      let signal = this.matrix[lane.b[0]][lane.b[1]];
      let signalOpen = signal.orientation.includes(lane.direction);
      while (temp) {
        let { car, next } = temp;
        if (next) {
          moveCar(
            car,
            Math.min(car.pos + vs(next.car.pos - car.pos), LANE_LENGTH),
            lane
          );
        } else if (car.pos === LANE_LENGTH && signalOpen) {
          let nextLane = signal.lanesOut[+(Math.random() <= 0.5)];
          if (!nextLane) throw Error("error in finding lane");
          if (!nextLane.first || nextLane.first.car.pos >= SJ) {
            lane.pop();
            moveCar(car, 0, nextLane);
            nextLane.unshift(car);
          }
        } else moveCar(car, Math.min(car.pos + VF, LANE_LENGTH), lane);
        temp = next;
      }
    }
  }
}

//@flow

import { N, CYCLE, LANE_LENGTH, W, SJ, VF, TURN, HIST } from "src/constants";
import uniqueId from "lodash/uniqueId";
import { mod } from "src/utils";
import mc from "material-colors";
type Orientation = "ns" | "ew";
type Direction = "n" | "s" | "e" | "w";
type Coord = [number, number];

const vs = (() => {
  const a = (VF / W + 1)*SJ,
    b = W / SJ;
  return (s: number) => {
    if (s <= SJ) return 0;
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
  ].map(d => mc[d]["200"]);
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
  color: string,
  nextTimeTurning: boolean,
  alreadyMoved:boolean
};

type Node = {
  car: Car,
  next: Node | null,
  prev: Node | null
};

const makeNode = (car): Node => ({ car, next: null, prev: null });

const makeCar = (pos: number, lane: Lane): Car => {
  let x = lane.x0 + pos / LANE_LENGTH * (lane.x1 - lane.x0);
  let y = lane.y0 + pos / LANE_LENGTH * (lane.y1 - lane.y0);
  return {
    id: uniqueId(),
    color: getColor(),
    pos,
    x,
    y,
    lane: lane.id,
    orientation: lane.orientation,
    nextTimeTurning: Math.random() <= TURN,
    alreadyMoved: false
  };
};

const moveCar = (car: Car, pos: number, lane: Lane): void => {
  car.x = lane.x0 + pos / LANE_LENGTH * (lane.x1 - lane.x0);
  car.y = lane.y0 + pos / LANE_LENGTH * (lane.y1 - lane.y0);
  car.pos = pos;
  car.lane = lane.id;
  car.orientation = lane.orientation;
  car.alreadyMoved = true;
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
  history: Array<[number, number]>;
  k: number;

  getMFDState(): [number, number] {
    let l = this.history.length;
    let k = 0,
      q = 0;
    for (let d of this.history) (k += d[0]), (q += d[1]);
    return [k / l, q / l];
  }

  makeCars(k: number) {
    this.k = k;
    let carsPerLane = k; //distance normalized to lane length
    this.cars = [];
    // this.history= [].slice(0,5);
    let space = LANE_LENGTH / carsPerLane;
    for (let lane of this.lanes) {
      lane.first = lane.last = null;
      for (var i = 0; i < carsPerLane; i++) {
        let pos = i * space;
        let newCar = makeCar(pos, lane);
        lane.push(newCar);
        this.cars.push(newCar);
      }
    }
  }

  constructor(k: number) {
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
        }
    this.history = [[k, 0]];
    this.makeCars(k);
  }

  run(dt: number) {
    let queue: Array<[Lane, Lane, Car]> = [];
    for (let signal of this.signals) signal.tick();
    for(let car of this.cars) car.alreadyMoved = false;
    let q = 0;
    for (let lane of this.lanes) {
      let temp = lane.first;
      let signal = this.matrix[lane.b[0]][lane.b[1]];
      let signalOpen = signal.orientation.includes(lane.direction);
      while (temp) {
        let { car, next } = temp;
        let dx = 0;
        // if(car.alreadyMoved) continue;
        if (next && !car.alreadyMoved) {
          dx = vs(next.car.pos - car.pos);
          moveCar(car, car.pos + dx, lane);
        }
        if (!next && !car.alreadyMoved) {
          let distanceRemaining = LANE_LENGTH - car.pos;
          if (!signalOpen) {
            dx = vs(distanceRemaining);
            moveCar(car, car.pos + dx, lane);
            // dx=0;
          } else {
            let turning = Math.random() < TURN;
            let nextLane = signal.lanesOut.find(
              d => (d.orientation === lane.orientation) !== turning
            );
            if (!nextLane) throw Error("error in finding lane");
            if (!nextLane.first) {
              lane.pop();
              dx = VF;
              moveCar(car, VF - distanceRemaining, nextLane);
              dx = distanceRemaining; //could be a bug
              nextLane.unshift(car);
            } else {
              dx = vs(nextLane.first.car.pos + distanceRemaining);
              if (dx > distanceRemaining) {
                lane.pop();
                moveCar(car, dx - distanceRemaining, nextLane);
                dx = distanceRemaining;//note this could be a bug
                // car.nextTimeTurning = Math.random() <= TURN;
                nextLane.unshift(car);
              } else {
                moveCar(car, car.pos + dx, lane);
              }
            }
          }
        }
        q += dx;
        temp = next;
      }
    }
    this.history.push([
      this.cars.length / this.lanes.length,
      q / this.lanes.length
    ]);
    if (this.history.length > HIST) this.history.shift();
  }
}

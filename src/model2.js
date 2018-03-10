//https://mgechev.github.io/javascript-algorithms/data-structures_linked-list.js.html
//@flow

const GAP = 1;
class Car {
  id: string;
  pos: number;
  constructor(id, pos) {
    Object.assign(this, { id, pos });
  }
}

class Node {
  car: Car;
  next: Node | null;
  prev: Node | null;
  constructor(car: Car) {
    Object.assign(this, { car, next: null, prev: null });
  }
}

class Lane {
  first: Node | null;
  last: Node | null;
  direction: "n" | "s" | "e" | "w";
  a: [number, number];
  b: [number, number];
  aS: Signal;
  bS: Signal;
  constructor(a, b, aS, bS, direction) {
    Object.assign(this, {
      first: null,
      last: null,
      direction,
      a,
      b,
      aS,
      bS
    });
  }

  unshift(car: Car) {
    let node = new Node(car);
    if (this.first === null) {
      this.first = this.last = node;
    } else {
      let temp = this.first;
      this.first = node;
      node.next = temp;
      temp.prev = node;
    }
  }

  pop(): Node {
    if (this.last === null) {
      return null;
    }
    let temp = this.last;
    this.last = this.last.prev;
    return temp;
  }
}
const LANE_LENGTH = 100;

const CYCLE = 20;

class Signal {
  row: number;
  col: number;
  direction: 0 | 1;
  t: number;
  id: string;
  lanesOut: Array<Lane>;
  lanesIn: Array<Lane>;
  constructor(row, col, id) {
    Object.assign(this, { row, col, direction: 0, t: 0, id });
  }
  addLaneIn(lane) {
    this.lanesIn.push(lane);
  }
  addLaneOut(lane) {
    this.lanesOut.push(lane);
  }
  tick(dt: number) {
    this.t = (this.t + dt) % CYCLE;
  }
}

const N = 10;
const range = Array(N)
  .fill(0)
  .map((d, i) => i);
const even = (d: number) => d % 2 === 0;

class Graph {
  matrix: Array<Array<Signal>>;
  lanes: Array<Lane>;
  constructor(matrix) {
    //create signals matrix
    this.matrix = range.map(row => range.map(col => new Signal(row, col)));
    //add lanes
    for (let row of range)
      for (let col of range)
        for (let or of ["ns", "ew"]) {
          let a = [row, col];
          let b =
            or === "ns"
              ? [row % 2 ? row - 1 : row + 1, col]
              : [row, row % 2 ? col - 1 : col + 1];
          let direction =
            or === "ns" ? (row % 2 ? "s" : "n") : col % 2 ? "w" : "e";
          let lane = new Lane(
            a,
            b,
            this.entry(...a),
            this.entry(...b),
            direction
          );
          lane.aS.addLaneOut(lane);
          lane.bS.addLaneIn(lane);
          this.lanes.push(lane);
        }
  }

  entry(row: number, col: number) {
    row = row < 0 ? N - 1 : row;
    col = col < 0 ? N - 1 : col;
    return this.matrix[row][col];
  }

  run(dt: number) {
    for (let row of this.matrix) for (let s of row) s.tick(dt);
    for (let lane of this.lanes) {
      let temp = lane.first;
      while (temp) {
        let { car, next } = temp;
        if (next) {
          //if there's a car after this one
          //move the car forward
          if (next.car.pos - temp.car.pos > GAP) temp.car.pos++;
        } else {
          if (LANE_LENGTH - car.pos < GAP) {
            //if there's room to move
            let turning = Math.random() < 0.5;
            let signal = lane.bS;
            let nextLane = signal.lanesOut.find(
              l => (l.direction === lane.direction) !== turning
            );
            if (!nextLane) throw Error("error in finding lane");
            if (nextLane.first && nextLane.first.car.pos > GAP) {
              //you can go in the next
              lane.pop();
              nextLane.unshift(car);
            }
          }
        }
        temp = next;
      }
    }
  }
}

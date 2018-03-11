//@flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import style from "./styleApp.scss";
import type { State } from "src/types/State";
import type { Dispatch } from "src/types/Dispatch";
import { scaleLinear } from "d3-scale";
import { N, LANE_LENGTH } from "src/constants";
import classnames from "classnames";

const width = 600;
const lineWidth = 10;
const scale2 = scaleLinear()
  .range([0, width])
  .domain([0, N]);

const scale = (() => {
  let a = width / N,
    b = a - lineWidth,
    c = lineWidth / 2;
  return v => {
    let v0 = v | 0;
    // if (v0 === v && v0 > 0) return (v0 - 1) * a + c + b;
    let v1 = v - v0;
    return v0 * a + v1 * b + c;
  };
})();

const range = Array(2 * N).fill(0);
const Lanes = range.map((_, i) => {
  let d =
    i < N
      ? `M0,${scale2(i)} L${width},${scale2(i)}`
      : `M${scale2(i % N)},0 L${scale2(i % N)},${width}`;
  return <path d={d} className={style.lane} key={i} />;
});

class CarComponent extends PureComponent {
  render() {
    let { x, y, orientation, color } = this.props;
    // if (orientation === "ns") (x = scale2(x)), (y = scale(y));
    // else (x = scale(x)), (y = scale2(y));
    x = scale2(x);
    y = scale2(y);

    return (
      <rect
        transform={`translate(${x},${y})`}
        className={style.car}
        width="3"
        height="3"
        x="-1.5"
        y="-1.5"
      />
    );
  }
}

// class SignalComponent extends PureComponent {
//   render() {
//     let { x, y, orientation } = this.props;
//     return (
//       <rect
//         width="8px"
//         height="8px"
//         transform={`translate(${scale(x) - 4},${scale(y) - 4})`}
//         className={classnames(style.signal, style[orientation])}
//       />
//     );
//   }
// }

export default connect(
  ({ timerOn, time, cars, signals }) => ({
    timerOn,
    time,
    cars,
    signals
  }),
  (dispatch: Dispatch) => ({
    timerToggle() {
      dispatch({ type: "TIMER_TOGGLE" });
    }
  })
)(({ timerOn, timerToggle, cars }) => {
  return (
    <div className={style.main}>
      <div>
        <div className={style.button} onClick={timerToggle}>
          {timerOn ? "ON" : "OFF"}
        </div>
      </div>
      {/* <div className={style.time}>{time}</div> */}
      <svg className={style.svg}>
        <g transform="translate(10,10)">
          {Lanes}
          <g>
            {cars.map(d => (
              <CarComponent
                x={d.x}
                y={d.y}
                key={d.id}
                orientation={d.orientation}
              />
            ))}
          </g>
          {/* {signals.map(({ col, row, orientation, id }) => (
            <SignalComponent
              x={col}
              y={row}
              orientation={orientation}
              key={id}
            />
          ))} */}
        </g>
      </svg>
    </div>
  );
});

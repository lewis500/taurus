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
const scale = scaleLinear()
  .range([0, width])
  .domain([0, N]);

const range = Array(2 * N).fill(0);
const Lanes = range.map((_, i) => {
  let d =
    i < N
      ? `M0,${scale(i)} L${width},${scale(i)}`
      : `M${scale(i % N)},0 L${scale(i % N)},${width}`;
  return <path d={d} className={style.lane} key={i} />;
});

class CarComponent extends PureComponent {
  render() {
    let { x, y } = this.props;
    return (
      <rect
        transform={`translate(${scale(x)},${scale(y)})`}
        className={style.car}
        width="3"
        height="3"
        x="-1.5"
        y="-1.5"
      />
    );
  }
}

class SignalComponent extends PureComponent {
  render() {
    let { x, y, orientation } = this.props;
    return (
      <rect
        width="8px"
        height="8px"
        transform={`translate(${scale(x) - 4},${scale(y) - 4})`}
        className={classnames(style.signal, style[orientation])}
      />
    );
  }
}

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
)(({ timerOn, time, timerToggle, signals, cars }) => {
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
          <g>{cars.map(d => <CarComponent x={d.x} y={d.y} key={d.id} />)}</g>
          {signals.map(({ col, row, orientation, id }) => (
            <SignalComponent
              x={col}
              y={row}
              orientation={orientation}
              key={id}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});

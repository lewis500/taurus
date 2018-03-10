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

class LaneComponent extends PureComponent {
  render() {
    let { x0, x1, y0, y1 } = this.props;
    let d = `M${scale(x0)},${scale(y0)} L${scale(x1)},${scale(y1)}`;
    return <path className={style.lane} d={d} />;
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
  ({ timerOn, time, cars, lanes, signals }) => ({
    timerOn,
    time,
    cars,
    lanes,
    signals
  }),
  (dispatch: Dispatch) => ({
    timerToggle() {
      dispatch({ type: "TIMER_TOGGLE" });
    }
  })
)(({ timerOn, time, timerToggle, lanes, signals }) => {
  return (
    <div className={style.main}>
      <div className={style.button} onClick={timerToggle}>
        {timerOn ? "ON" : "OFF"}
      </div>
      <div className={style.time}>{time}</div>
      <svg className={style.svg}>
        <g transform="translate(10,10)">
          {lanes.map(lane => (
            <LaneComponent
              x0={lane.x0}
              x1={lane.x1}
              y0={lane.y0}
              y1={lane.y1}
              key={lane.id}
              direction={lane.direction}
            />
          ))}
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

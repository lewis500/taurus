//@flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import style from "./styleApp.scss";
import type { State } from "src/types/State";
import type { Dispatch } from "src/types/Dispatch";
import { scaleLinear } from "d3-scale";
import { N, LANE_LENGTH, SJ } from "src/constants";
import classnames from "classnames";
import Plot from "src/components/Plot";

const width = 450;
const lineWidth = 5;
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
        width="2"
        height="2"
        x="-1"
        y="-1"
      />
    );
  }
}

export default connect(
  ({ timerOn, time, cars, k, mfdState }) => ({
    timerOn,
    time,
    cars,
    k,
    mfdState
  }),
  (dispatch: Dispatch) => ({
    timerToggle() {
      dispatch({ type: "TIMER_TOGGLE" });
    },
    setK(e) {
      // console.log({...e});
      let k = +e.target.value;
      dispatch({ type: "SET_K", payload: k });
    }
  })
)(({ timerOn, timerToggle, cars, k, setK, mfdState: [kState, qState] }) => {
  return (
    <div className={style.main}>
      <div className={style.inputs}>
        <div className={style.button} onClick={timerToggle}>
          {timerOn ? "ON" : "OFF"}
        </div>
        <input
          type="range"
          min="0"
          max={LANE_LENGTH / SJ - 1}
          step="1"
          value={k}
          // key="input"
          // onChange={()=>{}}
          onChange={setK}
          // onMouseUp={setK}
        />
        <span>k: {kState.toFixed(2)}</span>
        <span>q: {qState.toFixed(2)}</span>
      </div>
      <div className={style.row}>
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
          </g>
        </svg>
        <Plot />
      </div>
    </div>
  );
});

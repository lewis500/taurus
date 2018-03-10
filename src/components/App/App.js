//@flow
import React from "react";
import { connect } from "react-redux";
import style from "./styleApp.scss";
import type { State } from "src/types/State";
import type { Dispatch } from "src/types/Dispatch";
import { streets } from "src/constants";

const streetsRendered = (
  <g>
    {streets.map(d => (
      <rect
        key={d.id}
        width={100}
        height={10}
        className={style.street}
        transform={`translate(${110 * d.col},${110 * d.row +
          d.orientation * 10}) rotate(${90 * d.orientation})`}
      />
    ))}
  </g>
);

export default connect(
  ({ timerOn, time }) => ({ timerOn, time }),
  (dispatch: Dispatch) => ({
    timerToggle() {
      dispatch({ type: "TIMER_TOGGLE" });
    }
  })
)(({ timerOn, time, timerToggle }) => {
  return (
    <div className={style.main}>
      <div className={style.button} onClick={timerToggle}>
        {timerOn ? "ON" : "OFF"}
      </div>
      <div className={style.time}>{time}</div>
      <br />
      <svg className={style.svg}>
        <g transform="translate(10,10)">{streetsRendered}</g>
      </svg>
    </div>
  );
});

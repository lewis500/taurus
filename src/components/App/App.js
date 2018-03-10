//@flow
import React from "react";
import { connect } from "react-redux";
import * as AC from "src/actionNames";
import style from "./styleApp.scss";
import type { State } from "src/types/State";
import type { Dispatch } from "src/types/Dispatch";
import { streets } from "src/constants";

export default connect(
  ({ counter }: State) => ({ counter }),
  (dispatch: Dispatch) => ({
    onClick() {
      dispatch({ type: AC.INCREMENT });
    }
  })
)(({ counter, onClick }) => {
  return (
    <svg className={style.svg}>
      <g transform="translate(10,10)">
        {streets.map(d => {
          return (
            <rect
              key={d.id}
              width={100}
              height={10}
              className={style.street}
              transform={`translate(${110 * d.col},${110 * d.row + d.orientation*10}) rotate(${90 *
                d.orientation})`}
            />
          );
        })}
      </g>
    </svg>
  );
});

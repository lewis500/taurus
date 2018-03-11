import React from "react";
import style from "./stylePlot";
import { connect } from "react-redux";
import * as CN from "src/constants";

const width = 400;
const height = 300;
const mar = 10;
const x = (v: number) => width * v / (CN.LANE_LENGTH / CN.SJ);
const y = (v: number) => height * (1 - v / 6);

const FDLine = (() => {
  let K0 = CN.LANE_LENGTH / CN.SJ * CN.W / (CN.VF + CN.W);
  let d = `M0,${height} L${x(K0)},${y(K0 * CN.VF/2)} L${width},${height}`;
  return <path d={d} className={style.fd} />;
})();

export default connect(({ mfdState }) => ({ mfdState }))(
  ({ mfdState: [k, q] }) => {
    return (
      <div className={style.plot}>
        <svg width={width + 2 * mar} height={height + 2 * mar}>
          <g transform={`translate(${mar},${mar})`}>
            <rect className={style.bg} width={width} height={height} />
            {FDLine}
            <circle
              r="5"
              className={style.dot}
              transform={`translate(${x(k)},${y(q)})`}
            />
          </g>
        </svg>
      </div>
    );
  }
);

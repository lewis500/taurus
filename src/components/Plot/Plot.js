import React from "react";
import style from "./stylePlot";
import { connect } from "react-redux";
import * as CN from "src/constants";
import getMFD from "src/getMFD2";
console.log(CN.Q0);

const width = 400;
const height = 300;
const mar = 10;
const x = (v: number) => width * v / (CN.LANE_LENGTH / CN.SJ);
const y = (v: number) => height * (1 - v / CN.Q0);

const FDLine = (() => {
  let K0 = CN.LANE_LENGTH / CN.SJ * CN.W / (CN.VF + CN.W);
  let d = `M0,${height} L${x(K0)},${y(K0 * CN.VF )} L${width},${height}`;
  return <path d={d} className={style.fd} />;
})();

const MFDLine = (() => {
  const MFD = getMFD();
  console.log(MFD);
  let res = [];
  for (var i = 0, l = MFD.length; i < l; i++)
    res.push([x(MFD[i][0]), y(MFD[i][1])]);
  let d = "M" + res.join("L");
  // console.log(d);
  return <path d={d} className={style.mfd} />;
})();

export default connect(({ mfdState }) => ({ mfdState }))(
  ({ mfdState: [k, q] }) => {
    return (
      <div className={style.plot}>
        <svg width={width + 2 * mar} height={height + 2 * mar}>
          <g transform={`translate(${mar},${mar})`}>
            <rect className={style.bg} width={width} height={height} />
            {FDLine}
            {MFDLine}
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

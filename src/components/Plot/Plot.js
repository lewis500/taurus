import React from "react";
import style from "./stylePlot";
import { connect } from "react-redux";
import * as CN from "src/constants";
import getMFD from "src/getMFD2";
import Axis from "src/components/Axis";
import { scaleLinear } from "d3-scale";

const width = 400;
const height = 300;
const mar = 35;
const x = scaleLinear()
  .domain([0, CN.LANE_LENGTH/CN.SJ])
  .range([0, width]);
const y = scaleLinear()
  .domain([0, CN.Q0])
  .range([height, 0]);

const FDLine = (() => {
  let K0 = CN.LANE_LENGTH / CN.SJ * CN.W / (CN.VF + CN.W);
  let d = `M0,${height} L${x(K0)},${y(K0 * CN.VF)} L${width},${height}`;
  return <path d={d} className={style.fd} />;
})();

const MFDLine = (() => {
  const MFD = getMFD();
  // console.log(MFD);
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
        <svg width={width + 2 * mar} height={height + 3 * mar}>
          <g transform={`translate(${mar},${mar})`}>
            <rect width={width} height={height} className={style.bg}/>
            <Axis
              transform={`translate(${0},${height})`}
              scale={x}
              orient="BOTTOM"
              ticks={5}
              tickPadding={9}
            />
            <text className={style.label} transform={`translate(${width/2},${height+40})`}>density (veh/block)</text>
            <text className={style.label} transform={`translate(${-22},${height/2}) rotate(-90)`}>flow (veh/s)</text>
            <Axis
              ticks={4}
              tickPadding={9}
              scale={y}
              orient="LEFT"
              className={"yAxis"}
              tickSizeInner={-width}
            />
          </g>
          <g transform={`translate(${mar},${mar})`}>
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

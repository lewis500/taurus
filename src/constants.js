// export const streets  = Array(9 * 2)
//   .fill(0)
//   .map((d, i) => {
//     let row = Math.floor(i / 6);
//     let orientation = i % 2;
//     let col = Math.floor((i % 6) / 2);
//     return {
//       row,
//       col,
//       orientation,
//       id: [row, orientation, col].join("")
//     };
//   });

export const GAP = 1;
export const CYCLE = 50;
export const N = 10;
export const LANE_LENGTH = 100;
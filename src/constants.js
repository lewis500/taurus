//@flow
export const CYCLE = 30;
export const N = 7;
export const LANE_LENGTH = 40;
export const SJ = 1.5;
export const VF = 2;
export const W = VF / 2;
export const TURN = 0.15;
export const HIST = 2*CYCLE;
export const KJ = 1 / SJ*LANE_LENGTH;
export const K0 = KJ * W / (VF + W);
export const Q0 = VF * K0;
export const GREEN = CYCLE * 0.5;

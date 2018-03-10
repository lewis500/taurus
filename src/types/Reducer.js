//@flow
import type { Action } from "src/types/Action";
export type Reducer<S, A: Action> = (s: S, a: A) => S;

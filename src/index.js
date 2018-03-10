//@flow
import React from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { render } from "react-dom";
import App from "src/components/App";
import type { Store} from "redux";
import type {Action} from 'src/types/Action'
import type {State} from 'src/types/State';
import root from 'src/reducers/root';

const store:Store<State,Action> = createStore(root);
const container = document.getElementById("root");
if (!container) throw Error("no root container");

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container
);

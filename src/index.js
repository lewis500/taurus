//@flow
import React from "react";
import { Provider } from "react-redux";
import { render } from "react-dom";
import App from "src/components/App";
import store from './store';

const container = document.getElementById("root");
if (!container) throw Error("no root container");

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container
);

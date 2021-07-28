import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const router_basename = process.env.REACT_APP_ROUTER_BASENAME;

ReactDOM.render(
  // Load BrowserRouter as soon as possible so that we can use reactrouter
  // hooks in App
  <BrowserRouter basename={router_basename}>
    <App />
  </BrowserRouter>,
  document.querySelector(".container")
);

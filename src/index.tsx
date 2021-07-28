import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

ReactDOM.render(
  // Load BrowserRouter as soon as possible so that we can use reactrouter
  // hooks in App
  <BrowserRouter><App/></BrowserRouter>,
  document.querySelector(".container")
);

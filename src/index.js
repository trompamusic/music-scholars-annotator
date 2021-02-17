import React from "react";
import ReactDOM from "react-dom";

import SelectableScoreWrapper from "./containers/selectableScoreWrapper";

// Parameters for SelectableScore component
// ****************************************
// MEI_URI: Can be a full URI, e.g. obtained from the TROMPA Contributor Environment
// const MEI_URI = "test.mei";
// vrvOptions: If not supplied to <SelectableScore>, will default to predefined options
var zoom = 45;
var pageHeight = 1150;
var pageWidth = 1000;
var sizedPageWidth = (pageWidth * 100) / zoom;
var sizedPageHeight = (pageHeight * 100) / zoom;
const vrvOptions = {
  scale: zoom,
  adjustPageHeight: 1,
  pageHeight: sizedPageHeight,
  pageWidth: sizedPageWidth,
  footer: "none",
  unit: 6,
};

function onZoomIncrease() {
  var step = 10;
  vrvOptions.scale = vrvOptions.scale + step;
  vrvOptions.pageHeight = (pageHeight * 100) / vrvOptions.scale;
  vrvOptions.pageWidth = (pageWidth * 100) / vrvOptions.scale;
  console.log(
    "ZOOM INCREASE",
    vrvOptions.scale,
    "page w",
    vrvOptions.pageWidth,
    "page h",
    vrvOptions.pageHeight
  );
}

function onZoomDecrease() {
  var step = 10;
  vrvOptions.scale = vrvOptions.scale - step;
  vrvOptions.pageHeight = (pageHeight * 100) / vrvOptions.scale;
  vrvOptions.pageWidth = (pageWidth * 100) / vrvOptions.scale;
  console.log(
    "ZOOM DECREASE",
    vrvOptions.scale,
    "page w",
    vrvOptions.pageWidth,
    "page h",
    vrvOptions.pageHeight
  );
}

ReactDOM.render(
  <SelectableScoreWrapper
    vrvOptions={vrvOptions}
    zoomIn={onZoomIncrease}
    zoomOut={onZoomDecrease}
  />,
  document.querySelector(".container")
);

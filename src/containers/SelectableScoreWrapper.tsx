import React from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ReduxPromise from "redux-promise";

import { reducers } from "meld-clients-core/lib/reducers";
import SolidWrapper from "./SolidWrapper";

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  ReduxPromise
)(createStore);

const SelectableScoreWrapper = () => {
  return (
    <Provider store={createStoreWithMiddleware(reducers)}>
      <SolidWrapper />
    </Provider>
  );
}

export default SelectableScoreWrapper;

import React, { Component } from "react";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import ReduxPromise from "redux-promise";

import { reducers } from "meld-clients-core/lib/reducers";
import SolidWrapper from "./solidWrapper";

const createStoreWithMiddleware = applyMiddleware(
  thunk,
  ReduxPromise
)(createStore);

export default class SelectableScoreWrapper extends Component {
  constructor(props) {
    super(props);
    // MEI_URI: Can be a full URI, e.g. obtained from the TROMPA Contributor Environment
    this.state = {
      MEI_URI: "test.mei",
    };
    this.store = createStore(reducers);
  }

  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <p>Specify your MEI link here</p>
        <div>
          <form>
            <input type="text" name="value" v placeholder="link..." />
            <input type="submit" />
          </form>
        </div>
        <SolidWrapper
          uri={this.state.MEI_URI}
          vrvOptions={this.props.vrvOptions}
          handleMEIInput={this.handleMEIInput}
          onChange={this.onChange}
          value={this.state.value}
        />
      </Provider>
    );
  }
}

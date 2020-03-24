import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import ReduxPromise from 'redux-promise';

import { reducers } from 'meld-clients-core/lib/reducers'
import SelectableScoreApp from './selectableScoreApp'

const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);

export default class SelectableScoreWrapper extends Component {
  constructor(props) {
    super(props)
    this.store = createStore(reducers)
  }

  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <SelectableScoreApp uri = { this.props.uri} vrvOptions = { this.props.vrvOptions }/>
      </Provider>
    )
  }
}

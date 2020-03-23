import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { reducers } from 'meld-clients-core/lib/reducers'
import TestApp from './testApp'

export default class SubApp extends Component {
  constructor(props) {
    super(props)
    this.store = createStore(reducers)
  }

  render() {
    return (
      <Provider store={this.store}>
        <TestApp />
      </Provider>
    )
  }
}

import React, {Component} from "react";
import SelectableScoreWrapper from "./containers/selectableScoreWrapper";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

import { reducers } from 'meld-clients-core/lib/reducers';
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import ReduxPromise from 'redux-promise';


const CE_URL = "https://api.trompamusic.eu"

const client = new ApolloClient({
    uri: CE_URL,
    cache: new InMemoryCache()
});

export default class App extends Component {
    render() {
        const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);

        return (
            <Provider store={createStoreWithMiddleware(reducers)}>
            <ApolloProvider client={client}>
                <SelectableScoreWrapper/>
            </ApolloProvider>
            </Provider>
        )
    }
}
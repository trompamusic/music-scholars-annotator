import React from "react";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";

import { reducers } from 'meld-clients-core/lib/reducers';
import {createStore, applyMiddleware} from "redux";
import thunk from "redux-thunk";
import {Provider} from "react-redux";
import ReduxPromise from 'redux-promise';
import SolidWrapper from "./containers/SolidWrapper";
import Navigation from "./containers/Navigation";
import {SessionProvider} from "@inrupt/solid-ui-react";
import {Container} from "react-bootstrap-v5";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, BrowserRouter as Router, Switch } from "react-router-dom";


const CE_URL = "https://api.trompamusic.eu"

const client = new ApolloClient({
    uri: CE_URL,
    cache: new InMemoryCache()
});

function App() {
    const createStoreWithMiddleware = applyMiddleware(thunk, ReduxPromise)(createStore);

    return (
        <Router>
            <SessionProvider sessionId="trompa-music-scholars-annotator">
                <Provider store={createStoreWithMiddleware(reducers)}>
                    <ApolloProvider client={client}>
                        <Navigation/>
                        <Container fluid="lg">
                            <Switch>
                                <Route exact path="/">
                                    <SolidWrapper />
                                </Route>
                            </Switch>
                        </Container>
                    </ApolloProvider>
                </Provider>
            </SessionProvider>
        </Router>
    )
}

export default App;

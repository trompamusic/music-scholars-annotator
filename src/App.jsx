import React, {Component} from "react";
import SelectableScoreWrapper from "./containers/selectableScoreWrapper";
import {ApolloClient, ApolloProvider, InMemoryCache} from "@apollo/client";


const CE_URL = "https://api.trompamusic.eu"

const client = new ApolloClient({
    uri: CE_URL,
    cache: new InMemoryCache()
});

export default class App extends Component {
    render() {
        return (
            <ApolloProvider client={client}>
                <SelectableScoreWrapper/>
            </ApolloProvider>
        )
    }
}
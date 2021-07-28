import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import { reducers } from "meld-clients-core/lib/reducers";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import ReduxPromise from "redux-promise";
import Navigation from "./containers/Navigation";
import { SessionProvider } from "@inrupt/solid-ui-react";
import { Container } from "react-bootstrap-v5";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";
import AnnotatorRouter from "./containers/AnnotatorRouter";

const CE_URL = "https://api.trompamusic.eu";

const client = new ApolloClient({
  uri: CE_URL,
  cache: new InMemoryCache(),
});

function App() {
  const createStoreWithMiddleware = applyMiddleware(
    thunk,
    ReduxPromise
  )(createStore);

  let history = useHistory();
  // According to https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/restore-session-browser-refresh/
  // A session created with solid-client-authn-browser won't reload when the user refreshes the page, so we
  // use the {restorePreviousSession: true} trick to make this happen.
  // The SessionProvider will call this callback once the user has been logged in, allowing us to
  // redirect back to where they were.
  const onSessionRestore = (url: string) => {
    const u = new URL(url);
    history.push(u.hash.substring(1));
  };

  return (
    <SessionProvider
      sessionId="trompa-music-scholars-annotator"
      onSessionRestore={onSessionRestore}
    >
      <Provider store={createStoreWithMiddleware(reducers)}>
        <ApolloProvider client={client}>
          <Navigation />
          <Container fluid="lg" style={{ paddingLeft: "0px" }}>
            <AnnotatorRouter />
          </Container>
        </ApolloProvider>
      </Provider>
    </SessionProvider>
  );
}

export default App;

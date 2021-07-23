import { useEffect, useState } from "react";
import { Nav, Navbar } from "react-bootstrap-v5";
import {
  CombinedDataProvider,
  LoginButton,
  LogoutButton,
  Text,
} from "@inrupt/solid-ui-react";

import { FOAF } from "@inrupt/lit-generated-vocab-common";
import { Link, useHistory } from "react-router-dom";
import { Button } from "react-bootstrap-v5";
import React from "react";

import Logo from "../graphics/top-bar-logo_0_0.png";
import {
  handleIncomingRedirect,
  ISessionInfo,
  onSessionRestore,
} from "@inrupt/solid-client-authn-browser";

export default function Navigation() {
  const trompaIdp = "https://trompa-solid.upf.edu";
  let history = useHistory();
  const [session, setSession] = useState<ISessionInfo | undefined>(undefined);

  onSessionRestore((url) => {
    const u = new URL(url);
    history.push(u.pathname + u.search);
  });

  // According to https://docs.inrupt.com/developer-tools/javascript/client-libraries/tutorial/restore-session-browser-refresh/
  // A session created with solid-client-authn-browser won't reload when the user refreshes the page, so we
  // use the {restorePreviousSession: true} trick to make this happen.
  // We manually manage the session as a state variable so that we can re-set it here in useEffect
  // so that we re-render the component when we restore the session.
  // TODO: It might be a better idea to store this session state as part of App and pass it down to components that need it
  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true,
    }).then((info) => {
      setSession(info);
    });
  }, []);

  return (
    <Navbar bg="light" expand="xl">
      <Navbar.Brand href="#home">
        <img src={Logo} alt="Trompa logo" />
        Music scholars annotation tool
      </Navbar.Brand>
      <Nav className="me-auto">
        <Nav.Link as={Link} to="/">
          Home
        </Nav.Link>
        <Nav.Link as={Link} to="/new">
          New
        </Nav.Link>
      </Nav>
      <Nav>
        {session && session.isLoggedIn ? (
          <Navbar.Text style={{ display: "inline-flex", alignItems: "center" }}>
            <CombinedDataProvider
              datasetUrl={session.webId!}
              thingUrl={session.webId!}
            >
              Logged in:{" "}
              <Text
                style={{ marginLeft: ".1vw" }}
                property={FOAF.name.iri.value}
              />
            </CombinedDataProvider>
            &emsp;
            <LogoutButton onLogout={() => setSession(undefined)}>
              <Button className="logoutButton">Log out</Button>
            </LogoutButton>
          </Navbar.Text>
        ) : (
          <LoginButton
            oidcIssuer={trompaIdp}
            redirectUrl={window.location.origin}
          >
            <Button className="loginButton">Log in</Button>
          </LoginButton>
        )}
      </Nav>
    </Navbar>
  );
}

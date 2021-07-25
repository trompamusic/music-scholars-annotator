import { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap-v5";
import {
  CombinedDataProvider,
  LoginButton,
  LogoutButton,
  SessionContext,
  Text,
} from "@inrupt/solid-ui-react";

import { FOAF } from "@inrupt/lit-generated-vocab-common";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap-v5";
import React from "react";

import Logo from "../graphics/top-bar-logo_0_0.png";

export default function Navigation() {
  const trompaIdp = "https://trompa-solid.upf.edu";
  const { session } = useContext(SessionContext);

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
        <Nav.Link as={Link} to="/help">
          Help
        </Nav.Link>
      </Nav>
      <Nav>
        {session.info.isLoggedIn ? (
          <Navbar.Text style={{ display: "inline-flex", alignItems: "center" }}>
            <CombinedDataProvider
              datasetUrl={session.info.webId!}
              thingUrl={session.info.webId!}
            >
              Logged in:{" "}
              <Text
                style={{ marginLeft: ".1vw" }}
                property={FOAF.name.iri.value}
              />
            </CombinedDataProvider>
            &emsp;
            <LogoutButton>
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

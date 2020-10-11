import React, { useState } from "react";
import data from "@solid/query-ldflex";

import {
  LoginButton,
  LogoutButton,
  Value,
  LoggedIn,
  LoggedOut,
  useLDflexValue,
} from "@solid/react";

import SelectableScoreApp from "./selectableScoreApp";
// state = {
//   userURI: "",
// };
// onChange = (e) => this.setState({ userURI: e.target.value });
export default function SolidWrapper(props) {
  data.context.extend({
    trompa: "http://vocab.trompamusic.eu/vocab#",
  });
  const userPOD = useLDflexValue("user.storage");
  return (
    <div id="authWrapper">
      <LoggedOut>
        <div>
          <p>
            <LoginButton className="loginButton" popup="auth-popup.html">
              Log in with Solid
            </LoginButton>
          </p>
        </div>
      </LoggedOut>
      <LoggedIn>
        <h2>Annotation submitter demo</h2>
        <p>
          You are logged in as <Value src="user.name" />
        </p>
        <p>
          <LogoutButton className="logoutButton">Log out</LogoutButton>
        </p>
        <p>insert your pod URI</p>
        <form>
          <input
            placeholder="Enter pod URI..."
            //onChange={this.onChange}
            //value={this.state.userURI}
            name="value"
          ></input>
        </form>
        {typeof userPOD !== "undefined" ? (
          <SelectableScoreApp
            uri={props.uri}
            vrvOptions={props.vrvOptions}
            submitUri={`${userPOD}public/`}
          />
        ) : (
          <div>Loading... </div>
        )}
      </LoggedIn>
    </div>
  );
}

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

export default function SolidWrapper(props) {
  data.context.extend({
    trompa: "http://vocab.trompamusic.eu/vocab#",
  });
  const userPOD = useLDflexValue("user.storage");
  const [userInput, setUserInput] = useState("public/");

  const handleUserInput = (e) => {
    const containerPath = e.target.value
      ? setUserInput(e.target.value)
      : "public/";
  };

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
        <p>Specify annotation container path inside your Pod:</p>
        <div>
          <input type="text" placeholder="public/" onChange={handleUserInput} />
        </div>
        {typeof userPOD !== "undefined" ? (
          <SelectableScoreApp
            uri={props.uri}
            vrvOptions={props.vrvOptions}
            submitUri={`${userPOD}` + userInput}
          />
        ) : (
          <div>Loading... </div>
        )}
      </LoggedIn>
    </div>
  );
}

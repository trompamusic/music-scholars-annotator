import React, { useState, useRef } from "react";
import data from "@solid/query-ldflex";
import InputField from "./InputField.js";

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
  const userInput = useRef(null);
  var testInput = "";
  const handleClick = () => {
    testInput = userInput.current;
    console.log(`${userInput.current.value.value}`);
    return testInput;
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
        <p>insert your pod URI</p>
        <div>
          <form ref={userInput}>
            <InputField
              placeholder="Enter pod URI..."
              type="text"
              name="value"
            />
            <input type="button" value="store ref" onClick={handleClick} />
          </form>
        </div>
        {typeof userPOD !== "undefined" ? (
          <SelectableScoreApp
            uri={props.uri}
            vrvOptions={props.vrvOptions}
            submitUri={`${userInput.current.value.value}`}
          />
        ) : (
          <div>Loading... </div>
        )}
      </LoggedIn>
    </div>
  );
}

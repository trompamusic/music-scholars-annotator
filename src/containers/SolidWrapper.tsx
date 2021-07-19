import React, {ChangeEvent, useState} from "react";
import data from "@solid/query-ldflex";

import {
  LoginButton,
  LogoutButton,
  Value,
  LoggedIn,
  LoggedOut,
  useLDflexValue,
} from "@solid/react";

import SelectableScoreApp from "./SelectableScoreApp";

const SolidWrapper = () => {
  data.context.extend({
    trompa: "http://vocab.trompamusic.eu/vocab#",
  });

  const userPOD = useLDflexValue("user.storage");
  const userId = useLDflexValue("user");
  const [userInput, setUserInput] = useState("private/");

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value ? e.target.value : "private/");
  };

  return (
    <div id="authWrapper">
      <LoggedOut>
        <div>
          <a
            href="https://trompamusic.eu/"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
          <p>
            <LoginButton className="loginButton" popup="auth-popup.html">
              Log in with Solid
            </LoginButton>
          </p>
        </div>
      </LoggedOut>
      <LoggedIn>
        <a
          href="https://trompamusic.eu/"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <h2>Music scholars annotation tool</h2>
        <p>
          You are logged in as{" "}
          <a href={userId?.toString()} target="_blank" rel="noopener noreferrer">
            <Value src="user.name" />
          </a>
        </p>
        <p title="close the current session and quit the app">
          <LogoutButton className="logoutButton">Log out</LogoutButton>
        </p>
        <p>Specify the annotation container path inside your Pod:</p>
        <div>
          <input
            title="enter your preferred POD folder"
            type="text"
            placeholder="private/"
            onChange={handleUserInput}
            className="sizedTextBox"
          />
        </div>
        {typeof userPOD !== "undefined" ? (
          <SelectableScoreApp
            podUri={userPOD.toString()}
            submitUri={`${userPOD}` + userInput}
            userId={userId ? userId.toString() : ''}
          />
        ) : (
          <div>Loading... </div>
        )}
      </LoggedIn>
    </div>
  );
}

export default SolidWrapper;

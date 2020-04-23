import React, { Component } from "react";
import { AuthButton, Value, LoggedIn, LoggedOut, Image } from "@solid/react";

export class SolidLoginComponent extends Component {
  render() {
    return (
      <div>
        <header>
          <h3>Solid integration test</h3>
          <p>
            <AuthButton popup="/popup.html" />
          </p>
        </header>
        <main>
          <LoggedIn>
            <Image
              src="user.image"
              defaultSrc="profile.svg"
              className="profile"
            />
            <p>
              Welcome back, <Value src="user.name" />.
            </p>
          </LoggedIn>
          <LoggedOut>
            <p>You are logged out.</p>
          </LoggedOut>
        </main>
      </div>
    );
  }
}

export default SolidLoginComponent;

import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotation-submitter.js";
import RadioButton from "../annotations/RadioButton.js"
import AuthButton from "../solid/components/AuthButton.jsx"
import LoggedIn from "../solid/components/LoggedIn.jsx"
import LoggedOut from "../solid/components/LoggedOut"
import Value from "../solid/components/Value.jsx"
import Image from "../solid/components/Image.jsx"

// selectionString: CSS selector for all elements to be selectable (e.g. ".measure", ".note")
const selectorString = ".measure";

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      uri: this.props.uri,
      /* you can set this dynamically if your app requires dynamic MEI updates */
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
  }

  

  handleSelectionChange(selection) {
    this.setState({ selection });
    /* and anything else your app needs to do when the selection changes */
  }

  handleScoreUpdate(scoreElement) {
    console.log("Received updated score DOM element: ", scoreElement);
  }
  render() {
    return (
      <div>
       <header>
       <h1>Solid integration test</h1>
        <p><AuthButton popup="/popup.html"/></p>
       </header>
       <main>
        <LoggedIn>
          <Image src="user.image" defaultSrc="profile.svg" className="profile"/>
          <p>Welcome back, <Value src="user.name"/>.</p>
        </LoggedIn>
        <LoggedOut>
          <p>You are logged out.</p>
        </LoggedOut>
      </main>

      <p>
          This is a minimal example demonstrating the use of the TROMPA
          selectable-score component.
      </p>

        {/* pass anything as buttonContent that you'd like to function as a clickable next page button */}
        <NextPageButton
          buttonContent={<span>Next</span>}
          uri={this.state.uri}
        />

        {/* pass anything as buttonContent that you'd like to function as a clickable prev page button */}
        <PrevPageButton
          buttonContent={<span>Prev</span>}
          uri={this.state.uri}
        />
        <RadioButton/>

        <AnnotationSubmitter selection={this.state.selection} />

        <SelectableScore
          uri={this.state.uri}
          options={this.props.vrvOptions}
          onSelectionChange={this.handleSelectionChange}
          selectorString={selectorString}
          onScoreUpdate={this.handleScoreUpdate}
        />
      </div>
    );
  }
}

import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotation-submitter.js";
import SelectionHandler from "../annotations/SelectionHandler.js";
import SolidLoginComponent from "../SolidLoginComponent.js";
//import SubmitButton from "../submit-button.js";

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      uri: this.props.uri,
      selectorString: ".note",
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.handleStringChange = this.handleStringChange.bind(this);
  }

  handleStringChange(selectorString) {
    this.setState({ selectorString });
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
        <h2>Selectable score component demo</h2>
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

        {/*solid pod login handler*/}
        <SolidLoginComponent />

        {/* <SubmitButton /> */}

        {/*selector for the component selection*/}
        <SelectionHandler
          selectorString={this.state.selectorString}
          handleStringChange={this.handleStringChange}
        />

        {/*annotation submission component*/}
        <AnnotationSubmitter
          uri={this.state.uri}
          selection={this.state.selection}
        />

        <SelectableScore
          uri={this.state.uri}
          options={this.props.vrvOptions}
          onSelectionChange={this.handleSelectionChange}
          selectorString={this.state.selectorString}
          onScoreUpdate={this.handleScoreUpdate}
        />
      </div>
    );
  }
}

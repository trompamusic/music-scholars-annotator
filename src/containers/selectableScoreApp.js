import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotation-submitter.js";
import SelectionHandler from "../annotations/SelectionHandler.js";

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      uri: this.props.uri,
      selectorString: ".note",
      currentAnnotation: [],
      //buttonState: "disabledSubmitButton",
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.handleStringChange = this.handleStringChange.bind(this);
    // this.submitHandler = this.submitHandler.bind(this);
    // this.handleAnnotation = this.handleAnnotation.bind(this);
    // this.buttonEnabler = this.buttonEnabler.bind(this);
    // this.buttonDisable = this.buttonDisable.bind(this);
  }

  handleStringChange(selectorString) {
    this.setState({ selectorString });
  }

  handleSelectionChange(selection) {
    this.setState({ selection });
    /* and anything else your app needs to do when the selection changes */
  }

  // handleAnnotation(anno) {
  //   //var joined = this.state.currentAnnotation.concat(anno);
  //   this.setState({ currentAnnotation: anno });
  // }

  // submitHandler(currentAnnotation) {
  //   return {
  //     "@context": "http://www.w3.org/ns/anno.jsonld",
  //     target: currentAnnotation.target,
  //     type: currentAnnotation.type,
  //     body: currentAnnotation.body,
  //     motivation: currentAnnotation.motivation,
  //   };
  // }

  // buttonEnabler() {
  //   this.setState({ buttonState: "enabledSubmitButton" });
  // }

  // buttonDisable() {
  //   this.setState({ buttonState: "disabledSubmitButton" });
  // }

  handleScoreUpdate(scoreElement) {
    console.log("Received updated score DOM element: ", scoreElement);
  }
  render() {
    return (
      <div>
        {/*selector for the component selection*/}
        <SelectionHandler
          selectorString={this.state.selectorString}
          handleStringChange={this.handleStringChange}
        />

        {/*annotation submission component*/}
        <AnnotationSubmitter
          uri={this.state.uri}
          submitUri={this.props.submitUri}
          selection={this.state.selection}
          //passAnnotation={this.passAnnotation}
          // currentAnnotation={this.handleAnnotation}
          //buttonEnabler={this.buttonEnabler}
          //submitHandler={this.submitHandler}
          //submitHandlerArgs={this.state.currentAnnotation}
        />

        {/*button that submits the annotation to the user solid pod*/}
        {/* <div className={this.state.buttonState}>
          <SubmitButton
            buttonContent="Submit to your Solid POD"
            submitUri={this.props.submitUri}
            submitHandler={this.handleSubmit}
            submitHandlerArgs={this.state.currentAnnotation}
          />
        </div> */}

        {/* pass anything as buttonContent that you'd like to function as a clickable prev page button */}
        <div className="pageButton">
          <PrevPageButton
            buttonContent={<span>Previous page</span>}
            uri={this.state.uri}
          />
        </div>

        <div className="divider"></div>

        {/* pass anything as buttonContent that you'd like to function as a clickable next page button */}
        <div className="pageButton">
          <NextPageButton
            buttonContent={<span>Next page</span>}
            uri={this.state.uri}
          />
        </div>

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

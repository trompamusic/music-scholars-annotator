import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import Annotations from "../annotations/Annotations.js";
import uuid from "uuid";

// selectionString: CSS selector for all elements to be selectable (e.g. ".measure", ".note")
const selectorString = ".measure";

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      uri: this.props.uri 
      /* you can set this dynamically if your app requires dynamic MEI updates */,
      annotation: "",
      measureid: "",
      annotationlist: [],
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
  }
  /*form change handler*/
  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onSubmit = (e) => {
    e.preventDefault();
    this.addannotation(
      this.state.selection.map((elem) => elem.getAttribute("id")).join(", "),
      this.state.annotation
    );
    this.setState({ measureid: "" });
    this.setState({ annotation: "" });
    console.log(this.state.measureid);
  };
  /*adds an annotation item to the annotation list array */
  addannotation = (measureid, annotation) => {
    const newAnnotation = {
      id: uuid.v4(),
      annotation,
      measureid,
    };
    this.setState({
      annotationlist: [...this.state.annotationlist, newAnnotation],
    });
  };

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
        <p>
          This is a minimal example demonstrating the use of the TROMPA
          selectable-score component.
        </p>
        {/*form for the annotation submission */}
        <div>
          <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
            <textarea
              type="text"
              name="annotation"
              placeholder="Add your annotation"
              value={this.state.annotation}
              onChange={this.onChange}
            />
            <input
              type="submit"
              name="submit"
              value="add annotation to selection"
              className="btn"
            />
          </form>
        </div>
        {/*list component for the annotations */ }
        <div className="ScrollerContainer">
          <div className="list">
            <Annotations annotationlist={this.state.annotationlist} />
          </div>
        </div>

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

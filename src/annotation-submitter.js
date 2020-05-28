import React from "react";
import uuid from "uuid";
import Addannotations from "./annotations/Addannotation.js";

export class AnnotationSubmitter extends React.Component {
  state = {
    annotationlist: [],
    annotationType: "",
    placeholder: "",
  };
  onChange = (e) =>
    this.setState({
      annotationType: e.target.value,
      placeholder: e.target.placeholder,
    });
  addannotation = (target, value) => {
    if (this.state.annotationType === "describing") {
      const newDescribingAnnotation = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        id: uuid.v4(), //temporary dummy
        target, //this takes the measure id selected by the user
        type: "Annotation",
        body: [{ type: "TextualBody", value: value }], //this takes the user input
        motivation: "describing",
      };
      this.setState({
        annotationlist: [...this.state.annotationlist, newDescribingAnnotation],
      });
      console.log(newDescribingAnnotation);
    } else if (this.state.annotationType === "linking") {
      const newLinkingAnnotation = {
        "@context": "http://www.w3.org/ns/anno.jsonld",
        id: uuid.v4(), //temporary dummy
        target, //this takes the measure id selected by the user
        type: "Annotation",
        body: [{ id: value }], //this takes the user input
        motivation: "linking",
      };
      this.setState({
        annotationlist: [...this.state.annotationlist, newLinkingAnnotation],
      });
      console.log(newLinkingAnnotation);
    }
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h3>Annotation submission demo</h3>
          <p>please select the annotation type:</p>
          <label>
            <input
              type="radio"
              name="annotationType"
              value="describing"
              placeholder="Add your annotation..."
              onChange={this.onChange}
            />
            describing
          </label>
          <label>
            <input
              type="radio"
              value="linking"
              name="annotationType"
              placeholder="instert your URI link..."
              onChange={this.onChange}
            />
            linking
          </label>
          <div className="addAnnotations">
            <Addannotations
              addannotation={this.addannotation}
              selection={this.props.selection}
              uri={this.props.uri}
              placeholder={this.state.placeholder}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

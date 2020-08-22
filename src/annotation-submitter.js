import React from "react";
import Addannotations from "./annotations/Addannotation.js";
export class AnnotationSubmitter extends React.Component {
  state = {
    annotationType: "",
    placeholder: "", //placeholder text for the input field
  };
  onChange = (e) =>
    this.setState({
      annotationType: e.target.value,
      placeholder: e.target.placeholder,
    });

  submitHandler = (value) => {
    //adds different annotations based on selection
    var anno = "";
    switch (this.state.annotationType) {
      case "describing":
        anno = {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ type: "TextualBody", value }], //this takes the user input
          motivation: "describing",
        };
        //no set state nothing that goes up beyond this point
        return {
          anno,
        };

      case "linking":
        anno = {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: value }], //this takes the user URI
          motivation: "linking",
        };
        // console.log(anno);
        return {
          anno,
        };

      default:
        console.log(
          "no annotation found, have you selected the annotation type?"
        );
    }
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h3>Annotation type</h3>
          <label>
            <input
              type="radio"
              name="annotationType"
              value="describing"
              placeholder="Add your annotation..."
              onChange={this.onChange}
            />
            Describing
          </label>
          <label>
            <input
              type="radio"
              value="linking"
              name="annotationType"
              placeholder="instert your URI link..."
              onChange={this.onChange}
            />
            Linking
          </label>
          <div className="addAnnotations">
            <Addannotations
              submitUri={this.props.submitUri}
              placeholder={this.state.placeholder}
              submitHandler={this.submitHandler}
              onResponse={this.props.onResponse}
              onRefreshClick={this.props.onRefreshClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

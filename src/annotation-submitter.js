import React from "react";
import uuid from "uuid";
import Annotations from "./annotations/Annotations.js";
import Addannotations from "./annotations/Addannotation.js";

export class AnnotationSubmitter extends React.Component {
  state = {
    annotationlist: [],
  };

  addannotation = (target, value, uri) => {
    const newAnnotation = {
      context: "@context: http://www.w3.org/ns/anno.jsonld",
      id: uuid.v4(), //temporary dummy
      uri, //this as you suggested takes the uri prop passed to the selectable score
      target, //this takes the measure id selected by the user
      type: "TextualBody",
      value, //this takes the user inpuSt
      motivation: "describing",
    };
    this.setState({
      annotationlist: [...this.state.annotationlist, newAnnotation],
    });
    console.log(newAnnotation);
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h3>Annotation submission demo</h3>
          <Addannotations
            addannotation={this.addannotation}
            selection={this.props.selection}
            uri={this.props.uri}
          />
          <div className="ScrollerContainer">
            <div className="list">
              <Annotations annotationlist={this.state.annotationlist} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

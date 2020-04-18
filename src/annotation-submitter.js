import React from "react";
import uuid from "uuid";
import Annotations from "./annotations/Annotations.js";
import Addannotations from "./annotations/Addannotation.js";

export class AnnotationSubmitter extends React.Component {
  state = {
    annotationlist: []
  };

  addannotation = (measureid, annotation) => {
    const newAnnotation = {
      id: uuid.v4(),
      annotation,
      measureid
    };
    this.setState({
      annotationlist: [...this.state.annotationlist, newAnnotation]
    });
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h3>Annotation submission demo</h3>
          <Addannotations addannotation={this.addannotation} />
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

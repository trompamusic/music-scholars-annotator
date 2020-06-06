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

  descAnnotation = () => {
    console.log("desc");
    function iterate(item) {
      const targetId = item.target;
      const fragment = targetId.substr(targetId.lastIndexOf("#"));
      console.log(fragment);
      const bodies = item.body;
      const element = document.querySelector(fragment);
      if (bodies.length) {
        if ("value" in bodies[0]) {
          const title = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "title"
          );
          // Enter the annotation text into this title node
          title.innerHTML = bodies[0]["value"];
          element.insertBefore(title, element.firstChild);
        }
      }
    }
    this.state.annotationlist.forEach(iterate);
  };

  linkAnnotation = () => {
    console.log("link");
    function iterate(item) {
      const targetId = item.target;
      const fragment = targetId.substr(targetId.lastIndexOf("#"));
      console.log(fragment);
      const bodies = item.body;
      const element = document.querySelector(fragment);
      if (bodies.length) {
        // make the target clickable, linking to the (first) body URI
        element.addEventListener(
          "click",
          function () {
            window.open(bodies[0]["@id"], "_blank");
          },
          true
        );
        // and turn the cursor into a pointer as a hint that it's clickable
        element.style.pointer = "cursor";
      }
    }
    this.state.annotationlist.forEach(iterate);
  };

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
              annotationType={this.state.annotationType}
              descAnnotation={this.descAnnotation}
              linkAnnotation={this.linkAnnotation}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

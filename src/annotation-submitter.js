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

  placeAnnotation = () => {
    function iterate(item) {
      const bodies = item.body;
      const targetId = item.target[0].id;
      const fragment = targetId.substr(targetId.lastIndexOf("#"));
      const element = document.querySelector(fragment);
      switch (item.motivation) {
        case "describing":
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
          break;
        case "linking":
          if (bodies.length) {
            // make the target clickable, linking to the (first) body URI
            element.addEventListener(
              "click",
              function () {
                window.open(bodies[0]["id"], "_blank");
              },
              true
            );
            // and turn the cursor into a pointer as a hint that it's clickable
            element.style.cursor = "pointer";
          }
          break;
        default:
          console.log("sorry, don't know what to do for this annotation boss");
      }
    }
    this.state.annotationlist.forEach(iterate);
  };

  addannotation = (target, value) => {
    switch (this.state.annotationType) {
      case "describing":
        const newDescribingAnnotation = {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          id: uuid.v4(), //temporary dummy
          target, //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ type: "TextualBody", value: value }], //this takes the user input
          motivation: "describing",
        };
        this.setState(
          {
            annotationlist: [
              ...this.state.annotationlist,
              newDescribingAnnotation,
            ],
          },
          () => {
            this.placeAnnotation();
          }
        );

        console.log(newDescribingAnnotation);
        break;
      case "linking":
        const newLinkingAnnotation = {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          id: uuid.v4(), //temporary dummy
          target, //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: value }], //this takes the user input
          motivation: "linking",
        };
        this.setState(
          {
            annotationlist: [
              ...this.state.annotationlist,
              newLinkingAnnotation,
            ],
          },
          () => {
            this.placeAnnotation();
          }
        );

        console.log(newLinkingAnnotation);
        break;
      default:
        console.log(
          "no annotation found, have you selected the annotation type?"
        );
    }

    // if (this.state.annotationType === "describing") {

    // } else if (this.state.annotationType === "linking") {

    // }
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
              //descAnnotation={this.descAnnotation}
              //linkAnnotation={this.linkAnnotation}
              //placeAnnotation={this.placeAnnotation}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

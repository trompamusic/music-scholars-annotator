import React from "react";
import Addannotations from "./annotations/Addannotation.js";

export class AnnotationSubmitter extends React.Component {
  state = {
    annotationlist: [],
    annotationType: "",
    placeholder: "", //placeholder text for the input field
  };
  onChange = (e) =>
    this.setState({
      annotationType: e.target.value,
      placeholder: e.target.placeholder,
    });

  placeAnnotation = () => {
    //places the user annotation to the selected element
    function iterate(annotation) {
      annotation.target.map((jsonTarget) => {
        const bodies = annotation.body;
        const targetId = jsonTarget.id;
        const fragment = targetId.substr(targetId.lastIndexOf("#"));
        const element = document.querySelector(fragment);
        //checks what's the motivation of the target
        switch (annotation.motivation) {
          case "describing":
            if (bodies.length) {
              if ("value" in bodies[0]) {
                const title = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "title"
                );
                // Embeds the annotation text into this title node
                title.innerHTML = bodies[0]["value"];
                element.insertBefore(title, element.firstChild);
                element.style.fill = "magenta";
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
              element.style.fill = "darkcyan";
            }
            break;
          default:
            console.log(
              "sorry, don't know what to do for this annotation boss"
            );
        }
      });
    }
    this.state.annotationlist.forEach(iterate);
  };

  addannotation = (target, value) => {
    //adds different annotations based on selection
    var anno = "";
    switch (this.state.annotationType) {
      case "describing":
        anno = {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          target, //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ type: "TextualBody", value: value }], //this takes the user input
          motivation: "describing",
        };
        this.setState(
          {
            annotationlist: [...this.state.annotationlist, anno],
          },
          () => {
            this.placeAnnotation();
          },
          this.props.currentAnnotation(anno)
        );
        console.log("annotation has been loaded, ready to post");
        break;
      case "linking":
        anno = {
          "@context": "http://www.w3.org/ns/anno.jsonld",
          target, //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: value }], //this takes the user URI
          motivation: "linking",
        };
        this.setState(
          {
            annotationlist: [...this.state.annotationlist, anno],
          },
          () => {
            this.placeAnnotation();
          },
          this.props.currentAnnotation(anno)
        );
        console.log("annotation has been loaded, ready to post");
        break;
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
          <p>
            magenta highlighting is for describing and cyan highlighting is for
            linking
          </p>
          <div className="addAnnotations">
            <Addannotations
              addannotation={this.addannotation}
              selection={this.props.selection}
              uri={this.props.uri}
              placeholder={this.state.placeholder}
              annotationType={this.state.annotationType}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

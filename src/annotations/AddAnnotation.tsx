/* addAnnotation contains the submitButton component imported from the selectable score component, this handles the logic behind the POST to solid */
/* also the input field changes based on the chosen annotation motivation*/
import React, {ChangeEvent, Component} from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";
import {ReactComponent as ArrowAltToTop} from "../graphics/arrow-alt-to-top-regular.svg"
import {ReactComponent as FileImport} from "../graphics/file-import-regular.svg"
import {ReactComponent as RedoAlt} from "../graphics/redo-alt-solid.svg"

type AddAnnotationProps = {
  annotationType: string
  onRefreshClick: () => void
  submitUri: string
  buttonContent: string
  // Args to submitHandler is handlerArgs, which can be anything, or {} if not set
  createAnnotationObject: (args?: any) => Annotation | undefined
  saveAnnotation: (annotation: Annotation) => void;
  placeholder: string
}

type AddAnnotationState = {
  value: string
  seconds: string
  target: string[]
}

class AddAnnotation extends Component<AddAnnotationProps, AddAnnotationState> {
  state = {
    value: "",
    seconds: "",
    target: []
  };

  onChange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => this.setState({ value: e.target.value });

  onTimeChange = (e: ChangeEvent<HTMLInputElement>) =>
    this.setState({ seconds: e.target.value }, () =>
      console.log(this.state.seconds)
    );

  saveAnnotation = () => {
    const annotation = this.props.createAnnotationObject(this.state)
    if (annotation) {
      this.props.saveAnnotation(annotation);
    } else {
      console.log("annotation is empty, not saving");
    }
  }

  wipeState() {
    this.setState({ value: "", seconds: "" });
  }

  render() {
    return (
      <div>
        {this.props.annotationType === "playlist" && (
          <div>
            <input
              type="text"
              value={this.state.value}
              name="value"
              placeholder="enter link here"
              onChange={this.onChange}
              className="sizedTextBox"
            />
            <span> with title: </span>
            <input
              type="text"
              placeholder="title"
              name="seconds"
              value={this.state.seconds}
              onChange={this.onTimeChange}
              className="sizedTextBox"
            />
          </div>
        )}
        {this.props.annotationType !== "cueMedia" && (
          <textarea
            className="textArea"
            id="annotationContent"
            name="value"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.onChange}
          />
        )}
        {this.props.annotationType === "cueMedia" && (
          <div>
            <input
              type="text"
              value={this.state.value}
              name="value"
              placeholder="enter link here"
              onChange={this.onChange}
              className="sizedTextBox"
            />
            <span> jump to: </span>
            <input
              type="text"
              pattern="[0-9]"
              placeholder="seconds"
              name="seconds"
              value={this.state.seconds}
              onChange={this.onTimeChange}
              className="sizedTextBox"
            />
          </div>
        )}
        <button
          className={this.state.value ? "enabledSubmitButton" : "disabledSubmitButton"}
          title="click to post your annotation to your solid POD"
          onClick={this.saveAnnotation}
        >
            {this.state.value && (<>
            <ArrowAltToTop style={{width: '1em', height: '1em'}} /> {this.props.buttonContent}</>
            )}
            {!this.state.value && (<>
              <FileImport style={{width: '1em', height: '1em'}}/>{" "}Write something to begin...
              </>)}
        </button>

        <button
          onClick={this.props.onRefreshClick}
          className="refreshButton"
          title="click to display the annotation contained in your solid POD"
        >
          <RedoAlt style={{width: '1em', height: '1em'}} />
          <span>{""} Fetch Annotations</span>
        </button>
      </div>
    );
  }
}

export default AddAnnotation;

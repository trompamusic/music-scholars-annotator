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
  submitHandler: (args?: any) => Annotation | undefined
  onResponse: (response: AnnotationSolidResponse) => void
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

  wipeState() {
    this.setState({ value: "", seconds: "" });
  }

  render() {
    //packages the two states in one variable. The submithandlerArgs then are read with .value and .seconds from the submitHandler function
    let value = this.state.value;
    let seconds = this.state.seconds;
    let handlerArgs = {
      value,
      seconds,
    };

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
        {this.state.value && (
          <button
            className="enabledSubmitButton"
            title="click to post your annotation to your solid POD"
          >
            <ArrowAltToTop style={{width: '1em', height: '1em'}} />{" "}
            <SubmitButton
              buttonContent={this.props.buttonContent}
              submitUri={this.props.submitUri}
              submitHandler={this.props.submitHandler}
              submitHandlerArgs={handlerArgs}
              onResponse={this.props.onResponse}
            />
          </button>
        )}
        {!this.state.value && (
          <button
            className="disabledSubmitButton"
            title="click to post your annotation to your solid POD"
          >
            <FileImport style={{width: '1em', height: '1em'}} />{" "}
            <SubmitButton
              buttonContent="Write something to begin..."
              submitUri={this.props.submitUri}
              submitHandler={this.props.submitHandler}
              submitHandlerArgs={handlerArgs}
              onResponse={this.props.onResponse}
            />
          </button>
        )}

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

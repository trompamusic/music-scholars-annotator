/* addAnnotation contains the submitButton component imported from the selectable score component, this handles the logic behind the POST to solid */
/* also the input field changes based on the chosen annotation motivation*/
import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    seconds: "",
    target: [],
    buttonStatus: "disabledSubmitButton",
  };
  onChange = (e) => this.setState({ value: e.target.value });

  onTimeChange = (e) =>
    this.setState({ seconds: e.target.value }, () =>
      console.log(this.state.seconds)
    );

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
            <SubmitButton
              buttonContent="Select measures to begin"
              submitUri={this.props.submitUri}
              submitHandler={this.props.submitHandler}
              submitHandlerArgs={handlerArgs}
              onResponse={this.props.onResponse}
            />
          </button>
        )}
        <span>
          <button
            onClick={this.props.onRefreshClick}
            className="refreshButton"
            title="click to display the annotation contained in your solid POD"
          >
            <p>Fetch Annotations</p>
          </button>
        </span>
      </div>
    );
  }
}

export default Addannotation;

/* old */
/* <button
          style={{ padding: "5px", marginBottom: "5px" }}
          onClick={() => this.setState({ visible: !visible })}
        >
          Toggle legend
        </button>
        {this.state.visible === true && (
          <div>
            <h4>Annotation legend</h4>

            <span className="selectionLegend" />
            <span>currently selected</span>

            <span className="descriptionLegend" />
            <span>descriptive annotation</span>

            <span className="linkingLegend" />
            <span>linking annotation</span>

            <span className="cueMediaLegend" />
            <span>cue media annotation</span>

            <span className="replyLegend" />
            <span>replying annotation</span>

            <span className="focusLegend" />
            <span>highlighted annotation</span>
          </div>
        )} */

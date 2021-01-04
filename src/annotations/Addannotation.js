import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    seconds: "",
    target: [],
    visible: false,
  };
  onChange = (e) => this.setState({ value: e.target.value });

  onTimeChange = (e) =>
    this.setState({ seconds: e.target.value }, () =>
      console.log(this.state.seconds)
    );

  render() {
    let value = this.state.value;
    let seconds = this.state.seconds;
    const { visible } = this.state.visible;
    return (
      <div>
        <button
          style={{ padding: "5px", marginBottom: "5px" }}
          onClick={() => this.setState({ visible: !visible })}
        >
          toggle legend
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
              value={this.state.value}
              name="value"
              placeholder="enter link here"
              onChange={this.onChange}
            />
            <span> jump to: </span>
            <input
              placeholder="seconds"
              name="seconds"
              value={this.state.seconds}
              onChange={this.onTimeChange}
            />
          </div>
        )}

        <button className="enabledSubmitButton" onClick={this.onClick}>
          <SubmitButton
            buttonContent={this.props.buttonContent}
            submitUri={this.props.submitUri}
            submitHandler={this.props.submitHandler}
            submitHandlerArgs={this.state.value}
            onResponse={this.props.onResponse}
          />
        </button>
        <button onClick={this.props.onRefreshClick} className="refreshButton">
          <p>Fetch Annotations</p>
        </button>
      </div>
    );
  }
}

export default Addannotation;

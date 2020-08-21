import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    target: [],
    //buttonState: "enabledSubmitButton",
  };

  onChange = (e) => this.setState({ value: e.target.value });

  render() {
    return (
      <div>
        <form style={{ display: "inline-block" }}>
          <input
            type="text"
            name="value"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.onChange}
          />
        </form>
        <div className="enabledSubmitButton">
          <SubmitButton
            buttonContent="Submit to your Solid POD"
            submitUri={this.props.submitUri}
            submitHandler={this.props.submitHandler}
            submitHandlerArgs={this.state.value}
            onResponse={this.props.onResponse}
          />
        </div>
      </div>
    );
  }
}

export default Addannotation;

import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    target: [],
    buttonState: "enabledSubmitButton",
  };

  onChange = (e) => this.setState({ value: e.target.value });
  // onSubmit = (e) => {
  //   e.preventDefault();
  //   this.setState(
  //     {
  //       target: [...this.state.target],
  //     },
  //     () => {
  //       this.props.addannotation(
  //         this.props.selection.map((elem) => {
  //           return { id: this.props.uri + "#" + elem.getAttribute("id") };
  //         }),
  //         this.state.value
  //       );
  //       this.reset();
  //       //this.props.buttonEnabler();
  //     }
  //   );
  // };
  //clears input field
  // reset = () => {
  //   this.setState({ value: "" });
  // };

  render() {
    return (
      <div>
        <form id="myform" style={{ display: "inline-block" }}>
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
            submitHandlerArgs={{ value: this.state.value }}
          />
        </div>
      </div>
    );
  }
}

export default Addannotation;

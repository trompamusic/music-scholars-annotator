import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    target: [],
    buttonState: "enabledSubmitButton",
  };

  onChange = (e) => this.setState({ value: e.target.value });
  onSubmit = (e) => {
    e.preventDefault();
    this.setState(
      {
        target: [...this.state.target],
      },
      () => {
        this.props.addannotation(
          this.props.selection.map((elem) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }),
          this.state.value
        );
        this.reset();
        //this.props.buttonEnabler();
      }
    );
  };
  //clears input field
  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    return (
      <form id="my-form" onSubmit={this.onSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          name="value"
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        />
        {/* <input
          type="submit"
          name="submit"
          disabled={!this.state.value}
          className="selectionButton"
          value="confirm your annotation"
        /> */}
        <div className={this.state.buttonState}>
          <SubmitButton
            form="my-form"
            type="submit"
            buttonContent="Submit to your Solid POD"
            submitUri={this.props.submitUri}
            submitHandler={this.props.handleSubmit}
            submitHandlerArgs={this.props.currentAnnotation}
          />
        </div>
      </form>
    );
  }
}

export default Addannotation;

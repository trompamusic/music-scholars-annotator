import React, { Component } from "react";

export class Addannotation extends Component {
  state = {
    value: "",
    target: [],
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
        this.props.buttonEnabler();
      }
    );
  };
  //clears input field
  reset = () => {
    this.setState({ value: "" });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          name="value"
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        />
        <input
          type="submit"
          name="submit"
          disabled={!this.state.value}
          className="selectionButton"
          value="confirm your annotation"
        />
      </form>
    );
  }
}

export default Addannotation;

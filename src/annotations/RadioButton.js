import React, { Component } from "react";

export default class RadioButton extends Component {
  state = {
    selectorString: "",
  };

  handleRadioButton(string) {
    this.setState({
      selectorString: string
    });
  }
 
  render() {
    return (
      <div className="header">
        <h3>Select what you want to annotate (currently WIP)</h3>
        <label>
        <input
          type="radio"
          checked={this.state.selectorString === ".measure"}
          onChange={() => this.handleRadioButton(".measure")}
        />
        measure
        </label>

        <label>
        <input
          type="radio"
          checked={this.state.selectorString === ".note"}
          onChange={() => this.handleRadioButton(".note")}
        />
        note
        </label>
      </div>
    );
  }
}

import React, { Component } from "react";
import Checkbox from "./Checkbox";
const Selectors = [".note", ".measure", ".dynam", ".dir"];
export default class RadioButton extends Component {
  state = {
    selectorString: [],
  };

  updateStateList(e, value) {
    if (e.target.checked) {
      //append to array
      this.setState(
        {
          selectorString: this.state.selectorString.concat([value]),
        },
        () => {
          this.props.handleStringChange(this.state.selectorString);
        }
      );
    } else {
      //remove from array
      this.setState(
        {
          selectorString: this.state.selectorString.filter(function (val) {
            return val !== value;
          }),
        },
        () => {
          this.props.handleStringChange(this.state.selectorString);
        }
      );
    }
  }

  createCheckbox = (option) => (
    <Checkbox
      label={option}
      onClick={(e) => this.updateStateList(e, option)}
      key={option}
    />
  );

  buildCheckboxes = () => Selectors.map(this.createCheckbox);

  render() {
    return (
      <div>
        <h3>Selection Type</h3>
        <form>{this.buildCheckboxes()}</form>
      </div>
    );
  }
}

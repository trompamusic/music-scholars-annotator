/* manages the rendering of the checkbox component mapping across the selectors const */
/* and uses updateSelectorList to update the selectorString Prop passed from the selctableScore main app*/

import React, { Component } from "react";
import Checkbox from "./checkBox";
const Selectors = [
  {
    name: "Note",
    value: ".note",
  },

  {
    name: "Measure",
    value: ".measure",
  },

  {
    name: "Dynamics",
    value: ".dynam",
  },

  {
    name: "Directives",
    value: ".dir",
  },
];

export default class RadioButton extends Component {
  state = {
    selectorString: [],
  };

  updateSelectorList(e, value) {
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
      onClick={(e) => this.updateSelectorList(e, option.value)}
      key={option.value}
    />
  );

  buildCheckboxes = () => Selectors.map(this.createCheckbox);

  render() {
    return (
      <div>
        <h3>Selection type</h3>
        <form>{this.buildCheckboxes()}</form>
      </div>
    );
  }
}

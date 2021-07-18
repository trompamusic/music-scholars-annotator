/* manages the rendering of the checkbox component mapping across the selectors const */
/* and uses updateSelectorList to update the selectorString Prop passed from the selctableScore main app*/
import React, { Component } from "react";
import Checkbox from "./checkBox";
const Selectors: SelectorType[] = [
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

type SelectorType = {
  name: string;
  value: string;
};

type SelectionHandlerProps = {
  selectorString: string[]
  handleStringChange: (st: string[]) => void
}

type SelectionHandlerState = {
  selectorString: string[]
}

export default class SelectionHandler extends Component<SelectionHandlerProps, SelectionHandlerState> {
  state = {
    selectorString: [],
  };

  updateSelectorList(e: any, value: string) {
    if (e.target.checked) {
      //append to array
      const newSelectorString = [...this.state.selectorString, value];
      this.setState(
        {
          selectorString: newSelectorString,
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

  createCheckbox = (selector: SelectorType) => (
    <Checkbox
      label={selector}
      onClick={(e) => this.updateSelectorList(e, selector.value)}
      key={selector.value}
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

export type { SelectorType };

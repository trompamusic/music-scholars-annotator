/* manages the rendering of the checkbox component mapping across the selectors const */
/* and uses updateSelectorList to update the selectorString Prop passed from the selctableScore main app*/
import React, { Component, MouseEvent } from "react";
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

type Props = {
  e: Element;
  target: any;
  option: any;
};

export default class SelectionHandler extends Component {
  state = {
    selectorString: [],
  };

  updateSelectorList(e: Props, value: SelectorType) {
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

  createCheckbox = (option: Props) => (
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

export type { SelectorType };

/* manages the rendering of the checkbox component mapping across the selectors const */
/* and uses updateSelectorList to update the selectorString Prop passed from the selctableScore main app*/
import React, { Component } from "react";
import {Form} from "react-bootstrap-v5";

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

  render() {
    return (
      <div>
        <h3>Selection type</h3>
        <Form>
          {Selectors.map(selector => {
            return <Form.Check
              inline
              key={selector.name}
              label={selector.name}
              name="selector"
              value={selector.value}
              id={`selector-${selector.name}`}
            />
          })}
        </Form>
      </div>
    );
  }
}

export type { SelectorType };

/* simple checkbox component */
import React, { MouseEventHandler } from "react";
import { SelectorType } from "./selectionHandler";

type Props = {
  onClick: MouseEventHandler;
  label: SelectorType;
};

const Checkbox = ({ label, onClick }: Props) => (
  <span>
    <label>
      <input
        type="checkbox"
        name={label.name}
        onClick={onClick}
        value={label.value}
        key={label.value}
      />
      {label.name}
    </label>
  </span>
);

export default Checkbox;

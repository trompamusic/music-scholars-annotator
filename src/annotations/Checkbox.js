import React from "react";
const Checkbox = ({ label, onClick }) => (
  <div>
    <label>
      <input type="checkbox" name={label} onClick={onClick} value={label} />
      {label}
    </label>
  </div>
);

export default Checkbox;

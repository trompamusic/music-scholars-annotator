/* simple checkbox component */
import React from 'react'

const Checkbox = ({ label, onClick }) => (
  <span>
    <label>
      <input
        type='checkbox'
        name={label.name}
        onClick={onClick}
        value={label.value}
        key={label.value}
      />
      {label.name}
    </label>
  </span>
)

export default Checkbox

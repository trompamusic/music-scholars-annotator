import React, { Component } from "react";

export default class RadioButton extends Component {
  render() {
    return (
      <div className="header">
        <h3>Radio button demo</h3>
        <form>
          <div className="form-check">
            <label>
              <input
                type="radio"
                name="radioButton"
                value="option1"
                className="form-check-input"
              />
              I really liked the first passage
            </label>
          </div>

          <div className="form-check">
            <label>
              <input
                type="radio"
                name="radioButton"
                value="option2"
                className="form-check-input"
              />
              I really liked the second pasasge
            </label>
          </div>

          <div className="form-check">
            <label>
              <input
                type="radio"
                name="radioButton"
                value="option3"
                className="form-check-input"
              />
              I didn't like any of the passages
            </label>
          </div>
        </form>
      </div>
    );
  }
}

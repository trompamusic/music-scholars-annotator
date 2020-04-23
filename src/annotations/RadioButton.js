import React, { Component } from "react";

export default class RadioButton extends Component {
  state = {
    selectorString: "",
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onSubmit = (e) => {
    e.preventDefault();
    this.props.handleStringChange(this.state.selectorString);
    this.setState({ selectorString: "" });
  };

  render() {
    return (
      <div>
        <h3>Choose your type of selection</h3>
        <p> (debug) current selection : {this.props.selectorString}</p>
        <form onSubmit={this.onSubmit}>
          <label>
            <input
              type="radio"
              value=".note"
              name="selectorString"
              onChange={this.onChange}
            />
            Note
          </label>

          <label>
            <input
              type="radio"
              name="selectorString"
              value=".measure"
              onChange={this.onChange}
            />
            Measure
          </label>
          <div>
            <input
              type="submit"
              name="submit"
              className="btn"
              value="choose your selection"
            />
          </div>
        </form>
      </div>
    );
  }
}

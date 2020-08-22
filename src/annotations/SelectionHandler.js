import React, { Component } from "react";

export default class RadioButton extends Component {
  state = {
    selectorString: "",
  };

  onChange = (e) =>
    this.setState({ selectorString: e.target.value }, () => {
      this.props.handleStringChange(this.state.selectorString);
    });

  render() {
    return (
      <div>
        <h3>Selection Type</h3>
        <form>
          <label>
            <input
              type="radio"
              defaultChecked={this.props.selectorString}
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
        </form>
      </div>
    );
  }
}

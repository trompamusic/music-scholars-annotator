import React, { Component } from "react";

export default class RadioButton extends Component {
  state = {
    selectorString: "",
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onSubmit = (e) => {
   e.preventDefault();
   this.props.handleStringChange(this.props.selectorString, this.state.selectorString);
   this.setState({ selectorString: ""});
   console.log(this.state.selectorString)
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h3>Choose your type of selection (wip, currently not working)</h3>
        <div className="radio">
          <label>
            <input
              type="radio"
              value=".note"
              name="selectorString"
              //checked={this.props.selectorString === ".note"}
              onChange={this.onChange}
            />
            Note
          </label>
        </div>
        <div className="radio">
          <label>
            <input
              type="radio"
              name= "selectorString"
              value=".measure"
              //checked={this.props.selectorString === ".measure"}
              onChange={this.onChange}
            />
            Measure
          </label>
        </div>
        <input type="submit" name="submit" className="btn" />
      </form>
    );
  }
}

import React, { Component } from "react";

export class Addannotation extends Component {
  state = {
    annotation: "",
    measureid: "",
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onSubmit = (e) => {
    e.preventDefault();
    this.props.addannotation(this.props.selection.map((elem) => elem.getAttribute("id")).join(", "), this.state.annotation);
    this.setState({ measureid: "" });
    this.setState({ annotation: "" });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          name="annotation"
          placeholder="Add your annotation"
          value={this.state.annotation}
          onChange={this.onChange}
        />
        <input
          type="text"
          name="measureid"
          placeholder="select measure id..."
          value={this.props.selection.map((elem) => elem.getAttribute("id")).join(", ")}
          onChange={this.onChange}
        />
        <input type="submit" name="submit" className="btn" />
      </form>
    );
  }
}

export default Addannotation;

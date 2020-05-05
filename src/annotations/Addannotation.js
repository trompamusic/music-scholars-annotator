import React, { Component } from "react";

export class Addannotation extends Component {
  state = {
    value: "",
    target: [],
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });
  onSubmit = (e) => {
    e.preventDefault();
    this.props.addannotation(
      this.props.selection
        .map((elem) => "@id:" + this.props.uri + "#" + elem.getAttribute("id"))
        .join(", "),
      this.state.value
    );
    this.setState({
      target: [...this.state.target],
    });
    this.setState({ value: "" });
    this.setState({ uri: this.props.uri });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          name="value"
          placeholder="Add your annotation"
          value={this.state.value}
          onChange={this.onChange}
        />
        {/* <input
          type="text"
          name="target"
          placeholder="measure id..."
          value={this.props.selection
            .map((elem) => elem.getAttribute("id"))
            .join(", ")}
          onChange={this.onChange}
        /> */}
        <input
          type="submit"
          name="submit"
          className="btn"
          value="submit your annotation"
        />
      </form>
    );
  }
}

export default Addannotation;

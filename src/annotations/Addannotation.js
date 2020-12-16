import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    target: [],
  };
  onChange = (e) => this.setState({ value: e.target.value });
  onClick = () => {
    this.setState({ value: "", target: [] });
  };
  render() {
    return (
      <div>
        <h4>Annotation legend</h4>

        <span className="selectionLegend" />
        <span>currently selected</span>

        <span className="descriptionLegend" />
        <span>descriptive annotation</span>

        <span className="linkingLegend" />
        <span>linking annotation</span>

        <span className="cueMediaLegend" />
        <span>cue media annotation</span>

        <span className="replyLegend" />
        <span>replying annotation</span>

        <span className="focusLegend" />
        <span>highlighted annotation</span>

        <textarea
          className="textArea"
          id="annotationContent"
          name="value"
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        ></textarea>
        <button className="enabledSubmitButton" onClick={this.onClick}>
          <SubmitButton
            buttonContent={this.props.buttonContent}
            submitUri={this.props.submitUri}
            submitHandler={this.props.submitHandler}
            submitHandlerArgs={this.state.value}
            onResponse={this.props.onResponse}
          />
        </button>
        <button onClick={this.props.onRefreshClick} className="refreshButton">
          <p>Fetch Annotations</p>
        </button>
      </div>
    );
  }
}

export default Addannotation;

import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";

export class Addannotation extends React.Component {
  state = {
    value: "",
    target: [],
    
  }; 
  onChange = (e) => this.setState({ value: e.target.value });

  render() {
    return (
      <div>
        <textarea
          className="textArea"
          id="annotationContent"
          name="value"
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
        ></textarea>
        <button className="enabledSubmitButton">
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

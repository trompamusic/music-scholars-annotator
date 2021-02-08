/* addAnnotation contains the submitButton component imported from the selectable score component, this handles the logic behind the POST to solid */
/* also the input field changes based on the chosen annotation motivation*/
import React from "react";
import SubmitButton from "selectable-score/lib/submit-button.js";
import Refresh from "../redo-alt-solid.svg";
import Push from "../arrow-alt-to-top-light.svg";
export class Addannotation extends React.Component {
  state = {
    value: "",
    seconds: "",
    target: [],
    buttonStatus: "disabledSubmitButton",
  };
  onChange = (e) => this.setState({ value: e.target.value });

  onTimeChange = (e) =>
    this.setState({ seconds: e.target.value }, () =>
      console.log(this.state.seconds)
    );

  render() {
    //packages the two states in one variable. The submithandlerArgs then are read with .value and .seconds from the submitHandler function
    let value = this.state.value;
    let seconds = this.state.seconds;
    let handlerArgs = {
      value,
      seconds,
    };

    return (
      <div>
        {this.props.annotationType !== "cueMedia" && (
          <textarea
            className="textArea"
            id="annotationContent"
            name="value"
            value={this.state.value}
            placeholder={this.props.placeholder}
            onChange={this.onChange}
          />
        )}
        {this.props.annotationType === "cueMedia" && (
          <div>
            <input
              type="text"
              value={this.state.value}
              name="value"
              placeholder="enter link here"
              onChange={this.onChange}
              className="sizedTextBox"
            />
            <span> jump to: </span>
            <input
              type="text"
              pattern="[0-9]"
              placeholder="seconds"
              name="seconds"
              value={this.state.seconds}
              onChange={this.onTimeChange}
              className="sizedTextBox"
            />
          </div>
        )}
        {this.state.value && (
          <button
            className="enabledSubmitButton"
            title="click to post your annotation to your solid POD"
          >
            <SubmitButton
              buttonContent={this.props.buttonContent}
              submitUri={this.props.submitUri}
              submitHandler={this.props.submitHandler}
              submitHandlerArgs={handlerArgs}
              onResponse={this.props.onResponse}
            />
          </button>
        )}
        {!this.state.value && (
          <button
            className="disabledSubmitButton"
            title="click to post your annotation to your solid POD"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fal"
              data-icon="arrow-alt-to-top"
              class="svg-inline--fa fa-arrow-alt-to-top fa-w-12"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              height="1em"
              width="1em"
              display="inline-flex"
            >
              <path
                fill="white"
                d="M153.1 448c-8.8 0-16-7.2-16-16V288H43.3c-7.1 0-10.7-8.6-5.7-13.6l143.1-143.5c6.3-6.3 16.4-6.3 22.7 0l143.1 143.5c5 5 1.5 13.6-5.7 13.6h-93.9v144c0 8.8-7.2 16-16 16h-77.8m0 32h77.7c26.5 0 48-21.5 48-48V320h61.9c35.5 0 53.5-43 28.3-68.2L226 108.2c-18.8-18.8-49.2-18.8-68 0L14.9 251.8c-25 25.1-7.3 68.2 28.4 68.2h61.9v112c-.1 26.5 21.5 48 47.9 48zM0 44v8c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-8c0-6.6-5.4-12-12-12H12C5.4 32 0 37.4 0 44z"
              ></path>
            </svg>

            <SubmitButton
              buttonContent="Select measures to begin"
              submitUri={this.props.submitUri}
              submitHandler={this.props.submitHandler}
              submitHandlerArgs={handlerArgs}
              onResponse={this.props.onResponse}
            />
          </button>
        )}
        <span>
          <button
            onClick={this.props.onRefreshClick}
            className="refreshButton"
            title="click to display the annotation contained in your solid POD"
          >
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="redo-alt"
              class="svg-inline--fa fa-redo-alt fa-w-16"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="1em"
              height="1em"
              display="inline-flex"
            >
              <path
                fill="white"
                d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"
              ></path>
            </svg>

            <span>{""} Fetch Annotations</span>
          </button>
        </span>
      </div>
    );
  }
}

export default Addannotation;

/* old */
/* <button
          style={{ padding: "5px", marginBottom: "5px" }}
          onClick={() => this.setState({ visible: !visible })}
        >
          Toggle legend
        </button>
        {this.state.visible === true && (
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
          </div>
        )} */

import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    e.preventDefault();

    const replyTarget = this.props.annotation.anno.target;
    this.props.onAnnoReplyHandler(replyTarget);
  }

  // onMediaClick (bodyMedia){
  //   //e.preventDefault()
  //   //const mediaCue = this.props.annotation.anno.body[0].id;
  //   console.log(bodyMedia)
  //   // TODO validate properly
  //   const currentMedia = bodyMedia.split("#")[0];
  //   const seekTo = bodyMedia.split("#")[1].replace("t=", "");
  //   console.log("Setting up seek to: ", currentMedia, seekTo);
  //   this.setState(this.props.currentMedia, () =>
  //     this.player.current.seekTo(seekTo)
  //   );
  // }

  renderSwitch() {
    const motivation = this.props.annotation.anno.motivation;
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const bodyMedia = this.props.annotation.anno.body[0].id;
    switch (motivation) {
      case "describing":
        return <p>The content of this annotation is {bodyD}</p>;
      case "linking":
        if (bodyL.startsWith("http")) {
          return (
            <p>
              The content of this annotation is{" "}
              {
                <a
                  href={bodyL}
                  onClick="return false;"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bodyL}
                </a>
              }
            </p>
          );
        } else {
          const appendURL = "https://" + bodyL;
          return (
            <p>
              The content of this annotation is{" "}
              {
                <a
                  href={appendURL}
                  onClick="return false;"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {bodyL}
                </a>
              }
            </p>
          );
        }

      case "trompa:cueMedia":
        return <p>The content of this annotation is {bodyMedia}</p>;

      default:
        return <p>The content of this annotation is {bodyD}</p>;
    }
  }

  render() {
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";
    // const bodyD = this.props.annotation.anno.body[0].value;
    // const bodyL = this.props.annotation.anno.body[0].id;
    // const bodyMedia = this.props.annotation.anno.body[0];

    return (
      <div className="annoItem">
        {this.renderSwitch()}
        {/* <p>The content of this annotation is {bodyD || <a href={bodyL} target="_blank"
            rel="noopener noreferrer">{bodyL}</a> || bodyMedia}</p> */}
        <div className="date">
          Created on: {date} by {creator}
        </div>
        <button
          className="replyButton"
          name="replyButton"
          onClick={this.onClick}
        >
          Reply
        </button>
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

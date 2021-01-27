import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
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
    //let { visible } = this.state.visible;
    switch (motivation) {
      case "describing":
        return <p>The textual content of this annotation is {bodyD}</p>;
      case "linking":
        if (bodyL.startsWith("http")) {
          return (
            <p>
              The link of this annotation is {""}
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
              The fixed link of this annotation is {""}
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
      //FIXME: needs to be able to click and play the video with time skip
      case "trompa:cueMedia":
        return <p>The mediacontent of this annotation is {bodyMedia}</p>;
      //FIXME: needs to build reply annotation structure, needs replyTarget + show/hide replies of sort
      case "replying":
        return <p>This reply contains: {bodyD}</p>;

      default:
        console.log("no motivation provided", motivation);
      //return <p>This annotation is wrong and its content is {bodyD}</p>;
    }
  }

  render() {
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";
    const motivation = this.props.annotation.anno.motivation;
    const bodyD = this.props.annotation.anno.body[0].value;
    let { visible } = this.state.visible;
    return (
      <div className="annoItem">
        {this.renderSwitch()}
        <div className="date">
          Created on: {date} by {creator} with {motivation} motivation
        </div>
        <button
          className="replyButton"
          name="replyButton"
          onClick={this.onClick}
        >
          Reply
        </button>
        <button
          className="showRepliesButton"
          name="showRepliesButton"
          onClick={() => this.setState({ visible: !visible })}
        >
          Show replies
        </button>
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

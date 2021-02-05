/* item that contains the annotation contents, the renderSwitch function assign specific display to the specfic anntation based on its motivation*/
import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: "hideReply",
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
  onShowReplyClick(e) {
    e.preventDefault();
    const replyTarget = document.querySelector("#replyAnno");
    const replyTargetId = replyTarget.dataset.replyAnnotationTarget;
    const rootAnno = e.target.closest(".annoItem");
    const rootAnnoTarget = rootAnno.dataset.target;
    if (replyTargetId === rootAnnoTarget) {
      const noLongerShowing = Array.from(
        document.getElementsByClassName("showReply")
      );
      noLongerShowing.forEach((noReplyShowing) =>
        noReplyShowing.classList.add("hiddenReply")
      );
      noLongerShowing.forEach((noReplyShowing) =>
        noReplyShowing.classList.remove("showReply")
      );
      const showing = Array.from(
        document.getElementsByClassName("hiddenReply")
      );
      showing.forEach((showingReply) =>
        showingReply.classList.add("showReply")
      );
      showing.forEach((showingReply) =>
        showingReply.classList.remove("hiddenReply")
      );
    } else {
      const noLongerShowing = Array.from(
        document.getElementsByClassName("showReply")
      );
      noLongerShowing.forEach((noReplyShowing) =>
        noReplyShowing.classList.add("hiddenReply")
      );
      noLongerShowing.forEach((noReplyShowing) =>
        noReplyShowing.classList.remove("showReply")
      );
      alert("no reply to show");
    }
  }
  renderSwitch() {
    const motivation = this.props.annotation.anno.motivation;
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const bodyMedia = this.props.annotation.anno.body[0].id;
    const target = this.props.annotation.anno.target[0].id;
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";

    //let { visible } = this.state.visible;
    switch (motivation) {
      case "describing":
        return (
          <div className="annoItem" data-target={target}>
            {" "}
            <p>The textual content of this annotation is {bodyD}</p>
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
              onClick={this.onShowReplyClick}
            >
              Show replies
            </button>
          </div>
        );
      case "linking":
        if (bodyL.startsWith("http")) {
          return (
            <div>
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
              <div className="date">
                Created on: {date} by {creator} with {motivation} motivation
              </div>
              <button
                className="replyButton"
                name="replyButton"
                onClick={this.onShowReplyClick}
              >
                Reply
              </button>
              <button
                className="showRepliesButton"
                name="showRepliesButton"
                onClick={() => this.setState({ visible: "showReply" })}
              >
                Show replies
              </button>
            </div>
          );
        } else {
          const appendURL = "https://" + bodyL;
          return (
            <div>
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
                onClick={this.onShowReplyClick}
              >
                Show replies
              </button>
            </div>
          );
        }
      //FIXME: needs to be able to click and play the video with time skip
      case "trompa:cueMedia":
        return (
          <div>
            {" "}
            <p>The mediacontent of this annotation is {bodyMedia}</p>
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
              onClick={this.onShowReplyClick}
            >
              Show replies
            </button>
          </div>
        );
      //FIXME: needs to build reply annotation structure, needs replyTarget + show/hide replies of sort
      case "replying":
        console.log(target);
        return (
          <div
            id="replyAnno"
            data-reply-annotation-target={target}
            className="hiddenReply"
          >
            <p>This reply contains: {bodyD}</p>
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
              onClick={this.onShowReplyClick}
            >
              Show replies
            </button>
          </div>
        );

      default:
        console.log("no motivation provided", motivation);
      //return <p>This annotation is wrong and its content is {bodyD}</p>;
    }
  }

  render() {
    // const date = this.props.annotation.anno.created;
    // const creator = this.props.annotation.anno.creator || "unknown";
    // const motivation = this.props.annotation.anno.motivation;
    // const bodyD = this.props.annotation.anno.body[0].value;

    return (
      <div className="annoItem">
        {this.renderSwitch()}
        {/* <div className="date">
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
          onClick={() => this.setState({ visible: "showReply" })}
        >
          Show replies
        </button> */}
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

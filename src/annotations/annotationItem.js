/* item that contains the annotation contents, the renderSwitch function assign specific display to the specfic anntation based on its motivation*/
import React from "react";

import PlayLogo from "../play-solid.svg";
class AnnotationItem extends React.Component {
  onClick(e) {
    e.preventDefault();
    const replyTarget = this.props.annotation.anno.target;
    this.props.onAnnoReplyHandler(replyTarget);
  }

  onPlayClick = (e) => {
    e.preventDefault();
    const bodyMedia = this.props.annotation.anno.body[0].id;
    console.log(bodyMedia);
    this.props.onMediaClick(bodyMedia);
  };
  onShowReplyClick(e) {
    e.preventDefault();
    const replyTargetAnno = document.querySelector("#replyAnno");
    if (replyTargetAnno) {
      const replyTargetAnnoId = replyTargetAnno.dataset.replyAnnotationTarget;
      const rootAnno = e.target.closest(".annoItem");
      const rootAnnoTargetId = rootAnno.dataset.target;
      if (replyTargetAnnoId === rootAnnoTargetId) {
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
        alert("no rpely to show");
      }
    } else alert("no reply to show");
  }
  renderSwitch() {
    const motivation = this.props.annotation.anno.motivation;
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const bodyMedia = this.props.annotation.anno.body[0].id;
    const target = this.props.annotation.anno.target[0].id;
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";
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
            <div className="annoItem" data-target={target}>
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
        } else {
          const appendURL = "https://" + bodyL;
          return (
            <div className="annoItem" data-target={target}>
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

      case "trompa:cueMedia":
        const cleanMediaString = bodyMedia.split("#")[0];
        return (
          <div className="annoItem" data-target={target}>
            {" "}
            <p>
              The mediacontent of this annotation is {cleanMediaString}{" "}
              <button className="playButton" onClick={this.onPlayClick}>
                {" "}
                <img
                  src={PlayLogo}
                  style={{
                    width: "5px",
                    alignContent: "center",
                    textAlign: "center",
                  }}
                ></img>{" "}
                play{" "}
              </button>
            </p>
            <wbr></wbr>
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
      //FIXME: needs to build reply annotation structure hirerchically
      case "replying":
        console.log(target);
        return (
          <div
            id="replyAnno"
            data-reply-annotation-target={target}
            className="hiddenReply"
          >
            <div className="annoItem">
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
          </div>
        );

      default:
        console.log(
          "no motivation provided defaulting to plain text annotation",
          motivation
        );
        return (
          <div className="annoItem" data-target={target}>
            {" "}
            <p>The plain text content of this annotation is {bodyD}</p>
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
  }

  render() {
    return <div className="annoItemContainer">{this.renderSwitch()}</div>;
  }
}

export default AnnotationItem;

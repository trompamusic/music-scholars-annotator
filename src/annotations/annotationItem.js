/* item that contains the annotation contents, the renderSwitch function assign specific display to the specfic anntation based on its motivation*/
import React from "react";

import PlayLogo from "../graphics/play-solid.svg";
class AnnotationItem extends React.Component {
  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const replyTarget = this.props.annotation.target;
    const replyTargetId = this.props.annotation["@id"];
    this.props.onAnnoReplyHandler(replyTarget, replyTargetId);
    console.log("reply target id", replyTargetId);
  };

  onPlayClick = (e) => {
    e.preventDefault();
    const bodyMedia = this.props.annotation.body[0].id;
    this.props.onMediaClick(bodyMedia);
  };
  onShowReplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const rootAnno = e.target.closest(".rootAnno");
    console.log("root anno", rootAnno);
    const replyTargetAnnos = document.querySelectorAll(".replyAnno");
    console.log(replyTargetAnnos);
    /* chunk of proto code that is probably useful for the end goal */
    // const testRoot = document.querySelectorAll(".rootAnno");
    // const replyTest = document.querySelectorAll(".replyAnno");
    // const _test = [testRoot, replyTest];
    // const filterRoot = [];
    // const filterReply = [];
    // for (var i = 0; i < replyTest.length; i++) {
    //   filterReply.push(replyTest[i].dataset.replyAnnotationTarget);
    // }
    // for (var i = 0; i < testRoot.length; i++) {
    //   filterRoot.push(testRoot[i].dataset.target);
    // }
    // console.log(_test);
    // const targetCollection = testRoot.forEach(
    //   (target) => target.item.dataset.target
    // );
    // const replyTargetAnnoArray = Array.from(
    //   document.querySelector(".replyAnno")
    // );
    // const originAnno = Array.from(document.querySelector(".rootAnno"));
    // const filteredResults = filterReply.filter((target) =>
    //   filterRoot.includes(target)
    // );

    // console.log(targetCollection, "reply", replyTest);

    //////////// NEEDS TO WIPE TARGET REPLY AFTER RPELYING TO IT ALSO THE ANNOTATION TYPE HANDLING IS MESSY //////////////////
    if (replyTargetAnnos.length) {
      replyTargetAnnos.forEach((replyTargetAnno) => {
        const replyTargetAnnoId = replyTargetAnno.dataset.replyAnnotationTarget;

        const rootAnnoTargetId = rootAnno.dataset.selfId;

        console.log("Reply target anno id: ", replyTargetAnnoId);
        if (replyTargetAnnoId === rootAnnoTargetId) {
          //appendichild is where the magic happens
          rootAnno.appendChild(replyTargetAnno);
          //creates an array of all the visible replies
          const noLongerShowing = Array.from(
            rootAnno.getElementsByClassName("showReply")
          );
          //hides them
          noLongerShowing.forEach((noReplyShowing) =>
            noReplyShowing.classList.add("hiddenReply")
          );
          noLongerShowing.forEach((noReplyShowing) =>
            noReplyShowing.classList.remove("showReply")
          );
          //creates an array of the hidden annotations
          const showing = Array.from(
            rootAnno.getElementsByClassName("hiddenReply")
          );
          //shows them
          showing.forEach((showingReply) =>
            showingReply.classList.add("showReply")
          );
          showing.forEach((showingReply) =>
            showingReply.classList.remove("hiddenReply")
          );
        }
        // } else {
        //   //if only one anno has replies and the other button is clicked, hides all the replies and alerts the user
        //   // const noLongerShowing = Array.from(
        //   //   rootAnno.getElementsByClassName("showReply")
        //   // );
        //   // noLongerShowing.forEach((noReplyShowing) =>
        //   //   noReplyShowing.classList.add("hiddenReply")
        //   // );
        //   // noLongerShowing.forEach((noReplyShowing) =>
        //   //   noReplyShowing.classList.remove("showReply")
        //   // );
        //   console.warn("no replies to show for this annotation");
        // }
      });
    } else console.warn("no replies to show for this annotation");
  };
  renderSwitch = () => {
    //stuff that i am carrying around: the annotation's ID you are replying to, the body (currently sits under annotation.source) and the annotation's specific ID
    const motivation = this.props.annotation.motivation;
    const bodyD = this.props.annotation.body[0].value;
    const bodyL = this.props.annotation.body[0].id;
    const bodyMedia = this.props.annotation.body[0].id;
    const target = this.props.annotation.target[0].id;
    const repTarget = this.props.annotation.target;
    const date = this.props.annotation.created;
    const creator = this.props.annotation.creator || "unknown";
    const selfId = this.props.annotation["@id"];
    // const originAnno = document.querySelectorAll("div[data-self-id]");
    // const innerBodyString = this.props.annotation.source;
    // const selfIdData = selfId.dataset.selfId;
    // const rootAnnoTargetIdData = rootAnnoTargetId.dataset.rootAnnotationId;

    switch (motivation) {
      case "describing":
        return (
          <div
            className="rootAnno annoItem"
            data-target={target}
            data-self-id={selfId}
          >
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
            <div
              className="annoItem"
              data-target={target}
              data-self-id={selfId}
            >
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
            <div
              className="annoItem"
              data-target={target}
              data-self-id={selfId}
            >
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
          <div className="annoItem" data-target={target} data-self-id={selfId}>
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
        return (
          <div
            data-reply-annotation-target={repTarget}
            className="replyAnno hiddenReply"
          >
            <div className="quoteContent">
              <p>This reply contains: {bodyD}</p>
              <div className="date">
                Created on: {date} by {creator} with {motivation} motivation
              </div>
              {/* <button
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
              </button> */}
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
            {/* <button
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
            </button> */}
          </div>
        );
    }
  };

  render() {
    return <div className="annoItemContainer">{this.renderSwitch()}</div>;
  }
}

export default AnnotationItem;

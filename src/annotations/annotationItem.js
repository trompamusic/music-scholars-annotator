/* item that contains the annotation contents, the renderSwitch function assign specific display to the specfic anntation based on its motivation*/
import React from "react";
import PlayLogo from "../graphics/play-solid.svg";
class AnnotationItem extends React.Component {
  onClick = (e) => {
    e.preventDefault();
    const replyTarget = this.props.annotation.anno.target;
    const replyTargetId = this.props.annotation["@id"];
    //was using || when showing quoted content a-la old school forum, allowes me to populate the quoted content field depending on the anno motivation.
    const innerBody =
      this.props.annotation.anno.body[0].id ||
      this.props.annotation.anno.body[0].value;
    this.props.onAnnoReplyHandler(replyTarget, replyTargetId, innerBody);
  };

  onPlayClick = (e) => {
    e.preventDefault();
    const bodyMedia = this.props.annotation.anno.body[0].id;
    this.props.onMediaClick(bodyMedia);
  };
  onShowReplyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const replyTargetAnno = document.querySelector("#replyAnno");
    /* chunk of proto code that is probably useful for the end goal */
    // const testRoot = document.querySelectorAll("#rootAnno");
    // const replyTest = document.querySelectorAll("#replyAnno");
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
    //   document.querySelector("#replyAnno")
    // );
    // const originAnno = Array.from(document.querySelector("#rootAnno"));
    // const filteredResults = filterReply.filter((target) =>
    //   filterRoot.includes(target)
    // );

    // console.log(targetCollection, "reply", replyTest);
    if (replyTargetAnno) {
      const replyTargetAnnoId = replyTargetAnno.dataset.replyAnnotationTarget;
      const rootAnno = e.target.closest(".annoItem");
      const rootAnnoTargetId = rootAnno.dataset.target;

      if (replyTargetAnnoId === rootAnnoTargetId) {
        //appendichild is where the magic happens only once. Needs recursiveness and reliability
        document.querySelector("#rootAnno").appendChild(replyTargetAnno);
        //creates an array of all the visible replies
        const noLongerShowing = Array.from(
          document.getElementsByClassName("showReply")
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
          document.getElementsByClassName("hiddenReply")
        );
        //shows them
        showing.forEach((showingReply) =>
          showingReply.classList.add("showReply")
        );
        showing.forEach((showingReply) =>
          showingReply.classList.remove("hiddenReply")
        );
      } else {
        //if only one anno has replies and the other button is clicked, hides all the replies and alerts the user
        const noLongerShowing = Array.from(
          document.getElementsByClassName("showReply")
        );
        noLongerShowing.forEach((noReplyShowing) =>
          noReplyShowing.classList.add("hiddenReply")
        );
        noLongerShowing.forEach((noReplyShowing) =>
          noReplyShowing.classList.remove("showReply")
        );
        alert("no replies to show for this annotation");
      }
    } else alert("no replies to show for this annotation");
  };
  renderSwitch = () => {
    //stuff that i am carrying around: the annotation's ID you are replying to, the body (currently sits under annotation.anno.source) and the annotation's specific ID
    const motivation = this.props.annotation.anno.motivation;
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const bodyMedia = this.props.annotation.anno.body[0].id;
    const target = this.props.annotation.anno.target[0].id;
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";
    const selfId = this.props.annotation["@id"];
    // const originAnno = document.querySelectorAll("div[data-self-id]");
    // const innerBodyString = this.props.annotation.anno.source;
    // const selfIdData = selfId.dataset.selfId;
    // const rootAnnoTargetIdData = rootAnnoTargetId.dataset.rootAnnotationId;

    switch (motivation) {
      case "describing":
        return (
          <div
            id="rootAnno"
            className="annoItem"
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
            id="replyAnno"
            data-reply-annotation-target={target}
            className="hiddenReply"
          >
            <div className="quoteContent">
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

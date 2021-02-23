/* item that contains the annotation contents, the renderSwitch function assign specific display to the specfic anntation based on its motivation*/
import React from "react";
import auth from 'solid-auth-client';
import {
  getSolidDatasetWithAcl,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  setAgentResourceAccess,
  setPublicResourceAccess,
  saveAclFor,
  getSolidDataset,
  getPublicAccess,
  getAgentAccessAll
} from "@inrupt/solid-client";

import PlayLogo from "../graphics/play-solid.svg";
class AnnotationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      userMayModifyAccess: false,
      resourceAcl:null,
      aclModified: false,
      datasetWithAcl: null,
      userId: null,
      isPictureShowing: false,
      previewButtonContent: "Show preview",
      showReplyButtonContent: "Show replies",
    };
    this.onClick = this.onClick.bind(this);
    this.grantPublic = this.grantPublic.bind(this);
    this.revokePublic = this.revokePublic.bind(this);
    this.updateDatasetAcl = this.updateDatasetAcl.bind(this);
  }
  onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const replyTarget = this.props.annotation.target;
    const replyTargetId = this.props.annotation["@id"];
    this.props.onAnnoReplyHandler(replyTarget, replyTargetId);
    console.log("reply target id", replyTargetId);
  };
  componentDidMount() { 
    this.updateDatasetAcl();
  }

  updateDatasetAcl() { 
    auth.currentSession()
      .then( (s) => { 
        getSolidDatasetWithAcl(this.props.annotation["@id"], { fetch: auth.fetch }).then( (datasetWithAcl) => {
          console.log("Got dataset: ", datasetWithAcl);
          let resourceAcl;
          if(!hasResourceAcl(datasetWithAcl)) { 
            if(!hasAccessibleAcl(datasetWithAcl)) {
              console.warn("You do not have permission to modify access on ", this.props.annotation["@id"])
            }
            if(!hasFallbackAcl(datasetWithAcl)) {
              console.warn("You do not have permission to view access rights list on ", this.props.annotation["@id"])
            } else { 
              resourceAcl = createAclFromFallbackAcl(datasetWithAcl);
              // ensure current user has control in the new ACL
              const userControllableResourceAcl = setAgentResourceAccess(resourceAcl, s.webId, 
                { read: true, append: true, write: true, control: true}
              )
              this.setState({
                userMayModifyAccess:true, 
                datasetWithAcl, 
                resourceAcl: userControllableResourceAcl,
                aclModified: Date.now()
              });
              console.log("Creating ACL from fallback ACL")
            }
          } else { 
            resourceAcl = getResourceAcl(datasetWithAcl);
            this.setState({
              userMayModifyAccess:true, 
              datasetWithAcl, 
              resourceAcl,
              aclModified: Date.now()
            });
            console.log("Got resource ACL");
          }
        }).catch( (e) => console.error("Couldn't get Solid dataset with ACL: ", this.props.annotation["@id"], e) ) 
      }).catch( (e) => console.error("Couldn't access the current Solid session: ", e) );
  }

  shouldComponentUpdate(nextProps, nextState) { 
    if(this.state.aclModified !== nextState.aclModified) { 
      // user has enacted an ACL change. Request a re-render accordingly.
      return true;
    }
    return false;
  }

  onPlayClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const bodyMedia = this.props.annotation.body[0].id;
    this.props.onMediaClick(bodyMedia);
  };

  onPreviewclick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const aimAt = e.target.closest(".rootAnno");
    const _children = aimAt.children[0];

    //const aimAt = rootAnno.contains("hiddenContainer");
    if (this.state.isPictureShowing === false) {
      this.setState({
        isPictureShowing: true,
        previewButtonContent: "Hide preview",
      });
      console.log(_children);
      document
        .querySelector(".hiddenContainer")
        .addEventListener("click", function (e) {
          e.stopPropagation();
        });
      _children.classList.remove("hiddenContainer");
      _children.classList.add("showContainer");
    } else {
      document
        .querySelector(".showContainer")
        .addEventListener("click", function (e) {
          e.stopPropagation();
        });
      this.setState({
        isPictureShowing: false,
        previewButtonContent: "show preview",
      });
      _children.classList.add("hiddenContainer");
      _children.classList.remove("showContainer");
    }
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
          if (
            this.props.areRepliesVisible === false ||
            this.state.isClicked === false
          ) {
            this.setState({
              isClicked: true,
              showReplyButtonContent: "Hide replies",
            });
            rootAnno.appendChild(replyTargetAnno);
            this.props.showReplyHandler();
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
          } else {
            this.setState({
              isClicked: false,
              showReplyButtonContent: "Show replies",
            });
            this.props.showReplyHandler();
            const annoContainer = document.querySelector(".listContainer");
            const noLongerShowing = Array.from(
              rootAnno.getElementsByClassName("showReply")
            );
            //hides them
            noLongerShowing.forEach((noReplyShowing) => {
              noReplyShowing.classList.add("hiddenReply");
              annoContainer.appendChild(noReplyShowing);
            });
            noLongerShowing.forEach((noReplyShowing) =>
              noReplyShowing.classList.remove("showReply")
            );
          }
          //appendichild is where the magic happens
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

 grantPublic(e) { 
    e.preventDefault();
    auth.currentSession()
      .then( (s) => { 
        let updatedAcl = setPublicResourceAccess(
          this.state.resourceAcl,
          { read: true, append: false, write: false, control: false }
        );
        // ensure current user has control in the new ACL
        updatedAcl = setAgentResourceAccess(updatedAcl, s.webId, 
          { read: true, append: true , write: true , control: true}
        )
        saveAclFor(this.state.datasetWithAcl, updatedAcl, { fetch: auth.fetch })
          .then( () => this.updateDatasetAcl() )
          .catch( (e) => console.error("Could not grant public access: ", e) );
      })
  }
  
  revokePublic(e) { 
    console.log("Revoking. Old acl: ", this.state.resourceAcl)
    e.preventDefault();
    auth.currentSession()
      .then( (s) => { 
        let updatedAcl = setPublicResourceAccess(
          this.state.resourceAcl,
          { read: false, append: false, write: false, control: false }
        )
        // ensure current user has control in the new ACL
        updatedAcl = setAgentResourceAccess(updatedAcl, s.webId, 
          { read: true, append: true , write: true , control: true }
        )

        saveAclFor(this.state.datasetWithAcl, updatedAcl, { fetch: auth.fetch })
          .then( () => this.updateDatasetAcl() )
          .catch( (e) => console.error("Could not revoke public access: ", e) );
      })
  }

  renderSwitch = () => {
    /* determine permission state of annotation in Solid Pod */
    let permission;
    let modifyPermissionsElement;
    
    if(this.state.datasetWithAcl) { 
      if(getPublicAccess(this.state.datasetWithAcl).read)  
        permission = "public";
      else if(Object.keys(getAgentAccessAll(this.state.datasetWithAcl)) > 1)
        /* declare it as shared if it has any access info for more than one (assumed to be user)
         * TODO check assumptions...
         */
        permission = "shared";
      else 
        permission = "private";
        
    } else {
      permission = "unknown";
    }

    // Logic to toggle public access on and off
    // TODO allow sharing with individual agents using setAgentResourceAccess
    if(!this.state.userMayModifyAccess) { 
      modifyPermissionsElement = 
        <span className="accessPermissions">User may <b>not</b> modify access</span>;
    } else { 
      if(permission !== "public") { 
        modifyPermissionsElement = 
          <button className="changeAccess" name="changeAccess" onClick={this.grantPublic}>
            Grant public access
          </button>;
      } else if(permission === "public") { 
        modifyPermissionsElement = 
          <button className="changeAccess" name="changeAccess" onClick={this.revokePublic}>
            Revoke public access
          </button>;
      }
    }
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
            <span className="date">
              Created on: {date} by {creator} with {motivation} motivation.
            </span>
            <span className="permission">
              Access permissions: { permission }.
            </span>
            { modifyPermissionsElement }
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
              {this.state.showReplyButtonContent}
            </button>
          </div>
        );
      case "linking":
        if (bodyL.startsWith("http")) {
          return (
            <div
              className="rootAnno annoItem"
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
              <span className="date">
                Created on: {date} by {creator} with {motivation} motivation
              </span>
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
                {this.state.showReplyButtonContent}
              </button>
            </div>
          );
        } else {
          const appendURL = "https://" + bodyL;
          return (
            <div
              className="rootAnno annoItem"
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
              <span className="date">
                Created on: {date} by {creator} with {motivation} motivation
              </span>
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
                {this.state.showReplyButtonContent}
              </button>
            </div>
          );
        }

      case "trompa:cueMedia":
        const cleanMediaString = bodyMedia.split("#")[0];
        return (
          <div
            className="rootAnno annoItem"
            data-target={target}
            data-self-id={selfId}
          >
            {" "}
            <p>
              The mediacontent of this annotation is {cleanMediaString}{" "}
              <button className="playButton" onClick={this.onPlayClick}>
                {" "}
                <img
                  src={PlayLogo}
                  alt=""
                  style={{
                    width: "5px",
                    alignContent: "center",
                    textAlign: "center",
                  }}
                ></img>{" "}
                play{" "}
              </button>
            </p>
            <span className="date">
              Created on: {date} by {creator} with {motivation} motivation
            </span>
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
              {this.state.showReplyButtonContent}
            </button>
          </div>
        );
      case "trompa:cueImage":
        return (
          <div
            className="rootAnno annoItem"
            data-target={target}
            data-self-id={selfId}
          >
            {" "}
            <div className="hiddenContainer">
              <a href={bodyMedia} target="_blank" rel="noopener noreferrer">
                <img
                  title="click for full res"
                  src={bodyMedia}
                  alt="annotation"
                  style={{
                    maxWidth: "240px",
                    maxHeight: "135px",
                    marginTop: "5px",
                  }}
                />
              </a>
            </div>
            <p>
              The mediacontent of this annotation is a picture, click the button
              to see a preview{" "}
              <button onClick={this.onPreviewclick}>
                {this.state.previewButtonContent}{" "}
              </button>
            </p>
            <span className="date">
              Created on: {date} by {creator} with {motivation} motivation
            </span>
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
              {this.state.showReplyButtonContent}
            </button>
          </div>
        );
      case "replying":
        return (
          <div
            data-reply-annotation-target={repTarget}
            className="replyAnno hiddenReply"
          >
            <div className="quoteContent">
              <p>This reply contains: {bodyD}</p>
              <span className="date">
                Created on: {date} by {creator} with {motivation} motivation
              </span>
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
                {this.state.showReplyButtonContent}
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

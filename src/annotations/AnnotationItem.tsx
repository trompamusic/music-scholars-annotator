/* item that contains the annotation contents, the renderSwitch function assign specific display to the specfic anntation based on its motivation*/
import React, {ChangeEvent, Component, MouseEvent} from "react";
import auth from "solid-auth-client";
import Toggle from "react-toggle";
import {
  getSolidDatasetWithAcl,
  hasResourceAcl,
  hasFallbackAcl,
  hasAccessibleAcl,
  createAclFromFallbackAcl,
  getResourceAcl,
  setAgentResourceAccess,
  setPublicResourceAccess,
  saveAclFor,
  getPublicAccess,
  getAgentAccessAll, AclDataset,
} from "@inrupt/solid-client";

import PlayLogo from "../graphics/play-solid.svg";
import {ReactComponent as Trash} from "../graphics/trash-solid.svg";
import {ReactComponent as InfoCircle} from "../graphics/info-circle-regular.svg";

export type Annotation = any

type AnnotationItemProps = {
  annotation: Annotation
  onRefreshClick: () => void
  onAnnoReplyHandler: (replyTarget: string, replyTargetId: string) => void
  onMediaClick: (id: string) => void
  showReplyHandler: () => void
  areRepliesVisible: boolean
  replyAnnotationTarget: any[]
}

type AnnotationItemState = {
  isClicked: boolean
  userMayModifyAccess: boolean
  resourceAcl?: AclDataset
  aclModified: number
  datasetWithAcl?: AclDataset
  userId?: string
  isPictureShowing: boolean
  previewButtonContent: string
  showRepliesButtonContent: string
  isConfirmVisible: boolean
  isVisible: boolean
  resp: string
}

class AnnotationItem extends Component<AnnotationItemProps, AnnotationItemState> {
  constructor(props: Readonly<AnnotationItemProps>) {
    super(props);
    this.state = {
      isClicked: false,
      userMayModifyAccess: false,
      resourceAcl: undefined,
      aclModified: 0,
      datasetWithAcl: undefined,
      userId: undefined,
      isPictureShowing: false,
      previewButtonContent: "Show preview",
      showRepliesButtonContent: "Toggle replies",
      isConfirmVisible: false,
      isVisible: false,
      resp: "",
    };
    this.grantPublic = this.grantPublic.bind(this);
    this.revokePublic = this.revokePublic.bind(this);
    this.updateDatasetAcl = this.updateDatasetAcl.bind(this);
    this.deleteAnno = this.deleteAnno.bind(this);
    // this.changeContent = this.changeContent.bind(this);
  }

  deleteAnno(e: MouseEvent<HTMLButtonElement>) {
    const parent = (e.target as Element).closest(".rootAnno");
    const testReplyRetrieval = document.querySelectorAll(".replyAnno");

    if (testReplyRetrieval) {
      testReplyRetrieval.forEach((replyTargetAnno) => {
        const replyTargetAnnoId = (replyTargetAnno as HTMLElement).dataset.replyAnnotationTarget;
        const rootAnnoTargetId = (parent as HTMLElement)!.dataset.selfId;
        if (replyTargetAnnoId === rootAnnoTargetId) {
          console.log("replies found: ", (replyTargetAnno as HTMLElement).dataset.selfId);
          auth
            .fetch((replyTargetAnno as HTMLElement).dataset.selfId!, { method: "DELETE" })
            .then(() => {console.log("replies deleted")});
        }
      });
    }
    auth
      .fetch(this.props.annotation["@id"], { method: "DELETE" })
      .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (!response.ok) {
          // get error message from body or default to response status
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }

        this.setState({ resp: "success" });
      })
        // @ts-ignore
      .then(this.props.onRefreshClick())
      .catch(() => {
        console.warn("Your annotation has been deleted, refreshing...");
      });
  }

  showDetails = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const parent = (e.target as HTMLElement).closest(".rootAnno");
    const details = parent!.querySelector(".hiddenDetails");
    if (details && !this.state.isVisible) {
      this.setState({ isVisible: true });
      details.classList.remove("hiddenDetails");
      details.classList.add("showDetails");
    } else {
      if (this.state.isVisible) {
        this.setState({ isVisible: false });
        const visibleDetails = parent!.querySelector(".showDetails");
        visibleDetails!.classList.remove("showDetails");
        visibleDetails!.classList.add("hiddenDetails");
      }
    }
  };

  showReplyDetails = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const parent = (e.target as HTMLElement).closest(".quoteContent");
    const details = parent!.querySelector(".hiddenDetails");
    if (details && !this.state.isVisible) {
      this.setState({ isVisible: true });
      details.classList.remove("hiddenDetails");
      details.classList.add("showDetails");
    } else {
      if (this.state.isVisible) {
        this.setState({ isVisible: false });
        const visibleDetails = parent!.querySelector(".showDetails");
        visibleDetails!.classList.remove("showDetails");
        visibleDetails!.classList.add("hiddenDetails");
      }
    }
  };
  onClick = (e: MouseEvent<HTMLButtonElement>) => {
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

  showConfirm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const parent = (e.target as HTMLElement).closest(".rootAnno");
    const confirmScreen = parent!.querySelector(".hiddenConfirm");
    if (confirmScreen && !this.state.isConfirmVisible) {
      this.setState({ isConfirmVisible: !this.state.isConfirmVisible });
      confirmScreen.classList.remove("hiddenConfirm");
      confirmScreen.classList.add("showConfirm");
    } else {
      if (this.state.isConfirmVisible) {
        this.setState({ isConfirmVisible: !this.state.isConfirmVisible });
        const visibleConfirm = parent!.querySelector(".showConfirm");
        visibleConfirm!.classList.remove("showConfirm");
        visibleConfirm!.classList.add("hiddenConfirm");
      }
    }
  };

  updateDatasetAcl() {
    auth
      .currentSession()
      .then((s) => {
        getSolidDatasetWithAcl(this.props.annotation["@id"], {
          fetch: auth.fetch,
        })
          .then((datasetWithAcl) => {
            console.log("Got dataset: ", datasetWithAcl);
            let resourceAcl;
            if (!hasResourceAcl(datasetWithAcl)) {
              if (!hasAccessibleAcl(datasetWithAcl)) {
                console.warn(
                  "You do not have permission to modify access on ",
                  this.props.annotation["@id"]
                );
              }
              if (!hasFallbackAcl(datasetWithAcl)) {
                console.warn(
                  "You do not have permission to view access rights list on ",
                  this.props.annotation["@id"]
                );
              } else {
                // @ts-ignore
                resourceAcl = createAclFromFallbackAcl(datasetWithAcl);
                // ensure current user has control in the new ACL
                const userControllableResourceAcl = setAgentResourceAccess(
                  resourceAcl,
                  s!.webId,
                  { read: true, append: true, write: true, control: true }
                );
                this.setState({
                  userMayModifyAccess: true,
                  // @ts-ignore
                  datasetWithAcl: datasetWithAcl,
                  resourceAcl: userControllableResourceAcl,
                  aclModified: Date.now(),
                });
                console.log("Creating ACL from fallback ACL");
              }
            } else {
              resourceAcl = getResourceAcl(datasetWithAcl);
              this.setState({
                userMayModifyAccess: true,
                // @ts-ignore
                datasetWithAcl: datasetWithAcl,
                resourceAcl: resourceAcl,
                aclModified: Date.now(),
              });
              console.log("Got resource ACL");
            }
          })
          .catch((e) =>
            console.error(
              "Couldn't get Solid dataset with ACL: ",
              this.props.annotation["@id"],
              e
            )
          );
      })
      .catch((e) =>
        console.error("Couldn't access the current Solid session: ", e)
      );
  }

  shouldComponentUpdate(nextProps: Readonly<AnnotationItemProps>, nextState: Readonly<AnnotationItemState>) {
    if (this.state.aclModified !== nextState.aclModified) {
      // user has enacted an ACL change. Request a re-render accordingly.
      return true;
    }
    return false;
  }

  onPlayClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const bodyMedia: string = this.props.annotation.body[0].id;
    this.props.onMediaClick(bodyMedia);
  };

  onPreviewclick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const aimAt = (e.target as HTMLElement).closest(".rootAnno");
    const _children = aimAt!.children[0];

    //const aimAt = rootAnno.contains("hiddenContainer");
    if (!this.state.isPictureShowing) {
      this.setState({
        isPictureShowing: true,
        previewButtonContent: "Hide preview",
      });
      console.log(_children);
      document
        .querySelector(".hiddenContainer")!
        .addEventListener("click", function (e) {
          e.stopPropagation();
        });
      _children.classList.remove("hiddenContainer");
      _children.classList.add("showContainer");
    } else {
      document
        .querySelector(".showContainer")!
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

  onShowReplyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const rootAnno = (e.target as HTMLElement).closest(".rootAnno");
    console.log("root anno", rootAnno);
    const replyTargetAnnos = document.querySelectorAll(".replyAnno");
    if (replyTargetAnnos.length) {
      replyTargetAnnos.forEach((replyTargetAnno) => {
        const replyTargetAnnoId = (replyTargetAnno as HTMLElement).dataset.replyAnnotationTarget;

        const rootAnnoTargetId = (rootAnno as HTMLElement)!.dataset.selfId;

        console.log("Reply target anno id: ", replyTargetAnnoId);
        if (replyTargetAnnoId === rootAnnoTargetId) {
          if (
            this.props.areRepliesVisible === false ||
            this.state.isClicked === false
          ) {
            this.setState({
              isClicked: true,
            });
            rootAnno!.appendChild(replyTargetAnno);
            this.props.showReplyHandler();

            //creates an array of all the visible replies
            const noLongerShowing = Array.from(
              rootAnno!.getElementsByClassName("showReply")
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
              rootAnno!.getElementsByClassName("hiddenReply")
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
            });
            this.props.showReplyHandler();

            const annoContainer = document.querySelector(".listContainer");
            const noLongerShowing = Array.from(
              rootAnno!.getElementsByClassName("showReply")
            );
            //hides them
            noLongerShowing.forEach((noReplyShowing) => {
              noReplyShowing.classList.add("hiddenReply");
              annoContainer!.appendChild(noReplyShowing);
            });
            noLongerShowing.forEach((noReplyShowing) =>
              noReplyShowing.classList.remove("showReply")
            );
          }
        }
      });
    } else console.warn("no replies to show for this annotation");
  };

  grantPublic(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    e.stopPropagation();
    auth.currentSession().then((s) => {
      let updatedAcl = setPublicResourceAccess(this.state.resourceAcl!, {
        read: true,
        append: false,
        write: false,
        control: false,
      });
      // ensure current user has control in the new ACL
      updatedAcl = setAgentResourceAccess(updatedAcl, s!.webId, {
        read: true,
        append: true,
        write: true,
        control: true,
      });
      // @ts-ignore
      saveAclFor(this.state.datasetWithAcl!, updatedAcl, { fetch: auth.fetch })
        .then(() => this.updateDatasetAcl())
        .catch((e) => console.error("Could not grant public access: ", e));
    });
  }

  revokePublic(e: ChangeEvent<HTMLInputElement>) {
    console.log("Revoking. Old acl: ", this.state.resourceAcl);
    e.stopPropagation();
    e.preventDefault();
    auth.currentSession().then((s) => {
      let updatedAcl = setPublicResourceAccess(this.state.resourceAcl!, {
        read: false,
        append: false,
        write: false,
        control: false,
      });
      // ensure current user has control in the new ACL
      updatedAcl = setAgentResourceAccess(updatedAcl, s!.webId, {
        read: true,
        append: true,
        write: true,
        control: true,
      });

      // @ts-ignore
      saveAclFor(this.state.datasetWithAcl!, updatedAcl, { fetch: auth.fetch })
        .then(() => this.updateDatasetAcl())
        .catch((e) => console.error("Could not revoke public access: ", e));
    });
  }

  renderSwitch = () => {
    const date = this.props.annotation.created;
    let todaysDateISO = new Date().toISOString();
    let creationDate = date.split("T")[0];
    let compareDate = String(todaysDateISO.split("T")[0]);
    let permission;
    let modifyPermissionsElement;
    let replies = document.querySelectorAll(".replyAnno");
    const selfId = this.props.annotation["@id"];
    var areRepliesPresent = false;
    /* check to see if any available replies are present, if not the toggle replies is hidden */
    if (replies.length) {
      replies.forEach((reply) => {
        const target = (reply as HTMLElement).dataset.replyAnnotationTarget;
        if (target === selfId) {
          areRepliesPresent = true;
        }
      });
    }

    /* determine permission state of annotation in Solid Pod */
    if (this.state.datasetWithAcl) {
      // @ts-ignore
      if (getPublicAccess(this.state.datasetWithAcl).read)
        permission = "public";
      else { // @ts-ignore
        if (Object.keys(getAgentAccessAll(this.state.datasetWithAcl)) > 1)
                /* declare it as shared if it has any access info for more than one (assumed to be user)
                 * TODO check assumptions...
                 */
                permission = "shared";
              else permission = "private";
      }
    } else {
      permission = "unknown";
    }
    // Logic to toggle public access on and off
    // TODO allow sharing with individual agents using setAgentResourceAccess
    if (!this.state.userMayModifyAccess) {
      modifyPermissionsElement = (
        <span className="accessPermissions">No access</span>
      );
    } else {
      if (permission !== "public") {
        modifyPermissionsElement = (
          <Toggle
            checked={false}
            onChange={this.grantPublic}
            icons={{
              unchecked: (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="lock"
                  className="svg-inline--fa fa-lock fa-w-14"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  vertical-align="middle"
                >
                  <path
                    fill="white"
                    d="M400 224h-24v-72C376 68.2 307.8 0 224 0S72 68.2 72 152v72H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48zm-104 0H152v-72c0-39.7 32.3-72 72-72s72 32.3 72 72v72z"
                  ></path>
                </svg>
              ),
            }}
          />
        );
      } else if (permission === "public") {
        modifyPermissionsElement = (
          <Toggle
            checked={true}
            onChange={this.revokePublic}
            icons={{
              checked: (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="lock-open"
                  className="svg-inline--fa fa-lock-open fa-w-18"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path
                    fill="white"
                    d="M423.5 0C339.5.3 272 69.5 272 153.5V224H48c-26.5 0-48 21.5-48 48v192c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V272c0-26.5-21.5-48-48-48h-48v-71.1c0-39.6 31.7-72.5 71.3-72.9 40-.4 72.7 32.1 72.7 72v80c0 13.3 10.7 24 24 24h32c13.3 0 24-10.7 24-24v-80C576 68 507.5-.3 423.5 0z"
                  ></path>
                </svg>
              ),
            }}
          />
        );
      }
    }
    /* shared components for all the annotations */
    let commonAnnoComponents = (
      <div>
        <div className="hiddenConfirm">
          <div>
            Delete this annotation and its replies?
            <p>
              <button className={"deleteYes"} onClick={this.deleteAnno}>
                yes
              </button>
              <button className={"deleteNo"} onClick={this.showConfirm}>
                no
              </button>
            </p>
          </div>
        </div>
        <div style={{ paddingTop: "1.5%" }}>
          {compareDate === creationDate && (
            <button className="deleteButton" onClick={this.showConfirm}>
              <Trash />
            </button>
          )}
          <button
            className="infoButton"
            onMouseEnter={this.showDetails}
            onMouseLeave={this.showDetails}
          >
            <InfoCircle/>
          </button>
          permissions: {modifyPermissionsElement}
        </div>
      </div>
    );
    /* cluster of buttons and stuff in the "annotation footer" */
    let replyButtonsCluster = (
      <div>
        <div className="hiddenDetails">
          {" "}
          <p className="date">
            Created on: {date}, access permissions: {permission}.
          </p>
        </div>
        <div>
          {areRepliesPresent && (
            <button
              className="showRepliesButton"
              name="showRepliesButton"
              onClick={this.onShowReplyClick}
            >
              {this.state.showRepliesButtonContent}
            </button>
          )}
          <button
            className="replyButton"
            name="replyButton"
            onClick={this.onClick}
          >
            Reply
          </button>
        </div>
      </div>
    );

    //stuff that i am carrying around: the annotation's ID you are replying to, the body (currently sits under annotation.source) and the annotation's specific ID
    const motivation = this.props.annotation.motivation;
    const bodyD = this.props.annotation.body[0].value;
    const bodyL = this.props.annotation.body[0].id;
    const bodyMedia = this.props.annotation.body[0].id;
    const target = this.props.annotation.target[0].id;
    const repTarget = this.props.annotation.target;
    const creator = this.props.annotation.creator || "unknown";

    switch (motivation) {
      case "describing":
        return (
          <div
            className="rootAnno annoItem"
            data-target={target}
            data-self-id={selfId}
          >
            {" "}
            {commonAnnoComponents}
            <p>{bodyD}</p>
            {replyButtonsCluster}
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
                {""}
                {commonAnnoComponents}
                {
                  <a
                    href={bodyL}
                    onClick={() => false}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bodyL}
                  </a>
                }
              </p>
              {replyButtonsCluster}
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
              {commonAnnoComponents}
              <p>
                {""}
                {
                  <a
                    href={appendURL}
                    onClick={() => false}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {bodyL}
                  </a>
                }
              </p>
              {replyButtonsCluster}
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
            {commonAnnoComponents}
            <p>
              {cleanMediaString}{" "}
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
            {replyButtonsCluster}
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
            {commonAnnoComponents}
            <p>
              The content of this annotation is a picture, click the button to
              see a preview{" "}
              <button onClick={this.onPreviewclick}>
                {this.state.previewButtonContent}{" "}
              </button>
            </p>
            {replyButtonsCluster}
          </div>
        );
      case "trompa:playlist":
        return;

      case "replying":
        return (
          <div
            data-reply-annotation-target={repTarget}
            data-self-id={selfId}
            className="replyAnno hiddenReply"
          >
            <div className="quoteContent">
              <button className="deleteButton" onClick={this.deleteAnno}>
                <Trash/>
              </button>
              <button
                className="infoButton"
                onMouseEnter={this.showReplyDetails}
                onMouseLeave={this.showReplyDetails}
              >
                <InfoCircle/>
              </button>
              <p>Reply: {bodyD}</p>
              <span className="hiddenDetails">
                {" "}
                <span className="date">
                  Created on: {date}, access permissions: {permission}.
                </span>
              </span>
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
          </div>
        );
    }
  };

  render() {
    return <div className="annoItemContainer">{this.renderSwitch()}</div>;
  }
}

export default AnnotationItem;

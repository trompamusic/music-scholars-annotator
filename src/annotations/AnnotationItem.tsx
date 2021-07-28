/* item that contains the annotation contents, the renderSwitch function assign specific display to the specific annotation based on its motivation*/
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
import {ReactComponent as LockSolid} from "../graphics/lock-solid.svg";
import {ReactComponent as LockOpenSolid} from "../graphics/lock-open-solid.svg";
import {Button, Card, Collapse} from "react-bootstrap-v5";

type AnnotationInput = {
  annotation: Annotation
  replies: Annotation[]
}

type AnnotationItemProps = {
  annotation: AnnotationInput
  onRefreshClick: () => void
  onAnnoReplyHandler: (replyTarget: AnnotationTarget[], replyTargetId: string) => void
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
  showDetails: boolean
  showReplies: boolean
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
      showDetails: false,
      showReplies: false
    };
    this.grantPublic = this.grantPublic.bind(this);
    this.revokePublic = this.revokePublic.bind(this);
    this.updateDatasetAcl = this.updateDatasetAcl.bind(this);
    this.deleteAnno = this.deleteAnno.bind(this);
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
      .fetch(this.props.annotation.annotation["@id"]!, { method: "DELETE" })
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

  /*
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
   */

  onReplyClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const replyTarget = this.props.annotation.annotation.target;
    const replyTargetId = this.props.annotation.annotation["@id"];
    this.props.onAnnoReplyHandler(replyTarget, replyTargetId!);
    console.log("reply target id", replyTargetId);
  };

  componentDidMount() {
    //this.updateDatasetAcl();
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
        getSolidDatasetWithAcl(this.props.annotation.annotation["@id"]!, {
          fetch: auth.fetch,
        })
          .then((datasetWithAcl) => {
            console.log("Got dataset: ", datasetWithAcl);
            let resourceAcl;
            if (!hasResourceAcl(datasetWithAcl)) {
              if (!hasAccessibleAcl(datasetWithAcl)) {
                console.warn(
                  "You do not have permission to modify access on ",
                  this.props.annotation.annotation["@id"]
                );
              }
              if (!hasFallbackAcl(datasetWithAcl)) {
                console.warn(
                  "You do not have permission to view access rights list on ",
                  this.props.annotation.annotation["@id"]
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
              this.props.annotation.annotation["@id"],
              e
            )
          );
      })
      .catch((e) =>
        console.error("Couldn't access the current Solid session: ", e)
      );
  }

  // shouldComponentUpdate(nextProps: Readonly<AnnotationItemProps>, nextState: Readonly<AnnotationItemState>) {
  //   if (this.state.aclModified !== nextState.aclModified) {
  //     // user has enacted an ACL change. Request a re-render accordingly.
  //     return true;
  //   }
  //   return false;
  // }

  onPlayClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const bodyMedia: string = this.props.annotation.annotation.body[0].id;
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
    const date = this.props.annotation.annotation.created;
    let todaysDateISO = new Date().toISOString();
    let creationDate = date.split("T")[0];
    let compareDate = String(todaysDateISO.split("T")[0]);
    let permission;
    let modifyPermissionsElement;
    let replies = document.querySelectorAll(".replyAnno");
    const selfId = this.props.annotation.annotation["@id"];
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
              unchecked: <LockSolid/>,
            }}
          />
        );
      } else if (permission === "public") {
        modifyPermissionsElement = (
          <Toggle
            checked={true}
            onChange={this.revokePublic}
            icons={{
              checked: <LockOpenSolid/>
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
            // onMouseEnter={this.showDetails}
            // onMouseLeave={this.showDetails}
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
            onClick={this.onReplyClick}
          >
            Reply
          </button>
        </div>
      </div>
    );

    //stuff that i am carrying around: the annotation's ID you are replying to, the body (currently sits under annotation.source) and the annotation's specific ID
    const motivation = this.props.annotation.annotation.motivation;
    const bodyD = this.props.annotation.annotation.body[0].value;
    const bodyL = this.props.annotation.annotation.body[0].id;
    const bodyMedia = this.props.annotation.annotation.body[0].id;
    const target = this.props.annotation.annotation.target[0].id;
    const repTarget = this.props.annotation.annotation.target;
    const creator = this.props.annotation.annotation.creator || "unknown";

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
                />{" "}
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
                className="float-right"
                // onMouseEnter={this.showReplyDetails}
                // onMouseLeave={this.showReplyDetails}
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
    //return <div className="annoItemContainer">{this.renderSwitch()}</div>;

    return <><Card className="ml-3">
      <Card.Body>
        <Card.Subtitle as="h6" className="text-muted">motivation: {this.props.annotation.annotation.motivation}</Card.Subtitle>
        <Card.Text>
          &nbsp;{this.props.annotation.annotation.body[0]!.value!}
          <Button
            className="float-end"
            onClick={() => {this.setState({showDetails: !this.state.showDetails})}}
          >i</Button>
        </Card.Text>
        <Card.Text className="float-end">
          {this.props.annotation.replies.length > 0 &&
            <Button onClick={() => {this.setState({showReplies: !this.state.showReplies})}}>
              {this.state.showReplies ? "Hide" : "Show"} replies
            </Button>
          }
          <Button>Reply</Button>
        </Card.Text>
      </Card.Body>
      <Collapse in={this.state.showDetails}>
        <Card.Footer>
          <small>Created on:{this.props.annotation.annotation.created}<br/>
          Permissions: x</small>

        </Card.Footer>
      </Collapse>
    </Card>
      {this.state.showReplies && this.props.annotation.replies.map((reply) => {
        return <Card style={{marginLeft: "1em"}} key={reply["@id"]}><Card.Body><Card.Text>Reply: {reply.body[0]!.value!}</Card.Text></Card.Body></Card>
      })}
      </>
  }
}

export default AnnotationItem;

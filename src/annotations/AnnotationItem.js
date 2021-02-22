import React from "react";
import PropTypes from "prop-types";
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

class AnnotationItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: "hideReply",
      userMayModifyAccess: false,
      resourceAcl:null,
      aclModified: false,
      datasetWithAcl: null,
      userId: null
    };
    this.props = props;
    this.onClick = this.onClick.bind(this);
    this.revokePublic = this.revokePublic.bind(this);
    this.grantPublic = this.grantPublic.bind(this);
    this.updateDatasetAcl = this.updateDatasetAcl.bind(this);
  }
  
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
  onShowReplyClick() {
    // const replyTarget = document.querySelector("replyAnno");
    // const inReplyTarget = Array.from(replyTarget);
    // inReplyTarget.forEach((replyVisible) =>
    //   replyVisible.classList.add("showReply")
    // );
    // inReplyTarget.forEach((replyVisible) =>
    //   replyVisible.classList.remove("hideReply")
    // );
  }

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

  renderSwitch() {
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
    console.log("Render switch. State: ", this.state.userMayModifyAccess, this.state.resourceAcl)
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
          <div>
            {" "}
            <p>The textual content of this annotation is {bodyD}</p>
            <div className="date">
              Created on: {date} by {creator} with {motivation} motivation <a className="annoUri" href={this.props.annotation['@id']}>uri</a>.
            </div>
            <div className="permission">
              Access permissions: { permission }.
            </div>
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
            className="showReply"
            id="replyAnno"
            data-reply-annotation-target={target}
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
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";
    const motivation = this.props.annotation.anno.motivation;
    const bodyD = this.props.annotation.anno.body[0].value;

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

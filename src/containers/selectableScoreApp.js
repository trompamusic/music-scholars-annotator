import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotations/annotation-submitter.js";
import SelectionHandler from "../annotations/SelectionHandler.js";
import AnnotationList from "../annotations/AnnotationList.js";
import ReactPlayer from "react-player";

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      annotationType: "",
      placeholder: "",
      uri: "Mahler.mei",
      testuri: "https://meld.linkedmusic.org/companion/mei/full-score/F6.mei",
      selectorString: [],
      buttonContent: "Submit to your Solid POD",
      replyAnnotationTarget: [],
      currentAnnotation: [],
      toggleAnnotationRetrieval: false,
      hasContent: true,
      isClicked: false,
      showMEIInput: true,
      currentMedia: this.props.currentMedia || "",
      seekTo: "",
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.handleStringChange = this.handleStringChange.bind(this);
    this.onResponse = this.onResponse.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.onReceiveAnnotationContainerContent = this.onReceiveAnnotationContainerContent.bind(
      this
    );
    this.onSubmitMEI = this.onSubmitMEI.bind(this);
    this.onMEIInputChange = this.onMEIInputChange.bind(this);
    this.hideMEIInput = this.hideMEIInput.bind(this);
    this.onAnnoTypeChange = this.onAnnoTypeChange.bind(this);
    this.onAnnoReplyHandler = this.onAnnoReplyHandler.bind(this);
    this.player = React.createRef();
  }

  onAnnoTypeChange = (e) =>
    this.setState({
      annotationType: e.target.value,
      placeholder: e.target.placeholder,
      buttonContent: "Submit to your Solid POD",
    });

  handleStringChange(selectorString) {
    this.setState({ selectorString }, () =>
      console.log(this.state.selectorString)
    );
  }

  handleSelectionChange(selection) {
    this.setState({ selection });
    /* and anything else your app needs to do when the selection changes */
  }

  onMEIInputChange = (e) => {
    this.setState({ uri: e.target.value });
  };

  hideMEIInput() {
    this.setState({ showMEIInput: !this.state.showMEIInput });
  }

  onAnnoReplyHandler(replyTarget) {
    this.setState({
      annotationType: "replying",
      placeholder: "you are replying to the selected annotation",
      buttonContent: "Reply to selected Solid annotation",
      replyAnnotationTarget: replyTarget,
    });
  }

  onSubmitMEI = () => {
    this.setState(
      {
        isClicked: true,
      },
      () => {
        this.hideMEIInput();
      }
    );
  };

  onResponse(resp) {
    console.log(resp);
    if (resp.status === 201) {
      this.setState(
        {
          toggleAnnotationRetrieval: true,
        },
        () => {
          this.setState({ toggleAnnotationRetrieval: false });
        }
      );
    } else if (resp.status === 404) {
      alert("folder not found, check your annotation container path!");
    }
  }

  onRefreshClick() {
    if (this.state.hasContent === false) {
      return;
    } else
      this.setState(
        {
          toggleAnnotationRetrieval: true,
        },
        () => {
          this.setState({ toggleAnnotationRetrieval: false });
        }
      );
  }

  onReceiveAnnotationContainerContent(content) {
    if (!content || !content.length) {
      alert("no annotation to retrieve");
      this.setState(
        {
          hasContent: false,
        },
        () => {
          console.log(this.state.hasContent);
          this.setState({ hasContent: true });
        }
      );
    }
    content = content.filter((c) => c["@id"].endsWith(".jsonld"));

    this.setState({ currentAnnotation: content }, () => {
      console.log(this.state.currentAnnotation);
    });
    console.log("iteration succeded");
    content.map((anno) => {
      anno.anno.target.map((jSonTarget) => {
        const bodies = anno.anno.body;
        const targetId = jSonTarget.id;
        const fragment = targetId.substr(targetId.lastIndexOf("#"));
        const element = document.querySelector(fragment);
        if (!element) {
          return;
        }
        const annoId = anno["@id"];
        const annoIdFragment = annoId.substr(annoId.lastIndexOf("/") + 1);
        //checks what's the motivation of the target
        switch (anno.anno.motivation) {
          case "describing":
            if (bodies.length) {
              if ("value" in bodies[0]) {
                const title = document.createElementNS(
                  "http://www.w3.org/2000/svg",
                  "title"
                );
                // Embeds the annotation text into this title node
                title.innerHTML = bodies[0]["value"];
                element.insertBefore(title, element.firstChild);
                element.classList.add(anno.anno.motivation);
                element.classList.add("focus-" + annoIdFragment);
              }
            }
            break;
          case "replying":
            element.classList.add(anno.anno.motivation);
            element.classList.add("focus-" + annoIdFragment);
            break;
          case "linking":
            if (bodies.length) {
              // make the target clickable, linking to the (first) body URI
              element.addEventListener(
                "click",
                function () {
                  //appends http fragment to avoid partial linking error
                  const URL = bodies[0]["id"];
                  if (URL.startsWith("http")) {
                    window.open(URL, "_blank");
                  } else {
                    const appendURL = "https://" + URL;
                    window.open(appendURL, "_blank");
                  }
                },
                true
              );
              // and turn the cursor into a pointer as a hint that it's clickable
              element.classList.add("focus-" + annoIdFragment);
              element.classList.add(anno.anno.motivation);
            }
            break;
          case "trompa:cueMedia":
            if (bodies.length) {
              // make the target clickable, seeking player to the (first) body media cue
              element.onclick = () => {
                //appends http fragment to avoid partial linking error
                const mediaCue = bodies[0]["id"];
                // TODO validate properly
                const currentMedia = mediaCue.split("#")[0];
                const seekTo = mediaCue.split("#")[1].replace("t=", "");
                console.log("Setting up seek to: ", currentMedia, seekTo);
                this.setState({ currentMedia }, () =>
                  this.player.current.seekTo(seekTo)
                );
              };
              // and turn the cursor into a pointer as a hint that it's clickable
              element.classList.add("focus-" + annoIdFragment);
              element.classList.add("cueMedia");
            }
            break;
          default:
            console.log(
              "sorry, don't know what to do for this annotation boss"
            );
        }
      });
    });
  }

  handleScoreUpdate(scoreElement) {
    console.log("Received updated score DOM element: ", scoreElement);
  }

  render() {
    return (
      <div>
        {this.state.isClicked === true && (
          <div className="score">
            <div className="pageButton">
              <PrevPageButton
                buttonContent={<span>Previous page</span>}
                uri={this.state.uri}
              />
            </div>
            <div className="divider"></div>
            {/* pass anything as buttonContent that you'd like to function as a clickable next page button */}
            <div className="pageButton">
              <NextPageButton
                buttonContent={<span>Next page</span>}
                uri={this.state.uri}
              />
            </div>
            <SelectableScore
              uri={this.state.uri}
              annotationContainerUri={this.props.submitUri}
              options={this.props.vrvOptions}
              onSelectionChange={this.handleSelectionChange}
              selectorString={this.state.selectorString}
              onScoreUpdate={this.handleScoreUpdate}
              onReceiveAnnotationContainerContent={
                this.onReceiveAnnotationContainerContent
              }
              toggleAnnotationRetrieval={this.state.toggleAnnotationRetrieval}
            />
          </div>
        )}
        {this.state.showMEIInput && (
          <div>
            <p>Select your MEI file:</p>
            <input
              type="text"
              onChange={this.onMEIInputChange}
              placeholder={this.state.uri}
            />

            <input
              title="click to render the linked MEI file"
              className="MEIButton"
              type="button"
              onClick={this.onSubmitMEI}
              value="render"
            />
          </div>
        )}

        {/*selector for the component selection*/}
        <SelectionHandler
          selectorString={this.state.selectorString}
          handleStringChange={this.handleStringChange}
        />
        {/*annotation submission component*/}
        <AnnotationSubmitter
          onAnnoTypeChange={this.onAnnoTypeChange}
          uri={this.state.uri}
          submitUri={this.props.submitUri}
          selection={this.state.selection}
          onResponse={this.onResponse}
          onRefreshClick={this.onRefreshClick}
          annotationType={this.state.annotationType}
          placeholder={this.state.placeholder}
          replyAnnotationTarget={this.state.replyAnnotationTarget}
          buttonContent={this.state.buttonContent}
          creator={this.props.userId}
        />
        {/*as buttonContent that you'd like to function as a clickable prev page
        button */}

        <AnnotationList
          entries={this.state.currentAnnotation}
          onAnnoReplyHandler={this.onAnnoReplyHandler}
        />

        {/* <OrchestralRibbon uri={this.state.testuri} width={500} height={600} /> */}

        <ReactPlayer
          playing
          ref={this.player}
          url={this.state.currentMedia}
          controls={true}
          onReady={() => {
            if (this.state.seekTo) {
              console.log("Seeking to: ", this.state.seekTo);
              this.player.current.seekTo(Math.floor(this.state.seekTo));
              this.setState({ seekTo: "" });
            }
          }}
        />
      </div>
    );
  }
}

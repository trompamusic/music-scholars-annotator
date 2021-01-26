import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotations/annotation-submitter.js";
import SelectionHandler from "../annotations/SelectionHandler.js";
import AnnotationList from "../annotations/AnnotationList.js";
import ReactPlayer from "react-player";
import Modal from "react-modal";

//Modal.setAppElement("root");
//
const vAdjust = 26; // num. pixels to nudge down anno measureBoxes

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      annotationType: "",
      placeholder: "",
      uri: "Mahler.mei",
      selectorString: "",
      buttonContent: "Submit to your Solid POD",
      replyAnnotationTarget: [],
      currentAnnotation: [],
      toggleAnnotationRetrieval: false,
      hasContent: true,
      isClicked: false,
      showMEIInput: true,
      currentMedia: this.props.currentMedia || "",
      seekTo: "",
      measuresToAnnotationsMap: {},
      annoToDisplay: [],
      helpWindowIsActive: false,
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
    this.convertCoords = this.convertCoords.bind(this);
    this.activateModal = this.activateModal.bind(this);
    this.deactivateModal = this.deactivateModal.bind(this);

    this.player = React.createRef();
  }
  activateModal = () => {
    this.setState({ helpWindowIsActive: true });
  };

  deactivateModal = () => {
    this.setState({ helpWindowIsActive: false });
  };

  convertCoords(elem) {
    if (
      document.getElementById(elem.getAttribute("id")) &&
      elem.style.display !== "none" &&
      (elem.getBBox().x !== 0 || elem.getBBox().y !== 0)
    ) {
      const x = elem.getBBox().x;
      const width = elem.getBBox().width;
      const y = elem.getBBox().y;
      const height = elem.getBBox().height;
      const offset = elem.closest("svg").parentElement.getBoundingClientRect();
      const matrix = elem.getScreenCTM();
      return {
        x: matrix.a * x + matrix.c * y + matrix.e - offset.left,
        y: matrix.b * x + matrix.d * y + matrix.f - offset.top,
        x2: matrix.a * (x + width) + matrix.c * y + matrix.e - offset.left,
        y2: matrix.b * x + matrix.d * (y + height) + matrix.f - offset.top,
      };
    } else {
      console.warn("Element unavailable on page: ", elem.getAttribute("id"));
      return { x: 0, y: 0, x2: 0, y2: 0 };
    }
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
    // FIXME: Validate that these are (TROMPA?) Web Annotations
    content = content.filter((c) => c["@id"].endsWith(".jsonld"));

    let measuresToAnnotationsMapList = content.map((anno) => {
      const measures = anno.anno.target
        .map((jsonTarget) => {
          const targetId = jsonTarget.id;
          const fragment = targetId.substr(targetId.lastIndexOf("#"));
          const element = document.querySelector(fragment);
          let measure = "";
          if (element) {
            measure = element.closest(".measure");
          }
          return measure;
        })
        .filter((el) => el); // ensure element exists on screen
      const distinctMeasures = [...new Set(measures)];
      return { annoId: anno["@id"], measures: distinctMeasures };
    });
    let newMap = {};
    measuresToAnnotationsMapList.forEach((measureToAnnoMap) => {
      measureToAnnoMap.measures.forEach((m) => {
        const mId = m.getAttribute("id");
        if (mId in newMap) {
          newMap[mId].push(measureToAnnoMap.annoId);
        } else {
          newMap[mId] = [measureToAnnoMap.annoId];
        }
      });
    });

    this.setState(
      { currentAnnotation: content, measuresToAnnotationsMap: newMap },
      () => {
        console.log("Mapped annotaitons ", newMap);
        console.log("current annotations ", content);
        // draw bounding boxes for all measures containing annotations
        const annotatedMeasuresOnScreen = Object.keys(
          this.state.measuresToAnnotationsMap
        ).filter(
          (measureId) => document.querySelectorAll("#" + measureId).length
        );
        console.log(
          "Annotated measures on screen: ",
          annotatedMeasuresOnScreen
        );
        annotatedMeasuresOnScreen.forEach((measureId) => {
          const coords = this.convertCoords(
            document.querySelector("#" + measureId)
          );
          console.log("Coords: ", coords);
          const measureBox = document.createElement("div");
          const measureBoxBackground = document.createElement("div");

          const coordsBox = {
            left: Math.floor(coords.x),
            top: Math.floor(coords.y) + vAdjust,
            width: Math.ceil(coords.x2 - coords.x),
            height: Math.ceil(coords.y2 - coords.y),
          };
          console.log("Coords box: ", coordsBox);
          measureBox.setAttribute("id", "measureBox-" + measureId);
          measureBox.setAttribute("class", "measureBox");
          measureBox.setAttribute(
            "style",
            "position: absolute;" +
              "background: rgba(0, 0, 0, 0);" +
              "left: " +
              coordsBox.left +
              "px;" +
              "top: " +
              coordsBox.top +
              "px;" +
              "width: " +
              coordsBox.width +
              "px;" +
              "height: " +
              coordsBox.height +
              "px;" +
              "z-index: 1"
          );

          measureBoxBackground.setAttribute(
            "id",
            "measureBoxBackground-" + measureId
          );
          measureBoxBackground.setAttribute("class", "measureBoxBackground");
          measureBoxBackground.setAttribute(
            "style",
            "position: absolute;" +
              "background: rgba(241, 145, 0, 0.25);" +
              "border:1px solid orange;" +
              "left: " +
              coordsBox.left +
              "px;" +
              "top: " +
              coordsBox.top +
              "px;" +
              "width: " +
              coordsBox.width +
              "px;" +
              "height: " +
              coordsBox.height +
              "px;" +
              "z-index: -1"
          );
          console.log("TRYING TO DRAW", measureBox);
          document
            .querySelector("#annotationBoxesContainer")
            .appendChild(measureBox);
          document
            .querySelector("#annotationBoxesContainer")
            .appendChild(measureBoxBackground);
          measureBox.onclick = () => {
            // FIXME: might need to work more on the onClick interaction
            // e.preventDefault();
            // const isBoxOpen = Array.from(e.currentTarget.classList).filter((c) =>
            //   c.startsWith("measureBox")
            // );
            // if (isBoxOpen.length > 1) {
            //   console.warn("too many open boxes", e.target);
            // }
            // // remove focus off previous inFocus elements (now outdated)
            // const noLongerOpen = Array.from(
            //   document.getElementsByClassName("isOpen")
            // );
            // noLongerOpen.forEach((noFocusElement) =>
            //   noFocusElement.classList.remove("isOpen")
            // );
            // // add focus to newly inFocus elements
            // const inOpenList = Array.from(
            //   document.getElementsByClassName(isBoxOpen[0])
            // );
            // inOpenList.forEach((focusElement) =>
            //   focusElement.classList.add("isOpen")
            // );

            let _annoiDs = content.map((jsonIds) => {
              const annotationsIds = jsonIds["@id"];
              return annotationsIds;
            });
            let _filteredAnnoIds = this.state.measuresToAnnotationsMap[
              measureId
            ];
            let compare = _annoiDs.filter((anno) =>
              _filteredAnnoIds.includes(anno)
            );
            this.setState({ annoToDisplay: compare });
            //console.log("filtered annos ", compare)
            //const compare = _annoiDs.map((elem1) => ({id: elem1.annotationsIds, match: _filteredAnnoIds.some((elem2) => elem2[0] === elem1.annotationsIds)}))
            // console.log("Clicked measure containing these annotations",
            //   measureId
            // )
            //console.log("all recorded annotations are ", _annoiDs)
            //console.log("the measure contains ", _filteredAnnoIds)
            // console.log("all measures on screen are", annotatedMeasuresOnScreen)
          };
        });
      }
    );
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
                // const title = document.createElementNS(
                //   "http://www.w3.org/2000/svg",
                //   "title"
                // );
                // Embeds the annotation text into this title node
                //title.innerHTML = bodies[0]["value"];
                //element.insertBefore(title, element.firstChild);
                //element.classList.add(anno.anno.motivation);
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
              //element.classList.add(anno.anno.motivation);
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
              //element.classList.add("cueMedia");
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
    const modal = this.state.helpWindowIsActive ? (
      <Modal
        isOpen={this.state.helpWindowIsActive}
        onRequestClose={this.deactivateModal}
        contentLabel="my modal"
        className="mymodal"
        overlayClassName="myoverlay"
        ariaHideApp={false}
      >
        <div>
          <header className="modal-header">
            <h2 className="modal-title">This modal has a title</h2>
          </header>
          <div className="modal-body">
            <p>Subtitle</p>
            <div style={{ height: 200, overflow: "auto" }}>
              <h3>Internally Scrolling Region</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
          <footer className="modal-footer">
            <button onClick={this.deactivateModal}>deactivate modal</button>
          </footer>
        </div>
      </Modal>
    ) : (
      false
    );
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
            <div id="annotationBoxesContainer" />
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
          allEntries={this.state.currentAnnotation}
          filteringEntries={this.state.annoToDisplay}
          onAnnoReplyHandler={this.onAnnoReplyHandler}
          currentMedia={this.state.currentMedia}
        />
        <div>
          <button onClick={this.activateModal}>help</button>
          {modal}
        </div>
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

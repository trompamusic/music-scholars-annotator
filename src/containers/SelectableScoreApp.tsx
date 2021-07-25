import React, { ChangeEvent, Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotations/AnnotationSubmitter";
import SelectionHandler from "../annotations/selectionHandler";
import AnnotationList from "../annotations/annotationList";
import ReactPlayer from "react-player";
import RenditionsPlaylist from "../annotations/renditionsPlaylist";

import ArrowToLeft from "../graphics/arrow-to-left-regular.svg";
import ArrowToRight from "../graphics/arrow-to-right-regular.svg";
import SearchMinus from "../graphics/search-minus-solid.svg";
import SearchPlus from "../graphics/search-plus-solid.svg";
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import FtempoSearch from "./FtempoSearch";
import { Session } from "@inrupt/solid-client-authn-browser";
import { SolidClient } from "trompa-annotation-component/dist";

//const vAdjust = 26; // num. pixels to nudge down anno measureBoxes+
const defaultVerovioScale = 50;

let viewPortHeight = window.outerHeight;
let viewPortWidth = window.outerWidth;
// prettier-ignore
const defaultVerovioHeight = (viewPortHeight < 1439) ? 2000 : 2500;
// prettier-ignore
const defaultVerovioWidth = (viewPortWidth > 1925) ? 2800 : 2000;

// Selector to say if we're showing the annotation interface or F-tempo search
enum ApplicationMode {
  Annotate = "Annotate",
  Search = "Search",
  Ready = "Ready",
}

type VerovioOptions = {
  scale: number;
  adjustPageHeight: number;
  pageHeight: number;
  pageWidth: number;
  footer: string;
  unit: number;
};

type SelectableScoreAppProps = {
  resourceUri: string;
  submitUri: string;
  currentMedia?: string;
  // Bound from the SelectableScore redux
  score: any;
  solidSession: Session;
};

type SelectableScoreAppState = {
  annoValue: string;
  selection: Element[];
  annotationType: string;
  placeholder: string;
  selectorString: string[];
  buttonContent: string;
  replyAnnotationTarget: AnnotationTarget[];
  currentAnnotation: Annotation[];
  hasContent: boolean;
  currentMedia: string;
  seekTo: string;
  measuresToAnnotationsMap: { [key: string]: string[] };
  annoToDisplay: any[];
  helpWindowIsActive: boolean;
  replyAnnotationTargetId: string;
  areRepliesVisible: boolean;
  ftempoSearchCounter: number;
  applicationMode: ApplicationMode;
  vrvOptions: VerovioOptions;
};

class SelectableScoreApp extends Component<
  SelectableScoreAppProps,
  SelectableScoreAppState
> {
  constructor(props: Readonly<SelectableScoreAppProps>) {
    super(props);
    this.state = {
      annoValue: "",
      selection: [],
      annotationType: "describing",
      placeholder: "Add your annotation...",
      selectorString: [],
      buttonContent: "Submit to your Solid POD",
      replyAnnotationTarget: [],
      currentAnnotation: [],
      hasContent: true,
      currentMedia: this.props.currentMedia || "",
      seekTo: "",
      measuresToAnnotationsMap: {},
      annoToDisplay: [],
      helpWindowIsActive: false,
      replyAnnotationTargetId: "",
      areRepliesVisible: false,

      ftempoSearchCounter: 1,
      applicationMode: ApplicationMode.Ready,
      vrvOptions: {
        scale: defaultVerovioScale,
        adjustPageHeight: 0,
        pageHeight: defaultVerovioHeight,
        pageWidth: defaultVerovioWidth,
        footer: "none",
        unit: 6,
      },
    };
    this.handleSelectionChange = this.handleSelectionChange.bind(this);
    this.handleStringChange = this.handleStringChange.bind(this);
    this.convertCoords = this.convertCoords.bind(this);
    this.annotate = this.annotate.bind(this);
    this.handlePageTurn = this.handlePageTurn.bind(this);
  }

  private player = React.createRef<ReactPlayer>();

  zoomIn = () => {
    let step = 5;
    let initialZoom = this.state.vrvOptions.scale;
    let initialHeight = this.state.vrvOptions.pageHeight;
    let initialWidth = this.state.vrvOptions.pageWidth;

    const newVrvOptions = Object.assign({}, this.state.vrvOptions);
    newVrvOptions.scale = initialZoom + step;
    //prettier-ignore
    newVrvOptions.pageHeight = initialHeight - (newVrvOptions.scale * 5);
    //prettier-ignore
    newVrvOptions.pageWidth = initialWidth - (newVrvOptions.scale * 2);
    if (newVrvOptions.scale < 50) {
      //prettier-ignore
      newVrvOptions.pageWidth = initialWidth - (newVrvOptions.scale * 5);
    }

    if (newVrvOptions.scale < 40) {
      //prettier-ignore
      newVrvOptions.pageHeight = initialHeight - (newVrvOptions.scale * 8);
      //prettier-ignore
      newVrvOptions.pageWidth = initialWidth - (newVrvOptions.scale * 5);
    }
    if (viewPortWidth >= 1925) {
      if (newVrvOptions.pageWidth > 3500) {
        newVrvOptions.pageWidth = 3500;
      }
    }

    if (newVrvOptions.scale >= 80) {
      console.log("max zoom reached");
      return;
    }
    // if (newVrvOptions.pageWidth >= 2380) {
    //   newVrvOptions.pageWidth = 2380;
    // }
    // if (newVrvOptions.pageWidth < 1500 || newVrvOptions.pageWidth > 1500) {
    //   newVrvOptions.pageWidth = 1500;
    // }
    // if (newVrvOptions.pageHeight < 1500 || newVrvOptions.pageHeight > 1500) {
    //   newVrvOptions.pageHeight = 1500;
    // }
    console.log(
      "ZOOM INCREASE",
      newVrvOptions.scale,
      "page w",
      newVrvOptions.pageWidth,
      "page h",
      newVrvOptions.pageHeight
    );
    this.setState({ vrvOptions: newVrvOptions });
  };

  zoomOut = () => {
    let step = 5;
    let initialZoom = this.state.vrvOptions.scale;
    let initialHeight = this.state.vrvOptions.pageHeight;
    let initialWidth = this.state.vrvOptions.pageWidth;
    //   vrvOptions.scale = vrvOptions.scale + step;
    //   vrvOptions.pageHeight = (pageHeight * 100) / vrvOptions.scale;
    //   vrvOptions.pageWidth = (pageWidth * 100) / vrvOptions.scale;
    //
    const newVrvOptions = Object.assign({}, this.state.vrvOptions);
    newVrvOptions.scale = initialZoom - step;
    //prettier-ignore
    newVrvOptions.pageHeight = initialHeight + (newVrvOptions.scale * 5);
    //prettier-ignore
    newVrvOptions.pageWidth = initialWidth + (newVrvOptions.scale * 2);
    if (newVrvOptions.scale < 50) {
      //prettier-ignore
      newVrvOptions.pageWidth = initialWidth + (newVrvOptions.scale * 5);
    }

    if (newVrvOptions.scale < 40) {
      //prettier-ignore
      newVrvOptions.pageHeight = initialHeight + (newVrvOptions.scale * 8);
      //prettier-ignore
      newVrvOptions.pageWidth = initialWidth + (newVrvOptions.scale * 5);
    }

    if (newVrvOptions.scale <= 25) {
      console.log("minimum zoom reached");
      return;
    }
    // if (newVrvOptions.pageWidth < 1500 || newVrvOptions.pageWidth > 1500) {
    //   newVrvOptions.pageWidth = 1500;
    // }
    // if (newVrvOptions.pageHeight < 1500 || newVrvOptions.pageHeight > 1500) {
    //   newVrvOptions.pageHeight = 1500;
    // }
    console.log(
      "ZOOM DECREASE",
      newVrvOptions.scale,
      "page w",
      newVrvOptions.pageWidth,
      "page h",
      newVrvOptions.pageHeight
    );
    this.setState({ vrvOptions: newVrvOptions });
  };

  showReplyHandler = () => {
    this.setState({ areRepliesVisible: !this.state.areRepliesVisible });
  };
  activateModal = () => {
    this.setState({ helpWindowIsActive: true });
  };

  deactivateModal = () => {
    this.setState({ helpWindowIsActive: false });
  };

  convertCoords(elem: SVGGraphicsElement) {
    if (
      document.getElementById(elem.getAttribute("id")!) &&
      elem.style.display !== "none" &&
      (elem.getBBox().x !== 0 || elem.getBBox().y !== 0)
    ) {
      //trims the box to fit within the measure and avoids overflowing slurs etc
      const staff1 = elem.getElementsByClassName("staff")[0];
      //magic from David Lewis
      const staffLines = Array.prototype.filter.call(
        staff1.children,
        (x) => x.tagName === "path"
      );
      //sets the bounding box size to the stafflines size
      const bbox = staffLines[0].getBBox();
      const x = elem.getBBox().x;
      const width = bbox.width;
      const y = elem.getBBox().y;
      const height = elem.getBBox().height;
      const offset = elem
        .closest("svg")!
        .parentElement!.getBoundingClientRect();
      const matrix = elem.getScreenCTM()!;
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

  onAnnoTypeChange = (e: ChangeEvent<HTMLInputElement>) =>
    this.setState({
      annotationType: e.target.value,
      placeholder: e.target.placeholder,
      buttonContent: "Submit to your Solid POD",
    });

  handleStringChange(selectorString: string[]) {
    this.setState({ selectorString });
  }

  handleSelectionChange(selection: Element[]) {
    this.setState({ selection });
  }

  //////////// NEEDS TO WIPE TARGET REPLY AFTER REPLYING TO IT ALSO THE ANNOTATION TYPE HANDLING IS MESSY //////////////////
  onAnnoReplyHandler = (
    replyTarget: AnnotationTarget[],
    replyTargetId: string
  ) => {
    this.setState({
      annotationType: "replying",
      placeholder: "you are replying to the selected annotation",
      buttonContent: "Reply to selected Solid annotation",
      replyAnnotationTarget: replyTarget,
      replyAnnotationTargetId: replyTargetId,
    });
  };

  /**
   * Called when the AnnotationSubmitter wants to save an annotation
   */
  saveAnnotation = async (annotation: any) => {
    console.log("selectable score: about to save an annotation");
    console.log(annotation);
    const solidClient = new SolidClient();
    await solidClient.saveAnnotation(
      annotation,
      this.props.solidSession,
      this.props.submitUri
    );
    // TODO: we shouldn't reload all annotations - instead just update state and re-compute boxes
    await this.onRefreshClick();
  };

  /**
   * Called when the "load annotations" <button> is clicked
   */
  onRefreshClick = async () => {
    const solidClient = new SolidClient();
    // TODO: correctly get the pod uri for this session
    let podUrl = new URL(this.props.solidSession.info!.webId!).origin;
    if (!podUrl.endsWith("/")) {
      podUrl = podUrl + "/";
    }
    const containerUrl = podUrl + this.props.submitUri;
    const annotations = await solidClient.fetchAnnotations(
      new URL(containerUrl),
      this.props.solidSession,
      {}
    );
    console.log("loaded annotations");
    console.log(annotations);
    this.setState({
      annotationType: "describing",
      replyAnnotationTarget: [],
      replyAnnotationTargetId: "",
      placeholder: "Add your annotation...",
      annoToDisplay: [],
    });
    this.onReceiveAnnotationContainerContent(annotations);
  };

  onMediaClick = (bodyMedia: string) => {
    console.log("button click", bodyMedia);
    //appends http fragment to avoid partial linking error
    //const mediaCue = bodies[0]["id"];
    // TODO validate properly
    const currentMedia = bodyMedia.split("#")[0];
    const seekTo = bodyMedia.split("#")[1].replace("t=", "");
    console.log("Setting up seek to: ", currentMedia, seekTo);
    this.setState({ currentMedia }, () => {
      if (this.player.current) {
        this.player.current.seekTo(parseInt(seekTo, 10));
      }
    });
  };

  /**
   * Called when a bunch of annotations are loaded by selectablescore
   * @param content array of annotations
   */
  onReceiveAnnotationContainerContent = (content: Annotation[]) => {
    // No annotations, undo all of the boxes on the score
    if (!content || !content.length) {
      alert("no annotation to retrieve");
      const noLongerInFocusList = Array.from(
        document.getElementsByClassName("inFocus")
      );
      noLongerInFocusList.forEach((noFocusElement) =>
        noFocusElement.classList.remove("inFocus")
      );
      document.querySelectorAll(".measureBox").forEach((mb) => mb.remove());
      document
        .querySelectorAll(".measureBoxBackground")
        .forEach((mb) => mb.remove());
      return;
    }
    // FIXME: Validate that these are (TROMPA?) Web Annotations
    content = content.filter((c) => c && c["@id"]!.endsWith(".jsonld"));

    let measuresToAnnotationsMapList = content.map((anno) => {
      let distinctMeasures: any[] = [];
      // replying annotations don't have distinct measures since they target
      // annotations, *not* MEI elements
      if (anno.motivation !== "replying") {
        const measures = anno.target
          .map((jsonTarget: AnnotationTarget) => {
            const targetId = jsonTarget.id;
            const fragment = targetId.substr(targetId.lastIndexOf("#"));
            const element = document.querySelector(fragment);
            let measure = null;
            if (element) {
              measure = element.closest(".measure");
            }
            return measure;
          })
          .filter((el: Element | null) => el); // ensure element exists on screen
        distinctMeasures = Array.from(new Set(measures));
      }
      return { annoId: anno["@id"]!, measures: distinctMeasures };
    });
    let newMap: { [key: string]: string[] } = {};
    measuresToAnnotationsMapList.forEach((measureToAnnoMap) => {
      measureToAnnoMap.measures.forEach((m) => {
        const mId: string = m.getAttribute("id");
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
        const noLongerInFocusList = Array.from(
          document.getElementsByClassName("inFocus")
        );
        noLongerInFocusList.forEach((noFocusElement) =>
          noFocusElement.classList.remove("inFocus")
        );
        // delete any existing measure boxes so we can redraw from blank slate
        document.querySelectorAll(".measureBox").forEach((mb) => mb.remove());
        document
          .querySelectorAll(".measureBoxBackground")
          .forEach((mb) => mb.remove());
        console.log("Mapped annotations ", newMap);
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
            document.querySelector("#" + measureId)!
          );
          console.log("Coords: ", coords);

          const measureBox = document.createElement("div");
          const measureBoxBackground = document.createElement("div");

          const coordsBox = {
            left: Math.floor(coords.x),
            top: Math.floor(coords.y),
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
          measureBoxBackground.classList.remove("isOpen");
          measureBoxBackground.classList.add("isClosed");
          measureBoxBackground.setAttribute(
            "style",
            "position: absolute;" +
              // "background: rgba(241, 145, 0, 0.25);" +
              // "border:1px solid orange;" +
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
            .querySelector(".annotationBoxesContainer")!
            .appendChild(measureBox);
          document
            .querySelector(".annotationBoxesContainer")!
            .appendChild(measureBoxBackground);

          measureBox.onclick = (e) => {
            const noLongerInFocusList = Array.from(
              document.getElementsByClassName("inFocus")
            );
            noLongerInFocusList.forEach((noFocusElement) =>
              noFocusElement.classList.remove("inFocus")
            );
            const bgBoxes = document.querySelectorAll(".measureBoxBackground");
            const frontBox = (e.target as HTMLElement).closest(".measureBox");
            bgBoxes.forEach((box) => {
              box.classList.add("isClosed");
              box.classList.remove("isOpen");
              const bgBoxId = box.id.split("measureBoxBackground-")[1];
              const frontBoxId = frontBox!.id.split("measureBox-")[1];

              if (frontBoxId === bgBoxId) {
                box.classList.remove("isClosed");
                box.classList.add("isOpen");
              }
            });

            const noLongerShowing = Array.from(
              document.getElementsByClassName("showReply")
            );
            console.log("no longer showing ", noLongerShowing);
            //hides them

            if (noLongerShowing.length) {
              //const replyHolder = document.createElement("div");
              if (this.state.areRepliesVisible) {
                this.setState({ areRepliesVisible: false });
              }
              const annoContainer = document.querySelector(".listContainer");
              console.log(annoContainer);
              //annoContainer.appendChild(replyHolder);
              noLongerShowing.forEach((noReplyShowing) => {
                noReplyShowing.classList.add("hiddenReply");
                annoContainer!.appendChild(noReplyShowing);
              });
              noLongerShowing.forEach((noReplyShowing) =>
                noReplyShowing.classList.remove("showReply")
              );
            }
            this.handleAnnoShowingUpdate(content, measureId);
          };
        });
      }
    );

    content.forEach((anno: Annotation) => {
      if (anno.motivation !== "replying") {
        anno.target.forEach((jsonTarget: AnnotationTarget) => {
          const bodies = anno.body;
          const targetId = jsonTarget.id;
          const fragment = targetId.substr(targetId.lastIndexOf("#"));
          const element = document.querySelector(fragment);
          if (!element) {
            return console.warn("no content has been found");
          }
          const annoId = anno["@id"]!;
          const annoIdFragment = annoId.substr(annoId.lastIndexOf("/") + 1);
          //checks what's the motivation of the target
          switch (anno.motivation) {
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
            case "linking":
              if (bodies.length) {
                // make the target clickable, linking to the (first) body URI
                // element.addEventListener(
                //   "click",
                //   function () {
                //     //appends http fragment to avoid partial linking error
                //     const URL = bodies[0]["id"];
                //     if (URL.startsWith("http")) {
                //       window.open(URL, "_blank");
                //     } else {
                //       const appendURL = "https://" + URL;
                //       window.open(appendURL, "_blank");
                //     }
                //   },
                //   true
                // );
                // and turn the cursor into a pointer as a hint that it's clickable
                element.classList.add("focus-" + annoIdFragment);
                //element.classList.add(anno.anno.motivation);
                element.classList.add("focus-" + annoIdFragment);
              }
              break;
            case "trompa:cueMedia":
              if (bodies.length) {
                // make the target clickable, seeking player to the (first) body media cue
                // element.onMediaClick = () => {
                //   //appends http fragment to avoid partial linking error
                //   const mediaCue = bodies[0]["id"];
                //   // TODO validate properly
                //   const currentMedia = mediaCue.split("#")[0];
                //   const seekTo = mediaCue.split("#")[1].replace("t=", "");
                //   console.log("Setting up seek to: ", currentMedia, seekTo);
                //   this.setState({ currentMedia }, () =>
                //     this.player.current.seekTo(seekTo)
                //   );
                // };
                // and turn the cursor into a pointer as a hint that it's clickable
                element.classList.add("focus-" + annoIdFragment);
                //element.classList.add("cueMedia");
              }
              break;
            case "trompa:cueImage":
              if (bodies.length) {
                element.classList.add("focus-" + annoIdFragment);
                //element.classList.add("cueMedia");
              }
              break;
            case "trompa:playlist": {
              return;
            }

            default:
              console.log(
                "sorry, don't know what to do for this annotation boss"
              );
          }
        });
      }
    });
  };

  /**
   * When clicking on a highlighted measure on the score, get a list
   * of annotations (and all replies, even if they're not replies to
   *  annotations in this measure)
   * @param content all annotations that have been loaded
   * @param measureId the fragment id of the measure that was selected
   */
  handleAnnoShowingUpdate = (content: Annotation[], measureId: string) => {
    let _annoIds = content.map((jsonIds) => {
      return jsonIds["@id"];
    });
    let _filteredAnnoIds = this.state.measuresToAnnotationsMap[measureId];
    let compare = _annoIds.filter(
      (anno) => anno && _filteredAnnoIds.includes(anno)
    );
    // compare has all annotation IDs *for our measure*
    // we want those, PLUS all replying annotations (which aren't tied to measures)
    const annotationsToDisplay = [
      ...compare,
      ...content
        .filter((anno) => anno.motivation === "replying") // get the replies
        .map((anno) => anno["@id"]), // and return their IDs
    ];
    console.log("to display: ", annotationsToDisplay);
    this.setState({
      annoToDisplay: annotationsToDisplay,
    });
  };

  handleScoreUpdate = async (scoreElement: any) => {
    // TODO: We shouldn't re-retrieve annotations on score update, just re-filter
    //  the list that we have
    console.log("Received updated score DOM element: ", scoreElement);
    await this.onRefreshClick();
  };

  handlePageTurn() {
    document.querySelectorAll(".measureBox").forEach((mb) => mb.remove());
    document
      .querySelectorAll(".measureBoxBackground")
      .forEach((mb) => mb.remove());
  }

  onFtempoSearchButton = () => {
    // TODO: This is a quick hack. At the moment SelectableScore doesn't trigger
    //  handleScoreUpdate on initial page load, only after a page is turned or zoomed
    //  So in order to make sure that we pass this.props.score.vrvTk to <FtempoSearch>,
    //  we just randomly update state when the user presses a button to make sure that
    //  we re-render
    console.debug(`state update ${this.state.ftempoSearchCounter}`);
    this.setState({
      ftempoSearchCounter: this.state.ftempoSearchCounter + 1,
      applicationMode: ApplicationMode.Search,
    });
  };

  annotate = () => {
    this.setState({
      applicationMode: ApplicationMode.Annotate,
    });
  };

  render() {
    return (
      <div>
        <div>
          <div className="scoreContainer">
            <div className="controls">
              <div className="prevPageButton" onClick={this.handlePageTurn}>
                <PrevPageButton
                  buttonContent={<img src={ArrowToLeft} alt="previous page" />}
                  uri={this.props.resourceUri}
                />
              </div>
              <button onClick={this.zoomOut} className="zoomOut">
                <img src={SearchMinus} alt="zoom out" />
              </button>
              {/* pass anything as buttonContent that you'd like to function as a clickable next page button */}
              <button onClick={this.zoomIn} className="zoomIn">
                <img src={SearchPlus} alt="zoom in" />
              </button>
              <div className="nextPageButton" onClick={this.handlePageTurn}>
                <NextPageButton
                  buttonContent={<img src={ArrowToRight} alt="next page" />}
                  uri={this.props.resourceUri}
                />
              </div>
            </div>
            <div className="annotationBoxesContainer" />
            <SelectableScore
              uri={this.props.resourceUri}
              vrvOptions={this.state.vrvOptions}
              onSelectionChange={this.handleSelectionChange}
              selectorString={this.state.selectorString}
              onScoreUpdate={this.handleScoreUpdate}
              selectionArea=".scoreContainer"
            />
          </div>
        </div>

        {this.state.applicationMode === ApplicationMode.Ready && (
          <div>
            <FtempoSearch
              onButtonPress={this.onFtempoSearchButton}
              vrvToolkit={this.props.score.vrvTk}
              counter={this.state.ftempoSearchCounter}
            />
            <h3>Annotate the score using the Annotation Tools</h3>
            <button onClick={this.annotate}>Make an annotation</button>
          </div>
        )}

        {/*selector for the component selection*/}
        {this.state.applicationMode === ApplicationMode.Annotate && (
          <div>
            <SelectionHandler
              selectorString={this.state.selectorString}
              handleStringChange={this.handleStringChange}
            />
            {/*annotation submission component*/}
            <AnnotationSubmitter
              creator={this.props.solidSession.info!.webId!}
              onAnnoTypeChange={this.onAnnoTypeChange}
              uri={this.props.resourceUri}
              submitUri={this.props.submitUri}
              selection={this.state.selection}
              saveAnnotation={this.saveAnnotation}
              onRefreshClick={this.onRefreshClick}
              annotationType={this.state.annotationType}
              placeholder={this.state.placeholder}
              replyAnnotationTarget={this.state.replyAnnotationTarget}
              buttonContent={this.state.buttonContent}
              replyAnnotationTargetId={this.state.replyAnnotationTargetId}
            />

            <RenditionsPlaylist
              allEntries={this.state.currentAnnotation}
              onRefreshClick={this.onRefreshClick}
            />

            <AnnotationList
              allEntries={this.state.currentAnnotation}
              filteringEntries={this.state.annoToDisplay}
              onAnnoReplyHandler={this.onAnnoReplyHandler}
              onMediaClick={this.onMediaClick}
              replyAnnotationTarget={this.state.replyAnnotationTarget}
              showReplyHandler={this.showReplyHandler}
              areRepliesVisible={this.state.areRepliesVisible}
              onRefreshClick={this.onRefreshClick}
            />
            <ReactPlayer
              width="80%"
              height="80%"
              ref={this.player}
              url={this.state.currentMedia}
              controls={true}
              onReady={() => {
                if (this.state.seekTo && this.player.current) {
                  console.log("Seeking to: ", this.state.seekTo);
                  this.player.current.seekTo(
                    Math.floor(Number(this.state.seekTo))
                  );
                  this.setState({ seekTo: "" });
                }
              }}
            />
          </div>
        )}

        <div>
          <button
            onClick={this.activateModal}
            style={{ padding: "5px", marginTop: "5px" }}
          >
            help
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ score }: any) {
  return { score };
}

function mapDispatchToProps(dispatch: Dispatch<AnyAction>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(SelectableScoreApp);

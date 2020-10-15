import React, { Component } from "react";
import SelectableScore from "selectable-score/lib/selectable-score";
import NextPageButton from "selectable-score/lib/next-page-button.js";
import PrevPageButton from "selectable-score/lib/prev-page-button.js";
import AnnotationSubmitter from "../annotations/annotation-submitter.js";
import SelectionHandler from "../annotations/SelectionHandler.js";
import AnnotationList from "../annotations/AnnotationList.js";

export default class SelectableScoreApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selection: [],
      uri:
        "https://raw.githubusercontent.com/trompamusic-encodings/Schumann-Clara_Romanze-in-a-Moll/master/Schumann-Clara_Romanze-ohne-Opuszahl_a-Moll.mei",
      selectorString: ".note",
      currentAnnotation: [],
      toggleAnnotationRetrieval: false,
      hasContent: true,
      isClicked: false,
      showMEIInput: true,
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
  }

  handleStringChange(selectorString) {
    this.setState({ selectorString });
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
                //element.classlist.add or .remove
                //use clickhandler, use queryselector to iterate across
              }
            }
            break;
          case "linking":
            if (bodies.length) {
              // make the target clickable, linking to the (first) body URI
              element.addEventListener(
                "click",
                function () {
                  window.open(bodies[0]["id"], "_blank");
                },
                true
              );
              // and turn the cursor into a pointer as a hint that it's clickable
              element.classList.add("focus-" + annoIdFragment);
              element.classList.add(anno.anno.motivation);
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
        {this.state.showMEIInput && (
          <div>
            <p>Select your MEI file:</p>
            <input
              type="text"
              onChange={this.onMEIInputChange}
              placeholder={this.state.uri}
            />
            <input
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
          uri={this.state.uri}
          submitUri={this.props.submitUri}
          selection={this.state.selection}
          onResponse={this.onResponse}
          onRefreshClick={this.onRefreshClick}
        />
        {/*as buttonContent that you'd like to function as a clickable prev page
        button */}
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

        <AnnotationList entries={this.state.currentAnnotation} />

        {this.state.isClicked === true && (
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
        )}
      </div>
    );
  }
}

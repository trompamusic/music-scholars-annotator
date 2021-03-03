/* annotationList is the annotationItem container. Filters the annotations in order to render only the one associated to the specific measure selected */
/* they are ordered chronologically with sortedfilteredAnno and the onClick funciton is attacehd to the annotation item's body to highlight the annotated section of the score*/

import React from "react";
import AnnotationItem from "./annotationItem";
//import PropTypes from "prop-types";
export class AnnotationList extends React.Component {
  state = {
    order: "desc",
  };

  render() {
    const { order } = this.state;
    const filtering = this.props.allEntries.filter((anno) =>
      this.props.filteringEntries.includes(anno["@id"])
    );
    const sortedFilteredAnno = filtering.sort((a, b) => {
      const isReverse = order === "asc" ? 1 : -1;
      return isReverse * a.created.localeCompare(b.created);
    });

    function onClick(e) {
      // e.preventDefault();
      // e.stopPropagation();
      console.log("i am being clicked");
      // figure out this element's focus Id
      const focusId = Array.from(e.currentTarget.classList).filter((c) =>
        c.startsWith("focus-")
      );
      if (focusId.length > 1) {
        console.warn("Element with multiple focus Ids!", e.target);
      }
      // remove focus off previous inFocus elements (now outdated)
      const noLongerInFocusList = Array.from(
        document.getElementsByClassName("inFocus")
      );
      noLongerInFocusList.forEach((noFocusElement) =>
        noFocusElement.classList.remove("inFocus")
      );
      // add focus to newly inFocus elements
      const inFocusList = Array.from(
        document.getElementsByClassName(focusId[0])
      );
      inFocusList.forEach((focusElement) =>
        focusElement.classList.add("inFocus")
      );
      // scroll page to highlighted item
      // document
      //   .querySelector(".inFocus")
      //   .scrollIntoView({ behavior: "smooth" });
    }

    return (
      <div className="listContainer" id="listContainer">
        {sortedFilteredAnno.map((item) => {
          const annoIdFragment = item["@id"].substr(
            item["@id"].lastIndexOf("/") + 1
          );
          return (
            <div
              className={"focus-" + annoIdFragment}
              onClick={onClick}
              key={item["@id"]}
              id={annoIdFragment}
            >
              <AnnotationItem
                annotation={item}
                onAnnoReplyHandler={this.props.onAnnoReplyHandler}
                onMediaClick={this.props.onMediaClick}
                replyAnnotationTarget={this.props.replyAnnotationTarget}
                showReplyHandler={this.props.showReplyHandler}
                areRepliesVisible={this.props.areRepliesVisible}
                onRefreshClick={this.props.onRefreshClick}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

// AnnotationList.propTypes = {
//   entries: PropTypes.array.isRequired,
// };

export default AnnotationList;

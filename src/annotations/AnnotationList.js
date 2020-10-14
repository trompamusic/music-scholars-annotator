import React from "react";
import AnnotationItem from "./AnnotationItem";
import PropTypes from "prop-types";
export class AnnotationList extends React.Component {
  render() {
    function onClick(e) {
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
    }

    return (
      <div className="listContainer">
        {this.props.entries.map((item) => {
          const annoIdFragment = item["@id"].substr(
            item["@id"].lastIndexOf("/") + 1
          );
          return (
            <div
              className={"focus-" + annoIdFragment}
              onClick={onClick}
              key={item["@id"]}
            >
              <AnnotationItem annotation={item} />
            </div>
          );
        })}
      </div>
    );
  }
}

AnnotationList.propTypes = {
  entries: PropTypes.array.isRequired,
};

export default AnnotationList;

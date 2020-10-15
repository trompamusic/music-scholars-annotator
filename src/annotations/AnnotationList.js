import React from "react";
import AnnotationItem from "./AnnotationItem";
import PropTypes from "prop-types";
export class AnnotationList extends React.Component {
  state = {
    order: "desc",
  };

  render() {
    const { order } = this.state;
    const sortedAnno = this.props.entries.sort((a, b) => {
      const isReverse = order === "asc" ? 1 : -1;
      return isReverse * a.anno.created.localeCompare(b.anno.created);
    });
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
      // scroll page to highlighted item
      document.querySelector(".inFocus").scrollIntoView({ behavior: "smooth" });
    }

    return (
      <div className="listContainer">
        {sortedAnno.map((item) => {
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

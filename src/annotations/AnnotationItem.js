import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  render() {
    const date = this.props.annotation.anno.created;
    const body = this.props.annotation.anno.body[0].value;
    const id = this.props.id;
    function onClick() {
      const annoId = id;
      const fragmentId = annoId.substr(annoId.lastIndexOf("/"));
      var searchElements = document.getElementsByClassName("annoList");
      for (var i = 0; i < searchElements.length; i++) {
        searchElements[i].addEventListener("click", function () {
          this.classList.add("focus-" + fragmentId);
        });
      }
    }
    return (
      <div className={"annoList"} onClick={onClick}>
        <p>The content of this annotation is {body}</p>
        <p className="date">date created: {date}</p>
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

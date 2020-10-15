import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  render() {
    const date = this.props.annotation.anno.created;
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const annoId = this.props.annotation["@id"];
    const annoIdFragment = annoId.substr(annoId.lastIndexOf("/") + 1);

    return (
      <div className={"annoList focus-" + annoIdFragment}>
        <p>The content of this annotation is {bodyD || bodyL}</p>
        <p className="date">date created: {date}</p>
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

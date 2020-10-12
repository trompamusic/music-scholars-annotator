import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  render() {
    const date = this.props.annotation.anno.created;
    const body = this.props.annotation.anno.body[0].value;
    return (
      <div className="annoList">
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
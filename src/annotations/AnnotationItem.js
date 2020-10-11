import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  render() {
    return (
      <div className="annoList">
        <p>
          the content of this annotation is{" "}
          {this.props.annotation.anno.body[0].value} and it has been created on:{" "}
          {this.props.annotation.anno.created}
        </p>
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

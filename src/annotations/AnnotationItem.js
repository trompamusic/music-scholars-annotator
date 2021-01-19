import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const replyTarget = this.props.annotation.anno.target;
    this.props.onAnnoReplyHandler(replyTarget);
  }

  render() {
    const date = this.props.annotation.anno.created;
    const creator = this.props.annotation.anno.creator || "unknown";
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const bodyMedia = this.props.annotation.anno.body[0];

    return (
      <div className="annoItem">
        <p>The content of this annotation is {bodyD || <a href={bodyL} target="_blank"
            rel="noopener noreferrer">{bodyL}</a> || bodyMedia}</p>
        <div className="date">
          Created on: {date} by {creator}
        </div>
        <button
          className="replyButton"
          name="replyButton"
          onClick={this.onClick}
        >
          Reply
        </button>
      </div>
    );
  }
}

AnnotationItem.propType = {
  annotation: PropTypes.object.isRequired,
};

export default AnnotationItem;

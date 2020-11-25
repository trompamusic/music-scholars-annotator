import React from "react";
import PropTypes from "prop-types";

class AnnotationItem extends React.Component {
  constructor(props){
    super(props);
    this.props = props;
    this.onClick = this.onClick.bind(this)
  }
  onClick(e){
    e.preventDefault();
    e.stopPropagation();
    console.log("test");
    this.props.onAnnoReplyHandler()
  }
  
  render() {
   
    const date = this.props.annotation.anno.created;
    const bodyD = this.props.annotation.anno.body[0].value;
    const bodyL = this.props.annotation.anno.body[0].id;
    const annoId = this.props.annotation["@id"];
    //const annoIdFragment = annoId.substr(annoId.lastIndexOf("/") + 1);
    return (
      <div className="annoList">
        <p>The content of this annotation is {bodyD || bodyL}</p>
        <span className="date">date created: {date}</span>
        <button className="replyButton" name="replyButton" onClick={this.onClick}>
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

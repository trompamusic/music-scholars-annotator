import React, { Component } from "react";
import Annotationitem from "./Annotationitem.js";
import PropTypes from "prop-types";

export class Annotations extends Component {
  render() {
    var annotationComponents = this.props.annotationlist.map(annotation => {
      return (
        <div>
          <Annotationitem key={annotation.id} annotation={annotation} />
        </div>
      );
    });
    return <div>{annotationComponents}</div>;
  }
}
Annotations.propTypes = {
  annotationlist: PropTypes.array.isRequired
};

export default Annotations;

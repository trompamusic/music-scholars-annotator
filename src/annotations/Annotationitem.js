import React, { Component } from "react";
import PropTypes from "prop-types";

export class Annotationitem extends Component {
  render() {
    return (
      <div>
        <p>
          {this.props.annotation.annotation}, the measure id is:
          {this.props.annotation.measureid}
        </p>
      </div>
    );
  }
}
Annotationitem.propTypes = {
  annotation: PropTypes.object.isRequired
};

export default Annotationitem;

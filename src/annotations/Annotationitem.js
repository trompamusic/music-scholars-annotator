import React, { Component } from "react";
import PropTypes from "prop-types";

export class Annotationitem extends Component {
  render() {
    return (
      <div>
        <p>
          {this.props.annotation.value},{this.props.annotation.target}
        </p>
      </div>
    );
  }
}
Annotationitem.propTypes = {
  value: PropTypes.object.isRequired,
};

export default Annotationitem;

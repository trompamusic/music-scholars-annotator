import React from "react";
import AnnotationItem from "./AnnotationItem";
import PropTypes from "prop-types";
export class AnnotationList extends React.Component {
  render() {
    function onClick() {
      const test = document.getElementsByClassName("focus-");
      console.log(test);
    }
    return (
      <div className="listContainer">
        {this.props.entries.map((item) => {
          return (
            <div className={"focus-" + item["@id"]} onClick={onClick}>
              <AnnotationItem key={item["@id"]} annotation={item} />
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

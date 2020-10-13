import React from "react";
import AnnotationItem from "./AnnotationItem";
import PropTypes from "prop-types";
export class AnnotationList extends React.Component {
  render() {
    return (
      <div className="listContainer">
        {this.props.entries.map((item) => {
          return (
            <AnnotationItem
              key={item["@id"]}
              annotation={item}
              id={item["@id"]}
              target={item.anno.target}
            />
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

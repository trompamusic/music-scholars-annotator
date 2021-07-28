/* annotationList is the annotationItem container. Filters the annotations in order to render only the one associated to the specific measure selected */
/* they are ordered chronologically with sortedfilteredAnno and the onClick funciton is attacehd to the annotation item's body to highlight the annotated section of the score*/

import React from "react";

import AnnotationItem from "./AnnotationItem";
import {CardColumns} from "react-bootstrap-v5";

type AnnoListProps = {
  filteringEntries: any[];
  annotations: Annotation[];
};

export class AnnotationList extends React.Component<AnnoListProps> {
  state = {
    order: "desc",
  };

  dummy = () => {

  }

  render() {
    const { order } = this.state;
    // const filtering = this.props.annotations.filter((anno) =>
    //   this.props.filteringEntries.includes(anno["@id"])
    // );
    const filtering = this.props.annotations.filter((an) => {return an.motivation !== "replying"});
    const sortedFilteredAnno = filtering.sort((a, b) => {
      const isReverse = order === "asc" ? 1 : -1;
      return isReverse * a.created.localeCompare(b.created);
    });

    return (
      <CardColumns>
        {sortedFilteredAnno.map((item: Annotation) => {
          const replies = this.props.annotations.filter((a) => {return a["target"] === item["@id"]});
          return <AnnotationItem
            key={item["@id"]}
            annotation={{annotation: item, replies}}
            onAnnoReplyHandler={this.dummy}
            onMediaClick={this.dummy}
            replyAnnotationTarget={[]}
            showReplyHandler={this.dummy}
            areRepliesVisible={true}
            onRefreshClick={this.dummy}
          />
        })}
      </CardColumns>
    );
  }
}

export default AnnotationList;

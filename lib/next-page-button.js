import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { scoreNextPageStatic } from 'meld-clients-core/lib/actions/index';

class NextPageButton extends Component {
  constructor(props) {
    super(props);
    this.nextPage = this.nextPage.bind(this);
  }

  nextPage() {
    this.props.scoreNextPageStatic(this.props.uri, this.props.score.pageNum, this.props.score.MEI[this.props.uri]);
  }

  render() {
    let buttonContent = "buttonContent" in this.props ? this.props.buttonContent : "";
    return /*#__PURE__*/React.createElement("div", {
      className: "selectable-score-nextPageButton",
      onClick: this.nextPage
    }, buttonContent);
  }

}

function mapStateToProps({
  score
}) {
  return {
    score
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    scoreNextPageStatic
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NextPageButton);
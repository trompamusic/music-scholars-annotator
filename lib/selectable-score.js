import React, { Component } from 'react';
import { connect } from 'react-redux';
import Score from 'meld-clients-core/lib/containers/score';
import DragSelect from "dragselect/dist/DragSelect";
import ReactDOM from 'react-dom';
const defaultVrvOptions = {
  scale: 45,
  adjustPageHeight: 1,
  pageHeight: 2500,
  pageWidth: 2200,
  footer: "none",
  unit: 6
};
const defaultSelectorString = '.note';

class SelectableScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vrvOptions: "vrvOptions" in this.props ? this.props.vrvOptions : defaultVrvOptions,
      selectorString: "selectorString" in this.props ? this.props.selectorString : defaultSelectorString,
      scoreComponentLoaded: false
    };
    this.enableSelector = this.enableSelector.bind(this);
    this.scoreComponent = React.createRef();
    this.handleScoreUpdate = this.handleScoreUpdate.bind(this);
    this.observer = new MutationObserver(this.handleScoreUpdate);
  }

  handleScoreUpdate() {
    this.props.onScoreUpdate(ReactDOM.findDOMNode(this.scoreComponent.current).querySelector("svg"));
  }

  enableSelector() {
    if (!Object.keys(this.props.score.SVG).length) {
      console.log("Enable selector called before MEI has loaded!");
      return; // no MEI loaded yet
    }

    if (typeof this.state.selector !== "undefined") {
      this.state.selector.stop();
    }

    let selector = new DragSelect({
      selectables: document.querySelectorAll(this.state.selectorString),
      area: document.getElementsByClassName('score')[0],
      selectedClass: 'selected',
      onDragStartBegin: () => {
        document.body.classList.add('s-noselect');
      },
      callback: elements => {
        document.body.classList.remove('s-noselect');
        this.props.onSelectionChange(elements);
      }
    });
    this.setState({
      selector: selector
    });
  }

  componentDidMount() {
    // horrible hack to allow SVG to be loaded into DOM first
    // TODO fix using Mutation Observers
    setTimeout(() => {
      this.enableSelector();
    }, 1000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.scoreComponentLoaded && this.scoreComponent.current) {
      // first load of score component - start observing for DOM changes
      this.setState({
        "scoreComponentLoaded": true
      }, () => {
        this.observer.observe(ReactDOM.findDOMNode(this.scoreComponent.current).querySelector(".score"), {
          "childList": true
        });
      });
    }

    if (prevProps.score.latestRenderedPageNum !== this.props.score.latestRenderedPageNum) {
      // page turned, re-initialise selectors 
      this.enableSelector();
    }

    if (prevProps.selectorString !== this.props.selectorString) {
      // selector changed (e.g. from .note to .measure), re-initialise selectors
      this.setState({
        "selectorString": this.props.selectorString
      }, () => {
        this.enableSelector();
      });
    }
  }

  render() {
    console.log("Attempting to render score with uri: ", this.props.uri);
    return /*#__PURE__*/React.createElement(Score, {
      uri: this.props.uri,
      key: this.props.uri,
      options: this.state.vrvOptions,
      ref: this.scoreComponent
    });
  }

}

function mapStateToProps({
  score
}) {
  return {
    score
  };
}

export default connect(mapStateToProps)(SelectableScore);
import React, { Component } from "react";
import PropTypes from "prop-types";
import { parseMei } from "../search/SearchQuery";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

export default class FtempoSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchReady: false,
      selectedOption: null,
      meiVoiceQueryStrings: {},
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.counter !== prevProps.counter) {
      const mei = this.props.vrvToolkit.getMEI();
      const meiDoc = new DOMParser().parseFromString(mei, "text/xml");
      console.debug(meiDoc);
      // TODO: not working?
      if (meiDoc.documentElement.nodeName === "parsererror") {
        return "";
      }
      this.setState({ meiVoiceQueryStrings: parseMei(meiDoc) });
    }
  }

  buttonPressed = (event) => {
    event.preventDefault();
    this.setState({ searchReady: true });
    this.props.onButtonPress(event);
  };

  onValueChange = (event) => {
    this.setState({
      selectedOption: event.target.value,
      searchResults: undefined
    });
  };

  doSearch = () => {
    const selectedVoice = this.state.meiVoiceQueryStrings[
      this.state.selectedOption
    ];
    if (selectedVoice && selectedVoice.notes) {
      const query = { codestring: selectedVoice.notes };
      fetch("https://uk-dev-ftempo.rism.digital/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(query),
      })
        .then((response) => response.json())
        .then((data) => {
          this.setState({ searchResults: data });
        });
    }
  };

  render() {
    return (
      <div>
        <h3>Search using F-TEMPO (experimental)</h3>
        {!this.state.searchReady && (
          <button onClick={this.buttonPressed}>Show search options</button>
        )}
        {this.state.searchReady && this.state.meiVoiceQueryStrings && (
          <>
            <p>
              Search this score on F-TEMPO: select a single voice from this list as query
            </p>
            <ul>
              {Object.keys(this.state.meiVoiceQueryStrings).map((e) => {
                return (
                  <li key={e}>
                    <label>
                      <input
                        type="radio"
                        name="voice"
                        value={e}
                        id={"voice-" + e}
                        checked={this.state.selectedOption === e}
                        onChange={this.onValueChange}
                      />
                      {this.state.meiVoiceQueryStrings[e].label}
                    </label>
                  </li>
                );
              })}
              {/*<li><label><input type="radio" name="voice" value="all" checked={this.state.selectedOption === "all"} onChange={this.onValueChange} />All voices</label></li>*/}
            </ul>
            <button
              onClick={this.doSearch}
              disabled={!this.state.selectedOption}
            >
              Search
            </button>
          </>
        )}
        {this.state.searchResults && (
          <Accordion allowZeroExpanded>
            {this.state.searchResults.map((i) => {
              return (
                <AccordionItem key={i.id}>
                  <AccordionItemHeading>
                    <AccordionItemButton>{i.id}</AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <img
                      src={
                        "https://uk-dev-ftempo.rism.digital/img/jpg/" + i.id + ".jpg"
                      }
                      alt=""
                    />
                  </AccordionItemPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    );
  }
}

FtempoSearch.propTypes = {
  onButtonPress: PropTypes.func,
  vrvToolkit: PropTypes.any,
  counter: PropTypes.number,
};

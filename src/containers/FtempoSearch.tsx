import React, { MouseEvent, Component } from "react";
import { parseMei } from "../search/SearchQuery";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";

type FtempoSearchProps = {
  onButtonPress: (e: MouseEvent) => void;
  vrvToolkit: any;
  counter: number;
};

type FtempoSearchState = {
  searchReady: boolean;
  selectedOption?: string;
  meiVoiceQueryStrings: { [key: string]: { label: string; notes: string } };
  searchResults?: object[];
};

export default class FtempoSearch extends Component<
  FtempoSearchProps,
  FtempoSearchState
> {
  constructor(props: FtempoSearchProps) {
    super(props);
    this.state = {
      searchReady: false,
      selectedOption: undefined,
      meiVoiceQueryStrings: {},
      searchResults: undefined,
    };
  }

  componentDidUpdate(
    prevProps: Readonly<FtempoSearchProps>,
    prevState: Readonly<FtempoSearchState>,
    snapshot: any
  ) {
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

  buttonPressed = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    this.setState({ searchReady: true });
    this.props.onButtonPress(event);
  };

  onValueChange = (event: any) => {
    this.setState({
      selectedOption: event.target.value,
      searchResults: undefined,
    });
  };

  doSearch = () => {
    if (!this.state.selectedOption) {
      return;
    }
    const selectedVoice =
      this.state.meiVoiceQueryStrings[this.state.selectedOption];
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
      <div className="ftempoContainer">
        <h3>Search using F-TEMPO (experimental)</h3>
        {!this.state.searchReady && (
          <button onClick={this.buttonPressed}>Show search options</button>
        )}
        {this.state.searchReady && this.state.meiVoiceQueryStrings && (
          <>
            <p>
              Search this score on F-TEMPO: select a single voice from this list
              as query
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
            {this.state.searchResults.map((i: any) => {
              return (
                <AccordionItem key={i.id}>
                  <AccordionItemHeading>
                    <AccordionItemButton>{i.id}</AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <img
                      src={
                        "https://uk-dev-ftempo.rism.digital/img/jpg/" +
                        i.id +
                        ".jpg"
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

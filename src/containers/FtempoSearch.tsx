import React, { useState } from "react";
import { parseMei } from "../search/SearchQuery";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { Button, Form } from "react-bootstrap-v5";

interface FtempoSearchProps {
  vrvToolkit: any;
}

const FtempoSearch = (props: FtempoSearchProps) => {
  const mei = props.vrvToolkit.getMEI();
  const meiDoc = new DOMParser().parseFromString(mei, "text/xml");
  const meiVoiceQueryStrings = parseMei(meiDoc);
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [searchResults, setSearchResults] = useState<object[]>([]);

  const doSearch = () => {
    if (!selectedOption) {
      return;
    }
    const selectedVoice = meiVoiceQueryStrings[selectedOption];
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
          setSearchResults(data);
        });
    }
  };

  return (
    <div className="ftempoContainer">
      <h3>Search using F-TEMPO (experimental)</h3>
      {meiVoiceQueryStrings && (
        <>
          <p>
            Search this score on F-TEMPO: select a single voice from this list
            as query
          </p>
          <ul>
            {Object.keys(meiVoiceQueryStrings).map((e) => {
              return (
                <Form.Check
                  key={e}
                  type="radio"
                  name="voice"
                  value={e}
                  id={"voice-" + e}
                  checked={selectedOption === e}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    setSearchResults([]);
                  }}
                  label={meiVoiceQueryStrings[e].label}
                />
              );
            })}
            {/*<li><label><input type="radio" name="voice" value="all" checked={this.state.selectedOption === "all"} onChange={this.onValueChange} />All voices</label></li>*/}
          </ul>
          <Button
            variant="success"
            onClick={doSearch}
            disabled={!selectedOption}
          >
            Search
          </Button>
        </>
      )}
      {searchResults.length > 0 && (
        <Accordion allowZeroExpanded>
          {searchResults.map((i: any) => {
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
};

export default FtempoSearch;

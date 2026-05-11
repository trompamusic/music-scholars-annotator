import React, { useMemo, useState } from "react";
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
  const meiVoiceQueryStrings = useMemo(() => {
    const mei = props.vrvToolkit.getMEI();
    const doc = new DOMParser().parseFromString(mei, "text/xml");
    return parseMei(doc);
  }, [props.vrvToolkit]);

  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    undefined
  );
  const [searchResults, setSearchResults] = useState<object[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doSearch = () => {
    if (!selectedOption) {
      return;
    }
    const selectedVoice = meiVoiceQueryStrings[selectedOption];
    if (!selectedVoice || !selectedVoice.notes) {
      setError("This voice has no notes to query.");
      setSearchResults(null);
      return;
    }
    setError(null);
    setLoading(true);
    setSearchResults(null);
    fetch("https://search.f-tempo.org/api/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ codestring: selectedVoice.notes }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setSearchResults(data);
      })
      .catch((err) => {
        console.error("F-TEMPO search failed", err);
        const detail = err?.message ? ` ${err.message}` : "";
        setError(`Error when performing search. Please try again later.${detail}`);
      })
      .finally(() => {
        setLoading(false);
      });
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
            {Object.keys(meiVoiceQueryStrings).map((key) => {
              return (
                <Form.Check
                  key={key}
                  type="radio"
                  name="voice"
                  value={key}
                  id={"voice-" + key}
                  checked={selectedOption === key}
                  onChange={(e) => {
                    setSelectedOption(e.target.value);
                    setSearchResults(null);
                    setError(null);
                  }}
                  label={meiVoiceQueryStrings[key].label}
                />
              );
            })}
          </ul>
          <Button
            variant="success"
            onClick={doSearch}
            disabled={!selectedOption || loading}
          >
            {loading ? "Searching…" : "Search"}
          </Button>
        </>
      )}
      {error && <p style={{ color: "#b00020", marginTop: "1em" }}>{error}</p>}
      {searchResults && searchResults.length === 0 && !loading && !error && (
        <p style={{ marginTop: "1em" }}>No matching scores found.</p>
      )}
      {searchResults && searchResults.length > 0 && (
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
                      "https://search.f-tempo.org/img/jpg/" + i.id + ".jpg"
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

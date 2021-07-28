import React, { useState } from "react";
import MultiModalComponent, {
  SearchConfig,
  SearchResult,
} from "trompa-multimodal-component";
import { Button, Col, Form, Row } from "react-bootstrap-v5";
import { useHistory } from "react-router-dom";
import gql from "graphql-tag";

const CE_URL = "https://api.trompamusic.eu";

const MUSIC_COMPOSITION_FRAGMENT = gql`
  fragment MusicCompositionFrag on MusicComposition {
    identifier
    contributor
    name
    source
    title
    composer {
      name
    }
    workExample(filter: { encodingFormat: "application/mei+xml" }) {
      ... on MediaObject {
        identifier
        source
        contentUrl
        encodingFormat
      }
    }
  }
`;

const EARLY_MUSIC_WORKS = gql`
  ${MUSIC_COMPOSITION_FRAGMENT}
  query ($query: String!) {
    allResults: ItemList(identifier: "e91489d7-a776-40dd-8abf-0c934922bd99") {
      identifier
      name
      itemListElement(filter: { name_regexp: $query }) {
        __typename
        ...MusicCompositionFrag
      }
    }
  }
`;

class FtempoCatalogueSearchType {
  name = "MusicComposition";

  static filters = [];

  static preprocessQuery = (query: string) => {
    return `(?i).*${query}.*`;
  };

  static searchAllQuery = EARLY_MUSIC_WORKS;

  static searchQuery = gql`
    ${MUSIC_COMPOSITION_FRAGMENT}
    query ($filter: _ThingInterfaceFilter) {
      results: ItemList(identifier: "e91489d7-a776-40dd-8abf-0c934922bd99") {
        identifier
        name
        itemListElement(filter: $filter, first: 50) {
          ...MusicCompositionFrag
        }
      }
    }
  `;

  static processSearchResult = (result: any) => {
    // Find the itemListElements of this ItemList, instead of a list of ItemLists
    if (Array.isArray(result) && result[0]) {
      return result[0].itemListElement;
    }

    return [];
  };
}

const searchConfig = new SearchConfig({
  searchTypes: [FtempoCatalogueSearchType],
});

const renderSearchResult = (
  type: string,
  item: any,
  onClick: (item: any) => void
) => {
  if (type === "MusicComposition") {
    let composer = null;
    if (item.composer.length > 0) {
      composer = item.composer[0].name;
    }
    return (
      <SearchResult
        variant="default"
        type="Composition"
        heading={composer}
        title={item.name || item.title}
        source={item.source}
        onClick={() => onClick(item)}
      />
    );
  }
  return (
    <SearchResult
      title={item.title}
      variant="default"
      onClick={() => onClick(item)}
    />
  );
};

const sampleScores = [
  {
    name: "Mahler - Symphony No. 4 (Piano 4 hands version)",
    url: "https://raw.githubusercontent.com/trompamusic-encodings/Mahler_Symphony_No4_Doblinger-4hands/master/Mahler_No4_1-Doblinger-4hands.mei",
  },
  {
    name: "Orlando di Lasso - Bon jour, mon coeur (from https://cpdl.org)",
    url: "https://trompa-mtg.upf.edu/data/meiconversion/79f3e3c5-29b7-424f-9144-4cc6d720c206.mei",
  },
];

export default function ResourceLoader() {
  const [userUrl, setUserUrl] = useState("");
  const history = useHistory();

  const loadUrl = (url: string) => {
    history.push({
      pathname: "/annotate",
      search: `?resource=${url}`,
    });
  };

  return (
    <Row>
      <Col sm={2} />
      <Col>
        <p>&nbsp;</p>
        <h2>Load a score</h2>
        <h3>Use a sample score</h3>
        <ul>
          {sampleScores.map((score) => {
            return (
              <li key={score.url}>
                <a
                  href={`/annotate?resource=${score.url}`}
                  onClick={(e) => {
                    e.preventDefault();
                    loadUrl(score.url);
                  }}
                >
                  {score.name}
                </a>
              </li>
            );
          })}
        </ul>
        <p>or</p>
        <h3>Load an MEI URL</h3>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (userUrl && userUrl !== "") {
              loadUrl(userUrl);
            }
          }}
        >
          <Row>
            <Col sm={11}>
              <Form.Control
                type="input"
                placeholder="Enter URL"
                value={userUrl}
                onChange={(e) => setUserUrl(e.target.value)}
              />
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={() => {
                  if (userUrl && userUrl !== "") {
                    loadUrl(userUrl);
                  }
                }}
              >
                Load
              </Button>
            </Col>
          </Row>
        </Form>
        <p>or</p>
        <h3>Search the TROMPA early music database</h3>
        <MultiModalComponent
          config={searchConfig}
          uri={CE_URL}
          renderSearchResult={renderSearchResult}
          placeholderText="Search for a composition..."
          onResultClick={(node: any) => {
            if (node.workExample.length) {
              loadUrl(node.workExample[0].contentUrl);
            }
          }}
        />
      </Col>
      <Col sm={2} />
    </Row>
  );
}

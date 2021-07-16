import React, {MouseEvent, Component, FunctionComponent, FormEvent, ChangeEvent} from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import searchIcon from "../graphics/search-solid.svg";

const EARLY_MUSIC_WORKS = gql`
  query earlyMusicWorks($query: String!) {
    ItemList(identifier: "e91489d7-a776-40dd-8abf-0c934922bd99") {
      identifier
      name
      itemListElement(filter: { name_regexp: $query }) {
        __typename
        ... on MusicComposition {
          identifier
          contributor
          name
          source
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
      }
    }
  }
`;

type SearchResults = {
  query: string
  onSelect: (event: MouseEvent<HTMLAnchorElement>) => void,
}

const SearchResults: FunctionComponent<SearchResults> = (props) => {
  const query = `(?i).*${props.query}.*`;
  const { loading, error, data } = useQuery(EARLY_MUSIC_WORKS, {
    variables: { query: query },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  console.debug(data);

  const works = data.ItemList;
  if (!works || !works.length) {
    return <div />;
  }
  console.debug(works);
  const compositions = works[0].itemListElement;
  if (!compositions || !compositions.length) {
    return <div />;
  }
  console.debug(compositions);
  return (
    <div>
      <p>Results:</p>
      <ul>
        {compositions.map((item: any) => {
          const id = item.identifier;
          const title = item.name;
          const contributor = item.contributor;
          const composer = item.composer[0].name;
          const workExample = item.workExample;
          if (workExample && workExample.length) {
            return (
              <li key={id}>
                <a href={workExample[0].source} onClick={props.onSelect}>
                  {composer} - {title} (from {contributor})
                </a>
              </li>
            );
          } else {
            return "";
          }
        })}
      </ul>
    </div>
  );
}


type FileSelectorProps = {
  defaultUrl: string,
  placeholder: string,
  onSelect: (value: string) => void
};

type FileSelectorState = {
  defaultValue: string
  fieldValue: string
  searchValue: string
  showResults: boolean
  searchResults: object
};

export default class FileSelector extends Component<FileSelectorProps, FileSelectorState> {
  constructor(props: FileSelectorProps) {
    super(props);
    this.state = {
      // default file to load
      defaultValue: this.props.defaultUrl,
      // react controlled component for url field
      fieldValue: "",
      // react controlled component for search field
      searchValue: "",
      showResults: false,
      searchResults: {},
    };
  }

  handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ fieldValue: event.target.value });
  };

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.onSelect(this.state.fieldValue || this.state.defaultValue);
  };

  handleSearch = (event: any) => {
    event.preventDefault();
    this.setState({ showResults: true });
  };

  handleSearchResultSelection = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    this.props.onSelect((event.target as HTMLAnchorElement).href);
  };

  render() {
    return (
      <div>
        <p>Select your MEI file:</p>
        <form onSubmit={(e) => this.handleSubmit}>
          <input
            type="text"
            onChange={this.handleChange}
            value={this.state.fieldValue}
            placeholder="https://..."
            className="sizedTextBox"
          />

          <input
            title="click to render the linked MEI file"
            className="MEIButton"
            type="submit"
            value="render"
          />
        </form>
        <p>Or search for an item from the TROMPA database</p>
        <form onSubmit={this.handleSearch} className="hide-submit">
          <input
            type="text"
            onChange={this.handleSearchChange}
            value={this.state.searchValue}
            placeholder="search for a work name"
            className="sizedTextBox"
          />
          <label>
            <input
              title="search for a work name"
              className="MEIButton"
              type="submit"
            />
            <img src={searchIcon} alt="zoom in" className="searchIcon" />
          </label>
        </form>
        {this.state.showResults && (
          <SearchResults
            query={this.state.searchValue}
            onSelect={this.handleSearchResultSelection}
          />
        )}
      </div>
    );
  }
}

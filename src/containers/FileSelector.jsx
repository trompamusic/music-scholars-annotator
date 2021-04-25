import React, {Component} from "react";
import PropTypes from "prop-types";
import {useQuery} from "@apollo/client";
import {gql} from "@apollo/client/core";

const EARLY_MUSIC_WORKS = gql`
query earlyMusicWorks($query: String!) {
  ItemList(identifier:"e91489d7-a776-40dd-8abf-0c934922bd99") {
    identifier
    name
    itemListElement(filter:{name_regexp:$query}) {
      __typename
      ... on MusicComposition {
        identifier
        contributor
        name
        source
        composer {
          name
        }
        workExample(filter: {encodingFormat:"application/mei+xml"}) {
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

function SearchResults(props) {

    const query = `(?i).*${props.query}.*`
    const { loading, error, data } = useQuery(EARLY_MUSIC_WORKS, {variables: {query: query}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    console.debug(data)

    const works = data.ItemList;
    if (!works || !works.length) {
        return <div/>
    }
    console.debug(works)
    const compositions = works[0].itemListElement;
    if (!compositions || !compositions.length) {
        return <div/>
    }
    console.debug(compositions)
    return (
        <div>
            <p>Results:</p>
            <ul>
                {compositions.map(function(item) {
                    const id = item.identifier
                    const title = item.name;
                    const contributor = item.contributor;
                    const composer = item.composer[0].name;
                    const workExample = item.workExample;
                    if (workExample && workExample.length) {
                        return <li key={id}>
                            <a href={workExample[0].source} onClick={props.onSelect}>{composer} - {title} (from {contributor})</a>
                        </li>
                    } else {
                        return ""
                    }
                })}
            </ul>
        </div>
    )
}

SearchResults.props = {
    query: PropTypes.string,
    onSelect: PropTypes.func
}

export default class FileSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // default file to load
            defaultValue: this.props.defaultUrl,
            // react controlled component for url field
            fieldValue: '',
            // react controlled component for search field
            searchValue: '',
            showResults: false,
            searchResults: {}
        }
    }

    handleChange = event => {
        this.setState({fieldValue: event.target.value});
    }

    handleSearchChange = event => {
        this.setState({searchValue: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.onSelect(this.state.fieldValue || this.state.defaultValue);
    }

    handleSearch = event => {
        event.preventDefault();
        this.setState({showResults: true})
    }

    handleSearchResultSelection = event => {
        event.preventDefault();
        this.props.onSelect(event.target.attributes.href.value);
    }

    render() {
        return (
            <div>
                <p>Select your MEI file:</p>
                <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    onChange={this.handleChange}
                    value={this.state.fieldValue}
                    placeholder={this.props.placeholder}
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
                <form onSubmit={this.handleSearch}>
                    <input
                        type="text"
                        onChange={this.handleSearchChange}
                        value={this.state.searchValue}
                        placeholder="search for a work name"
                        className="sizedTextBox"
                    />

                    <input
                        title="search for a work name"
                        className="MEIButton"
                        type="submit"
                        value="search"
                    />
                </form>
                {this.state.showResults &&
                    <SearchResults query={this.state.searchValue} onSelect={this.handleSearchResultSelection}/>
                }

            </div>
        );
    }
}

FileSelector.propTypes = {
    defaultUrl: PropTypes.string,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func
}
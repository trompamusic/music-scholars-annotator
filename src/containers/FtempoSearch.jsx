import React, {Component} from "react";
import PropTypes from "prop-types";
import {parseMei} from "../search/SearchQuery";


export default class FtempoSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchReady: false,
            selectedOption: null,
            meiQueryOptions: {},
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.counter !== prevProps.counter) {
            const mei = this.props.vrvToolkit.getMEI();
            const meiDoc = new DOMParser().parseFromString(mei, "text/xml");
            console.debug(meiDoc)
            // TODO: not working?
            if (meiDoc.documentElement.nodeName === "parsererror") {
                return ""
            }
            this.setState({meiQueryOptions: parseMei(meiDoc)})
        }
    }

    buttonPressed = (event) => {
        event.preventDefault();
        this.setState({searchReady: true});
        this.props.onButtonPress(event);
    }

    onValueChange = (event) => {
        this.setState({
            selectedOption: event.target.value
        });
    }

    doSearch = () => {
        const query = {codestring: this.state.meiQueryOptions[this.state.selectedOption].notes}
        fetch('http://uk-dev-ftempo.rism.digital/api/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(query),
        }).then(response => response.json()).then(data => {
            console.debug(`search results! ${data}`)
            this.setState({searchResults: data})
        })
    }

    render() {
        return (
            <div>
                <h3>Search using FTempo</h3>
                {!this.state.searchReady && <button onClick={this.buttonPressed}>Show search options</button>}
                {this.state.searchReady && this.state.meiQueryOptions &&
                <><p>Search this score on FTempo, either a single voice or all voices</p>
                <ul>
                    {Object.keys(this.state.meiQueryOptions).map((e) => {
                        return <li key={e}>
                            <label><input type="radio" name="voice" value={e} id={"voice-" + e} checked={this.state.selectedOption === e} onChange={this.onValueChange}/>
                                {this.state.meiQueryOptions[e].label}</label></li>
                    })
                    }
                    <li><label><input type="radio" name="voice" value="all" checked={this.state.selectedOption === "all"} onChange={this.onValueChange} />All voices</label></li>
                </ul>
                    <button onClick={this.doSearch} disabled={!this.state.selectedOption}>Search</button>
                </>
                }
                {this.state.searchResults && this.state.searchResults.map((i) => {
                    return <li key={i.id}>{i.id}</li>
                })
                }
            </div>
        )
    }
}

FtempoSearch.propTypes = {
    onButtonPress: PropTypes.func,
    vrvToolkit: PropTypes.any,
    counter: PropTypes.number
}
import React, {Component} from "react";
import PropTypes from "prop-types";

export default class FileSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultValue: this.props.defaultUrl,
            fieldValue: ''
        }
    }

    handleChange = event => {
        this.setState({fieldValue: event.target.value});
    }

    handleSubmit = event => {
        event.preventDefault();
        this.props.onSelect(this.state.fieldValue || this.state.defaultValue);
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
            </div>
        );
    }
}

FileSelector.propTypes = {
    defaultUrl: PropTypes.string,
    placeholder: PropTypes.string,
    onSelect: PropTypes.func
}
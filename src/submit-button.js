import React, { Component } from 'react';
import { connect } from 'react-redux' ;
import { bindActionCreators } from 'redux';
import { postAnnotation } from 'meld-clients-core/lib/actions/index';


class SubmitButton extends Component { 
  constructor(props) { 
    super(props);
    this.post = this.post.bind(this);
  }

  post() { 
    this.props.postAnnotation(
      this.props.submitUri,
      "",
      this.props.submitHandler()
    )
  }

  render() { 
    const buttonContent = "buttonContent" in this.props
      ? this.props.buttonContent
      : "Submit";
    return(
      <div className="selectable-score-postButton" onClick={this.post}>
        { buttonContent }
      </div>
    )
  }
}

function mapStateToProps() { 
  return {}
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( { 
    postAnnotation,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitButton);

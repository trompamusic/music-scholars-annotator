import React from "react";
class PlaylistItem extends React.Component {
  render() {
    return (
      <div className="rootAnno playlistItem">
        {this.props.anno.body[0].seconds}
        <iframe
          src={this.props.anno.body[0].value}
          frameBorder="0"
          width="300"
          height="60"
        />
      </div>
    );
  }
}

export default PlaylistItem;

import React from "react";
import PlaylistItem from "./playlistItem";
class renditionsPlaylist extends React.Component {
  render() {
    //let entries = this.props.allEntries;
    return (
      <div>
        <button className="renditionButton">show renditions playlist</button>
        <div>
          {this.props.allEntries.map((anno) => {
            const motivation = anno.motivation;
            console.log(motivation);
            if (motivation === "trompa:playlist") {
              return (
                <div key={anno["@id"]}>
                  <PlaylistItem anno={anno} />
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  }
}

export default renditionsPlaylist;

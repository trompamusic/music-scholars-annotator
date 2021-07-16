import React, {FunctionComponent, useState} from "react";
import PlaylistItem from "./playlistItem";


type RenditionsPlaylistProps = {
  allEntries: any[]
  onRefreshClick: () => null
}

const RenditionsPlaylist :FunctionComponent<RenditionsPlaylistProps> = (props) => {
  const [visible, setVisible] = useState(false);

    return (
      <div>
        <button className="renditionButton" onClick={() => {
          setVisible(!visible)
        }}>
          Show recordings playlist
        </button>
        <div className={`playlist ${!visible ? 'hidden' : ''}`}>
          {props.allEntries.map((anno) => {
            const motivation = anno.motivation;
            return (
              motivation === "trompa:playlist" && (
                <div key={anno["@id"]}>
                  <PlaylistItem
                    annotation={anno}
                    onRefreshClick={props.onRefreshClick}
                  />
                </div>
              )
            );
          })}
        </div>
      </div>
    );
}

export default RenditionsPlaylist;

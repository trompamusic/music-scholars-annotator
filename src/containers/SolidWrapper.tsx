import React, { useState } from "react";

import SelectableScoreApp from "./SelectableScoreApp";

const SolidWrapper = (props: {resourceUri: string}) => {
    const [userInput, setUserInput] = useState("private/");

    return (
        <div id="authWrapper">
            <p>Specify the annotation container path inside your Pod:</p>
            <div>
                <input
                    title="enter your preferred POD folder"
                    type="text"
                    placeholder="private/"
                    onChange={(e) => {
                        setUserInput(e.target.value ? e.target.value : "private/");
                    }}
                    className="sizedTextBox"
                />
            </div>
                <SelectableScoreApp
                    resourceUri={props.resourceUri}
                    submitUri={userInput}
                />
        </div>
    );
};

export default SolidWrapper;

import React, { useState } from "react";

import SelectableScoreApp from "./SelectableScoreApp";
import {useSession} from "@inrupt/solid-ui-react";

const SolidWrapper = (props: {resourceUri: string}) => {
    const [userInput, setUserInput] = useState("private/");
    const {session} = useSession();

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
                    solidSession={session}
                />
        </div>
    );
};

export default SolidWrapper;

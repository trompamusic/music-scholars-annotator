import React, { ChangeEvent, useState } from "react";

import SelectableScoreApp from "./SelectableScoreApp";
import {useHistory, useLocation} from "react-router-dom";

const SolidWrapper = () => {
    const [userInput, setUserInput] = useState("private/");
    const userPOD = 'p';
    const userId = 'i';

    const history = useHistory();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const resource = query.get('resource');

    if (!resource) {
        history.push('/new');
    }

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
                    resourceUri={resource!}
                    podUri={userPOD.toString()}
                    submitUri={`${userPOD}` + userInput}
                    userId={userId ? userId.toString() : ""}
                />
        </div>
    );
};

export default SolidWrapper;

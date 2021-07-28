import { Route, Switch, useLocation } from "react-router-dom";
import ResourceLoader from "./ResourceLoader";
import SolidWrapper from "./SolidWrapper";
import React from "react";
import HelpPage from "./HelpPage";

/**
 * Check if the user is logged in with a solid session. If not, show a message informing
 * them that they need to be logged in.
 * If the are logged in, route to resource chooser or the annotator.
 */
const AnnotatorRouter = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const resource = query.get("resource");

  return (
    <Switch>
      <Route exact path="/">
        <ResourceLoader />
      </Route>
      <Route exact path="/annotate">
        <SolidWrapper resourceUri={resource!} />
      </Route>
      <Route exact path="/help">
        <HelpPage />
      </Route>
    </Switch>
  );
};

export default AnnotatorRouter;

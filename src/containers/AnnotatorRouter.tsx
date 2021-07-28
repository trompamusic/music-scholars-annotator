import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
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
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const resource = query.get("resource");

  // Can't annotate with no resource, redirect to /new
  if (location.pathname === "/annotate" && !resource) {
    history.push("/new");
  }

  return (
    <Switch>
      <Route exact path="/">
        <Redirect to="/new" />
      </Route>
      <Route exact path="/new">
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

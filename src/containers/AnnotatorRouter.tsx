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
import { useSession } from "@inrupt/solid-ui-react";
import { Col, Row } from "react-bootstrap-v5";
import HelpPage from "./HelpPage";
import AnnotationList from "../annotations/AnnotationList";
/**
 * Check if the user is logged in with a solid session. If not, show a message informing
 * them that they need to be logged in.
 * If the are logged in, route to resource chooser or the annotator.
 */
const AnnotatorRouter = () => {
  const { session } = useSession();

  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const resource = query.get("resource");

  // Can't annotate with no resource, redirect to /new
  if (location.pathname === "/annotate" && !resource) {
    history.push("/new");
  }

  /*
  if (!session.info.isLoggedIn) {
    return (
      <Row>
        <Col />
        <Col xs={5}>Log in to get started</Col>
        <Col />
      </Row>
    );
  }
   */

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
      <Route exact path="/list">
        <TestAnnoList />
      </Route>
    </Switch>
  );
};

const TestAnnoList = () => {
  const annotations: Annotation[] = require('./test_annos.json');
  return <Row>
    <Col>
      <AnnotationList filteringEntries={[]} annotations={annotations} />
    </Col>
    <Col />
  </Row>
}

export default AnnotatorRouter;

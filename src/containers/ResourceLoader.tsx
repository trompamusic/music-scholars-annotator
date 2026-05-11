import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap-v5";
import { useHistory } from "react-router-dom";

const sampleScores = [
  {
    name: "Mahler - Symphony No. 4 (Piano 4 hands version)",
    url: "https://raw.githubusercontent.com/trompamusic-encodings/Mahler_Symphony_No4_Doblinger-4hands/master/Mahler_No4_1-Doblinger-4hands.mei",
  },
  {
    name: "Orlando di Lasso - Bon jour, mon coeur (from https://cpdl.org)",
    url: "https://trompa-mtg.upf.edu/data/meiconversion/79f3e3c5-29b7-424f-9144-4cc6d720c206.mei",
  },
];

export default function ResourceLoader() {
  const [userUrl, setUserUrl] = useState("");
  const history = useHistory();

  const loadUrl = (url: string) => {
    history.push({
      pathname: "/annotate",
      search: `?resource=${url}`,
    });
  };

  return (
    <Row>
      <Col sm={2} />
      <Col>
        <p>&nbsp;</p>
        <h2>Load a score</h2>
        <h3>Use a sample score</h3>
        <ul>
          {sampleScores.map((score) => {
            return (
              <li key={score.url}>
                <a
                  href={`/annotate?resource=${score.url}`}
                  onClick={(e) => {
                    e.preventDefault();
                    loadUrl(score.url);
                  }}
                >
                  {score.name}
                </a>
              </li>
            );
          })}
        </ul>
        <p>or</p>
        <h3>Load an MEI URL</h3>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            if (userUrl && userUrl !== "") {
              loadUrl(userUrl);
            }
          }}
        >
          <Row>
            <Col sm={11}>
              <Form.Control
                type="input"
                placeholder="Enter URL"
                value={userUrl}
                onChange={(e) => setUserUrl(e.target.value)}
              />
            </Col>
            <Col>
              <Button
                variant="primary"
                type="submit"
                onClick={() => {
                  if (userUrl && userUrl !== "") {
                    loadUrl(userUrl);
                  }
                }}
              >
                Load
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col sm={2} />
    </Row>
  );
}

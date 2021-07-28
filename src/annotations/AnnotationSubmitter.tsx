import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ReactComponent as ArrowAltToTop } from "../graphics/arrow-alt-to-top-regular.svg";
import { ReactComponent as FileImport } from "../graphics/file-import-regular.svg";
import { Form } from "react-bootstrap-v5";

interface AnnotationSubmitterProps {
  uri: string;
  creator: string;
  selection: Element[];
  saveAnnotation: (annotation: Annotation) => void;
  onRefreshClick: () => void;
}

interface InputProps {
  body: any;
  setBody: (body: any) => void;
}

/**
 * An input for an `oa:describing` annotation
 * @param onBodyChange a callback to set the body of an annotation with this input
 */
const DescribingInput = ({ body, setBody }: InputProps) => {
  return (
    <textarea
      className="textArea"
      id="annotationContent"
      value={body.value}
      placeholder="Add your annotation..."
      onChange={(e) => {
        setBody({ id: uuidv4(), type: "TextualBody", value: e.target.value });
      }}
    />
  );
};

const CueImageInput = ({ body, setBody }: InputProps) => {
  return (
    <textarea
      className="textArea"
      id="annotationContent"
      value={body.value}
      placeholder="Insert your image link..."
      onChange={(e) => {
        setBody({ id: e.target.value });
      }}
    />
  );
};

// TODO: This has the same body as CueImageInput, could be reused?
const LinkingInput = ({ body, setBody }: InputProps) => {
  return (
    <textarea
      className="textArea"
      id="annotationContent"
      value={body.value}
      placeholder="Insert your URI link..."
      onChange={(e) => {
        setBody({ id: e.target.value });
      }}
    />
  );
};

const CueMediaInput = ({ body, setBody }: InputProps) => {
  const value = body.value || "";
  const seconds = body.seconds || "";

  return (
    <div>
      <input
        type="text"
        value={value}
        name="value"
        placeholder="enter link here"
        onChange={(e) => {
          setBody({ id: e.target.value + "#t=" + seconds });
        }}
        className="sizedTextBox"
      />
      <span> jump to: </span>
      <input
        type="text"
        pattern="[0-9]"
        placeholder="seconds"
        name="seconds"
        value={seconds}
        onChange={(e) => {
          setBody({ id: value + "#t=" + e.target.value });
        }}
        className="sizedTextBox"
      />
    </div>
  );
};

const PlaylistInput = ({ body, setBody }: InputProps) => {
  const value = body.value || "";
  const title = body.title || "";
  let id = body.id;
  if (!id) {
    id = uuidv4();
  }

  return (
    <div>
      <input
        type="text"
        value={value}
        name="value"
        placeholder="enter link here"
        onChange={(e) => {
          setBody({ id, type: "TextualBody", title, value: e.target.value });
        }}
        className="sizedTextBox"
      />
      <span> with title: </span>
      <input
        type="text"
        placeholder="title"
        name="seconds"
        value={title}
        onChange={(e) => {
          setBody({ id, type: "TextualBody", title: e.target.value, value });
        }}
        className="sizedTextBox"
      />
    </div>
  );
};

const AnnotationSubmitter = (props: AnnotationSubmitterProps) => {
  const [motivation, setMotivation] = useState("describing");
  const [body, setBody] = useState({});

  const saveAnnotation = () => {
    const annotation = {
      "@context": "https://www.w3.org/ns/anno.jsonld",
      target: props.selection.map((elem: Element) => {
        return { id: props.uri + "#" + elem.getAttribute("id") };
      }), //this takes the measure id selected by the user
      type: "Annotation",
      motivation: motivation,
      body: [body],
      created: new Date().toISOString(),
      creator: props.creator,
    } as Annotation;
    if (!bodyEmpty()) {
      props.saveAnnotation(annotation);
      setBody({});
    } else {
      console.log("annotation is empty, not saving");
    }
  };

  const annotationTypeDefinitions = [
    {
      value: "Describing",
      motivation: "describing",
      title: "links external resources to the annotation",
    },
    {
      value: "Linking",
      motivation: "linking",
      title: "adds a textual content to the annotation",
    },
    {
      value: "Cue Media",
      motivation: "trompa:cueMedia",
      title: "links a media content to the annotation",
    },
    {
      value: "Image",
      motivation: "trompa:cueImage",
      title: "links an image content to the annotation",
    },
    {
      value: "Playlist",
      motivation: "trompa:playlist",
      title: "adds a textual content to the annotation",
    },
  ];

  const bodyEmpty = () => {
    return Object.keys(body).length === 0 && body.constructor === Object;
  };

  return (
    <div className="App">
      <div className="container__app">
        <h3>Annotation type</h3>
        {annotationTypeDefinitions.map((d) => {
          return (
            <Form.Check
              inline
              key={d.motivation}
              id={`annotationType-${d.motivation}`}
              type="radio"
              label={d.value}
              name="annotationType"
              value={d.value}
              onChange={() => {
                setMotivation(d.motivation);
                setBody({});
              }}
              checked={motivation === d.motivation}
            />
          );
        })}

        <div className="addAnnotations">
          {motivation === "describing" && (
            <DescribingInput body={body} setBody={setBody} />
          )}
          {motivation === "linking" && (
            <LinkingInput body={body} setBody={setBody} />
          )}
          {motivation === "trompa:cueMedia" && (
            <CueMediaInput body={body} setBody={setBody} />
          )}
          {motivation === "trompa:cueImage" && (
            <CueImageInput body={body} setBody={setBody} />
          )}
          {motivation === "trompa:playlist" && (
            <PlaylistInput body={body} setBody={setBody} />
          )}
          <button
            className={
              bodyEmpty() ? "disabledSubmitButton" : "enabledSubmitButton"
            }
            title="click to post your annotation to your solid POD"
            onClick={saveAnnotation}
          >
            {!bodyEmpty() && (
              <>
                <ArrowAltToTop style={{ width: "1em", height: "1em" }} /> Submit
                to your Solid POD
              </>
            )}
            {bodyEmpty() && (
              <>
                <FileImport style={{ width: "1em", height: "1em" }} /> Write
                something to begin...
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnotationSubmitter;

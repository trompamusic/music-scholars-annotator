/* annotation submitter takes the handlerArgs passed from the addAnnotaiton script and builds the jsonLd structure of each annotation based on its motivation */
/* it also renders the radio button array to selecte the annotation motivation  */
import React, {ChangeEvent, Component} from "react";
import { v4 as uuidv4 } from "uuid";
import AddAnnotation from "./AddAnnotation";

export type AnnotationSolidResponse = any

type AnnotationSubmitterProps = {
  annotationType: string
  uri: string
  submitUri: string
  placeholder: string
  selectorString: string
  buttonContent: string
  onAnnoTypeChange: (e: ChangeEvent<HTMLInputElement>) => void
  creator: string
  replyAnnotationTargetId: string
  selection: Element[]
  onResponse: (response: AnnotationSolidResponse) => void
  onRefreshClick: () => void
}

export class AnnotationSubmitter extends Component<AnnotationSubmitterProps, {}> {
  private textArea = React.createRef<AddAnnotation>();

  submitHandler = (handlerArgs: any) => {
    if (this.textArea.current) {
      this.textArea.current.wipeState();
    }
    //adds different annotations based on selection
    //let replyAnnotationTargetId = this.props.replyAnnotationTargetId;
    let value = handlerArgs.value;
    let seconds = handlerArgs.seconds;

    switch (this.props.annotationType) {
      case "describing":
        return {
          "@context": "https://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem: Element) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: uuidv4(), type: "TextualBody", value }], //this takes the user input
          motivation: "describing",
          created: new Date().toISOString(),
          creator: this.props.creator,
        };

      case "linking":
        return {
          "@context": "https://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem: Element) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: value }], //this takes the user URI
          motivation: "linking",
          created: new Date().toISOString(),
          creator: this.props.creator,
        };

      case "cueMedia":
        return {
          "@context": "https://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem: Element) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: value + "#t=" + seconds }], //this takes the user link + time offest
          motivation: "trompa:cueMedia",
          created: new Date().toISOString(),
          creator: this.props.creator,
        };

      case "image":
        return {
          "@context": "https://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem: Element) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: value }], //this takes the user image link
          motivation: "trompa:cueImage",
          created: new Date().toISOString(),
          creator: this.props.creator,
        };

      case "playlist":
        return {
          "@context": "https://www.w3.org/ns/anno.jsonld",
          target: this.props.selection.map((elem: Element) => {
            return { id: this.props.uri + "#" + elem.getAttribute("id") };
          }), //this takes the measure id selected by the user
          type: "Annotation",
          body: [{ id: uuidv4(), type: "TextualBody", seconds, value }], //this takes the user input
          motivation: "trompa:playlist",
          created: new Date().toISOString(),
          creator: this.props.creator,
        };

      case "replying":
        return {
          "@context": "https://www.w3.org/ns/anno.jsonld",
          target: this.props.replyAnnotationTargetId, //this takes the annotation ID being replied to
          type: "Annotation",
          body: [{ id: uuidv4(), type: "TextualBody", value }], //this takes the user input
          motivation: "replying",
          created: new Date().toISOString(),
          creator: this.props.creator,
        };

      default:
        console.log(
          "no annotation found, have you selected the annotation type?"
        );
    }
  };

  render() {
    return (
      <div className="App">
        <div className="container">
          <h3>Annotation type</h3>
          <label>
            <input
              title="adds a textual content to the annotation"
              type="radio"
              name="annotationType"
              value="describing"
              placeholder="Add your annotation..."
              onChange={this.props.onAnnoTypeChange}
              checked={this.props.annotationType === "describing"}
            />
            Describing
          </label>
          <label>
            <input
              title="links external resources to the annotation"
              type="radio"
              value="linking"
              name="annotationType"
              placeholder="Insert your URI link..."
              onChange={this.props.onAnnoTypeChange}
              checked={this.props.annotationType === "linking"}
            />
            Linking
          </label>
          <label>
            <input
              title="links a media content to the annotation"
              type="radio"
              value="cueMedia"
              name="annotationType"
              onChange={this.props.onAnnoTypeChange}
              checked={this.props.annotationType === "cueMedia"}
            />
            Cue Media
          </label>
          <label>
            <input
              title="links an image content to the annotation"
              type="radio"
              value="image"
              name="annotationType"
              placeholder="Insert your image link..."
              onChange={this.props.onAnnoTypeChange}
              checked={this.props.annotationType === "image"}
            />
            Image
          </label>
          <label>
            <input
              title="playlist"
              type="radio"
              value="playlist"
              name="annotationType"
              onChange={this.props.onAnnoTypeChange}
              checked={this.props.annotationType === "playlist"}
            />
            Playlist
          </label>
          <label>
            <input
              title="will be used when the reply button is clicked"
              type="radio"
              value="reply"
              name="annotationType"
              disabled={true}
              checked={this.props.annotationType === "replying"}
            />
            Reply
          </label>
          <div className="addAnnotations">
            <AddAnnotation
              ref={this.textArea}
              annotationType={this.props.annotationType}
              submitUri={this.props.submitUri}
              placeholder={this.props.placeholder}
              submitHandler={this.submitHandler}
              onResponse={this.props.onResponse}
              onRefreshClick={this.props.onRefreshClick}
              buttonContent={this.props.buttonContent}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default AnnotationSubmitter;

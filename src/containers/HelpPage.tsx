import React from "react";
const HelpPage = () => {
  return (
    <div>
      <h3>Below you can find some tips on how to use the annotation tool:</h3>
      <br />
      <div>
        <h4>How do I create an annotation?</h4>
        <ol>
          <li>
            Select the type of selection you want to use (note, measure,
            directives etc)
          </li>
          <li>
            Drag across the score in order to select the elements you want to
            annotate
          </li>
          <li>
            You can select discontinuous measures by holding the shift key
          </li>
          <li>
            Sometimes slurs can get in the way of your selection, you can
            deselect unwanted measures by holding the shift key and clicking on
            the measure you wish to deselect
          </li>
          <li>
            Select the type of annotation you wish to submit (description, link
            etc)
          </li>
          <li>
            Type the text or paste the URL you wish to attach to the annotation
          </li>
          <li>Click the green submit button</li>
        </ol>
        <h4>I made a mistake in my annotation, how can I delete it?</h4>
        <ul>
          <li>
            You can delete you annotation by clicking the rubbish bin icon in
            the annotation item and click yes to delete it
          </li>
        </ul>

        <h4>
          I have replied to an annotation but I can’t see my reply, where is it?
        </h4>
        <ul>
          <li>
            You can see all the replies to the specific annotation by clicking
            the “show replies button” in the annotation you are replying to
          </li>
        </ul>
        <h4>
          Can I create a different type of reply (media or image content)?
        </h4>
        <ul>
          <li>
            Not right now, this feature will be released in a future version of
            the software
          </li>
        </ul>
        <h4>How does the solid pod system work, is my data really safe?</h4>
        <ul>
          <li>
            Solid was purposely built for data safety and protection, and by
            design everything contained in the pod is private unless specified.
            For more information visit the{" "}
            <a
              href="https://solidproject.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              solid project
            </a>{" "}
            page for more info
          </li>
        </ul>
        <h4>I have found a bug, what can i do?</h4>
        <ul>
          <li>
            Please submit a bug report to{" "}
            <a href="mailto:fzuba001@gold.ac.uk?subject=Bug report">
              fzuba001@gold.ac.uk
            </a>{" "}
            describing the nature of the bug and how to reproduce it, make sure
            to include browser model and operating system used. Thanks! :)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HelpPage;

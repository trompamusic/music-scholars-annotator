import React, {Component} from "react";
import Modal from "react-modal";
import PropTypes from 'prop-types';

export default class HelpModal extends Component {
    render = () => {
        return <Modal
            isOpen={this.props.isOpen}
            onRequestClose={this.props.onRequestClose}
            contentLabel="my modal"
            className="mymodal"
            overlayClassName="myoverlay"
            ariaHideApp={false}
        >
            <div>
                <header className="modal-header">
                    <h1 className="modal-title">Help section</h1>
                </header>
                <div className="modal-body">
                    <h3>
                        Below you can find some tips on how to use the annotation tool:
                    </h3>
                    <br />
                    <div style={{ height: 500, overflow: "auto" }}>
                        <h4>How do I create an annotation?</h4>
                        <p>
                            - Select the type of selection you want to use (note, measure,
                            directives etc)
                            <br />
                            <br />- Drag across the score in order to select the elements
                            you want to annotate
                            <br />
                            <br />- You can select discontinuous measures by holding the
                            shift key
                            <br />
                            <br />- Sometimes slurs can get in the way of your selection,
                            you can deselect unwanted measures by holding the shift key and
                            clicking on the measure you wish to deselect
                            <br />
                            <br />- Select the type of annotation you wish to submit
                            (description, link etc)
                            <br />
                            <br />- Type the text or paste the URL you wish to attach to the
                            annotation
                            <br />
                            <br />- Click the green submit button
                        </p>
                        <h4>I made a mistake in my annotation, how can I delete it?</h4>
                        <p>
                            - You can delete you annotation by clicking the rubbish bin icon
                            in the annotation item and click yes to delete it
                        </p>

                        <h4>
                            I have replied to an annotation but I can’t see my reply, where
                            is it?
                        </h4>
                        <p>
                            - You can see all the replies to the specific annotation by
                            clicking the “show replies button” in the annotation you are
                            replying to
                        </p>
                        <h4>
                            Can I create a different type of reply (media or image content)?
                        </h4>
                        <p>
                            - Not right now, this feature will be released in a future
                            version of the software
                        </p>
                        <h4>
                            How does the solid pod system work, is my data really safe?
                        </h4>
                        <p>
                            - Solid was purposely built for data safety and protection, and
                            by design everything contained in the pod is private unless
                            specified. For more information visit the{" "}
                            <a
                                href="https://solidproject.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                solid project
                            </a>{" "}
                            page for more info
                        </p>
                        <h4>I have found a bug, what can i do?</h4>
                        <p>
                            - Please submit a bug report to{" "}
                            <a href="mailto:fzuba002@gold.ac.uk?subject=Bug report">
                                fzuba002@gold.ac.uk
                            </a>{" "}
                            describing the nature of the bug and how to reproduce it, make
                            sure to include browser model and operating system used. Thanks!
                            :)
                        </p>
                    </div>
                </div>
                <footer className="modal-footer">
                    <button onClick={this.props.onRequestClose}>close</button>
                </footer>
            </div>
        </Modal>
    }
}

HelpModal.propTypes = {
    isOpen: PropTypes.bool,
    onRequestClose: PropTypes.func
}
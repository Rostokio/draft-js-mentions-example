import React from "react";
import ReactDOM from "react-dom";
import PostEditor from "./components/PostEditor";
import "./styles.css";
import {EditorState} from "draft-js";
import {convertFromHTML} from "draft-convert";


class Post extends React.Component {
    constructor(props) {
        super(props);
        this.mentionsRef = React.createRef();
        this.state = {
            mentions: [],
            placeholder: ""
        }
    }

    handleEditorChange = (state) => {
        this.mentionsRef.current.setState({editorState: state});
    }

    handleMentionLoad = (state) => {
        this.setState({mentions: state});
        console.log(this.state);
    }

    handlePlaceholderLoad = (state) => {
        this.setState({placeholder: state});
    }

    callBackend = (id) => {
        fetch('http://localhost:8080/draft?id=' + id)
            .then(result => result.json())
            .then(result => {
                this.handlePlaceholderLoad(result.placeholder);
                this.handleMentionLoad(result.mentions);
                this.handleEditorChange(EditorState.createWithContent(convertFromHTML(result.data)));
            })
            .catch(e => console.log(e));
    }

    componentDidMount() {
        this.callBackend(0);
    }

    render() {
        return (
            <div className="container">
                <div className="PostEditor__container">
                    <div className="PostEditor">
                        <PostEditor
                            className="PostEditor__input"
                            placeholder={this.state.placeholder}
                            mentions={this.state.mentions}
                            ref={this.mentionsRef}
                        />
                        <div key="footerMain" className="PostEditor__footer">
                            <button onClick={() => {
                                this.callBackend("1")
                            }
                            }
                            >I
                            </button>

                            <button onClick={() => {
                                this.callBackend("2")
                            }
                            }
                            >II
                            </button>

                            <button onClick={() => {
                                this.callBackend("3")
                            }
                            }
                            >III
                            </button>

                            <button onClick={() => {
                                this.callBackend("0")
                            }
                            }
                            >reset
                            </button>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Post/>, rootElement);

import React, { Component } from "react";
import PropTypes from "prop-types";
import { EditorState, getDefaultKeyBinding, RichUtils } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin, {
    defaultSuggestionsFilter
} from "draft-js-mention-plugin";
import createToolbarPlugin from '@draft-js-plugins/static-toolbar';
import { stateToHTML } from "draft-js-export-html";
import "draft-js-mention-plugin/lib/plugin.css";
import "draft-js/dist/Draft.css";
import _ from "lodash";
import '@draft-js-plugins/static-toolbar/lib/plugin.css';

import MentionComponent from "./mentionComponent";
import EntryComponent from "./EntryComponent";

const cmdState = {
    handled: "handled",
    notHandled: "not-handled"
};
const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;

class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.mentionPlugin = createMentionPlugin({
            entityMutability: "IMMUTABLE",
            mentionComponent: MentionComponent // since we want to remove the entire name at once.
        });
        this.state = {
            editorState: EditorState.createEmpty(),
            suggestions: this.props.mentions
        };
    }

    reset = () => {
        this.setState({
            editorState: EditorState.createEmpty()
        });
    };

    onChange = editorState => {
        this.setState({
            editorState
        });
    };

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, this.props.mentions)
        });
    };

    keyBindingFn = e => {
        // retrun custom commands on keyPress if required
        return getDefaultKeyBinding(e);
    };

    toHtml = () => {
        const contentState = this.state.editorState.getCurrentContent();
        const options = {
            // eslint-disable-next-line consistent-return
            entityStyleFn: entity => {
                const entityType = entity.get("type").toLowerCase();
                if (entityType === "mention") {
                    const data = entity.getData();
                    return {
                        element: "span",
                        attributes: {
                            "data-mention-id": _.get(data, "mention.id"),
                            class: "mention_class"
                        },
                        style: {
                            // Put styles here...
                        }
                    };
                }
            }
        };
        return stateToHTML(contentState, options);
    };

    handleKeyCommand = command => {
        // handle custom command here;

        const newState = RichUtils.handleKeyCommand(
            this.state.editorState,
            command
        );
        if (newState) {
            this.onChange(newState);
            return cmdState.handled;
        }
        return cmdState.notHandled;
    };

    render() {
        const { MentionSuggestions } = this.mentionPlugin;
        const plugins = [this.mentionPlugin, toolbarPlugin];
        const { className, style, placeholder } = this.props;

        return (
            <div className={`editor ${className}`} style={style}>
                <Toolbar />
                <br/>
                <br/>
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    plugins={plugins}
                    keyBindingFn={this.keyBindingFn}
                    handleKeyCommand={this.handleKeyCommand}
                    placeholder={placeholder}
                    ref={element => {
                        this.editor = element;
                    }}
                />

                <MentionSuggestions
                    onSearchChange={this.onSearchChange}
                    suggestions={this.state.suggestions}
                    entryComponent={EntryComponent}
                />
            </div>
        );
    }
}

PostEditor.propTypes = {
    /**
     * mentions {array} - array of names for `@`mentions to work
     */
    mentions: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            id: PropTypes.number
        })
    ),
    /**
     * className {string} - className applied to top most Wrapper
     */
    className: PropTypes.string,
    /**
     * style {object} - inline style to be applied to top most Wrapper
     */
    style: PropTypes.object,
    /**
     * placeholder {string} - placeholder to display when editor has no text
     */
    placeholder: PropTypes.string
};

PostEditor.defaultProps = {
    mentions: []
};

export default PostEditor;

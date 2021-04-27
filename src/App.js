import React, {useState} from 'react';
import {convertFromRaw, ContentState, EditorState} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './App.css';
import {convertFromHTML} from "draft-convert";


const App = () => {
    const ref = React.useRef();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const handleEditorChange = (state) => {
        setEditorState(state);
    }

    const callBackend = (id) => {
        fetch('http://localhost:8080/draft?id=' + id)
            .then(result => result.text())
            .then(result => setEditorState(EditorState.createWithContent(convertFromHTML(result))))
            .catch(e => console.log(e));
    }

    return (
        <div className="App">
            <header className="App-header">
                Termsheets example
            </header>
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                ref={ref}
            />
            <button onClick={() => {
                callBackend("1")
            }
            }
            >Вставить первый текст с бэка</button>

            <button onClick={() => {
                callBackend("2")
            }
            }
            >Вставить второй текст с бэка</button>

            <button onClick={() => {
                callBackend("3")
            }
            }
            >Вставить третий текст с бэка</button>
        </div>

    )
}
export default App;

// MyEditor.jsx
import React, { useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

function MyEditor({ initialHtml, onChange }) {
  const [content, setContent] = useState(initialHtml || "");

  const handleChange = (value) => {
    setContent(value);
    onChange(value); // Retorna o HTML para o pai
  };

  return (
    <SunEditor
      defaultValue={content}
      onChange={handleChange}
      setOptions={{
        height: 200,
        buttonList: [
          ["undo", "redo"],
          ["font", "fontSize", "formatBlock"],
          ["bold", "underline", "italic", "strike"],
          ["fontColor", "hiliteColor", "removeFormat"],
          ["align", "horizontalRule", "list", "table"],
          ["link", "image", "video"],
          ["fullScreen", "codeView", "preview"]
        ]
      }}
    />
  );
}

export default MyEditor;

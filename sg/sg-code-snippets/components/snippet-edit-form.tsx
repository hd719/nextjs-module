"use client";

import type { Snippet } from "@prisma/client";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import { editSnippet } from "@/actions";
interface SnippetEditFormProps {
  snippet: Snippet;
}

export default function SnippetEditForm({ snippet }: SnippetEditFormProps) {
  const [code, setCode] = useState(snippet.code);
  const handleEditorChange = (value: string = "") => {
    setCode(value);
  };
  const snippetEditFormAction = editSnippet.bind(null, snippet.id, code);

  return (
    <div>
      <Editor
        height="40vh"
        defaultLanguage="javascript"
        defaultValue={code}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
        }}
        onChange={handleEditorChange}
      />
      <form action={snippetEditFormAction}>
        <button type="submit" className="p-2 border rounded">
          Save
        </button>
      </form>
    </div>
  );
}

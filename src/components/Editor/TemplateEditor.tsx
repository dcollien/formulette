import React from "react";
import MonacoEditor from "@uiw/react-monacoeditor";

export interface TemplateEditorProps {
  template: string;
  onTemplateChange?: (template: string) => void;
  height?: string;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  template,
  onTemplateChange,
  height="480px"
}: TemplateEditorProps) => {
  return (
    <MonacoEditor
      height={height}
      language="markdown"
      value={template}
      options={{
        theme: "vs-dark",
      }}
      onChange={onTemplateChange}
    />
  );
};

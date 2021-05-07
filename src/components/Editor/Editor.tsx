import React, { useMemo, useState } from "react";
import { Parameters, Options } from "../../util/types";
import { TemplateEditor } from "./TemplateEditor";
import { OptionEditor } from "./OptionEditor";
import { ParameterEditor } from "./ParameterEditor";
import { extractVariables } from "../../util/template";

export type ChangeHandler<T> = (
  name: keyof T,
  value: T[keyof T] | undefined
) => void;
export interface EditorProps {
  template: string;
  parameters: Parameters;
  options: Options;
  onTemplateChange?: (template: string) => void;
  onParameterChange?: ChangeHandler<Parameters>;
  onOptionChange?: ChangeHandler<Options>;
  onError?: (err: Error) => void;
}

export const Editor: React.FC<EditorProps> = ({
  template,
  parameters,
  options,
  onTemplateChange,
  onParameterChange,
  onOptionChange,
  onError,
}: EditorProps) => {
  const [currTemplate, setTemplate] = useState<string>(template);

  const templateChangeHandler = (newTemplate: string) => {
    onTemplateChange && onTemplateChange(newTemplate);
    setTemplate(newTemplate);
  };

  const variables = useMemo(() => extractVariables(currTemplate), [currTemplate]);
  const canDelete: {[name: string]: boolean} = {};

  Object.keys(parameters).forEach((name) => {
    canDelete[name] = true;
  });

  variables.forEach((name) => {
    canDelete[name] = false;
  });
  
  const onScan = () => {
    variables.forEach((name) => {
      if (!(name in parameters)) {
        onParameterChange && onParameterChange(name,  {
          type: "input",
          inputType: "number"
        });
      }
    });
  };

  return <div className="formulette-editor">
    <TemplateEditor template={template} onTemplateChange={templateChangeHandler}/>
    <ParameterEditor parameters={parameters} onParameterChange={onParameterChange} canDelete={canDelete} onScan={onScan} />
    <OptionEditor options={options} onOptionChange={onOptionChange}/>
  </div>;
};

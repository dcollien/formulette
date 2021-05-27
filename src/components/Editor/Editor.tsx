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
  onOptionChange?: ChangeHandler<Options>;
  onParametersChange?: (params: Parameters) => void;
  onError?: (err: Error) => void;
}

export const Editor: React.FC<EditorProps> = ({
  template,
  parameters,
  options,
  onTemplateChange,
  onOptionChange,
  onParametersChange,
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
    const newParameters: Parameters = {};
    
    variables.forEach((name) => {
      if (!(name in parameters)) {
        newParameters[name] = {
          type: "input",
          inputType: "number"
        };
      }
    });

    onParametersChange && onParametersChange({ ...parameters, ...newParameters})
  };

  const onParameterChange: ChangeHandler<Parameters> = (name, value) => {
    const newParameters: Parameters = {...parameters};
    if (value === undefined) {
      delete newParameters[name];
      console.log("DELETED", name, newParameters);
      onParametersChange && onParametersChange({
        ...newParameters
      });
    } else {
      onParametersChange && onParametersChange({
        ...newParameters,
        [name]: value,
      });
    }
  }

  return <div className="formulette-editor">
    <TemplateEditor template={template} onTemplateChange={templateChangeHandler}/>
    <ParameterEditor parameters={parameters} onParameterChange={onParameterChange} canDelete={canDelete} onScan={onScan} />
    <OptionEditor options={options} onOptionChange={onOptionChange}/>
  </div>;
};

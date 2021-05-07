import React, { ChangeEvent, ChangeEventHandler, useState } from "react";
import { ChangeHandler } from "./Editor";

import { Parameters } from "../../util/types";
import { Parameter } from "./ParameterEditors";

export interface ParameterEditorProps {
  parameters: Parameters;
  onParameterChange?: ChangeHandler<Parameters>;
  canDelete: { [name: string]: boolean };
  onScan?: () => void;
}

export const ParameterEditor: React.FC<ParameterEditorProps> = ({
  parameters,
  onParameterChange,
  canDelete,
  onScan,
}: ParameterEditorProps) => {
  const [paramName, setParamName] = useState<string>("");

  const paramNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setParamName(evt.currentTarget.value);
  };

  const addParameter = () => {
    onParameterChange &&
      onParameterChange(paramName, {
        type: "input",
        inputType: "number",
      });

    setParamName("");
  };

  return (
    <>
      <div className="fte-add-parameter">
        <div className="fte-sidebyside">
          <input
            name="text"
            value={paramName}
            onChange={paramNameChange}
            placeholder="Parameter Name"
          />
          <button type="button" onClick={addParameter}>
            Add Parameter
          </button>
        </div>
        {onScan && (
          <>
            <div className="fte-sidebyside">or</div>
            <div className="fte-sidebyside">
              <button type="button" onClick={onScan}>
                Scan For Parameters
              </button>
            </div>
          </>
        )}
      </div>
      <div className="fte-parameter-table">
        {Object.keys(parameters)
          .sort()
          .map((name) => (
            <Parameter
              key={name}
              name={name}
              definition={parameters[name]}
              onChange={onParameterChange}
              canDelete={canDelete[name]}
            />
          ))}
      </div>
    </>
  );
};

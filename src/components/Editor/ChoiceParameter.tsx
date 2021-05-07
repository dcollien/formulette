import React, { ChangeEvent } from "react";
import { ChoiceInputDefinition } from "../../util/types";
import { ParameterProps, Selection } from "./ParameterEditors";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

export const ChoiceParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  const defn = definition as ChoiceInputDefinition;

  const onDefaultChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value;
    const numVal = evt.currentTarget.valueAsNumber;

    let val;
    if (defn.valueType === "string") {
      val = textVal
    } else {
      val = textVal && numVal ? numVal : textVal ? textVal : undefined;
    }

    onChange &&
      onChange(name, {
        ...definition,
        default: val,
      } as ChoiceInputDefinition);
  };

  const onWidthChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    onChange &&
      onChange(name, {
        ...defn,
        width: textVal.endsWith("%") ? textVal : Number(textVal),
      } as ChoiceInputDefinition);
  };

  const onTypeChange = (val: string) => {
    onChange &&
      onChange(name, {
        ...defn,
        valueType: val,
      } as ChoiceInputDefinition);
  };

  const typeNames = ["Integer", "Floating Point", "String"];

  const typeValues = ["integer", "float", "string"];

  const onValuesChange = (values: Array<string>) => {
    let newValues;

    if (defn.valueType === "string") {
      newValues = values;
    } else {
      newValues = values.map((val) => Number(val));
    }

    onChange &&
      onChange(name, {
        ...defn,
        values: newValues,
      });
  };

  const onValueValidate = (value: string) => {
    if (defn.valueType === "string") {
      return true;
    } else if (defn.valueType === "integer") {
      const numVal = Number(value);
      return !isNaN(numVal) && Number.isInteger(numVal);
    } else {
      return !isNaN(Number(value));
    }
  };

  const tags = defn.values ? defn.values.map((val) => val.toString()) : [];

  return (
    <>
      <div>
        <div className="fte-sidebyside">
          <label className="fte-label">Width:</label>
          <div>
            <input
              type="text"
              value={defn.width || ""}
              onChange={onWidthChange}
            />
          </div>
        </div>
        <div className="fte-sidebyside">
          <label className="fte-label">Value Type:</label>
          <div className="fte-select-container">
            <Selection
              names={typeNames}
              values={typeValues}
              selected={defn.valueType || "integer"}
              onChange={onTypeChange}
            />
          </div>
        </div>
      </div>

      <div className="fte-sidebyside">
        <label className="fte-label">Values:</label>
        <ReactTagInput
          placeholder="Value"
          tags={tags}
          onChange={onValuesChange}
          validator={onValueValidate}
        />
      </div>
      <div>
        <label className="fte-label">Default Value:</label>
        <div>
          <input
            type={defn.valueType === "string" ? "text" : "number"}
            value={defn.default || ""}
            onChange={onDefaultChange}
          />
        </div>
      </div>
    </>
  );
};

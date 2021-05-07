import React, { ChangeEvent, useState } from "react";
import { isTextDefinition, NumberInputDefinition, TextInputDefinition } from "../../util/types";
import { ParameterProps } from "./ParameterEditors";

export const NumberParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  const defn = definition as NumberInputDefinition;
  
  const [minVal, setMinVal] = useState<string>(defn.range?.min ? "" + defn.range?.min : "");
  const [maxVal, setMaxVal] = useState<string>(defn.range?.min ? "" + defn.range?.min : "");

  const onDefaultChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value;
    const numVal = evt.currentTarget.valueAsNumber;
    onChange &&
      onChange(name, {
        ...definition,
        default: textVal && numVal ? numVal : textVal ? textVal : undefined,
      } as NumberInputDefinition);
  };

  const onMinChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    const numVal = Number(textVal);
    setMinVal(textVal);

    if (!isNaN(numVal)) {
      const range = defn.range || { min: { value: 0 }, max: { value: 0 }};

      onChange &&
      onChange(name, {
        ...defn,
        range: {
          ...range,
          min: {
            value: numVal
          }
        }
      } as NumberInputDefinition);
    }
  };

  const onMaxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    const numVal = Number(textVal);
    setMaxVal(textVal);

    if (!isNaN(numVal)) {
      const range = defn.range || { min: { value: 0 }, max: { value: 0 }};

      onChange &&
      onChange(name, {
        ...defn,
        range: {
          ...range,
          max: {
            value: numVal
          }
        }
      } as NumberInputDefinition);
    }
  };

  const onWidthChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    onChange &&
      onChange(name, {
        ...definition,
        width: textVal.endsWith("%") ? textVal : Number(textVal),
      } as NumberInputDefinition);
  };

  return (
    <>
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
        <label className="fte-label">Minimum:</label>
        <div>
          <input
            type="text"
            value={minVal}
            onChange={onMinChange}
          />
        </div>
      </div>
      <div className="fte-sidebyside">
        <label className="fte-label">Maximum:</label>
        <div>
          <input
            type="text"
            value={maxVal}
            onChange={onMaxChange}
          />
        </div>
      </div>
      <div className="fte-sidebyside">
        <label className="fte-label">Default Value:</label>
        <div>
          <input
            type="number"
            value={defn.default || ""}
            onChange={onDefaultChange}
          />
        </div>
      </div>
    </>
  );
};


export const TextParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  if (definition.type !== "input" || !isTextDefinition(definition)) {
    return null;
  }

  const onDefaultChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const textVal = evt.currentTarget.value;
    onChange &&
      onChange(name, {
        ...definition,
        default: textVal,
      });
  };

  const onWidthChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    onChange &&
      onChange(name, {
        ...definition,
        width: textVal.endsWith("%") ? textVal : Number(textVal),
      });
  };

  const onHeightChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    onChange &&
      onChange(name, {
        ...definition,
        height: textVal ? Number(textVal) : undefined,
      });
  };

  const onMaxLengthChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    onChange &&
      onChange(name, {
        ...definition,
        maxLength: textVal ? Number(textVal) : undefined,
      } as TextInputDefinition);
  };

  return (
    <>
      <div className="fte-sidebyside">
        <label className="fte-label">Width:</label>
        <div>
          <input
            type="text"
            value={definition.width || ""}
            onChange={onWidthChange}
          />
        </div>
      </div>
      <div className="fte-sidebyside">
        <label className="fte-label">Height:</label>
        <div>
          <input
            type="text"
            value={definition.height || ""}
            onChange={onHeightChange}
          />
        </div>
      </div>
      <div className="fte-sidebyside">
        <label className="fte-label">Maximum Length:</label>
        <div>
          <input
            type="number"
            value={definition.maxLength || ""}
            onChange={onMaxLengthChange}
          />
        </div>
      </div>
      <div>
        <label className="fte-label">Default Value:</label>
        <div>
          <textarea
            className="fte-default-text"
            value={definition.default || ""}
            onChange={onDefaultChange}
          ></textarea>
        </div>
      </div>
    </>
  );
};

import React, { ChangeEvent, useState } from "react";
import { RandomInputDefinition } from "../../util/types";
import { ParameterProps, Selection } from "./ParameterEditors";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

export const RandomParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  const defn = definition as RandomInputDefinition;

  const [minVal, setMinVal] = useState<string>(
    defn.range?.min ? "" + defn.range?.min : ""
  );
  const [maxVal, setMaxVal] = useState<string>(
    defn.range?.min ? "" + defn.range?.min : ""
  );

  const onDefaultChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value;
    const numVal = evt.currentTarget.valueAsNumber;

    let val;
    if (defn.valueType === "string") {
      val = textVal;
    } else {
      val = textVal && numVal ? numVal : textVal ? textVal : undefined;
    }

    onChange &&
      onChange(name, {
        ...definition,
        default: val,
      } as RandomInputDefinition);
  };

  const onMinChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    const numVal = Number(textVal);
    setMinVal(textVal);

    if (!isNaN(numVal)) {
      const range = defn.range || { min: { value: 0 }, max: { value: 0 } };

      onChange &&
        onChange(name, {
          ...defn,
          range: {
            ...range,
            min: {
              ...range.min,
              value: numVal,
            },
          },
        } as RandomInputDefinition);
    }
  };

  const onMaxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    const numVal = Number(textVal);
    setMaxVal(textVal);

    if (!isNaN(numVal)) {
      const range = defn.range || { min: { value: 0 }, max: { value: 0 } };

      onChange &&
        onChange(name, {
          ...defn,
          range: {
            ...range,
            max: {
              ...range.max,
              value: numVal,
            },
          },
        } as RandomInputDefinition);
    }
  };

  const onMaxInclusiveChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.currentTarget.checked;
    onChange &&
      onChange(name, {
        ...defn,
        range: {
          ...defn.range,
          max: {
            ...defn.range?.max,
            inclusive: isChecked,
          },
        },
      } as RandomInputDefinition);
  };

  const onMinInclusiveChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const isChecked = evt.currentTarget.checked;
    onChange &&
      onChange(name, {
        ...defn,
        range: {
          ...defn.range,
          min: {
            ...defn.range?.max,
            inclusive: isChecked,
          },
        },
      } as RandomInputDefinition);
  };

  const onWidthChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value.trim();
    onChange &&
      onChange(name, {
        ...defn,
        width: textVal.endsWith("%") ? textVal : Number(textVal),
      } as RandomInputDefinition);
  };

  const onTypeChange = (val: string) => {
    onChange &&
      onChange(name, {
        ...defn,
        valueType: val,
      } as RandomInputDefinition);
  };

  const typeNames = ["Integer", "Floating Point"];

  const typeValues = ["integer", "float"];

  const rangeNames = ["Minimum/Maximum", "List of Values"];

  const rangeValues = ["minmax", "list"];

  const selectedRange = defn.range ? "minmax" : "list";

  if (selectedRange === "list") {
    typeNames.push("String");
    typeValues.push("string");
  }

  const onRangeChange = (val: string) => {
    if (val === "minmax") {
      onChange &&
        onChange(name, {
          ...defn,
          valueType: defn.valueType === "string" ? "float" : defn.valueType,
          range: {
            min: {
              value: 0,
            },
            max: {
              value: 1,
            },
          },
        } as RandomInputDefinition);
    } else {
      onChange &&
        onChange(name, {
          ...defn,
          range: undefined,
        } as RandomInputDefinition);
    }
  };

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
          <label className="fte-label">Range:</label>
          <div className="fte-select-container">
            <Selection
              names={rangeNames}
              values={rangeValues}
              selected={selectedRange}
              onChange={onRangeChange}
            />
          </div>
        </div>
      </div>
      {selectedRange === "minmax" ? (
        <>
          <div className="fte-sidebyside">
            <label className="fte-label">Minimum:</label>
            <div>
              <input type="text" value={minVal} onChange={onMinChange} />
              <label>
                <input
                  type="checkbox"
                  checked={
                    defn.range?.min.inclusive === undefined ||
                    defn.range?.min.inclusive
                  }
                  onChange={onMinInclusiveChange}
                />
                Inclusive
              </label>
            </div>
          </div>
          <div className="fte-sidebyside">
            <label className="fte-label">Maximum:</label>
            <div>
              <input type="text" value={maxVal} onChange={onMaxChange} />
              <label>
                <input
                  type="checkbox"
                  checked={defn.range?.max.inclusive || false}
                  onChange={onMaxInclusiveChange}
                />
                Inclusive
              </label>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="fte-sidebyside">
            <label className="fte-label">Values:</label>
            <ReactTagInput
              placeholder="Value"
              tags={tags}
              onChange={onValuesChange}
              validator={onValueValidate}
            />
          </div>
        </>
      )}
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

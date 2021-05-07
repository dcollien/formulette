import React, { ChangeEvent } from "react";
import { ChangeHandler } from "./Editor";

import { Options } from "../../util/types";

export interface OptionEditorProps {
  options: Options;
  onOptionChange?: ChangeHandler<Options>;
}

export const OptionEditor: React.FC<OptionEditorProps> = ({
  options,
  onOptionChange,
}: OptionEditorProps) => {
  const onNaNChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value;
    let setVal;
    if (textVal) {
      setVal = textVal;
    }

    onOptionChange && onOptionChange("nanLabel", setVal);
  };

  const onUndefinedChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value;
    let setVal;
    if (textVal) {
      setVal = textVal;
    }

    onOptionChange && onOptionChange("undefinedLabel", setVal);
  };

  const onNullChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const textVal = evt.currentTarget.value;
    let setVal;
    if (textVal) {
      setVal = textVal;
    }

    onOptionChange && onOptionChange("nullLabel", setVal);
  };

  return (
    <div className="fte-options">
      <div><label>Customise how values are displayed:</label></div>
      <div className="fte-sidebyside">
        <label className="fte-label">NaN Label:</label>
        <div>
          <input type="text" value={options.nanLabel} onChange={onNaNChange} />
        </div>
      </div>
      <div className="fte-sidebyside">
        <label className="fte-label">Null Label:</label>
        <div>
          <input type="text" value={options.nullLabel} onChange={onNullChange} />
        </div>
      </div>
      <div className="fte-sidebyside">
        <label className="fte-label">Undefined Label:</label>
        <div>
          <input type="text" value={options.undefinedLabel} onChange={onUndefinedChange} />
        </div>
      </div>
    </div>
  );
};

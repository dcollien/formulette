import React from "react";
import { RandomInputDefinition } from "src/util/types";

interface SpinnerProps {
  value?: number | string;
  parameter: RandomInputDefinition;
  onChange: (value: number | string) => void;
}

export const Spinner: React.FC<SpinnerProps> = ({
  value,
  parameter,
  onChange,
}: SpinnerProps) => {
  const onClick = () => {
    const p = Math.random();

    if (parameter.range) {
      let max = parameter.range.max.value;
      let min = parameter.range.min.value;

      if (parameter.range.type === "integer") {
        const isMaxInclusive = parameter.range.max.inclusive === true; // default false
        const isMinInclusive = parameter.range.max.inclusive !== false; // default true

        max -= isMaxInclusive ? 0 : 1;
        min += isMinInclusive ? 0 : 1;

        onChange(Math.floor(p * (max - min) + min));
      } else {
        onChange(p * (max - min) + min);
      }
    } else if (parameter.values) {
      const i = Math.floor(p * parameter.values.length);
      onChange(parameter.values[i]);
    }
  };

  return (
    <div className="random-spinner">
      {value !== undefined ? (
        <span className="chosen-value">{value}</span>
      ) : (
        <span className="chosen-value">&nbsp;</span>
      )}
      <button type="button" onClick={onClick} title="Randomise">
        🎲
      </button>
    </div>
  );
};

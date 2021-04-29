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
        const isMaxInclusive = parameter.range.max.inclusive === undefined ? false : parameter.range.max.inclusive;
        const isMinInclusive = parameter.range.min.inclusive === undefined ? true  : parameter.range.min.inclusive;

        max += isMaxInclusive ? 1 : 0;
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
    <span className="random-spinner">
      {value !== undefined ? (
        <span className="chosen-value">{value}</span>
      ) : (
        <span className="chosen-value">&nbsp;</span>
      )}
      <button type="button" onClick={onClick} title="Randomise">
        <span role="img" aria-label="Random Die">🎲</span>
      </button>
    </span>
  );
};

import React from "react";

import { ExpressionParser } from "expressionparser";

import {
  VariableValue,
  isChoiceInputDefinition,
  isRandomInputDefinition,
  ParameterDefinition,
  Options,
  isNumberInputDefinition,
  isTextDefinition
} from "../../util/types";

import { renderEvaluation } from "../../util/template";


import { Spinner } from "./Spinner";
export interface ParameterProps {
  name: string;
  value: VariableValue;
  parameter: ParameterDefinition;
  parser: ExpressionParser;
  onChange: (value?: VariableValue) => void;
  options?: Options;
}

export const Parameter: React.FC<ParameterProps> = ({
  name,
  value,
  parameter,
  parser,
  onChange,
  options
}: ParameterProps) => {

  // TODO: convert node and child to react
  if (parameter.type === "constant") {
    return <>{parameter.value + ""}</>;
  } else if (parameter.type === "calculation") {
    const evaluated = renderEvaluation(parser, name, parameter, options);
    return <>{evaluated}</>;
  } else if (parameter.type ===  "function") {
    return <>{name}</>;
  }

  if (value === undefined) {
    value = parameter.default;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleValueChange = (value: number | string) => {
    onChange(value);
  };

  const handleTextChange = (evt: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = evt.currentTarget.value;

    if (isTextDefinition(parameter)) { 
      if (parameter.maxLength && value !== undefined) {
        value = value.slice(0, parameter.maxLength);
      }
    }

    onChange(value);
  };

  const handleSelectChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(evt.currentTarget.selectedIndex);
    if (isChoiceInputDefinition(parameter)) {
      onChange(parameter.values[index]);
    }
  };

  const handleNumberChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    onChange(evt.currentTarget.value);
  };

  const style: Record<string, string | number> = {
    zIndex: 999,
    position: "relative",
  };

  if (parameter.width) {
    if ((parameter.width + "").endsWith("%")) {
      style.width = parameter.width;
    } else {
      style.width = parameter.width + "px"; // TODO: styled component
    }
  }

  if (parameter.height) {
    style.height = parameter.height + "px"; // TODO: styled component
  }

  if (isChoiceInputDefinition(parameter)) {
    return (
      <select
        style={style}
        onChange={handleSelectChange}
        value={value as string | number}
        title={name}
      >
        {parameter.values.map((val: string | number, i: number) => (
          <option key={i} value={val}>
            {val}
          </option>
        ))}
      </select>
    );
  } else if (isRandomInputDefinition(parameter)) {
    return (
      <span style={style}>
        <Spinner
          value={value as string | number | undefined}
          onChange={handleValueChange}
          parameter={parameter}
        />
      </span>
    );
  } else if (isNumberInputDefinition(parameter)) {
    let numValue = value !== undefined ? Number(value) : value;
    if (parameter.range && numValue !== undefined) {
      numValue = Math.max(numValue, parameter.range.max.value);
      numValue = Math.min(numValue, parameter.range.min.value)
    }

    return (
      <input
        type="number"
        style={style}
        value={numValue?.toString() || ""}
        onChange={handleNumberChange}
        title={name}
      ></input>
    );
  } else if (isTextDefinition(parameter)) {
    let textValue = value as string;
    if (parameter.maxLength && textValue !== undefined) {
      textValue = textValue.slice(0, parameter.maxLength);
    }

    return (
      <textarea 
        style={style}
        value={textValue}
        onChange={handleTextChange}
        title={name}
      ></textarea>
    );
  } else {
    return <>undefined</>;
  }
};

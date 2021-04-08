import React from "react";

import { ExpressionParser } from "expressionparser";
import ReactHtmlParser, { Node } from "react-html-parser";

import {
  VariableValue,
  isChoiceInputDefinition,
  isRandomInputDefinition,
  ParameterDefinition,
} from "../../util/types";
import { Spinner } from "./Spinner";

export interface ParameterProps {
  name: string;
  value: VariableValue;
  parameter: ParameterDefinition;
  node: Node;
  parser: ExpressionParser;
  onChange: (value?: VariableValue) => void;
}

export const Parameter: React.FC<ParameterProps> = ({
  value,
  parameter,
  parser,
  node,
  onChange,
}: ParameterProps) => {

  // TODO: convert node and child to react
  if (parameter.type === "constant") {
    return <>{parameter.value + ""}</>;
  } else if (parameter.type === "calculation") {
    const evaluated = parser.expressionToValue(parameter.expression);
    if (typeof evaluated === "string") {
      return <>{evaluated}</>;
    } else {
      return <>JSON.stringify(evaluated)</>;
    }
  } else if (parameter.type ===  "function") {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleValueChange = (value: number | string) => {
    onChange(value);
  };

  const handleTextChange = (evt: React.ChangeEvent) => {
    onChange(evt.currentTarget.value);
  };

  const handleSelectChange = (evt: React.ChangeEvent) => {
    const index = Number(evt.currentTarget.selectedIndex);
    if (isChoiceInputDefinition(parameter)) {
      onChange(parameter.values[index]);
    }
  };

  const handleNumberChange = (evt: React.ChangeEvent) => {
    onChange(Number(evt.currentTarget.value));
  };

  const style: Record<string, string | number> = {
    zIndex: 999,
    position: "relative",
  };

  if (parameter.width) {
    style.width = parameter.width + "px"; // TODO: styled component
  }

  if (isChoiceInputDefinition(parameter)) {
    return (
      <select
        style={style}
        onChange={handleSelectChange}
        value={value as string | number}
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
      <div style={style}>
        <Spinner
          value={value as string | number | undefined}
          onChange={handleValueChange}
          parameter={parameter}
        />
      </div>
    );
  } else if (parameter.inputType === "number") {
    return (
      <input
        type="number"
        style={style}
        value={value as number}
        onChange={handleNumberChange}
      ></input>
    );
  } else if (parameter.inputType === "text") {
    return (
      <textarea value={value as string} onChange={handleTextChange}></textarea>
    );
  } else {
    return null;
  }
};

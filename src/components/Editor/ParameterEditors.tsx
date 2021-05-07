import React, { ChangeEvent } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

import { InputType, ParameterDefinition, Parameters } from "../../util/types";
import { NumberParameter, TextParameter } from "./InputParameter";
import { RandomParameter } from "./RandomParameter";
import { ChoiceParameter } from "./ChoiceParameter";

export interface ParameterProps {
  name: keyof Parameters;
  definition: ParameterDefinition;
  onChange?: (name: string, value: ParameterDefinition | undefined) => void;
  canDelete?: boolean;
}

export const FunctionParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  if (definition.type !== "function") {
    return null;
  }

  const currArgs = definition.arguments || [];

  const changeExpHandler = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    onChange &&
      onChange(
        name,
        Object.assign({}, definition, {
          expression: evt.currentTarget.value,
        })
      );
  };

  const onTagValidate = (tag: string) => {
    return !currArgs.includes(tag);
  };

  const onTagChange = (newTags: Array<string>) => {
    onChange &&
      onChange(
        name,
        Object.assign({}, definition, {
          arguments: newTags,
        })
      );
  };

  return (
    <div>
      <label className="fte-label">Arguments:</label>
      <ReactTagInput
        placeholder="Argument"
        tags={currArgs}
        onChange={onTagChange}
        validator={onTagValidate}
      />
      <label className="fte-label">Expression:</label>
      <textarea
        className="fte-expression-editor"
        value={definition.expression}
        onChange={changeExpHandler}
      />
    </div>
  );
};

export const CalculationParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  if (definition.type !== "calculation") {
    return null;
  }

  const changeHandler = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    onChange &&
      onChange(
        name,
        Object.assign({}, definition, {
          expression: evt.currentTarget.value,
        })
      );
  };
  return (
    <div>
      <label className="fte-label">Expression:</label>
      <textarea
        className="fte-expression-editor"
        value={definition.expression}
        onChange={changeHandler}
      />
    </div>
  );
};

export const InputParameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
}: ParameterProps) => {
  if (definition.type !== "input") {
    return null;
  }

  let InnerParameter;

  if (definition.inputType === "number") {
    InnerParameter = NumberParameter;
  } else if (definition.inputType === "text") {
    InnerParameter = TextParameter;
  } else if (definition.inputType === "random") {
    InnerParameter = RandomParameter;
  } else if (definition.inputType === "choice") {
    InnerParameter = ChoiceParameter;
  }

  const typeNames = ["Text", "Number", "Choice", "Random"];

  const typeValues = ["text", "number", "choice", "random"];

  const onTypeChange = (newType: string) => {
    if (!typeValues.includes(newType)) {
      return;
    }

    onChange &&
      onChange(name, {
        ...definition,
        inputType: newType as InputType,
      });
  };

  return (
    <div>
      <div className="fte-select-container fte-sidebyside">
        <label className="fte-label">Input Type:</label>
        <div>
          <Selection
            names={typeNames}
            values={typeValues}
            selected={definition.inputType}
            onChange={onTypeChange}
          />
        </div>
      </div>
      {InnerParameter && (
        <InnerParameter
          name={name}
          definition={definition}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export interface SelectionProps {
  names: Array<string>;
  values: Array<string>;
  selected: string;
  onChange: (value: string) => void;
}

export const Selection: React.FC<SelectionProps> = ({
  names,
  values,
  selected,
  onChange,
}: SelectionProps) => {
  const changeHandler = (evt: ChangeEvent<HTMLSelectElement>) => {
    onChange(evt.currentTarget.value);
  };
  return (
    <select value={selected} onChange={changeHandler}>
      {values.map((value, i) => (
        <option key={value} value={value}>
          {names[i]}
        </option>
      ))}
    </select>
  );
};

const componentForParameter = (parameter: ParameterDefinition) => {
  const types = {
    constant: null,
    function: FunctionParameter,
    calculation: CalculationParameter,
    input: InputParameter,
  };

  return types[parameter.type];
};

export const Parameter: React.FC<ParameterProps> = ({
  name,
  definition,
  onChange,
  canDelete,
}: ParameterProps) => {
  const typeNames: Array<string> = ["Input", "Calculation", "Function"];

  const typeValues: Array<string> = ["input", "calculation", "function"];

  const onTypeChange = (value: string) => {
    const newVal = Object.assign({}, definition, {
      type: value,
    });
    onChange && onChange(name, newVal);
  };

  const deleteParam = () => {
    onChange && onChange(name, undefined);
  };

  const Component = componentForParameter(definition);

  return (
    <>
      <div>
        <div className="fte-parameter-name">{name}</div>
        <div className="fte-type-select fte-select-container">
          <Selection
            names={typeNames}
            values={typeValues}
            selected={definition.type}
            onChange={onTypeChange}
          />
        </div>
      </div>
      <div className="fte-parameter-component">
        {Component && (
          <Component name={name} definition={definition} onChange={onChange} />
        )}

        {canDelete && (
          <div className="fte-parameter-delete">
            <button type="button" onClick={deleteParam}>
              Delete
            </button>
          </div>
        )}
      </div>
    </>
  );
};

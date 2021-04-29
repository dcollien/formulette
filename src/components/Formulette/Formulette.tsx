import React, { useMemo } from "react";
import "./style.css";

import ReactHtmlParser from "react-html-parser";
import { DomElement } from "domhandler";

import { stripHTML } from "../../util/html";
import { VariableValue, Parameters, Values } from "../../util/types";
import { initParser } from "../../util/formula";
import {
  initTextMacro,
  renderTemplate,
  initKatexMacros,
} from "../../util/template";

import { Parameter } from "./Parameter";

export type FormuletteChangeHandler = (
  name: string,
  value: VariableValue
) => void;

export interface FormuletteProps {
  template: string;
  parameters: Parameters;
  values: Values;
  onChange: FormuletteChangeHandler;
  onError: (err: Error) => void;
}

export const Formulette: React.FC<FormuletteProps> = ({
  template,
  parameters,
  values,
  onChange,
  onError,
}: FormuletteProps) => {
  const parser = useMemo(() => {
    try {
      return initParser(parameters, values);
    } catch (err) {
      onError(err);
      return;
    }
  }, [parameters, values, onError]);

  const textMacro = useMemo(() => {
    try {
      return initTextMacro(parameters);
    } catch (err) {
      onError(err);
      return;
    }
  }, [parameters, parser]);

  const katexMacros = useMemo(() => {
    try {
      return initKatexMacros(parameters);
    } catch (err) {
      onError(err);
      return;
    }
  }, [parameters, parser]);

  const changeHandler = (name: string) => (value: VariableValue) => {
    onChange(name, value);
  };

  const strippedTemplate = stripHTML(template);

  let renderedTemplate;

  try {
    if (katexMacros === undefined || textMacro === undefined) {
      throw new Error("Macros Uninitialised");
    }
    if (parser === undefined) {
      throw new Error("Parser Uninitialised");
    }
    renderedTemplate = renderTemplate(strippedTemplate, katexMacros, textMacro);
  } catch (err) {
    onError(err);
    renderedTemplate = "";
  }

  const htmlOptions = {
    transform: (node: DomElement, index: number) => {
      if (node.type === "tag" && node.name === "a") {
        const name = node.attribs?.href?.replace("#eval-", "") || "";
        return parser ? (
          <Parameter
            key={`${name}-${index}`}
            name={name}
            value={values[name]}
            parser={parser}
            onChange={changeHandler(name)}
            parameter={parameters[name]}
          />
        ) : <>{name}</>;
      }
      return;
    },
  };

  return (
    <div className="formulette">
      {ReactHtmlParser(renderedTemplate, htmlOptions)}
    </div>
  );
};

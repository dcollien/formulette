import React, { useMemo } from "react";
import "./style.css";

import ReactHtmlParser from "react-html-parser";
import { DomElement } from "domhandler";

import { stripHTML } from "../../util/html";
import { VariableValue, Parameters, Values, Options } from "../../util/types";
import { initParser } from "../../util/formula";
import {
  initTextMacro,
  renderTemplate,
  initKatexMacros,
  evaluateTags,
} from "../../util/template";

import { Parameter } from "./Parameter";

export type FormuletteChangeHandler = (
  name: string,
  value: VariableValue
) => void;

export interface FormuletteProps {
  template: string;
  parameters: Parameters;
  values?: Values;
  onChange?: FormuletteChangeHandler;
  onError?: (err: Error) => void;
  options?: Options
}

export const Formulette: React.FC<FormuletteProps> = ({
  template,
  parameters,
  values = {},
  onChange,
  onError,
  options,
}: FormuletteProps) => {
  const parser = useMemo(() => {
    try {
      return initParser(parameters, values);
    } catch (err) {
      onError && onError(err);
      return;
    }
  }, [parameters, values, onError]);

  const textMacro = useMemo(() => {
    try {
      return initTextMacro(parameters);
    } catch (err) {
      onError && onError(err);
      return;
    }
  }, [parameters, onError]);

  const katexMacros = useMemo(() => {
    try {
      return initKatexMacros(parameters, parser, options);
    } catch (err) {
      onError && onError(err);
      return;
    }
  }, [parameters, onError, parser, options]);

  const renderedTemplate = useMemo(() => {
    const strippedTemplate = stripHTML(template);

    try {
      if (katexMacros === undefined || textMacro === undefined) {
        throw new Error("Macros Uninitialised");
      }
      if (parser === undefined) {
        throw new Error("Parser Uninitialised");
      }
      return renderTemplate(strippedTemplate, katexMacros, textMacro);
    } catch (err) {
      onError && onError(err);
      return `<code>${err.message}</code>`;
    }
  }, [katexMacros, textMacro, template, onError, parser]);  

  const htmlOptions = useMemo(() => {
    const changeHandler = (name: string) => (value: VariableValue) => {
      onChange && onChange(name, value);
    };
  
    return {
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
              options={options}
            />
          ) : <>{name}</>;
        } else if (node.type === "tag" && node.name === "code") {
          const replacedTags = node.children?.map((node) => {
            if (node.type === "text") {
              return <>{evaluateTags(node.data, parameters, parser, options)}</>
            } else {
              return <>{node}</>;
            }
          });
          return <code>{replacedTags}</code>
        }
        return;
      },
    }
  }, [parameters, options, parser, values, onChange]);

  const parsedTemplate = useMemo(() => {
    return ReactHtmlParser(renderedTemplate, htmlOptions)
  }, [renderedTemplate, htmlOptions]);

  return (
    <div className="formulette">
      {parsedTemplate}
    </div>
  );
};

import { init, formula, ExpressionParser } from "expressionparser";
import { ExpressionValue } from "expressionparser/dist/ExpressionParser";

import { Parameters, Values } from "./types";

export const initParser = (parameters: Parameters, values: Values): ExpressionParser => {
  let parser: ExpressionParser | null = null;

  const typeLookup = (term: string) => {
    if (term in parameters) {
      const parameter = parameters[term];
      if (parameter.type === "function") {
        return "function";
      }
    }
    
    return "unknown";
  };

  type ExpressionFunction = (...args: ExpressionValue[]) => ExpressionValue;

  const evaluator = (
    term: string
  ): ExpressionValue | ExpressionFunction => {
    let defaultValue;
    let paramType;

    if (term in parameters) {
      const parameter = parameters[term];
  
      if (parameter.type === "constant") {
        return parameter.value as ExpressionValue;
      } else if (parameter.type === "function") {
        return (...args: ExpressionValue[]) => {
          const kwArgs: Record<string, ExpressionValue> = {};
          parameter.arguments.forEach((argName, index) => {
            kwArgs[argName] = args[index];
          });

          if (parser === null) {
            throw new Error("Not initialised");
          }

          console.log(kwArgs);

          return parser.expressionToValue(parameter.expression, kwArgs);
        };
      } else if (parameter.type === "input") {
        defaultValue = parameter.default;
        paramType = parameter.inputType;
      } else if (parameter.type === "calculation") {
        if (parser !== null) {
          const result = parser.expressionToValue(parameter.expression);
          return result;
        } else {
          throw new Error("Not initialised");
        }
      }
    }
    
    if (term in values && values[term] !== undefined) {
      if (paramType === "number") {
        return Number(values[term]);
      } else {
        return values[term] as ExpressionValue;
      }
    }
  
    if (defaultValue === undefined) {
      if (paramType === "text") {
        return "";
      }
      throw new Error(`Invalid term: ${term}`); 
    }
  
    return defaultValue;
  };

  parser = init(formula, evaluator, typeLookup);

  return parser;
};

import { init, formula, ExpressionParser } from "expressionparser";
import { ExpressionValue } from "expressionparser/dist/ExpressionParser";

import { Parameters, Values } from "./types";

export const initParser = (parameters: Parameters, values: Values): ExpressionParser => {
  let parser: ExpressionParser | null = null;

  const evaluator = (
    term: string
  ): ExpressionValue => {
    let defaultValue;
  
    if (term in parameters) {
      const parameter = parameters[term];
  
      if (parameter.type === "constant") {
        return parameter.value as ExpressionValue;
      } else if (parameter.type === "function") {
        return term;
      } else if (parameter.type === "input") {
        defaultValue = parameter.default;
      } else if (parameter.type === "calculation") {
        if (parser !== null) {
          const result = parser.expressionToValue(parameter.expression);
          console.log(result);
          return result;
        } else {
          throw new Error("Not initialised");
        }
      }
    }
    
    if (term in values && values[term] !== undefined) {
      return values[term] as ExpressionValue;
    }
  
    if (defaultValue === undefined) {
      throw new Error("Invalid term"); 
    }
  
    return defaultValue;
  };

  parser = init(formula, evaluator);

  return parser;
};

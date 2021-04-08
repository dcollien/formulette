import { init, formula, ExpressionParser } from "expressionparser";
import { ExpressionValue } from "expressionparser/dist/ExpressionParser";

import { Parameters, Values } from "./types";

const initTermEvaluator = (parameters: Parameters, values: Values) => (
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
    }
  }
  
  if (term in values && values[term] !== undefined) {
    return values[term] as ExpressionValue;
  }

  return defaultValue;
};

export const initParser = (parameters: Parameters, values: Values): ExpressionParser =>
  init(formula, initTermEvaluator(parameters, values));

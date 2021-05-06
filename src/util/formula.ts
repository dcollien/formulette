import { init, formula, ExpressionParser } from "expressionparser";
import { ExpressionValue } from "expressionparser/dist/ExpressionParser";

import { Parameters, Values } from "./types";

export const initParser = (parameters: Parameters, values: Values): ExpressionParser => {
  let parser: ExpressionParser | null = null;

  const builtIns: {[name: string]: ExpressionFunction} = {
    "CHARTDATA": (keys, values) => {
      if (!Array.isArray(keys) || !Array.isArray(values)) {
        throw new Error("DATATABLE: Values are not an array");
      }

      return keys.map((key: ExpressionValue, i: number) => {
        return {key, value: values[i]};
      });
    },
  };

  const typeLookup = (term: string) => {
    if (term.toUpperCase() in builtIns) {
      return "function";
    }
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
    let result = undefined;

    if (term.toUpperCase() in builtIns) {
      return builtIns[term.toUpperCase()];
    }

    if (term in parameters) {
      const parameter = parameters[term];
  
      if (parameter.type === "constant") {
        result = parameter.value as ExpressionValue;
      } else if (parameter.type === "function") {
        result = (...args: ExpressionValue[]) => {
          const kwArgs: Record<string, ExpressionValue> = {};
          parameter.arguments.forEach((argName, index) => {
            kwArgs[argName] = args[index];
          });

          // TODO memoize result based on term and kwArgs

          if (parser === null) {
            throw new Error("Not initialised");
          }

          let returnVal;
          try {
            returnVal = parser.expressionToValue(parameter.expression, kwArgs);
          } catch (err) {
            throw new Error(`Calculation error in function ${term}: ${err.message} in ${parameter.expression}`);
          }

          return returnVal;
        };
      } else if (parameter.type === "calculation") {
        if (parser !== null) {
          try {
            result = parser.expressionToValue(parameter.expression);
          } catch (err) {
            throw new Error(`Calculation error in ${term}: ${err.message} in ${parameter.expression}`);
          }
        } else {
          throw new Error("Not initialised");
        }
      } else if (parameter.type === "input") {
        defaultValue = parameter.default;
        paramType = parameter.inputType;
      }
    }
    
    if (term in values && values[term] !== undefined) {
      if (paramType === "number") {
        result = Number(values[term]);
      } else {
        result = values[term] as ExpressionValue;
      }
    } else if (result === undefined) {
      if (defaultValue === undefined) {
        if (paramType === "text") {
          result = "";
        } else if (paramType === "number") {
          result = 0;
        } else if (term in parameters) {
          throw new Error(`No default for input: ${term}`);
        } else {
          throw new Error(`Unknown term: ${term}`);
        }
      } else {
        result = defaultValue;
      }
    }

    return result;
  };

  parser = init(formula, evaluator, typeLookup);

  return parser;
};

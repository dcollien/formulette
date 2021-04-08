export type VariableValue =
  | boolean
  | string
  | number
  | undefined
  | VariableValue[]
  | { [key: string]: VariableValue };

export interface ConstantDefinition {
  type: "constant";
  value: VariableValue;
}

export interface FunctionDefinition {
  type: "function";
  arguments: string[];
  expression: string;
}

export interface CalculationDefinition {
  type: "calculation";
  expression: string;
}

export interface InputDefinition {
  type: "input";
  inputType: "text" | "number" | "choice" | "random";
  width?: number;
  default?: number | string;
}

export interface RandomInputDefinition extends InputDefinition {
  inputType: "random";
  range?: {
    type?: "integer" | "float",
    min: {
      value: number;
      inclusive?: boolean;
    };
    max: {
      value: number;
      inclusive?: boolean;
    };
  };
  values?: number[];
  default?: number;
}


export const isRandomInputDefinition = (
  defn: InputDefinition
): defn is RandomInputDefinition => defn.inputType === "random";

export interface ChoiceInputDefinition extends InputDefinition {
  inputType: "choice";
  values: Array<number | string>;
}

export const isChoiceInputDefinition = (
  defn: InputDefinition
): defn is ChoiceInputDefinition => defn.inputType === "choice";

export type ParameterDefinition =
  | ConstantDefinition
  | FunctionDefinition
  | InputDefinition
  | CalculationDefinition;

export type Parameters = Record<string, ParameterDefinition>;
export type Values = Record<string, VariableValue>;

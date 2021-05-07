import { Parameters } from "src/util/types";

const quadratic = String.raw`
Given:
$$a=\${inputa}$$
$$b=\${inputb}$$
$$c=\${inputc}$$

The Quadratic Formula:
$$
x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}
$$

via substitution becomes:
$$
x=\frac{-\${b}\pm \sqrt{\${b}^2-4\times\${a}\times\${c}}}{2\times\${a}} 
$$

Giving:
$$x=\${xPos} \text{ or } \${xNeg}$$
`;

export default {
  template: quadratic,
  parameters: {
    inputa: {
      type: "input",
      inputType: "number",
      width: 100,
      default: 0,
    },
    inputb: {
      type: "input",
      inputType: "number",
      width: 100,
      default: 0,
    },
    inputc: {
      type: "input",
      inputType: "number",
      width: 100,
      default: 0,
    },
    a: {
      type: "calculation",
      expression: "inputa",
    },
    b: {
      type: "calculation",
      expression: "inputb",
    },
    c: {
      type: "calculation",
      expression: "inputc",
    },
    xPos: {
      type: "calculation",
      expression: "(-b + sqrt(b^2 - 4 * a * c))/(2 * a)",
    },
    xNeg: {
      type: "calculation",
      expression: "(-b - sqrt(b^2 - 4 * a * c))/(2 * a)",
    },
  } as Parameters,
  options: {
    nanLabel: "?"
  }
};

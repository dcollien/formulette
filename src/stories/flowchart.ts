import { FormuletteProps } from "src/components/Formulette/Formulette";

const args: FormuletteProps = {
  template: `
\${choice}
~~~mermaid
graph TD
  A[Christmas] -->|Get money| B(Go shopping)
  B --> C{Let me think}
  D[Laptop]
  E[iPhone]
  F[Car]
  C --> \${result}
~~~
`,
  parameters: {
    "choice": {
      type: "input",
      inputType: "choice",
      values: ["D", "E", "F"],
      default: "D"
    },
    "result": {
      type: "calculation",
      expression: "choice"
    }
  }
};

export default args;

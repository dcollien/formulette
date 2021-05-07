import { FormuletteProps } from "src/components/Formulette/Formulette";
import { RandomInputDefinition } from "src/util/types";

const args: FormuletteProps = {
  template: `
  | Name          | Age           | Height    |
  | ------------- |--------------:|:---------:|
  | Agnes         | \${a1}        |  \${h1}   |
  | Bob           | \${a2}        |  \${h2}   |
  | Colin         | \${a3}        |  \${h3}   |
  |**Average**    | **\${avgA}**  | **\${avgH}**  |

\`\`\`vis
  layout: bar
  data: \${data}
\`\`\`
`,
  parameters: {
    "a1": {
      type: "input",
      inputType: "random",
      valueType: "integer",
      range: {
        min: {
          value: 5
        },
        max: {
          value: 100
        }
      },
      default: 30
    } as RandomInputDefinition,
    "a2": {
      type: "input",
      inputType: "choice",
      values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      default: 90
    },
    "a3": {
      type: "input",
      inputType: "number",
      default: 30
    },
    "h1": {
      type: "input",
      inputType: "number",
      default: 155
    },
    "h2": {
      type: "input",
      inputType: "number",
      default: 180
    },
    "h3": {
      type: "input",
      inputType: "number",
      default: 175
    },
    "avgA": {
      type: "calculation",
      expression: "round(100*(a1 + a2 + a3)/3)/100"
    },
    "avgH": {
      type: "calculation",
      expression: "round(100*(h1 + h2 + h3)/3)/100"
    },
    "va1": {
      type: "calculation",
      expression: "a1"
    },
    "va2": {
      type: "calculation",
      expression: "a2"
    },
    "va3": {
      type: "calculation",
      expression: "a3"
    },
    "data": {
      type: "calculation",
      expression: `chartdata(["Agnes", "Bob", "Colin"], [va1, va2, va3])`
    }
  }
};

export default args;

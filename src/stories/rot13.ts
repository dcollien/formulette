import { FormuletteProps } from "src/components/Formulette/Formulette";

const args: FormuletteProps = {
  template: `
Input:

\${input}

Output:

\`
\${output}
\`
  `,
  parameters: {
    input: {
      type: "input",
      inputType: "text",
      default: "Hello World",
      width: "100%",
      height: 100
    },

    output: {
      type: "calculation",
      expression: "rot13(input)"
    },

    chartoint: {
      "type": "function",
      "arguments": ["c", "a"],
      "expression": 'code(c) - code(a)'
    },
    inttochar: {
      "type": "function",
      "arguments": ["i", "a"],
      "expression": 'char(i + code(a))'
    },
    rotint: {
      "type": "function",
      "arguments": ["i", "n"],
      "expression": 'if (i < 0 or i >= 26, i, (i + n) % 26)'
    },
    rotcharby: {
      "type": "function",
      "arguments": ["c", "a", "n"],
      "expression": 'inttochar(rotint(chartoint(c, a), n), a)'
    },
    rot13letters: {
      "type": "function",
      "arguments": ["c"],
      "expression": 'if(c = upper(c), rotcharby(c, "A", 13), rotcharby(c, "a", 13))'
    },
    rot13: {
      type: "function",
      arguments: ["text"],
      expression: "string(map(rot13letters, chararray(text)))"
    }
  },
  options: {

  }
};

export default args;

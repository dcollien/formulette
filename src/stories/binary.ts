
import { FormuletteProps } from "src/components/Formulette/Formulette";
import { TextInputDefinition } from "src/util/types";

const template = `

# Decimal to Binary

|               |                  |
|:--------------|-----------------:|
|Decimal value: | \${decimalInput}  |
|Binary value:  |\`\${bin}\`          |


Digits left-to-right are from the remainders, bottom-to-top:

| Step | Value        | Calculation                                                                                     |
|:-----|-------------:|------------------------------------------------------------------------------------------------:|
| 0    | \\( \\\${x0} \\) | \\( \\tfrac{\\\${x0}}{2} = \\textcolor{green}{\\\${x1}} \\text{ remainder } \\textcolor{blue}{\\\${d0}} \\) |
| 2    | \\( \\\${x2} \\) | \\( \\tfrac{\\\${x2}}{2} = \\textcolor{green}{\\\${x3}} \\text{ remainder } \\textcolor{blue}{\\\${d2}} \\) |
| 3    | \\( \\\${x3} \\) | \\( \\tfrac{\\\${x3}}{2} = \\textcolor{green}{\\\${x4}} \\text{ remainder } \\textcolor{blue}{\\\${d3}} \\) |
| 4    | \\( \\\${x4} \\) | \\( \\tfrac{\\\${x4}}{2} = \\textcolor{green}{\\\${x5}} \\text{ remainder } \\textcolor{blue}{\\\${d4}} \\) |
| 5    | \\( \\\${x5} \\) | \\( \\tfrac{\\\${x5}}{2} = \\textcolor{green}{\\\${x6}} \\text{ remainder } \\textcolor{blue}{\\\${d5}} \\) |
| 6    | \\( \\\${x6} \\) | \\( \\tfrac{\\\${x6}}{2} = \\textcolor{green}{\\\${x7}} \\text{ remainder } \\textcolor{blue}{\\\${d6}} \\) |
| 7    | \\( \\\${x7} \\) | \\( \\tfrac{\\\${x7}}{2} = \\textcolor{green}{\\\${x8}} \\text{ remainder } \\textcolor{blue}{\\\${d7}} \\) |
| 1    | \\( \\\${x1} \\) | \\( \\tfrac{\\\${x1}}{2} = \\textcolor{green}{\\\${x2}} \\text{ remainder } \\textcolor{blue}{\\\${d1}} \\) |

... etc.

# Binary to Decimal

|               |                  |
|:--------------|-----------------:|
|Binary value:  | \${binaryInput}   |
|Decimal value: |\`\${dec}\`          |

Calculating vertically and adding up the bottom row:


|              | \\(2^7\\)    | \\(2^6\\)    | \\(2^5\\)    | \\(2^4\\)    | \\(2^3\\)    | \\(2^2\\)    | \\(2^1\\)    | \\(2^0\\)    |                 |
|:-------------|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|:----------:|----------------:|
| Powers of 2: | 128        | 64         | 32         | 16         | 8          | 4          | 2          | 0          |                 |
|              | \\(\\times\\) | \\(\\times\\) | \\(\\times\\) | \\(\\times\\) | \\(\\times\\) | \\(\\times\\) | \\(\\times\\) | \\(\\times\\) |                 |
| Digits:      | \${b7}      |   \${b6}    |   \${b5}    |   \${b4}    |   \${b3}    |   \${b2}    |   \${b1}    |   \${b0}    |                 |
|              | \\(=\\)      | \\(=\\)      | \\(=\\)      | \\(=\\)      | \\(=\\)      | \\(=\\)      | \\(=\\)      | \\(=\\)      |                 |
|              | \${c7}      |   \${c6}    |   \${c5}    |   \${c4}    |   \${c3}    |   \${c2}    |   \${c1}    |   \${c0}    |                 | 
| Giving:      |            |            |            |            |            |            |            |            |                 |
|              | \${c7} +    |   \${c6} +  |   \${c5} +  |   \${c4} +  |   \${c3} +  |   \${c2} +  |   \${c1} +  |   \${c0}    | \\( = \\\${dec} \\) |
`;


const args: FormuletteProps = {
  template,
  parameters: {
    "decimalInput": {
      "type": "input",
      "inputType": "number",
      "default": 100
    },
    "binaryInput": {
      "type": "input",
      "inputType": "text",
      "default": "101010",
      "maxLength": 8
    } as TextInputDefinition,
    "dec": {
      "type": "calculation",
      "expression": "bin2dec(binaryInput)"
    },
    "bin": {
      "type": "calculation",
      "expression": "dec2bin(decimalInput)"
    },
    "x0": {
      "type": "calculation",
      "expression": "decimalInput"
    },
    "x1": {
      "type": "calculation",
      "expression": "floor(x0 / 2)"
    },
    "x2": {
      "type": "calculation",
      "expression": "floor(x1 / 2)"
    },
    "x3": {
      "type": "calculation",
      "expression": "floor(x2 / 2)"
    },
    "x4": {
      "type": "calculation",
      "expression": "floor(x3 / 2)"
    },
    "x5": {
      "type": "calculation",
      "expression": "floor(x4 / 2)"
    },
    "x6": {
      "type": "calculation",
      "expression": "floor(x5 / 2)"
    },
    "x7": {
      "type": "calculation",
      "expression": "floor(x6 / 2)"
    },
    "x8": {
      "type": "calculation",
      "expression": "floor(x7 / 2)"
    },
    "d0": {
      "type": "calculation",
      "expression": "mod(x0, 2)"
    },
    "d1": {
      "type": "calculation",
      "expression": "mod(x1, 2)"
    },
    "d2": {
      "type": "calculation",
      "expression": "mod(x2, 2)"
    },
    "d3": {
      "type": "calculation",
      "expression": "mod(x3, 2)"
    },
    "d4": {
      "type": "calculation",
      "expression": "mod(x4, 2)"
    },
    "d5": {
      "type": "calculation",
      "expression": "mod(x5, 2)"
    },
    "d6": {
      "type": "calculation",
      "expression": "mod(x6, 2)"
    },
    "d7": {
      "type": "calculation",
      "expression": "mod(x7, 2)"
    },
    "isBinary": {
      "type": "function",
      "arguments": ["digit"],
      "expression": "(digit = \"0\" OR digit = \"1\")"
    },
    "binaryDigits": {
      "type": "calculation",
      "expression": "filter(isBinary, chararray(binaryInput))"
    },
    "handleUndefined": {
      "type": "function",
      "arguments": ["value"],
      "expression": "if(value = UNDEFINED, \"0\", value)"
    },
    "getDigit": {
      "type": "function",
      "arguments": ["i"],
      "expression": "handleUndefined(index(binaryDigits, length(binaryDigits) - i - 1))"
    },
    "b0": {
      "type": "calculation",
      "expression": "getDigit(0)"
    },
    "b1": {
      "type": "calculation",
      "expression": "getDigit(1)"
    },
    "b2": {
      "type": "calculation",
      "expression": "getDigit(2)"
    },
    "b3": {
      "type": "calculation",
      "expression": "getDigit(3)"
    },
    "b4": {
      "type": "calculation",
      "expression": "getDigit(4)"
    },
    "b5": {
      "type": "calculation",
      "expression": "getDigit(5)"
    },
    "b6": {
      "type": "calculation",
      "expression": "getDigit(6)"
    },
    "b7": {
      "type": "calculation",
      "expression": "getDigit(7)"
    },
    "c7": {
      "type": "calculation",
      "expression": "STR2DEC(b7) * 128"
    },
    "c6": {
      "type": "calculation",
      "expression": "STR2DEC(b6) * 64"
    },
    "c5": {
      "type": "calculation",
      "expression": "STR2DEC(b5) * 32"
    },
    "c4": {
      "type": "calculation",
      "expression": "STR2DEC(b4) * 16"
    },
    "c3": {
      "type": "calculation",
      "expression": "STR2DEC(b3) * 8"
    },
    "c2": {
      "type": "calculation",
      "expression": "STR2DEC(b2) * 4"
    },
    "c1": {
      "type": "calculation",
      "expression": "STR2DEC(b1) * 2"
    },
    "c0": {
      "type": "calculation",
      "expression": "STR2DEC(b1) * 1"
    },
  }
};

export default args;

import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
  Formulette,
  FormuletteProps,
} from "../components/Formulette/Formulette";
import { useState } from "react";
import { RandomInputDefinition, Values } from "../util/types";

import quadratic from "./quadratic.txt";
import rot13 from './rot13';
import table from './table';
import binary from './binary';
import flowchart from './flowchart';

export default {
  title: "Formulette",
  component: Formulette,
} as Meta;

const Template: Story<FormuletteProps> = (args) => {
  const [values, setValues] = useState<Values>({});

  const onChange = (name: string, value: any) => {
    setValues({ ...values, [name]: value });
  };

  const onError = (err: Error) => {
    console.log(err);
  };

  return (
    <>
      <Formulette
        template={args.template}
        parameters={args.parameters}
        onChange={onChange}
        onError={onError}
        values={values}
        options={args.options}
      />
    </>
  );
};

export const SquareRoot = Template.bind({});
SquareRoot.args = {
  template: `
# Test

\${x} = \${yyy}

$$ \\sqrt{\\\${yyy}} = \\\${z} $$

`,
  parameters: {
    x: {
      type: "input",
      inputType: "choice",
      width: 100,
      values: [0.1, 0.2, 0.3, 0.4, 0.5],
      default: 0.1,
    },
    yyy: {
      type: "calculation",
      expression: "x",
    },
    z: {
      type: "calculation",
      expression: "SQRT(x)",
    },
  },
};

export const QuadraticFormula = Template.bind({});
QuadraticFormula.args = {
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
  },
  options: {
    nanLabel: "?"
  }
};


export const RandomSquareRoot = Template.bind({});
RandomSquareRoot.args = {
  template: String.raw`
$$ x = \frac{\sqrt{\${in}} + 5}{2} $$
$$ x = \${out} $$
`,
  parameters: {
    in: {
      type: "input",
      inputType: "random",
      width: 100,
      range: {
        min: {
          value: 0,
          inclusive: true
        },
        max: {
          value: 10,
          inclusive: true
        },
        type: "integer"
      },
      default: 0,
    } as RandomInputDefinition,
    out: {
      type: "calculation",
      expression: "(SQRT(in) + 5)/2",
    },
  },
};

export const Rot13 = Template.bind({});
Rot13.args = rot13;

export const Table = Template.bind({});
Table.args = table;

export const Binary = Template.bind({});
Binary.args = binary;

export const FlowChart = Template.bind({});
FlowChart.args = flowchart;

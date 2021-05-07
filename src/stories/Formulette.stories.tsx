import React, { useState } from "react";
import { Story, Meta } from "@storybook/react";

import {
  Formulette,
  FormuletteProps,
} from "../components/Formulette/Formulette";

import { RandomInputDefinition, Values } from "../util/types";

import quadratic from "./quadratic";
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
QuadraticFormula.args = quadratic;

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
      valueType: "integer",
      range: {
        min: {
          value: 0,
          inclusive: true
        },
        max: {
          value: 10,
          inclusive: true
        }
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

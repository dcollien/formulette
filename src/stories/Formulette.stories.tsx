import React from "react";
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from "@storybook/react/types-6-0";

import {
  Formulette,
  FormuletteProps,
} from "../components/Formulette/Formulette";
import { useState } from "react";
import { Values } from "../util/types";

export default {
  title: "Formulette",
  component: Formulette,
} as Meta;

const Template: Story<FormuletteProps> = (args: unknown) => {
  const [values, setValues] = useState<Values>({});
  const [error, setError] = useState<Error>(null);

  const onChange = (name: string, value: unknown) => {
    // setValues({ ...values, [name]: value });
  };

  const onError = (err: Error) => {
    console.log(err);
    // setError(err);
  };

  return (
    <>
      <Formulette
        {...args}
        onChange={onChange}
        onError={onError}
        values={values}
      />
      {error && <pre>{error.toString()}</pre>}
    </>
  );
};

export const ExampleA = Template.bind({});
ExampleA.args = {
  template: `
# Test

\${x} = \${yyy}

$$ \\sqrt{\\eval{yyy}} = \\eval{z} $$

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

export const ExampleB = Template.bind({});
ExampleB.args = {
  template: `
$$x=\\frac{-b\\pm \\sqrt{b^2-4ac}}{2a}$$

$$a=\\eval{inputa}$$
$$b=\\eval{inputb}$$
$$c=\\eval{inputc}$$

$$x=\\eval{xPos} \\text{or} \\eval{xNeg}$$
`,
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
      expression: "-b + (4 * sqrt(b^2 - 4 * a * c))/(2 * a)",
    },
    xNeg: {
      type: "calculation",
      expression: "-b - (4 * sqrt(b^2 - 4 * a * c))/(2 * a)",
    },
  },
};

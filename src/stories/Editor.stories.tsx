import React, { useState } from "react";

import { Story, Meta } from "@storybook/react";

import quadratic from "./quadratic";
import rot13 from './rot13';

import {
  Options,
  Parameters,
  Values,
} from "../util/types";

import { ChangeHandler, Editor } from "../components/Editor/Editor";
import { Formulette } from "../components/Formulette/Formulette";

import binary from "./binary";

export default {
  title: "Editor",
  component: Editor,
} as Meta;

const showDebug = false;

const Template: Story<{
  options?: Options;
  parameters?: Parameters;
  template?: string;
}> = (args) => {
  const [options, setOptions] = useState<Values>(args.options || {});
  const [params, setParams] = useState<Parameters>(args.parameters || {});
  const template = args.template || "";
  const [currTemplate, setTemplate] = useState<string>(template);
  const [values, setValues] = useState<Values>({});

  const onValuesChange = (name: string, value: any) => {
    setValues({ ...values, [name]: value });
  };

  const onOptionChange: ChangeHandler<Options> = (name, value) => {
    setOptions({
      ...options,
      [name]: value,
    });
  };

  const onParametersChange = (updatedParams: Parameters) => setParams(updatedParams);

  const onTemplateChange = (value: string) => {
    setTemplate(value);
  };

  const onError = (err: Error) => {
    console.log(err);
  };

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: showDebug ? "50% 25% 25%" : "100%",
          fontFamily: "monospace",
          width: "100%"
        }}
      >
        <div style={{ border: "1px solid black", padding: "6px" }}>
          <Formulette
            template={currTemplate}
            parameters={params}
            values={values}
            onChange={onValuesChange}
            options={options}
          />
        </div>
        {showDebug && (
          <>
            <div style={{ border: "1px solid black", padding: "6px" }}>
              Debug Parameters:
              <code>
                <pre>{JSON.stringify(params, null, 2)}</pre>
              </code>
            </div>
            <div style={{ border: "1px solid black", padding: "6px" }}>
              Debug Values:
              <code>
                <pre>{JSON.stringify(values, null, 2)}</pre>
              </code>
            </div>
          </>
        )}
      </div>
      <Editor
        options={options}
        template={template}
        parameters={params}
        onOptionChange={onOptionChange}
        onParametersChange={onParametersChange}
        onTemplateChange={onTemplateChange}
        onError={onError}
      />
    </>
  );
};

export const Empty = Template.bind({});
Empty.args = {
  template: "",
  parameters: {},
};

export const Binary = Template.bind({});
Binary.args = binary;

export const QuadraticFormula = Template.bind({});
QuadraticFormula.args = quadratic;

export const Rot13 = Template.bind({});
Rot13.args = rot13;



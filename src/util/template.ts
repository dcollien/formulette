import katex from "katex";
import marked from "marked";

import { ExpressionParser } from "expressionparser";

import { ParameterDefinition, Parameters } from "./types";

interface Context {
  consumeArgs: (numArgs: number) => { text: string }[][];
}

const variableRenderer = (
  parameter: ParameterDefinition,
  parser: ExpressionParser,
  inputRenderer: () => string
) => {
  if (parameter.type === "constant") {
    return parameter.value + "";
  } else if (parameter.type === "calculation") {
    const evaluated = parser.expressionToValue(parameter.expression);
    if (typeof evaluated === "string") {
      return evaluated;
    } else {
      return JSON.stringify(evaluated);
    }
  } else {
    return inputRenderer();
  }
};

type KatexMacros = { [name: string]: string | ((context: Context) => string) };

const fixLatex = (inLatex: string) =>
  inLatex
    .replace("\\begin{align}", "\\begin{aligned}")
    .replace("\\end{align}", "\\end{aligned}");

export const initKatexMacros = (
  parameters: Parameters,
  parser: ExpressionParser
): KatexMacros => ({
  "\\evalb": "\\htmlData{type=var, name=#1}{#1}",
  "\\eval": (context: Context) => {
    const args = context.consumeArgs(1)[0];

    let name: string;
    if (args.length === 1) {
      name = args[0].text;
    } else {
      name = args
        .map((arg) => arg.text)
        .reverse()
        .join("");
    }

    const parameter = parameters[name];

    console.log(context);
    console.log(args);
    console.log(name);

    if (parameter === undefined) {
      throw new Error(`${name} is not defined`);
    }

    return variableRenderer(
      parameter,
      parser,
      () => `\\href{#eval-${name}}{${name}}`
    );
  },
});

type TextMacro = (name: string) => string;

export const initTextMacro = (
  parameters: Parameters,
  parser: ExpressionParser
): TextMacro => (name: string) => {
  const parameter = parameters[name];

  if (parameter === undefined) {
    throw new Error(`${name} is not defined`);
  }

  return variableRenderer(
    parameter,
    parser,
    () => `<a href="#eval-${name}">${name}</a>`
  );
};

const renderTextSection = (
  template: string,
  katexMacros: KatexMacros,
  renderVariable: TextMacro
) => {
  const inlineChunks = template.split(/\\\((.+)?\\\)/g);

  for (let i = 0; i < inlineChunks.length; i++) {
    if (i % 2 !== 0) {
      // Render inline equation sections
      inlineChunks[i] = katex.renderToString(fixLatex(inlineChunks[i]), {
        macros: katexMacros,
        trust: true,
      });
    } else {
      // Render variables (or insert placeholders)
      inlineChunks[i] = inlineChunks[i].replace(
        /\$\{([^}]+)?\}/g,
        (_match, p1) => renderVariable(p1)
      );
    }
  }

  // Markdown parse the document
  const renderedVariables = inlineChunks.join("");
  return marked(renderedVariables);
};

// Render the template text to HTML, including equations and placeholders
export const renderTemplate = (
  template: string,
  katexMacros: KatexMacros,
  renderVariable: TextMacro
): string => {
  const blockChunks = template.split(/\$\$(.+)?\$\$/g);

  for (let i = 0; i < blockChunks.length; i++) {
    if (i % 2 === 0) {
      blockChunks[i] = renderTextSection(
        blockChunks[i],
        katexMacros,
        renderVariable
      );
    } else {
      blockChunks[i] =
        "<p>" +
        katex.renderToString(fixLatex(blockChunks[i]), {
          macros: katexMacros,
          displayMode: true,
          trust: true,
        }) +
        "</p>";
    }
  }

  return blockChunks.join("\n");
};

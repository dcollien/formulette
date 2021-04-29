import { ExpressionParser } from "expressionparser";
import katex from "katex";
import MarkdownIt from "markdown-it";
import vis from "markvis";
import * as d3 from "d3";

import { Options, Parameters } from "./types";

interface Context {
  consumeArgs: (numArgs: number) => { text: string }[][];
}

type KatexMacros = { [name: string]: string | ((context: Context) => string) };

const fixLatex = (inLatex: string) =>
  inLatex
    .replace("\\begin{align}", "\\begin{aligned}")
    .replace("\\end{align}", "\\end{aligned}");

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
}).use(vis);

export const renderEvaluation = (parser: ExpressionParser | undefined, expression: string, options?: Options): string => {
  if (!parser) throw new Error("Parser Uninitialised");

  const evaluated = parser.expressionToValue(expression);
  if (typeof evaluated === "string") {
    return evaluated;
  } else if (evaluated === null) {
    return options?.nullLabel || "Null";
  } else if (typeof(evaluated) === 'number' && isNaN(evaluated)) {
    return options?.nanLabel || "NaN";
  } else if (evaluated === undefined) {
    return options?.undefinedLabel || "Undefined";
  } else {
    return JSON.stringify(evaluated);
  }
};

export const evaluateTags = (html: string, parameters: Parameters, parser: ExpressionParser | undefined, options?: Options): string => {
  return html.replace(/<a href="#eval-(\w+)">\w+<\/a>/gm, (_match, name) => {
    const parameter = parameters[name];
    
    if (!parameter || parameter.type !== "calculation") {
      throw new Error("Attempting to evaluate non-calculation");
    }
    return renderEvaluation(parser, parameter.expression, options)
  });
};

export const initKatexMacros = (
  parameters: Parameters,
  parser?: ExpressionParser,
  options?: Options
): KatexMacros => {
  const template = (context: Context) => {
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

    if (parameter === undefined) {
      throw new Error(`${name} is not defined`);
    }

    if (parameter.type === "calculation") {
      return renderEvaluation(parser, parameter.expression, options);
    } else {
      return `\\href{#eval-${name}}{${name}}`;
    }
  };

  return {
    "\\eval": template,
    "\\$": template
  }
};

type TextMacro = (name: string) => string;

export const initTextMacro = (
  parameters: Parameters,
  parser?: ExpressionParser,
  options?: Options
): TextMacro => (name: string) => {
  const parameter = parameters[name];

  if (parameter === undefined) {
    throw new Error(`${name} is not defined`);
  }

  if (parameter.type === "calculation") {
    return renderEvaluation(parser, parameter.expression, options);
  } else {
    return `<a href="#eval-${name}">${name}</a>`;
  }
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
  return md.render(renderedVariables, { d3 });
};

// Render the template text to HTML, including equations and placeholders
export const renderTemplate = (
  template: string,
  katexMacros: KatexMacros,
  renderVariable: TextMacro
): string => {
  const blockChunks = template.split("$$");

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

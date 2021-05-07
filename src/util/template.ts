import { ExpressionParser } from "expressionparser";
import katex from "katex";
import MarkdownIt from "markdown-it";
import markdownItMermaid from "@liradb2000/markdown-it-mermaid";
import vis from "markvis";
import * as d3 from "d3";

import { CalculationDefinition, Options, Parameters } from "./types";

interface Context {
  consumeArgs: (numArgs: number) => { text: string }[][];
}

type KatexMacros = { [name: string]: string | ((context: Context) => string) };

const fixLatex = (inLatex: string) =>
  inLatex
    .replace("\\begin{align}", "\\begin{aligned}")
    .replace("\\end{align}", "\\end{aligned}");

const chartContainerHtml = `<div id="container"><div id="chart"></div></div>`;

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
})
  .use(vis)
  .use(markdownItMermaid);

export const renderEvaluation = (
  parser: ExpressionParser | undefined,
  term: string,
  parameter: CalculationDefinition,
  options?: Options
): string => {
  if (!parser) throw new Error("Parser Uninitialised");

  try {
    const evaluated = parser.expressionToValue(parameter.expression);
    if (typeof evaluated === "string") {
      return evaluated;
    } else if (evaluated === null) {
      return options?.nullLabel || "Null";
    } else if (typeof evaluated === "number" && isNaN(evaluated)) {
      return options?.nanLabel || "NaN";
    } else if (evaluated === undefined) {
      return options?.undefinedLabel || "Undefined";
    } else {
      return JSON.stringify(evaluated);
    }
  } catch (err) {
    throw new Error(
      `Unable to evaluate ${term} "${parameter.expression}": ${err.message}`
    );
  }
};

// Used for pure HTML, e.g. <code> tags
export const evaluateTags = (
  html: string,
  parameters: Parameters,
  parser: ExpressionParser | undefined,
  options?: Options
): string => {
  return html.replace(/<a href="#eval-(\w+)">\w+<\/a>/gm, (_match, name) => {
    const parameter = parameters[name];

    if (!parameter || parameter.type !== "calculation") {
      throw new Error("Attempting to evaluate non-calculation");
    }
    return renderEvaluation(parser, name, parameter, options);
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
      return renderEvaluation(parser, name, parameter, options);
    } else {
      return `\\href{#eval-${name}}{${name}}`;
    }
  };

  return {
    "\\eval": template,
    "\\$": template,
  };
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
    return renderEvaluation(parser, name, parameter, options);
  } else {
    return `<a href="#eval-${name}">${name}</a>`;
  }
};

const enhanceKatexError = (err: string) => {
  const commonDollar = "KaTeX parse error: Can't use function '$' in math mode";
  let newErr = err.replace(
    commonDollar,
    `Can't use "$". Did you mean to use "\\$"? In math mode`
  );

  newErr = newErr.replace("KaTeX parse error:", "");
  return newErr;
};

const extractVariablesKatex = (katex:string) => {
  const variables: Array<string> = [];

  katex.replace(
    /\\\$\{([^}]+)?\}/g,
    (_match, p1) => {
      variables.push(p1);
      return '';
    }
  );

  return variables;
};

const extractVariablesTextSection = (
  template: string
) => {
  let variables: Array<string> = [];

  const inlineChunks = template.split("\\(").join("\\)").split("\\)");

  const replacer = (_match: string, p1: string) => {
    variables.push(p1);
    return '';
  };

  for (let i = 0; i < inlineChunks.length; i++) {
    if (i % 2 !== 0) {
      variables = variables.concat(extractVariablesKatex(inlineChunks[i]));
    } else {
      inlineChunks[i].replace(
        /\$\{([^}]+)?\}/g,
        replacer
      );
    }
  }
  return variables;
}

const renderTextSection = (
  template: string,
  katexMacros: KatexMacros,
  renderVariable: TextMacro
) => {
  const inlineChunks = template.split("\\(").join("\\)").split("\\)");

  for (let i = 0; i < inlineChunks.length; i++) {
    if (i % 2 !== 0) {
      // Render inline equation sections
      try {
        inlineChunks[i] = katex.renderToString(fixLatex(inlineChunks[i]), {
          macros: katexMacros,
          trust: true,
        });
      } catch (err) {
        const message = enhanceKatexError(err.message);
        throw new Error(
          `Inline equation error in "\\(${inlineChunks[i]}\\)": ${message}`
        );
      }
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
  return md.render(renderedVariables, {
    d3,
    container: chartContainerHtml,
    colors: d3.schemeSet3,
  });
};

export const extractVariables = (
  template: string
): Array<string> => {
  let variables: Array<string> = [];
  const blockChunks = template.split("$$");

  for (let i = 0; i < blockChunks.length; i++) {
    if (i % 2 === 0) {
      variables = variables.concat(extractVariablesTextSection(blockChunks[i]));
    } else {
      variables = variables.concat(extractVariablesKatex(blockChunks[i]));
    }
  }

  return variables;
}

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

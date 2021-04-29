import katex from "katex";
import marked from "marked";

import { Parameters } from "./types";

interface Context {
  consumeArgs: (numArgs: number) => { text: string }[][];
}

type KatexMacros = { [name: string]: string | ((context: Context) => string) };

const fixLatex = (inLatex: string) =>
  inLatex
    .replace("\\begin{align}", "\\begin{aligned}")
    .replace("\\end{align}", "\\end{aligned}");

export const initKatexMacros = (
  parameters: Parameters
): KatexMacros => ({
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

    if (parameter === undefined) {
      throw new Error(`${name} is not defined`);
    }

    return `\\href{#eval-${name}}{${name}}`;
  },
});

type TextMacro = (name: string) => string;

export const initTextMacro = (
  parameters: Parameters
): TextMacro => (name: string) => {
  const parameter = parameters[name];

  if (parameter === undefined) {
    throw new Error(`${name} is not defined`);
  }

  return `<a href="#eval-${name}">${name}</a>`;
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

import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

// ==================================================================================
// SECTION 1: HELPER FUNCTIONS
// ==================================================================================

function generateCssVariables(theme: any): string {
  const variables: string[] = [];
  const addVariables = (obj: any, prefix: string[] = []) => {
    for (const key in obj) {
      const newPrefix = [...prefix, key];
      const value = obj[key];
      if (typeof value === "string") {
        variables.push(`--${newPrefix.join("-")}: ${value};`);
      } else if (typeof value === "object" && value !== null) {
        addVariables(value, newPrefix);
      }
    }
  };
  if (theme.colors) addVariables(theme.colors, ["color"]);
  if (theme.fonts) {
    variables.push(`--font-heading: "${theme.fonts.heading}", sans-serif;`);
    variables.push(`--font-body: "${theme.fonts.body}", sans-serif;`);
  }
  return `:root {\n  ${variables.join("\n  ")}\n}`;
}

function getGoogleFontsUrl(theme: any): string {
  if (!theme.fonts || !theme.fonts.heading || !theme.fonts.body) return "";
  const headingFont = theme.fonts.heading.replace(/ /g, "+");
  const bodyFont = theme.fonts.body.replace(/ /g, "+");
  const fonts = new Set([headingFont, bodyFont]);
  return `https://fonts.googleapis.com/css2?${Array.from(fonts)
    .map((f) => `family=${f}:wght@400;700`)
    .join("&")}&display=swap`;
}

function generateLayoutCode(seo: any, theme: any): string {
  const googleFontsUrl = getGoogleFontsUrl(theme);
  return `
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${seo.title.replace(/"/g, '\\"')}",
  description: "${seo.description.replace(/"/g, '\\"')}",
  keywords: "${seo.keywords.replace(/"/g, '\\"')}",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="${googleFontsUrl}" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}`;
}

function serializeProps(props: Record<string, any>): string {
  return Object.entries(props)
    .map(([key, value]) => {
      if (key === "canvas") return "";
      if (typeof value === "string")
        return `${key}="${value.replace(/"/g, '\\"')}"`;
      if (typeof value === "object") return `${key}={${JSON.stringify(value)}}`;
      return `${key}={${value}}`;
    })
    .join(" ");
}

function generateNodeJsx(nodeId: string, nodes: Record<string, any>): string {
  const node = nodes[nodeId];
  if (!node) return "";
  if (nodeId === "ROOT")
    return node.nodes
      .map((childId: string) => generateNodeJsx(childId, nodes))
      .join("\n");
  const tagName = node.type?.resolvedName || node.type;
  if (!tagName) return "";
  const propsString = serializeProps(node.props);
  if (node.nodes && node.nodes.length > 0) {
    const childrenJsx = node.nodes
      .map((childId: string) => generateNodeJsx(childId, nodes))
      .join("\n");
    return `<${tagName} ${propsString}>${childrenJsx}</${tagName}>`;
  }
  return `<${tagName} ${propsString} />`;
}

function generatePageCode(
  nodes: Record<string, any>,
  usedComponents: string[],
): string {
  const rootNode = nodes["ROOT"];
  const rootProps = serializeProps(rootNode.props);
  const rootChildrenJsx = generateNodeJsx("ROOT", nodes);
  const imports = usedComponents
    .map((name) => `import { ${name} } from "./components/${name}";`)
    .join("\n");
  return `
"use client";
import React from "react";
${imports}

export default function Page() {
  return (
    <div ${rootProps}>
      ${rootChildrenJsx}
    </div>
  );
}`;
}

function findComponentPath(
  componentName: string,
  directory: string,
): string | null {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    if (item.isDirectory()) {
      const found = findComponentPath(componentName, fullPath);
      if (found) return found;
    } else if (
      item.isFile() &&
      path.basename(item.name, ".tsx") === componentName
    ) {
      return fullPath;
    }
  }
  return null;
}

// ==================================================================================
// SECTION 2: THE DEFINITIVE AST TRANSFORMATION
// ==================================================================================

function convertToPureComponent(inputPath: string, outputPath: string) {
  const code = fs.readFileSync(inputPath, "utf-8");
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let styleDeclaration: t.VariableDeclaration | null = null;
  let hasTextProp = false;
  let hasChildrenProp = false;

  traverse(ast, {
    VariableDeclarator(path: {
      node: { id: t.Node | null | undefined; init: t.Node | null | undefined };
      get: (arg0: string) => {
        (): any;
        new (): any;
        traverse: {
          (arg0: {
            CallExpression?: (callPath: any) => void;
            VariableDeclarator?: (innerPath: any) => void;
          }): void;
          new (): any;
        };
      };
    }) {
      const isComponent =
        t.isIdentifier(path.node.id) &&
        /^[A-Z]/.test(path.node.id.name) &&
        t.isArrowFunctionExpression(path.node.init);
      if (isComponent) {
        path.get("init.body").traverse({
          CallExpression(callPath) {
            if (
              t.isIdentifier(callPath.node.callee) &&
              callPath.node.callee.name === "useMemo"
            ) {
              const depArrayPath = callPath.get("arguments.1");
              if (depArrayPath && depArrayPath.isArrayExpression()) {
                const newElements = depArrayPath.node.elements.filter((el) => {
                  return !(
                    t.isIdentifier(el) &&
                    ["selected", "editing", "theme"].includes(el.name)
                  );
                });
                depArrayPath.node.elements = newElements;
              }
              callPath.get("arguments.0").traverse({
                ObjectProperty(propPath: {
                  node: { key: t.Identifier };
                  remove: () => void;
                }) {
                  const key = propPath.node.key as t.Identifier;
                  if (
                    [
                      "outline",
                      "outlineOffset",
                      "transition",
                      "cursor",
                    ].includes(key.name)
                  ) {
                    propPath.remove();
                  }
                },
              });
            }
          },
        });

        path.get("init.body").traverse({
          VariableDeclarator(innerPath) {
            if (
              t.isIdentifier(innerPath.node.id) &&
              innerPath.node.id.name === "style"
            ) {
              styleDeclaration = innerPath.parentPath
                .node as t.VariableDeclaration;
            }
          },
        });

        const props = (path.node.init as t.ArrowFunctionExpression)
          .params[0] as t.ObjectPattern;
        props.properties.forEach((prop) => {
          if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
            if (prop.key.name === "text") hasTextProp = true;
            if (prop.key.name === "children") hasChildrenProp = true;
          }
        });
      }
    },
  });

  traverse(ast, {
    ImportDeclaration(path: {
      node: { source: { value: any } };
      remove: () => void;
      replaceWith: (arg0: t.ImportDeclaration) => void;
    }) {
      const source = path.node.source.value;
      if (source.includes("@craftjs/core")) {
        path.remove();
        return;
      }
      if (source.startsWith("~/themes")) {
        const themeImportSpecifier = t.importSpecifier(
          t.identifier("theme"),
          t.identifier("theme"),
        );
        const newImport = t.importDeclaration(
          [themeImportSpecifier],
          t.stringLiteral("../../theme"),
        );
        path.replaceWith(newImport);
      }
    },

    ExpressionStatement(path: {
      node: { expression: t.Node | null | undefined };
      remove: () => void;
    }) {
      if (
        t.isAssignmentExpression(path.node.expression) &&
        t.isMemberExpression(path.node.expression.left) &&
        t.isIdentifier(path.node.expression.left.property, { name: "craft" })
      ) {
        path.remove();
      }
    },

    ArrowFunctionExpression(path: {
      findParent: (arg0: (p: any) => any) => any;
      get: (arg0: string) => {
        (): any;
        new (): any;
        replaceWith: { (arg0: t.BlockStatement): void; new (): any };
      };
    }) {
      const parentDeclarator = path.findParent((p) => p.isVariableDeclarator());
      if (
        !parentDeclarator ||
        !t.isIdentifier(parentDeclarator.node.id) ||
        !/^[A-Z]/.test(parentDeclarator.node.id.name)
      ) {
        return; // Not a component
      }

      if (styleDeclaration) {
        let children: (
          | t.JSXElement
          | t.JSXFragment
          | t.JSXExpressionContainer
          | t.JSXSpreadChild
          | t.JSXText
        )[] = [];
        if (hasTextProp) {
          children = [t.jsxExpressionContainer(t.identifier("text"))];
        } else if (hasChildrenProp) {
          children = [t.jsxExpressionContainer(t.identifier("children"))];
        }

        const newReturnElement = t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier("Tag"), [
            t.jsxAttribute(
              t.jsxIdentifier("style"),
              t.jsxExpressionContainer(t.identifier("style")),
            ),
          ]),
          t.jsxClosingElement(t.jsxIdentifier("Tag")),
          children,
          false,
        );

        path
          .get("body")
          .replaceWith(
            t.blockStatement([
              styleDeclaration,
              t.returnStatement(newReturnElement),
            ]),
          );
      }
    },
  });

  const { code: outputCode } = generate(ast, {
    jsescOption: { minimal: true },
  });
  fs.writeFileSync(outputPath, outputCode, "utf-8");
}

// ==================================================================================
// SECTION 3: API ROUTE HANDLER
// ==================================================================================
export async function POST(req: NextRequest) {
  try {
    const { pageState, theme: activeTheme, themeName, seo } = await req.json();

    if (!pageState || !activeTheme || !themeName || !seo) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required data (pageState, theme, themeName, seo)",
        },
        { status: 400 },
      );
    }

    const nodes = JSON.parse(pageState);
    const componentNames = Object.values(nodes)
      .map((node: any) => node.type?.resolvedName)
      .filter(Boolean);
    const usedComponents = [
      ...new Set(componentNames.filter((name: string) => /^[A-Z]/.test(name))),
    ];

    const projectPath = path.join(process.cwd(), "projects");
    const appPath = path.join(projectPath, "app");
    const componentsOutPath = path.join(appPath, "components");
    const themeOutPath = path.join(appPath, "theme");

    [projectPath, appPath, componentsOutPath, themeOutPath].forEach((p) => {
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });

    fs.writeFileSync(
      path.join(appPath, "layout.tsx"),
      generateLayoutCode(seo, activeTheme),
    );
    fs.writeFileSync(
      path.join(appPath, "globals.css"),
      generateCssVariables(activeTheme),
    );

    const themeJsonSourcePath = path.join(
      process.cwd(),
      `src/themes/config/themes-json/${themeName}.json`,
    );
    const themeJsonDestPath = path.join(themeOutPath, "theme.json");
    if (fs.existsSync(themeJsonSourcePath)) {
      fs.copyFileSync(themeJsonSourcePath, themeJsonDestPath);
    } else {
      throw new Error(`Theme file not found: ${themeJsonSourcePath}`);
    }

    const themeLoaderContent = `import themeData from './theme.json';\n\nexport const theme = themeData;\n`;
    fs.writeFileSync(path.join(themeOutPath, "index.ts"), themeLoaderContent);

    fs.writeFileSync(
      path.join(appPath, "page.tsx"),
      generatePageCode(nodes, usedComponents as string[]),
    );

    const baseDir = path.join(
      process.cwd(),
      "src/components/core/craft/user-components",
    );
    for (const comp of usedComponents as string[]) {
      const sourcePath = findComponentPath(comp, baseDir);
      if (!sourcePath) {
        console.warn(`[Export Warning] Component ${comp} source not found.`);
        continue;
      }
      const outputDir = path.join(componentsOutPath, comp);
      if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });
      const outputFile = path.join(outputDir, `index.tsx`);

      convertToPureComponent(sourcePath, outputFile);
    }

    return NextResponse.json({
      status: "success",
      message: "Project exported successfully!",
    });
  } catch (error: any) {
    console.error("[Export Error]", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An internal server error occurred",
      },
      { status: 500 },
    );
  }
}

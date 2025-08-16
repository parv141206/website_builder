import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

// ==================================================================================
// SECTION 1: HELPER FUNCTIONS (Unchanged and Correct)
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
function serializeProps(props: Record<string, any>, nodeId: string): string {
  if (nodeId === "ROOT") {
    const stylePropKeys = new Set([
      "display",
      "flexDirection",
      "flexWrap",
      "justifyContent",
      "alignItems",
      "alignContent",
      "gap",
      "rowGap",
      "columnGap",
      "gridTemplateColumns",
      "gridTemplateRows",
      "gridAutoFlow",
      "width",
      "height",
      "minWidth",
      "minHeight",
      "maxWidth",
      "maxHeight",
      "margin",
      "padding",
      "background",
      "borderColor",
      "borderWidth",
      "borderStyle",
      "borderRadius",
      "boxShadow",
      "color",
      "fontFamily",
      "fontSize",
    ]);

    const regularProps: string[] = [];
    const styleObject: Record<string, any> = {};

    Object.entries(props).forEach(([key, value]) => {
      if (key === "canvas" || value === undefined) return;

      if (stylePropKeys.has(key)) {
        styleObject[key] = value;
      } else {
        regularProps.push(`${key}="${value}"`);
      }
    });

    if (Object.keys(styleObject).length > 0) {
      const styleString = `style={${JSON.stringify(styleObject)}}`;
      regularProps.push(styleString);
    }

    return regularProps.join(" ");
  } else {
    return Object.entries(props)
      .map(([key, value]) => {
        if (key === "canvas" || value === undefined) return "";
        if (typeof value === "string")
          return `${key}="${value.replace(/"/g, '\\"')}"`;
        if (typeof value === "object" && value !== null)
          return `${key}={${JSON.stringify(value)}}`;
        return `${key}={${value}}`;
      })
      .filter(Boolean)
      .join(" ");
  }
}

function generateNodeJsx(
  nodeId: string,
  allNodes: Record<string, any>,
): string {
  const node = allNodes[nodeId];
  if (!node) return "";
  const componentName = node.type?.resolvedName;

  if (nodeId === "ROOT") {
    return node.nodes
      .map((childId: string) => generateNodeJsx(childId, allNodes))
      .join("\n");
  }

  const isComposite =
    node.linkedNodes && Object.keys(node.linkedNodes).length > 0;
  if (isComposite) {
    const rootChildNodeId = Object.values(node.linkedNodes)[0] as string;
    return generateNodeJsx(rootChildNodeId, allNodes);
  } else {
    const propsString = serializeProps(node.props, nodeId);
    const childrenJsx = node.nodes
      .map((childId: string) => generateNodeJsx(childId, allNodes))
      .join("\n");
    if (childrenJsx) {
      return `<${componentName} ${propsString}>${childrenJsx}</${componentName}>`;
    }
    return `<${componentName} ${propsString} />`;
  }
}

function generatePageCode(
  nodes: Record<string, any>,
  usedComponents: string[],
): string {
  const rootNode = nodes["ROOT"];
  const rootProps = serializeProps(rootNode.props, "ROOT");
  const rootChildrenJsx = generateNodeJsx("ROOT", nodes);
  const primitives = ["Container", "Text", "Image", "Button", "Link"];
  const imports = usedComponents
    .filter((name) => primitives.includes(name))
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

  let componentName = "";
  let propsType = "";

  // Finding component and props information
  traverse(ast, {
    VariableDeclarator(path: {
      node: { id: t.Node | null | undefined; init: t.Node | null | undefined };
    }) {
      if (
        t.isIdentifier(path.node.id) &&
        /^[A-Z]/.test(path.node.id.name) &&
        t.isArrowFunctionExpression(path.node.init)
      ) {
        componentName = path.node.id.name;
      }
    },
    TSTypeAliasDeclaration(path) {
      if (path.node.id.name.endsWith("Props")) {
        propsType = path.node.id.name;
      }
    },
  });

  // Removing all unwanted imports
  traverse(ast, {
    ImportDeclaration(path: {
      node: { source: { value: any } };
      remove: () => void;
    }) {
      const source = path.node.source.value;
      if (
        source.includes("@craftjs/core") ||
        source.startsWith("~/themes") ||
        source.includes("useTheme") ||
        source.includes("framer-motion")
      ) {
        path.remove();
      }
    },
  });

  // Removing .craft property assignments
  traverse(ast, {
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
  });

  // Removing all editor-specific variable declarations BEFORE component transformation
  traverse(ast, {
    VariableDeclarator(path: {
      node: { id: t.Node | null | undefined; init: t.Node | null | undefined };
      parentPath: { remove: () => void };
    }) {
      if (t.isIdentifier(path.node.id)) {
        // Remove useNode destructuring
        if (
          t.isObjectPattern(path.node.id) &&
          t.isCallExpression(path.node.init) &&
          t.isIdentifier(path.node.init.callee, { name: "useNode" })
        ) {
          path.parentPath.remove();
          return;
        }

        // Remove useTheme calls
        if (
          path.node.id.name === "theme" &&
          t.isCallExpression(path.node.init) &&
          t.isIdentifier(path.node.init.callee, { name: "useTheme" })
        ) {
          path.parentPath.remove();
          return;
        }

        // Remove useRef calls
        if (
          path.node.id.name === "ref" &&
          t.isCallExpression(path.node.init) &&
          t.isIdentifier(path.node.init.callee, { name: "useRef" })
        ) {
          path.parentPath.remove();
          return;
        }

        // Remove useState calls for editing
        if (
          t.isArrayPattern(path.node.id) &&
          t.isCallExpression(path.node.init) &&
          t.isIdentifier(path.node.init.callee, { name: "useState" })
        ) {
          //@ts-ignore
          const elements = path.node.id.elements;
          if (
            elements &&
            elements.length >= 2 &&
            t.isIdentifier(elements[0], { name: "editing" })
          ) {
            path.parentPath.remove();
            return;
          }
        }

        // Remove editor function declarations
        if (
          [
            "onDoubleClick",
            "handleBlur",
            "handleKeyDown",
            "commonProps",
          ].includes(path.node.id.name)
        ) {
          path.parentPath.remove();
        }
      }
    },
  });

  // Transforming the main component
  traverse(ast, {
    VariableDeclarator(path: {
      node: { id: t.Node | null | undefined; init: t.Node | null | undefined };
    }) {
      if (
        t.isIdentifier(path.node.id) &&
        path.node.id.name === componentName &&
        t.isArrowFunctionExpression(path.node.init)
      ) {
        const arrowFunc = path.node.init;

        // Clean the type annotation to remove craft property
        if (t.isTSTypeAnnotation(path.node.id.typeAnnotation)) {
          const newType = t.tsTypeReference(
            t.tsQualifiedName(t.identifier("React"), t.identifier("FC")),
            t.tsTypeParameterInstantiation([
              t.tsTypeReference(t.identifier(propsType)),
            ]),
          );
          path.node.id.typeAnnotation = t.tsTypeAnnotation(newType);
        }

        // Clean the function body
        if (t.isBlockStatement(arrowFunc.body)) {
          const cleanedStatements: t.Statement[] = [];

          for (const statement of arrowFunc.body.body) {
            if (t.isVariableDeclaration(statement)) {
              for (const declarator of statement.declarations) {
                if (t.isIdentifier(declarator.id)) {
                  // Keep only the style declaration
                  if (declarator.id.name === "style") {
                    const cleanedStyle = cleanStyleDeclaration(declarator);
                    cleanedStatements.push(
                      t.variableDeclaration("const", [cleanedStyle]),
                    );
                  }
                  // Skip all other variable declarations (they're editor-specific)
                }
              }
            } else if (t.isReturnStatement(statement)) {
              // Clean the return statement
              const cleanedReturn = cleanReturnStatement(statement);
              cleanedStatements.push(cleanedReturn);
            }
            // Skip all other statements (they're editor-specific)
          }

          arrowFunc.body = t.blockStatement(cleanedStatements);
        }
      }
    },
  });

  // Adding theme import at the beginning
  const themeImport = t.importDeclaration(
    [t.importSpecifier(t.identifier("theme"), t.identifier("theme"))],
    t.stringLiteral("../../theme"),
  );
  ast.program.body.unshift(themeImport);

  // Cleaning up React imports
  traverse(ast, {
    ImportDeclaration(path: {
      node: { source: { value: string }; specifiers: any[] };
      remove: () => void;
    }) {
      if (path.node.source.value === "react") {
        const filteredSpecifiers = path.node.specifiers.filter((spec) => {
          if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
            return !["useNode", "useRef", "useState", "useEffect"].includes(
              spec.imported.name,
            );
          }
          return true;
        });

        if (filteredSpecifiers.length > 0) {
          path.node.specifiers = filteredSpecifiers;
        } else {
          path.remove();
        }
      }
    },
  });

  const { code: outputCode } = generate(ast, {
    jsescOption: { minimal: true },
  });

  fs.writeFileSync(outputPath, outputCode, "utf-8");
}

function cleanStyleDeclaration(
  declarator: t.VariableDeclarator,
): t.VariableDeclarator {
  const cleanedDeclarator = t.cloneNode(declarator, true);

  if (t.isCallExpression(cleanedDeclarator.init)) {
    traverse(
      t.file(t.program([t.expressionStatement(cleanedDeclarator.init)])),
      {
        // Replace useTheme() with theme
        CallExpression(path: {
          node: { callee: t.Node | null | undefined };
          replaceWith: (arg0: t.Identifier) => void;
        }) {
          if (t.isIdentifier(path.node.callee, { name: "useTheme" })) {
            path.replaceWith(t.identifier("theme"));
          }
        },

        // Remove editor-specific properties
        ObjectProperty(path: {
          node: { key: t.Node | null | undefined };
          remove: () => void;
        }) {
          if (
            t.isIdentifier(path.node.key) &&
            ["outline", "outlineOffset", "cursor", "transition"].includes(
              path.node.key.name,
            )
          ) {
            path.remove();
          }
        },

        // Clean conditionals that reference editor state
        ConditionalExpression(path: {
          node: { test: t.Node | null | undefined; alternate: any };
          replaceWith: (arg0: any) => void;
        }) {
          if (
            t.isIdentifier(path.node.test, { name: "selected" }) ||
            t.isIdentifier(path.node.test, { name: "editing" }) ||
            (t.isLogicalExpression(path.node.test) &&
              (t.isIdentifier(path.node.test.left, { name: "selected" }) ||
                t.isIdentifier(path.node.test.right, { name: "selected" }) ||
                t.isIdentifier(path.node.test.left, { name: "editing" }) ||
                t.isIdentifier(path.node.test.right, { name: "editing" })))
          ) {
            path.replaceWith(path.node.alternate);
          }
        },

        // Clean dependency arrays
        ArrayExpression(path: {
          node: {
            elements: { filter: (arg0: (element: any) => boolean) => never[] };
          };
        }) {
          path.node.elements =
            path.node.elements?.filter((element) => {
              if (t.isIdentifier(element)) {
                return !["selected", "editing", "connect", "drag"].includes(
                  element.name,
                );
              }
              return true;
            }) || [];
        },
      },
      undefined,
    );
  }

  return cleanedDeclarator;
}

function cleanReturnStatement(
  returnStatement: t.ReturnStatement,
): t.ReturnStatement {
  const cleanedReturn = t.cloneNode(returnStatement, true);

  traverse(
    t.file(t.program([cleanedReturn])),
    {
      JSXAttribute(path: {
        node: { name: t.Node | null | undefined };
        remove: () => void;
      }) {
        if (
          t.isJSXIdentifier(path.node.name) &&
          [
            "ref",
            "onDoubleClick",
            "onBlur",
            "onKeyDown",
            "contentEditable",
            "suppressContentEditableWarning",
            "dangerouslySetInnerHTML",
          ].includes(path.node.name.name)
        ) {
          path.remove();
        }
      },
      JSXSpreadAttribute(path: {
        node: { argument: any };
        remove: () => void;
      }) {
        const arg = path.node.argument;

        // Direct commonProps spread: {...commonProps}
        if (t.isIdentifier(arg, { name: "commonProps" })) {
          path.remove();
          return;
        }

        // Cast expression spread: {...(commonProps as any)}
        if (
          t.isTSAsExpression(arg) &&
          t.isIdentifier(arg.expression, { name: "commonProps" })
        ) {
          path.remove();
          return;
        }

        // Parenthesized cast: {...((commonProps as any))}
        if (
          t.isParenthesizedExpression(arg) &&
          t.isTSAsExpression(arg.expression) &&
          t.isIdentifier(arg.expression.expression, { name: "commonProps" })
        ) {
          path.remove();
          return;
        }
      },

      // Handle conditional rendering - always use non-editing version
      ConditionalExpression(path: {
        node: { test: t.Node | null | undefined; alternate: any };
        replaceWith: (arg0: any) => void;
      }) {
        if (
          t.isIdentifier(path.node.test, { name: "editing" }) ||
          (t.isLogicalExpression(path.node.test) &&
            (t.isIdentifier(path.node.test.left, { name: "selected" }) ||
              t.isIdentifier(path.node.test.right, { name: "selected" })))
        ) {
          path.replaceWith(path.node.alternate);
        }
      },

      // Remove calls to editor functions
      CallExpression(path: {
        node: { callee: t.Node | null | undefined };
        replaceWith: (arg0: t.Identifier) => void;
      }) {
        if (
          t.isMemberExpression(path.node.callee) &&
          t.isIdentifier(path.node.callee.object) &&
          ["connect", "drag"].includes(path.node.callee.object.name)
        ) {
          path.replaceWith(t.identifier("undefined"));
        }
      },
    },
    undefined,
  );

  return cleanedReturn;
}

// ==================================================================================
// SECTION 3: THE DEFINITIVE API ROUTE HANDLER
// ==================================================================================
export async function POST(req: NextRequest) {
  try {
    const { pageState, theme: activeTheme, themeName, seo } = await req.json();

    if (!pageState || !activeTheme || !themeName || !seo) {
      return NextResponse.json(
        { status: "error", message: "Missing required data" },
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
      generatePageCode(nodes, usedComponents),
    );

    const primitivesToExport = usedComponents.filter((name) =>
      ["Container", "Text", "Image", "Button", "Link"].includes(name),
    );

    const baseDir = path.join(
      process.cwd(),
      "src/components/core/craft/user-components",
    );
    for (const comp of primitivesToExport) {
      const sourcePath = findComponentPath(
        comp,
        path.join(baseDir, "primitives"),
      );
      if (!sourcePath) {
        console.warn(
          `[Export Warning] Primitive component ${comp} source not found.`,
        );
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

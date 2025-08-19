import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "@babel/parser";
import * as t from "@babel/types";
import { POPULAR_GOOGLE_FONTS } from "~/themes";

const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const primitives = [
  "Container",
  "Text",
  "Image",
  "Button",
  "Link",
  "TextPressure",
  "SplitText",
  "BlurText",
  "TextType",
  "TextTrail",
];
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

function generateAllGoogleFontsUrl(): string {
  const fontParams = POPULAR_GOOGLE_FONTS.map((font) => {
    const weights = font.variants.join(";");
    return `family=${font.name.replace(/ /g, "+")}:wght@${weights}`;
  });

  return `https://fonts.googleapis.com/css2?${fontParams.join("&")}&display=swap`;
}

function generateLayoutCode(seo: any): string {
  const googleFontsUrl = generateAllGoogleFontsUrl();
  console.log(seo);
  return `
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${seo.title.replace(/\"/g, '\\"')}",
  description: "${seo.description.replace(/\"/g, '\\"')}",
  keywords: "${seo.keywords.replace(/\"/g, '\\"')}",
  authors: [{ name: "${seo.author.replace(/\"/g, '\\"')}" }],
  robots: "${seo.robots.replace(/\"/g, '\\"')}",
  openGraph: {
    title: "${seo.ogTitle.replace(/\"/g, '\\"')}",
    description: "${seo.ogDescription.replace(/\"/g, '\\"')}",
    images: ["${seo.ogImage.replace(/\"/g, '\\"')}"],
  },
  twitter: {
    card: "${seo.twitterCard.replace(/\"/g, '\\"')}",
  }
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
    plugins: ["jsx", "typescript", "decorators-legacy"],
  });

  let componentName = "";
  let propsTypeName = "";

  // STEP 1: Find component name and props type
  findComponentInfo(ast, (name, propsType) => {
    componentName = name;
    propsTypeName = propsType;
  });

  // STEP 2: Clean imports - remove CraftJS specific imports but keep others
  cleanImports(ast);

  // STEP 3: Remove CraftJS-specific variable declarations
  removeCraftJSVariables(ast);

  // STEP 4: Remove .craft property assignments
  removeCraftProperties(ast);

  // STEP 5: Transform the main component function
  transformMainComponent(ast, componentName, propsTypeName);

  // STEP 6: Add theme import (replace useTheme with static import)
  addThemeImport(ast);

  // STEP 7: Clean up any remaining React imports that are no longer needed
  cleanReactImports(ast);

  // Generate the final code
  const { code: outputCode } = generate(ast, {
    jsescOption: { minimal: true },
    retainLines: false,
    compact: false,
  });

  fs.writeFileSync(outputPath, outputCode, "utf-8");
}

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

function findComponentInfo(
  ast: t.File,
  callback: (name: string, propsType: string) => void,
) {
  let componentName = "";
  let propsTypeName = "";

  traverse(ast, {
    // Find React component (function declaration or variable with arrow function)
    VariableDeclarator(path: any) {
      const { node } = path;
      if (
        t.isIdentifier(node.id) &&
        /^[A-Z]/.test(node.id.name) &&
        (t.isArrowFunctionExpression(node.init) ||
          t.isFunctionExpression(node.init))
      ) {
        componentName = node.id.name;
      }
    },

    FunctionDeclaration(path: any) {
      const { node } = path;
      if (t.isIdentifier(node.id) && /^[A-Z]/.test(node.id.name)) {
        componentName = node.id.name;
      }
    },

    // Find Props type definition
    TSTypeAliasDeclaration(path: any) {
      const { node } = path;
      if (node.id.name.endsWith("Props")) {
        propsTypeName = node.id.name;
      }
    },

    TSInterfaceDeclaration(path: any) {
      const { node } = path;
      if (node.id.name.endsWith("Props")) {
        propsTypeName = node.id.name;
      }
    },
  });

  callback(componentName, propsTypeName);
}

function cleanImports(ast: t.File) {
  const craftjsImports = [
    "@craftjs/core",
    "~/themes",
    "./themes",
    "../themes",
    "../../themes",
  ];

  traverse(ast, {
    ImportDeclaration(path: any) {
      const { node } = path;
      const source = node.source.value;

      // Remove CraftJS core imports completely
      if (craftjsImports.some((imp) => source.includes(imp))) {
        path.remove();
        return;
      }

      // For React imports, remove specific CraftJS-related hooks but keep the rest
      if (source === "react") {
        const craftjsHooks = [
          "useNode",
          "useEditor",
          "useRef",
          "useState",
          "useEffect",
          "useMemo",
          "useCallback",
        ];

        // Filter out CraftJS hooks but keep other React imports
        const filteredSpecifiers = node.specifiers.filter((spec: any) => {
          if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
            // Keep useState, useEffect, useMemo, useCallback if they're used for legitimate purposes
            // Only remove useNode, useEditor, and useRef (which is commonly used for CraftJS)
            return !["useNode", "useEditor"].includes(spec.imported.name);
          }
          return true; // Keep default imports and namespace imports
        });

        if (filteredSpecifiers.length > 0) {
          node.specifiers = filteredSpecifiers;
        } else {
          path.remove();
        }
      }

      // Keep motion/react imports as they're legitimate animation libraries
      // Keep all other imports as they might be legitimate dependencies
    },
  });
}

function removeCraftJSVariables(ast: t.File) {
  traverse(ast, {
    VariableDeclarator(path: any) {
      const { node } = path;

      if (
        !t.isIdentifier(node.id) &&
        !t.isObjectPattern(node.id) &&
        !t.isArrayPattern(node.id)
      ) {
        return;
      }

      // Remove useNode destructuring
      if (
        t.isObjectPattern(node.id) &&
        t.isCallExpression(node.init) &&
        t.isIdentifier(node.init.callee, { name: "useNode" })
      ) {
        path.parentPath.remove();
        return;
      }

      // Remove useEditor calls
      if (
        t.isObjectPattern(node.id) &&
        t.isCallExpression(node.init) &&
        t.isIdentifier(node.init.callee, { name: "useEditor" })
      ) {
        path.parentPath.remove();
        return;
      }

      // Remove useTheme calls (we'll replace with static import)
      if (
        t.isIdentifier(node.id, { name: "theme" }) &&
        t.isCallExpression(node.init) &&
        t.isIdentifier(node.init.callee, { name: "useTheme" })
      ) {
        path.parentPath.remove();
        return;
      }

      // Remove CraftJS-specific useRef calls (but be careful not to remove legitimate ones)
      if (
        t.isIdentifier(node.id, { name: "ref" }) &&
        t.isCallExpression(node.init) &&
        t.isIdentifier(node.init.callee, { name: "useRef" })
      ) {
        // Only remove if it's likely a CraftJS ref (no initial value or null)
        if (
          !node.init.arguments.length ||
          t.isNullLiteral(node.init.arguments[0])
        ) {
          path.parentPath.remove();
          return;
        }
      }

      // Remove editor-specific state variables
      if (
        t.isArrayPattern(node.id) &&
        t.isCallExpression(node.init) &&
        t.isIdentifier(node.init.callee, { name: "useState" })
      ) {
        const elements = node.id.elements;
        if (elements && elements.length >= 1 && t.isIdentifier(elements[0])) {
          const stateVarName = elements[0].name;
          // Remove common CraftJS editor state variables
          if (
            ["editing", "selected", "hovered", "dragging"].includes(
              stateVarName,
            )
          ) {
            path.parentPath.remove();
            return;
          }
        }
      }

      // Remove specific CraftJS-related function declarations
      if (t.isIdentifier(node.id)) {
        const craftjsFunctions = [
          "onDoubleClick",
          "handleBlur",
          "handleKeyDown",
          "handleFocus",
          "commonProps",
          "connectDrag",
          "connectDrop",
          "connect", // Add these
          "drag", // Add these
          "drop", // Add these
        ];

        if (craftjsFunctions.includes(node.id.name)) {
          path.parentPath.remove();
        }
      }
    },
  });

  // ADDITIONAL PASS: Remove any remaining references to CraftJS variables
  traverse(ast, {
    Identifier(path: any) {
      // Remove standalone references to CraftJS variables in dependency arrays
      if (
        [
          "connect",
          "drag",
          "drop",
          "selected",
          "editing",
          "connectors",
        ].includes(path.node.name)
      ) {
        // Check if this is in a dependency array or similar context
        const parent = path.parent;
        if (t.isArrayExpression(parent)) {
          path.remove();
        }
      }
    },
  });
}

function removeCraftProperties(ast: t.File) {
  traverse(ast, {
    ExpressionStatement(path: any) {
      const { node } = path;

      // Remove .craft property assignments
      if (
        t.isAssignmentExpression(node.expression) &&
        t.isMemberExpression(node.expression.left) &&
        t.isIdentifier(node.expression.left.property, { name: "craft" })
      ) {
        path.remove();
      }
    },
  });
}

function transformMainComponent(
  ast: t.File,
  componentName: string,
  propsTypeName: string,
) {
  traverse(ast, {
    VariableDeclarator(path: any) {
      const { node } = path;

      if (
        t.isIdentifier(node.id, { name: componentName }) &&
        t.isArrowFunctionExpression(node.init)
      ) {
        transformComponentFunction(path, node.init, propsTypeName);
      }
    },

    FunctionDeclaration(path: any) {
      const { node } = path;

      if (t.isIdentifier(node.id, { name: componentName })) {
        transformComponentFunction(path, node, propsTypeName);
      }
    },
  });
}

function transformComponentFunction(
  path: any,
  funcNode: any,
  propsTypeName: string,
) {
  // Update type annotation if it exists
  if (path.node.id && t.isTSTypeAnnotation(path.node.id.typeAnnotation)) {
    const newType = t.tsTypeReference(
      t.tsQualifiedName(t.identifier("React"), t.identifier("FC")),
      propsTypeName
        ? t.tsTypeParameterInstantiation([
            t.tsTypeReference(t.identifier(propsTypeName)),
          ])
        : undefined,
    );
    path.node.id.typeAnnotation = t.tsTypeAnnotation(newType);
  }

  // Clean the function body
  if (t.isBlockStatement(funcNode.body)) {
    const cleanedStatements: t.Statement[] = [];

    for (const statement of funcNode.body.body) {
      if (t.isVariableDeclaration(statement)) {
        // Process variable declarations
        const cleanedDeclarators = [];

        for (const declarator of statement.declarations) {
          if (t.isIdentifier(declarator.id)) {
            // Keep style declarations but clean them
            if (declarator.id.name === "style") {
              const cleanedStyle = cleanStyleDeclaration(declarator);
              cleanedDeclarators.push(cleanedStyle);
            }
            // Keep other legitimate variable declarations (but not CraftJS ones)
            else if (!isCraftJSVariable(declarator.id.name)) {
              cleanedDeclarators.push(declarator);
            }
          } else {
            // Keep complex destructuring that's not CraftJS related
            if (!isCraftJSDestructuring(declarator)) {
              cleanedDeclarators.push(declarator);
            }
          }
        }

        if (cleanedDeclarators.length > 0) {
          cleanedStatements.push(
            t.variableDeclaration(statement.kind, cleanedDeclarators),
          );
        }
      } else if (t.isReturnStatement(statement)) {
        // Clean the return statement
        const cleanedReturn = cleanReturnStatement(statement);
        cleanedStatements.push(cleanedReturn);
      } else if (!isCraftJSStatement(statement)) {
        // Keep other statements that aren't CraftJS specific
        cleanedStatements.push(statement);
      }
    }

    funcNode.body = t.blockStatement(cleanedStatements);
  }
}

function isCraftJSVariable(varName: string): boolean {
  const craftjsVars = [
    "selected",
    "editing",
    "hovered",
    "dragging",
    "connectors",
    "connect",
    "drag",
    "drop",
    "ref", // Be careful with this one
  ];
  return craftjsVars.includes(varName);
}

function isCraftJSDestructuring(declarator: t.VariableDeclarator): boolean {
  // Check if it's destructuring from useNode, useEditor, etc.
  if (
    t.isObjectPattern(declarator.id) &&
    t.isCallExpression(declarator.init) &&
    t.isIdentifier(declarator.init.callee)
  ) {
    return ["useNode", "useEditor", "useTheme"].includes(
      declarator.init.callee.name,
    );
  }
  return false;
}

function isCraftJSStatement(statement: t.Statement): boolean {
  // Add logic to identify and skip CraftJS-specific statements
  // This is a placeholder - you can expand this based on patterns you see
  return false;
}

function cleanStyleDeclaration(
  declarator: t.VariableDeclarator,
): t.VariableDeclarator {
  const cleanedDeclarator = t.cloneNode(declarator, true);

  if (t.isCallExpression(cleanedDeclarator.init)) {
    // Create a mini AST for just this expression to traverse it
    const tempAST = t.file(
      t.program([t.expressionStatement(cleanedDeclarator.init)]),
    );

    traverse(tempAST, {
      // Replace useTheme() calls with theme identifier
      CallExpression(path: any) {
        const { node } = path;
        if (t.isIdentifier(node.callee, { name: "useTheme" })) {
          path.replaceWith(t.identifier("theme"));
        }
      },

      // Remove CraftJS-specific style properties
      ObjectProperty(path: any) {
        const { node } = path;
        if (t.isIdentifier(node.key)) {
          const craftjsStyleProps = [
            "outline",
            "outlineOffset",
            "cursor",
            "pointerEvents",
          ];

          if (craftjsStyleProps.includes(node.key.name)) {
            path.remove();
          }
        }
      },

      // Clean conditional expressions that depend on CraftJS state
      ConditionalExpression(path: any) {
        const { node } = path;

        if (isCraftJSConditional(node.test)) {
          // Replace with the alternate (non-editing/non-selected state)
          path.replaceWith(node.alternate);
        }
      },

      // Clean logical expressions
      LogicalExpression(path: any) {
        const { node } = path;

        if (isCraftJSConditional(node)) {
          // For logical expressions, we need to be more careful
          // If it's something like `selected && someStyle`, remove it entirely
          if (t.isIdentifier(node.left) && isCraftJSVariable(node.left.name)) {
            path.replaceWith(t.identifier("undefined"));
          }
        }
      },

      // Clean dependency arrays in useMemo, useCallback, useEffect
      ArrayExpression(path: any) {
        const { node } = path;
        if (node.elements) {
          node.elements = node.elements.filter((element: any) => {
            if (t.isIdentifier(element)) {
              return !isCraftJSVariable(element.name);
            }
            return true;
          });
        }
      },
    });
  }

  return cleanedDeclarator;
}

function isCraftJSConditional(testNode: t.Expression): boolean {
  if (t.isIdentifier(testNode)) {
    return isCraftJSVariable(testNode.name);
  }

  if (t.isLogicalExpression(testNode)) {
    return (
      isCraftJSConditional(testNode.left) ||
      isCraftJSConditional(testNode.right)
    );
  }

  if (t.isMemberExpression(testNode)) {
    // Handle cases like `connectors.selected` or similar
    if (t.isIdentifier(testNode.object)) {
      return isCraftJSVariable(testNode.object.name);
    }
  }

  return false;
}

function cleanReturnStatement(
  returnStatement: t.ReturnStatement,
): t.ReturnStatement {
  const cleanedReturn = t.cloneNode(returnStatement, true);

  // Create a temporary AST to traverse just the return statement
  const tempAST = t.file(t.program([cleanedReturn]));

  traverse(tempAST, {
    // Remove CraftJS-specific JSX attributes
    JSXAttribute(path: any) {
      const { node } = path;

      if (t.isJSXIdentifier(node.name)) {
        const craftjsAttributes = [
          "onDoubleClick",
          "onBlur",
          "onKeyDown",
          "onFocus",
          "contentEditable",
          "suppressContentEditableWarning",
          "dangerouslySetInnerHTML",
        ];

        if (craftjsAttributes.includes(node.name.name)) {
          path.remove();
        }
      }

      // Handle ref attributes with CraftJS patterns
      if (t.isJSXIdentifier(node.name, { name: "ref" })) {
        // Check if the ref value contains connect/drag calls
        if (t.isJSXExpressionContainer(node.value)) {
          const expression = node.value.expression;
          if (containsCraftJSRef(expression)) {
            path.remove();
            return;
          }
        }
      }
    },

    // Remove CraftJS-specific spread attributes
    JSXSpreadAttribute(path: any) {
      const { node } = path;

      if (isCraftJSSpread(node.argument)) {
        path.remove();
      }
    },

    // Clean conditional expressions in JSX
    ConditionalExpression(path: any) {
      const { node } = path;

      if (isCraftJSConditional(node.test)) {
        path.replaceWith(node.alternate);
      }
    },

    // Replace CraftJS function calls - MORE COMPREHENSIVE
    CallExpression(path: any) {
      const { node } = path;

      // Handle nested connect(drag(ref)) patterns
      if (t.isCallExpression(node) && containsCraftJSRef(node)) {
        path.replaceWith(t.nullLiteral());
        return;
      }

      // Handle connect calls
      if (t.isIdentifier(node.callee, { name: "connect" })) {
        path.replaceWith(t.nullLiteral());
        return;
      }

      // Handle drag calls
      if (t.isIdentifier(node.callee, { name: "drag" })) {
        path.replaceWith(t.nullLiteral());
        return;
      }

      // Handle drop calls
      if (t.isIdentifier(node.callee, { name: "drop" })) {
        path.replaceWith(t.nullLiteral());
        return;
      }

      // Handle member expressions like connectors.connect
      if (
        t.isMemberExpression(node.callee) &&
        t.isIdentifier(node.callee.object) &&
        ["connectors", "connect", "drag", "drop"].includes(
          node.callee.object.name,
        )
      ) {
        path.replaceWith(t.nullLiteral());
        return;
      }
    },

    // Clean JSX expressions that reference CraftJS variables
    JSXExpressionContainer(path: any) {
      const { node } = path;

      if (
        t.isIdentifier(node.expression) &&
        isCraftJSVariable(node.expression.name)
      ) {
        path.replaceWith(t.jsxExpressionContainer(t.nullLiteral()));
        return;
      }

      // Clean arrow functions that contain CraftJS calls - ENHANCED
      if (t.isArrowFunctionExpression(node.expression)) {
        if (containsCraftJSRef(node.expression)) {
          path.replaceWith(t.jsxExpressionContainer(t.nullLiteral()));
          return;
        }
      }

      // Clean function expressions that contain CraftJS calls
      if (t.isFunctionExpression(node.expression)) {
        if (containsCraftJSRef(node.expression)) {
          path.replaceWith(t.jsxExpressionContainer(t.nullLiteral()));
          return;
        }
      }

      // Clean direct call expressions that are CraftJS related
      if (t.isCallExpression(node.expression)) {
        if (containsCraftJSRef(node.expression)) {
          path.replaceWith(t.jsxExpressionContainer(t.nullLiteral()));
          return;
        }
      }
    },
  });

  return cleanedReturn;
}

// Helper function to detect CraftJS ref patterns - ENHANCED
function containsCraftJSRef(node: t.Node): boolean {
  let hasCraftJSRef = false;

  // Handle the specific case of arrow functions with CraftJS calls
  if (t.isArrowFunctionExpression(node)) {
    // Check the body of the arrow function
    if (t.isBlockStatement(node.body)) {
      // For block statement bodies
      for (const statement of node.body.body) {
        if (t.isReturnStatement(statement) && statement.argument) {
          if (containsCraftJSRef(statement.argument)) {
            return true;
          }
        }
        if (t.isExpressionStatement(statement)) {
          if (containsCraftJSRef(statement.expression)) {
            return true;
          }
        }
      }
    } else {
      // For expression bodies like (ref) => connect(drag(ref))
      if (containsCraftJSRef(node.body)) {
        return true;
      }
    }
  }

  // Create a temporary AST and traverse it
  try {
    const tempNode = t.isStatement(node)
      ? node
      : t.expressionStatement(node as t.Expression);
    const tempAST = t.file(t.program([tempNode]));

    traverse(tempAST, {
      CallExpression(path: any) {
        const callNode = path.node;

        // Check for connect, drag, drop function calls
        if (t.isIdentifier(callNode.callee)) {
          if (["connect", "drag", "drop"].includes(callNode.callee.name)) {
            hasCraftJSRef = true;
            path.stop();
          }
        }

        // Check for nested calls like connect(drag(...))
        if (t.isCallExpression(callNode.callee)) {
          if (containsCraftJSRef(callNode.callee)) {
            hasCraftJSRef = true;
            path.stop();
          }
        }
      },

      Identifier(path: any) {
        // Only flag as CraftJS if it's being called as a function
        const parent = path.parent;
        if (["connect", "drag", "drop"].includes(path.node.name)) {
          // Check if this identifier is being called
          if (t.isCallExpression(parent) && parent.callee === path.node) {
            hasCraftJSRef = true;
            path.stop();
          }
          // Or if it's part of a member expression being called
          if (t.isMemberExpression(parent) && parent.object === path.node) {
            hasCraftJSRef = true;
            path.stop();
          }
        }
        if (path.node.name === "connectors") {
          hasCraftJSRef = true;
          path.stop();
        }
      },
    });
  } catch (e) {
    // If there's any error in traversal, assume it might be CraftJS-related
    // This is a safe fallback
    console.warn("Error checking CraftJS ref:", e);
    return false;
  }

  return hasCraftJSRef;
}

function isCraftJSSpread(argument: t.Expression): boolean {
  // Direct spread of CraftJS variables
  if (t.isIdentifier(argument)) {
    return ["commonProps", "connectors", "craftProps"].includes(argument.name);
  }

  // Type assertions like (commonProps as any)
  if (t.isTSAsExpression(argument) && t.isIdentifier(argument.expression)) {
    return ["commonProps", "connectors", "craftProps"].includes(
      argument.expression.name,
    );
  }

  // Parenthesized expressions
  if (t.isParenthesizedExpression(argument)) {
    return isCraftJSSpread(argument.expression);
  }

  return false;
}

function addThemeImport(ast: t.File) {
  // Add theme import at the beginning
  const themeImport = t.importDeclaration(
    [t.importSpecifier(t.identifier("theme"), t.identifier("theme"))],
    t.stringLiteral("../../theme"),
  );

  ast.program.body.unshift(themeImport);
}

function cleanReactImports(ast: t.File) {
  traverse(ast, {
    ImportDeclaration(path: any) {
      const { node } = path;

      if (node.source.value === "react") {
        // Remove React hooks that are no longer used
        const unusedHooks = ["useRef", "useState", "useEffect"]; // Be selective

        const filteredSpecifiers = node.specifiers.filter((spec: any) => {
          if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
            // Only remove if we're sure they're not used for legitimate purposes
            // This is conservative - we keep them unless we're certain
            return true;
          }
          return true;
        });

        node.specifiers = filteredSpecifiers;

        // If no specifiers left, remove the entire import
        if (filteredSpecifiers.length === 0) {
          path.remove();
        }
      }
    },
  });
}

// ==================================================================================
// UPDATED PROP SERIALIZATION FOR YOUR EXPORT API
// ==================================================================================

function propValueToString(value: any): string {
  if (value === null) {
    return "{null}";
  }

  if (value === undefined) {
    return "{undefined}";
  }

  if (typeof value === "string") {
    // Escape quotes within the string for the attribute value
    return `"${value.replace(/"/g, '\\"')}"`;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return `{${value}}`;
  }

  if (Array.isArray(value)) {
    const arrayContent = value
      .map((item) => {
        if (typeof item === "string") {
          return `"${item.replace(/"/g, '\\"')}"`;
        }
        return JSON.stringify(item);
      })
      .join(", ");
    return `{[${arrayContent}]}`;
  }

  if (typeof value === "object" && value !== null) {
    try {
      // For complex objects like animation, serialize as JSON
      const jsonString = JSON.stringify(value, null, 0);
      return `{${jsonString}}`;
    } catch (e) {
      // Fallback for objects that can't be JSON.stringify'd
      const objectString = Object.entries(value)
        .map(([key, val]) => {
          if (typeof val === "string") {
            return `${key}: "${val.replace(/"/g, '\\"')}"`;
          }
          return `${key}: ${JSON.stringify(val)}`;
        })
        .join(", ");
      return `{{ ${objectString} }}`;
    }
  }

  return `{undefined}`; // Fallback for other types
}

// UPDATED: Better serializeProps function
function serializeProps(props: Record<string, any>, nodeId: string): string {
  // The ROOT node special logic needs to handle styles correctly
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
      // Skip undefined props or internal craftjs props
      if (key === "canvas" || value === undefined) return;

      if (stylePropKeys.has(key)) {
        styleObject[key] = value;
      } else {
        // Use the updated helper for all other props
        regularProps.push(`${key}=${propValueToString(value)}`);
      }
    });

    if (Object.keys(styleObject).length > 0) {
      // Style objects are always stringified for the style prop
      const styleString = `style={${JSON.stringify(styleObject)}}`;
      regularProps.push(styleString);
    }

    // Add id="ROOT"
    regularProps.push('id="ROOT"');

    return regularProps.join(" ");
  }

  // Logic for all other components (like Container)
  else {
    const propStrings = Object.entries(props)
      .map(([key, value]) => {
        if (key === "canvas" || value === undefined) return "";

        // Special handling for complex objects
        if (key === "animation" && typeof value === "object") {
          return `${key}=${propValueToString(value)}`;
        }

        // Use our robust helper for ALL props
        return `${key}=${propValueToString(value)}`;
      })
      .filter(Boolean);

    return propStrings.join(" ");
  }
}
// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

// ==================================================================================
// SECTION 3: THE DEFINITIVE API ROUTE HANDLER
// ==================================================================================
export async function POST(req: NextRequest) {
  try {
    const {
      imageData,
      pageState,
      theme: activeTheme,
      themeName,
      seo,
    } = await req.json();

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
    const publicImagesPath = path.join(projectPath, "public");

    [
      projectPath,
      appPath,
      componentsOutPath,
      themeOutPath,
      publicImagesPath,
    ].forEach((p) => {
      if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
    });

    // Handle image exports (unchanged)
    if (imageData && Array.isArray(imageData)) {
      for (const imgData of imageData) {
        if (imgData.key && imgData.base64) {
          const imagePath = path.join(
            publicImagesPath,
            path.basename(imgData.key),
          );
          const base64Data = imgData.base64.replace(
            /^data:image\/\w+;base64,/,
            "",
          );
          const buffer = Buffer.from(base64Data, "base64");
          fs.writeFileSync(imagePath, buffer);
        }
      }
    }

    // Generate layout and theme files (unchanged)
    fs.writeFileSync(path.join(appPath, "layout.tsx"), generateLayoutCode(seo));
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
      fs.writeFileSync(
        themeJsonDestPath,
        JSON.stringify(activeTheme, null, 2),
        "utf-8",
      );
    } else {
      throw new Error(`Theme file not found: ${themeJsonSourcePath}`);
    }

    const themeLoaderContent = `import themeData from './theme.json';\n\nexport const theme = themeData;\n`;
    fs.writeFileSync(path.join(themeOutPath, "index.ts"), themeLoaderContent);
    fs.writeFileSync(
      path.join(appPath, "page.tsx"),
      generatePageCode(nodes, usedComponents),
    );

    // Export components using the ROBUST converter
    const primitivesToExport = usedComponents.filter((name) =>
      primitives.includes(name),
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
      const outputFile = path.join(outputDir, "index.tsx");

      // Use the ROBUST converter instead of the old one
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

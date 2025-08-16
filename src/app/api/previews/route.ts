// app/api/preview/route.ts
import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

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
// PURE COMPONENT TRANSFORMATION FOR PREVIEW
// ==================================================================================

function convertToPurePreview(inputPath: string): string {
  const code = fs.readFileSync(inputPath, "utf-8");
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  let componentName = "";
  let propsType = "";

  // Find component and props information
  traverse(ast, {
    VariableDeclarator(path: any) {
      if (
        t.isIdentifier(path.node.id) &&
        /^[A-Z]/.test(path.node.id.name) &&
        t.isArrowFunctionExpression(path.node.init)
      ) {
        componentName = path.node.id.name;
      }
    },
    TSTypeAliasDeclaration(path: any) {
      if (path.node.id.name.endsWith("Props")) {
        propsType = path.node.id.name;
      }
    },
  });

  // Remove all unwanted imports
  traverse(ast, {
    ImportDeclaration(path: any) {
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

  // Remove .craft property assignments
  traverse(ast, {
    ExpressionStatement(path: any) {
      if (
        t.isAssignmentExpression(path.node.expression) &&
        t.isMemberExpression(path.node.expression.left) &&
        t.isIdentifier(path.node.expression.left.property, { name: "craft" })
      ) {
        path.remove();
      }
    },
  });

  // Remove all editor-specific variable declarations
  traverse(ast, {
    VariableDeclarator(path: any) {
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

  // Transform the main component
  traverse(ast, {
    VariableDeclarator(path: any) {
      if (
        t.isIdentifier(path.node.id) &&
        path.node.id.name === componentName &&
        t.isArrowFunctionExpression(path.node.init)
      ) {
        const arrowFunc = path.node.init;

        // Clean the type annotation
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
                    const cleanedStyle =
                      cleanStyleDeclarationPreview(declarator);
                    cleanedStatements.push(
                      t.variableDeclaration("const", [cleanedStyle]),
                    );
                  }
                }
              }
            } else if (t.isReturnStatement(statement)) {
              // Clean the return statement
              const cleanedReturn = cleanReturnStatementPreview(statement);
              cleanedStatements.push(cleanedReturn);
            }
          }

          arrowFunc.body = t.blockStatement(cleanedStatements);
        }
      }
    },
  });

  // Add mock theme constant instead of import
  const mockThemeDeclaration = t.variableDeclaration("const", [
    t.variableDeclarator(
      t.identifier("theme"),
      t.objectExpression([
        t.objectProperty(
          t.identifier("colors"),
          t.objectExpression([
            t.objectProperty(
              t.identifier("primary"),
              t.stringLiteral("#3b82f6"),
            ),
            t.objectProperty(
              t.identifier("secondary"),
              t.stringLiteral("#64748b"),
            ),
            t.objectProperty(
              t.identifier("background"),
              t.stringLiteral("#ffffff"),
            ),
            t.objectProperty(t.identifier("text"), t.stringLiteral("#1f2937")),
          ]),
        ),
        t.objectProperty(
          t.identifier("fonts"),
          t.objectExpression([
            t.objectProperty(t.identifier("heading"), t.stringLiteral("Inter")),
            t.objectProperty(t.identifier("body"), t.stringLiteral("Inter")),
          ]),
        ),
      ]),
    ),
  ]);

  ast.program.body.unshift(mockThemeDeclaration);

  // Clean up React imports
  traverse(ast, {
    ImportDeclaration(path: any) {
      if (path.node.source.value === "react") {
        const filteredSpecifiers = path.node.specifiers.filter((spec: any) => {
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

  return outputCode;
}

function cleanStyleDeclarationPreview(
  declarator: t.VariableDeclarator,
): t.VariableDeclarator {
  const cleanedDeclarator = t.cloneNode(declarator, true);

  if (t.isCallExpression(cleanedDeclarator.init)) {
    traverse(
      t.file(t.program([t.expressionStatement(cleanedDeclarator.init)])),
      {
        // Replace useTheme() with theme
        CallExpression(path: any) {
          if (t.isIdentifier(path.node.callee, { name: "useTheme" })) {
            path.replaceWith(t.identifier("theme"));
          }
        },

        // Remove editor-specific properties
        ObjectProperty(path: any) {
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
        ConditionalExpression(path: any) {
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
        ArrayExpression(path: any) {
          path.node.elements =
            path.node.elements?.filter((element: any) => {
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

function cleanReturnStatementPreview(
  returnStatement: t.ReturnStatement,
): t.ReturnStatement {
  const cleanedReturn = t.cloneNode(returnStatement, true);

  traverse(
    t.file(t.program([cleanedReturn])),
    {
      JSXAttribute(path: any) {
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

      JSXSpreadAttribute(path: any) {
        const arg = path.node.argument;

        // Remove commonProps spreads
        if (
          t.isIdentifier(arg, { name: "commonProps" }) ||
          (t.isTSAsExpression(arg) &&
            t.isIdentifier(arg.expression, { name: "commonProps" })) ||
          (t.isParenthesizedExpression(arg) &&
            t.isTSAsExpression(arg.expression) &&
            t.isIdentifier(arg.expression.expression, { name: "commonProps" }))
        ) {
          path.remove();
        }
      },

      // Handle conditional rendering
      ConditionalExpression(path: any) {
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
      CallExpression(path: any) {
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
// API ROUTE HANDLER
// ==================================================================================

export async function POST(req: NextRequest) {
  try {
    const { componentName, props = {} } = await req.json();

    if (!componentName) {
      return NextResponse.json(
        { status: "error", message: "Component name is required" },
        { status: 400 },
      );
    }

    // Find the component file
    const baseDir = path.join(
      process.cwd(),
      "src/components/core/craft/user-components",
    );

    let sourcePath = findComponentPath(
      componentName,
      path.join(baseDir, "primitives"),
    );

    if (!sourcePath) {
      sourcePath = findComponentPath(
        componentName,
        path.join(baseDir, "composites"),
      );
    }

    if (!sourcePath) {
      return NextResponse.json(
        { status: "error", message: `Component ${componentName} not found` },
        { status: 404 },
      );
    }

    // Convert to pure preview component
    const pureCode = convertToPurePreview(sourcePath);
    console.log(pureCode);
    return NextResponse.json({
      status: "success",
      componentName,
      pureCode,
      props,
    });
  } catch (error: any) {
    console.error("[Preview Error]", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An internal server error occurred",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const componentName = searchParams.get("componentName");
    console.log("what");

    if (!componentName) {
      return NextResponse.json(
        { status: "error", message: "Component name is required" },
        { status: 400 },
      );
    }

    // Same logic as POST but for GET requests
    const baseDir = path.join(
      process.cwd(),
      "src/components/core/craft/user-components",
    );

    let sourcePath = findComponentPath(
      componentName,
      path.join(baseDir, "primitives"),
    );
    if (!sourcePath) {
      sourcePath = findComponentPath(
        componentName,
        path.join(baseDir, "composites"),
      );
    }

    if (!sourcePath) {
      return NextResponse.json(
        { status: "error", message: `Component ${componentName} not found` },
        { status: 404 },
      );
    }

    const pureCode = convertToPurePreview(sourcePath);
    console.log(pureCode);
    return NextResponse.json({
      status: "success",
      componentName,
      pureCode,
    });
  } catch (error: any) {
    console.error("[Preview Error]", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "An internal server error occurred",
      },
      { status: 500 },
    );
  }
}

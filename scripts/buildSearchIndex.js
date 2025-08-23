#!/usr/bin/env node
/* scripts/buildSearchIndex.js
 * Generate a static search index from Next.js App Router pages.
 * Requires: fast-glob, @babel/parser, @babel/traverse
 */

const fs = require("fs/promises");
const path = require("path");

// Handle both CJS/ESM builds of @babel/traverse
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const parser = require("@babel/parser");
const fg = require("fast-glob");

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "app");
const OUT_FILE = path.join(ROOT, "public", "search-index.json");

// ---------- Helpers

function normalizeWhitespace(s) {
  return s.replace(/\s+/g, " ").trim();
}

function isRouteGroup(seg) {
  // Remove "(...)" route groups from URLs
  return seg.startsWith("(") && seg.endsWith(")");
}

function isDynamicSeg(seg) {
  // Skip dynamic routes like [slug] or [...all]
  return seg.startsWith("[") && seg.endsWith("]");
}

function routeFromPageFile(absPageFile) {
  // Example:
  //  - app/page.js                     -> "/"
  //  - app/blog/page.js                -> "/blog"
  //  - app/(marketing)/about/page.js   -> "/about"
  //  - app/blog/[slug]/page.js         -> null  (skipped by default)
  const relDir = path.relative(APP_DIR, path.dirname(absPageFile));
  if (!relDir || relDir === "") return "/";

  const segs = relDir.split(path.sep).filter(Boolean);
  const cleaned = segs.filter((s) => !isRouteGroup(s));

  if (cleaned.some(isDynamicSeg)) {
    return null; // skip dynamic routes by default
  }

  if (cleaned.length === 0) return "/";
  return "/" + cleaned.join("/"); // posix-style URL
}

function parseFileToAst(code, filename) {
  // Parse JS/TS with JSX without executing project code
  return parser.parse(code, {
    sourceType: "module",
    allowReturnOutsideFunction: true,
    plugins: [
      "jsx",
      "classProperties",
      "classPrivateProperties",
      "classPrivateMethods",
      "dynamicImport",
      "importMeta",
      "topLevelAwait",
      // Enable TS/TSX if present. Parser will ignore TS syntax in .js files.
      "typescript",
    ],
    errorRecovery: true,
  });
}

function getJSXElementName(node) {
  // Handle <div>, <H1>, <Namespace.Component>, etc.
  const n = node?.openingElement?.name;
  if (!n) return null;
  if (n.type === "JSXIdentifier") return n.name;
  if (n.type === "JSXMemberExpression") {
    // Namespace.Component -> "Namespace.Component"
    const chain = [];
    let cur = n;
    while (cur) {
      if (cur.property?.name) chain.unshift(cur.property.name);
      if (cur.object?.name) {
        chain.unshift(cur.object.name);
        break;
      }
      cur = cur.object;
    }
    return chain.join(".");
  }
  return null;
}

function collectTextFromJSXChildren(children) {
  const parts = [];
  for (const c of children) {
    if (c.type === "JSXText") {
      const v = normalizeWhitespace(c.value || "");
      if (v) parts.push(v);
    } else if (
      c.type === "JSXExpressionContainer" &&
      c.expression &&
      (c.expression.type === "StringLiteral" ||
        c.expression.type === "TemplateLiteral")
    ) {
      if (c.expression.type === "StringLiteral") {
        const v = normalizeWhitespace(c.expression.value || "");
        if (v) parts.push(v);
      } else if (c.expression.type === "TemplateLiteral") {
        const raw = c.expression.quasis.map((q) => q.value.raw).join(" ");
        const v = normalizeWhitespace(raw || "");
        if (v) parts.push(v);
      }
    }
    // Nested JSXElement children will be visited separately by traverse
  }
  return parts.join(" ");
}

function extractMetadataObject(node) {
  // node: VariableDeclarator.init = ObjectExpression
  // return { title, description } if string literals
  if (!node || node.type !== "ObjectExpression") return {};
  const out = {};
  for (const prop of node.properties || []) {
    if (prop.type !== "ObjectProperty") continue;
    const key =
      prop.key.type === "Identifier" ? prop.key.name : prop.key.value;
    if (!key) continue;
    // Only handle simple string literal values
    if (prop.value.type === "StringLiteral") {
      out[key] = prop.value.value;
    }
  }
  return out;
}

function extractFromAst(ast) {
  let title = null;
  let description = null;
  const textParts = [];
  let capturedH1 = false;

  traverse(ast, {
    noScope: true,
    ExportNamedDeclaration(path) {
      // export const metadata = { title: "...", description: "..." }
      const decl = path.node.declaration;
      if (!decl) return;
      if (decl.type === "VariableDeclaration") {
        for (const d of decl.declarations) {
          if (
            d.id?.type === "Identifier" &&
            d.id.name === "metadata" &&
            d.init?.type === "ObjectExpression"
          ) {
            const m = extractMetadataObject(d.init);
            if (typeof m.title === "string") title = m.title;
            if (typeof m.description === "string") description = m.description;
          }
        }
      }
    },

    JSXElement(path) {
      // Grab H1 as a strong title fallback
      const name = getJSXElementName(path.node);
      if (!capturedH1 && name && name.toLowerCase() === "h1") {
        const h1 = collectTextFromJSXChildren(path.node.children);
        if (h1) {
          title = title || h1;
          capturedH1 = true;
        }
      }

      // Collect basic visible text for the page content index
      const chunk = collectTextFromJSXChildren(path.node.children);
      if (chunk) textParts.push(chunk);
    },

    JSXAttribute(path) {
      // Pull helpful string attributes
      const key = path.node.name?.name;
      if (!key) return;
      if (!["alt", "aria-label", "title"].includes(key)) return;

      const v = path.node.value;
      if (!v) return;
      if (v.type === "StringLiteral") {
        const s = normalizeWhitespace(v.value || "");
        if (s) textParts.push(s);
      } else if (
        v.type === "JSXExpressionContainer" &&
        v.expression?.type === "StringLiteral"
      ) {
        const s = normalizeWhitespace(v.expression.value || "");
        if (s) textParts.push(s);
      }
    },
  });

  const content = normalizeWhitespace(textParts.join(" "));
  return {
    title: title ? normalizeWhitespace(title) : null,
    description: description ? normalizeWhitespace(description) : null,
    content,
  };
}

// ---------- Main

async function main() {
  const matches = await fg(
    [
      "app/**/page.js",
      "app/**/page.jsx",
      "app/**/page.ts",
      "app/**/page.tsx",
    ],
    {
      cwd: ROOT,
      dot: false,
      ignore: [
        "**/node_modules/**",
        "app/**/api/**", // ignore API routes
        "app/**/route.*", // API handlers
      ],
      absolute: true,
    }
  );

  const entries = [];

  for (const file of matches) {
    const url = routeFromPageFile(file);
    if (!url) {
      // Dynamic route; skip. You can extend this to enumerate with your data.
      continue;
    }

    let code = "";
    try {
      code = await fs.readFile(file, "utf8");
    } catch (e) {
      console.warn(`⚠️  Could not read ${file}: ${e.message}`);
      continue;
    }

    let ast;
    try {
      ast = parseFileToAst(code, file);
    } catch (e) {
      console.warn(`⚠️  Parse failed for ${file}: ${e.message}`);
      continue;
    }

    const { title, description, content } = extractFromAst(ast);

    // Only index pages that have some text content
    const hasAnyText = Boolean(
      (title && title.length) ||
        (description && description.length) ||
        (content && content.length > 10)
    );
    if (!hasAnyText) continue;

    entries.push({
      url,
      title: title || null,
      description: description || null,
      content,
    });
  }

  // Ensure public/ exists
  const publicDir = path.join(ROOT, "public");
  await fs.mkdir(publicDir, { recursive: true });

  // Write index
  const payload = JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      count: entries.length,
      pages: entries,
    },
    null,
    2
  );
  await fs.writeFile(OUT_FILE, payload, "utf8");

  console.log(
    `✅ Built search index with ${entries.length} page(s) -> ${path.relative(
      ROOT,
      OUT_FILE
    )}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

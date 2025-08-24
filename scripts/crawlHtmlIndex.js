#!/usr/bin/env node
/**
 * Crawl built HTML (SSG) and produce public/search-index.json
 * Requires: fast-glob, cheerio
 */
const fs = require("fs/promises");
const path = require("path");
const fg = require("fast-glob");
const cheerio = require("cheerio");

const ROOT = process.cwd();
const BUILD_HTML_DIRS = [
    path.join(ROOT, ".next", "server", "app"), // Next.js App Router SSG artifacts
    path.join(ROOT, "out"),                    // if you `next export`
];

const EXCLUDE_TAGS = new Set(["script", "style", "noscript", "template", "svg", "nav", "header", "footer", "aside"]);
const COLLECT_TAGS = new Set([
  "h1","h2","h3","h4","h5","h6",
  "p","li","dt","dd","blockquote","pre","figcaption",
  "td","th"
]);

function getDirectText($, el) {
  // Only the immediate text nodes of this element (no descendants)
  const direct = $(el).contents().filter((_, n) => n.type === "text");
  return normalizeWhitespace(direct.text());
}

function stripChrome($) {
  // Remove obvious chrome anywhere in the doc
  $("nav,header,footer,aside,[aria-hidden='true'],[data-search-exclude]").remove();
  // Common ARIA roles for chrome:
  $("[role='navigation'],[role='banner'],[role='contentinfo'],[role='complementary']").remove();
  // Kill off likely sitewide menus and utility bars:
  $("[data-testid='site-nav'],[data-testid='site-footer']").remove();
}


function normalizeWhitespace(s) {
    return (s || "").replace(/\s+/g, " ").trim();
}

function extractTextPreserveBlocks($) {
  const $root = $("main,[role='main']").first().length
    ? $("main,[role='main']").first()
    : $("body").first();

  // belt-and-suspenders: remove non-content inside the chosen root
  EXCLUDE_TAGS.forEach(tag => $root.find(tag).remove());

  const parts = [];

  // 1) Collect from content tags only
  $root.find(Array.from(COLLECT_TAGS).join(",")).each((_, el) => {
    const txt = getDirectText($, el);
    if (txt) parts.push(txt);
  });

  // 2) Fallback: sometimes content is direct text under a container (rare).
  // Grab direct text that sits immediately under <main> descendants where no content tags exist.
  $root.find("*").each((_, el) => {
    // Skip if this element or its descendants include any content tag
    const containsContent = $(el).find(Array.from(COLLECT_TAGS).join(",")).length > 0;
    if (containsContent) return;

    const txt = getDirectText($, el);
    if (txt) parts.push(txt);
  });

  return parts.join("\n\n");
}


function urlFromHtmlPath(absHtmlPath) {
    // produce a normalized route from .next/server/app/**/index.html or out/**/*.html
    const relFromNext = absHtmlPath.split(path.sep + ".next" + path.sep + "server" + path.sep + "app" + path.sep).pop();
    const relFromOut = absHtmlPath.split(path.sep + "out" + path.sep).pop();
    const rel = relFromNext && relFromNext !== absHtmlPath ? relFromNext : relFromOut;

    if (!rel) return null;

    const segs = rel.split(path.sep).filter(Boolean);

    // quick rejects for not-found or error folders/files
    if (segs.includes("_not-found") || segs.includes("_error")) return null;

    const last = segs[segs.length - 1];
    // /foo/index.html -> /foo, /404.html -> /404
    let url;
    if (last === "index.html") url = "/" + segs.slice(0, -1).filter(s => !(s.startsWith("(") && s.endsWith(")"))).join("/");
    else if (last.endsWith(".html")) url = "/" + last.replace(/\.html$/, "");
    else return null;

    // Normalize & strip route groups
    url = url.replace(/\/+/g, "/");
    url = url.replace(/\/\(([^)]+)\)/g, ""); // remove (groups)

    // Final rejects (in case of flat files like 404.html)
    if (/^\/(_?not-?found|404|500)(\/|$)/i.test(url)) return null;

    return url === "" ? "/" : url;
}


async function extractFromHtml(absHtmlPath) {
  const html = await fs.readFile(absHtmlPath, "utf8");
  const $ = cheerio.load(html);

  stripChrome($);

  const title =
    $("meta[property='og:title']").attr("content") ||
    $("meta[name='twitter:title']").attr("content") ||
    $("title").text() ||
    $("h1").first().text() ||
    null;

  const description =
    $("meta[name='description']").attr("content") ||
    $("meta[property='og:description']").attr("content") ||
    null;

  EXCLUDE_TAGS.forEach(tag => $(tag).remove());
  const content = cleanContent(extractTextPreserveBlocks($));

  return {
    title: title ? normalizeWhitespace(title) : null,
    description: description ? normalizeWhitespace(description) : null,
    content,
  };
}


function cleanContent(s) {
  const lines = s.split(/\n+/).map(l => l.trim()).filter(Boolean);

  const seen = new Set(), uniq = [];
  for (const l of lines) {
    const key = l.replace(/\s+/g, " ");
    if (!seen.has(key)) { seen.add(key); uniq.push(l); }
  }

  const filtered = uniq.filter(l =>
    l.length >= 3 &&
    !/^Call Us\b/i.test(l) &&
    !/Privacy Policy/i.test(l) &&
    !/\bAttribution\b/i.test(l) &&
    !/^\b(Visit|About|Activities|FAQ|Reservations|Gallery|Map|Waypoints)\b$/i.test(l)
  );

  return filtered.join("\n");
}



async function main() {
    // discover HTML files in either build location
    const patterns = [];
    for (const dir of BUILD_HTML_DIRS) {
        patterns.push(path.join(dir, "**/*.html"));
    }
    const htmlFiles = await fg(patterns, { absolute: true, dot: false });

    const entries = [];
    for (const file of htmlFiles) {
        // Skip Next’s internal 404/500 artifacts if present
        if (file.includes("/_not-found/") || file.includes("/_error/")) continue;

        const url = urlFromHtmlPath(file);
        if (!url) continue;

        const { title, description, content } = await extractFromHtml(file);

        // Only keep pages with meaningful text (same idea as your current script)
        if ((title && title.length) || (description && description.length) || (content && content.length > 10)) {
            const SKIP_URLS = new Set([
                "/_not-found", "/not-found", "/404", "/500"
            ]);

            if (!url || SKIP_URLS.has(url) || /^\/(_?not-?found|404|500)(\/|$)/i.test(url)) {
                continue;
            }

            entries.push({ url, title: title || null, description: description || null, content });
        }
    }

    // Ensure public/ exists (same pattern you use now)
    const publicDir = path.join(ROOT, "public");
    await fs.mkdir(publicDir, { recursive: true });

    // Write index (same output shape you already produce)
    const payload = JSON.stringify(
        { generatedAt: new Date().toISOString(), count: entries.length, pages: entries },
        null,
        2
    );
    await fs.writeFile(path.join(ROOT, "public", "search-index.json"), payload, "utf8");

    console.log(`✅ Crawled ${entries.length} page(s) → public/search-index.json`);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

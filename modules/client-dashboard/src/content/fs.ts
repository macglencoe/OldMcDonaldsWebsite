import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Update } from "../types/update";

export type FsAdapterConfig = {
  contentDir?: string; // default: "content" (project root)
};

function resolveDir(contentDir?: string): string {
  const dir = contentDir || "content";
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
}

export async function list(config?: FsAdapterConfig): Promise<Update[]> {
  const dir = resolveDir(config?.contentDir);
  let files: string[] = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }

  const updates: Update[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    try {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const fm = (data || {}) as Record<string, unknown>;
      const parsedId = typeof fm.id === "number" ? fm.id : Number(fm.id);
      const id = Number.isFinite(parsedId) ? (parsedId as number) : (Date.parse((fm.date as string) || "") || undefined);
      const title = (fm.title as string) || slug;
      const date = (fm.date as string) || undefined;
      const author = (fm.author as string) || undefined;
      const description = (fm.description as string) || makePreview(content, 240) || undefined;
      const link = (fm.link as string) || `/updates/${slug}`;
      const preview = typeof fm.preview === "string" ? (fm.preview as string) : undefined; // preview URL
      updates.push({ id, slug, title, date, author, description, link, preview });
    } catch {
      // ignore bad files
    }
  }

  updates.sort((a, b) => {
    const ad = a.date || "";
    const bd = b.date || "";
    if (ad && bd) return bd.localeCompare(ad);
    const ai = a.id ?? 0;
    const bi = b.id ?? 0;
    return bi - ai;
  });

  return updates;
}

export async function listSlugs(config?: FsAdapterConfig): Promise<string[]> {
  const dir = resolveDir(config?.contentDir);
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

export async function getBySlug(slug: string, config?: FsAdapterConfig): Promise<{ update: Update; content: string } | null> {
  const dir = resolveDir(config?.contentDir);
  const filePath = path.join(dir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const fm = (data || {}) as Record<string, unknown>;
    const parsedId = typeof fm.id === "number" ? fm.id : Number(fm.id);
    const id = Number.isFinite(parsedId) ? (parsedId as number) : (Date.parse((fm.date as string) || "") || undefined);
    const title = (fm.title as string) || slug;
    const date = (fm.date as string) || undefined;
    const author = (fm.author as string) || undefined;
    const description = (fm.description as string) || makePreview(content, 240) || undefined;
    const link = (fm.link as string) || `/updates/${slug}`;
    const preview = typeof fm.preview === "string" ? (fm.preview as string) : undefined; // preview URL
    return { update: { id, slug, title, date, author, description, link, preview }, content };
  } catch {
    return null;
  }
}

function makePreview(markdown: string, maxChars = 240): string | undefined {
  const body = (markdown || "").trim();
  if (!body) return undefined;
  const firstPara = body.split(/\n\s*\n/)[0]?.trim() || body;
  if (firstPara.length <= maxChars) return firstPara;
  const sliceAt = firstPara.lastIndexOf(" ", maxChars - 1);
  const end = sliceAt > maxChars * 0.6 ? sliceAt : maxChars;
  return firstPara.slice(0, end).trimEnd() + "…";
}

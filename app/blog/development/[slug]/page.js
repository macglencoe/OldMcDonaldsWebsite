import Layout from "@/components/layout";
import fs from 'fs/promises';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import 'highlight.js/styles/github.css';
import Link from "next/link";


export default async function BlogPage({ params }) {
    const { slug } = params;

    const filePath = path.join(process.cwd(), 'content', 'development-blog', `${slug}.md`);
    let fileContent = '';

    try {
        fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (e) {
        console.error('Could not read blog post file:', e)
        fileContent = '# 404\nPost not found';
    }


    // Directory

    const contentDir = path.join(process.cwd(), 'content', 'development-blog');

    const allFiles = await fs.readdir(contentDir);
    const allSlugs = allFiles
        .filter((f) => /\.(mdx?)$/i.test(f))
        .map((f) => f.replace(/\.mdx?$/i, ''));

    const raw = await fs.readFile(path.join(contentDir, `${slug}.md`), 'utf-8');

    const otherSlugs = allSlugs.filter((s) => s !== slug);

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row mx-auto px-4 py-6 gap-8">
                <article className="prose dark:prose-invert flex-1 text-xl space-y-5 max-w-5xl mx-auto">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            table: ({ node, ...props }) => (
                                <table className="table-auto border-collapse border-foreground/20" {...props} />
                            ),
                            th: ({ node, ...props }) => (
                                <th className="border border-foreground/20 p-2 bg-accent/10" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                                <td className="border border-foreground/20 p-2" {...props} />
                            ),
                            a: ({ node, href, ...props }) => (
                                <a href={href} className="text-accent underline hover:opacity-80" {...props} />
                            ),
                            h1: ({ node, ...props }) => (
                                <div className="text-center border-b border-foreground/20 py-20 space-y-2 mb-10" style={{
                                    backgroundImage: 'radial-gradient(ellipse at bottom, var(--foreground) -250%, transparent 70%)'
                                }}>
                                    <h1 className="text-5xl font-bold" {...props} />
                                    <p>Development Blog</p>
                                </div>
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-3xl font-bold border-double border-l-12 border-background pl-4 bg-accent/20 py-2" {...props} />
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 className="text-2xl font-bold border-double border-l-12 border-accent/20 pl-4 py-1" {...props} />
                            ),
                            h4: ({ node, ...props }) => (
                                <h4 className="text-xl font-bold border-l-4 border-accent/20 pl-4 py-1" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                                <code className="bg-accent/20 px-1 py-0.5 rounded" {...props} />
                            ),
                            pre: ({ node, ...props }) => (
                                <pre className="bg-accent/20 rounded-2xl overflow-hidden text-lg border border-accent/20" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc space-y-2 pl-5" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="list-decimal space-y-2" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-accent/20 pl-4 flex flex-col" {...props} />
                            )
                        }}
                    >
                        {fileContent}
                    </ReactMarkdown>
                </article>
                <aside className="mt-8 lg:mt-0 lg:ml-8 lg:w-64 lg:sticky lg:top-24">
                    <div className="p-4 bg-accent/10 rounded">
                        <h3 className="font-bold mb-2">More posts</h3>
                        <ul className="space-y-1">
                            {otherSlugs.map((s) => (
                                <li key={s}>
                                    <Link
                                        href={`/blog/development/${s}`}
                                        className="text-accent hover:underline"
                                    >
                                        {s.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </Layout>
    )
}
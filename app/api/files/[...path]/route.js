import { NextResponse } from 'next/server';

const OWNER = 'macglencoe';
const REPO = 'OldMcDonaldsWebsite';
const TOKEN = process.env.GITHUB_TOKEN;
const BASE = `https://api.github.com/repos/${OWNER}/${REPO}/contents`;

/**
 * GET handler: Fetch file contents from GitHub.
 */
export async function GET(req, { params }) {
  const segments = params.path || [];
  const filePath = segments.join('/');
  if (!filePath) {
    return NextResponse.json({ message: 'Missing file path' }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const sha = searchParams.get('sha');
  const url = `${BASE}/${encodeURIComponent(filePath)}${sha ? `?ref=${sha}` : ''}`;

  try {
    const ghRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        Accept: 'application/vnd.github.raw+json'
      }
    });

    if (!ghRes.ok) {
      const errorText = await ghRes.text();
      return NextResponse.json({ message: errorText }, { status: ghRes.status });
    }

    const raw = await ghRes.text();
    try {
      const data = JSON.parse(raw);
      return NextResponse.json(data);
    } catch {
      return new NextResponse(raw);
    }

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

/**
 * PUT handler: Create or update a file on GitHub.
 */
export async function PUT(req, { params }) {
  const segments = params.path || [];
  const filePath = segments.join('/');
  if (!filePath) {
    return NextResponse.json({ message: 'Missing file path' }, { status: 400 });
  }

  try {
    const { content, message, branch = 'main' } = await req.json();
    if (typeof content !== 'string' || !message) {
      return NextResponse.json({ message: 'content (string) and message are required' }, { status: 400 });
    }

    const url = `${BASE}/${encodeURIComponent(filePath)}?ref=${branch}`;

    // Check for existing SHA
    const getRes = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });

    let sha;
    if (getRes.ok) {
      const meta = await getRes.json();
      sha = meta.sha;
    }

    const commitPayload = {
      message,
      content: Buffer.from(content, 'utf-8').toString('base64'),
      branch
    };
    if (sha) commitPayload.sha = sha;

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${TOKEN}`
      },
      body: JSON.stringify(commitPayload)
    });

    const result = await putRes.json();
    if (!putRes.ok) {
      return NextResponse.json({ error: result }, { status: putRes.status });
    }

    return NextResponse.json({ message: 'Committed successfully', result });

  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

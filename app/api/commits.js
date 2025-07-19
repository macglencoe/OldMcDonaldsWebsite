export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: "Only GET requests are allowed." });
    }

    const { per_page = 5, page = 1, branch = "main", path } = req.query;

    const owner = 'macglencoe';
    const repo = 'OldMcDonaldsWebsite';
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        return res.status(500).json({ message: "Github token not found." });
    }

    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${per_page}&page=${page}&sha=${branch}`+(path ? `&path=${path}` : '');

    const commitsResponse = await fetch(githubApiUrl, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
    });

    const commitData = await commitsResponse.json();

    if (commitsResponse.ok) {
        return res.status(200).json(commitData);
    } else {
        return res.status(commitsResponse.status).json({ error: commitData });
    }


}
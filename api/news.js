// api/news.js

export default async function handler(req, res) {
    const username = '513914@gr.balbharati.org';
    const password = 'DART@12345';
    const appId = '071bb78f';
    const aylienUrl = 'https://api.aylien.com/v1/oauth/token';

    try {
        // Get OAuth token
        const tokenResponse = await fetch(aylienUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64'),
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to get token');
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.access_token;

        // Fetch news from Aylien API
        const newsResponse = await fetch(
            'https://api.aylien.com/v6/news/stories?categories.id=ay.lifesoc.recontr,ay.lifesoc.fire,ay.lifesoc.evacuate,ay.lifesoc.disaster&language=en&text=disaster&published_at.start=NOW-7DAYS/DAY',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'X-AYLIEN-NewsAPI-Application-ID': appId,
                    'X-AYLIEN-NewsAPI-Application-Key': password,
                },
            }
        );

        if (!newsResponse.ok) {
            throw new Error('Failed to fetch news');
        }

        const newsData = await newsResponse.json();
        res.status(200).json(newsData.stories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

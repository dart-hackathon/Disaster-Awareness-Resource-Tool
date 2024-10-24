// api/news.js

import AylienNewsApi from 'aylien-news-api';

const defaultClient = AylienNewsApi.ApiClient.instance;
const app_id = defaultClient.authentications['app_id'];
const app_key = defaultClient.authentications['app_key'];

// Set your Aylien API credentials here
app_id.apiKey = process.env.AYLIEN_APP_ID;
app_key.apiKey = process.env.AYLIEN_API_KEY;

const api = new AylienNewsApi.DefaultApi();

export default async function handler(req, res) {
    if (req.method === 'GET') {
        let opts = {
            title: 'disaster',
            sortBy: 'published_at',
            language: ['en'],
            publishedAtStart: 'NOW-7DAYS',
            publishedAtEnd: 'NOW',
            perPage: 10
        };

        try {
            const data = await api.listStories(opts);
            res.status(200).json(data);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while fetching news' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
import fetch from 'node-fetch';

// Replace with your actual Aylien App ID and Key
const appId = '2071bb78f';
const apiKey = 'Y291b62df53cdb1b0a31e2eafbe3b2305';

// Function to get the OAuth token from Aylien API
async function getToken() {
    try {
        const response = await fetch('https://api.aylien.com/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + btoa('username:password'),
            },
            body: new URLSearchParams({
                grant_type: 'password',
            }),
        });

        if (!response.ok) {
            console.error('Failed to fetch token:', response.statusText);
            return null;
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
}

// Function to fetch news stories from Aylien API
export default async function handler(req, res) {
    const token = await getToken();
    if (!token) {
        res.status(500).json({ error: 'Failed to authenticate with Aylien API' });
        return;
    }

    // Aylien API query for disaster-related news
    const url = 'https://api.aylien.com/v6/news/stories?aql=language:(en) AND text:(disasters) AND categories:({{taxonomy:aylien AND id:ay.lifesoc.recontr}} OR {{taxonomy:aylien AND id:ay.lifesoc.fire}} OR {{taxonomy:aylien AND id:ay.lifesoc.evacuate}} OR {{taxonomy:aylien AND id:ay.lifesoc.disater}}) AND entities:({{surface_forms.text:"new delhi" AND overall_prominence:>=0.65}}) AND sentiment.title.polarity:(negative neutral positive)&cursor=*&published_at.end=NOW&published_at.start=NOW-1DAYS/DAY';

    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-AYLIEN-NewsAPI-Application-ID': appId,
            'X-AYLIEN-NewsAPI-Application-Key': apiKey,
        },
        redirect: 'follow',
    };

    try {
        const response = await fetch(url, requestOptions);
        const result = await response.text();  // Get raw text to inspect

        console.log('Aylien API response:', result);  // Log the raw response

        // Try to parse the response as JSON
        try {
            const jsonResult = JSON.parse(result);
            res.status(200).json(jsonResult);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            res.status(500).json({ error: 'Invalid JSON response from Aylien API' });
        }

    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news stories' });
    }
}

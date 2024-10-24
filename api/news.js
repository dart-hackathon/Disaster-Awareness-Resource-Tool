// Import necessary packages
const fetch = require('node-fetch'); // Use node-fetch to make API calls in the backend

// Define your Aylien credentials
const username = "513914@gr.balbharati.org";  // Replace with your actual username
const password = "DART@12345";  // Replace with your actual password
const appId = "071bb78f";          // Replace with your actual App ID

// Function to get the OAuth token
async function getToken() {
    const aylienOAuthUrl = "https://api.aylien.com/v1/oauth/token";
    try {
        const response = await fetch(aylienOAuthUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to get OAuth token');
        }

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Error fetching token:', error);
        return null;
    }
}

// Function to fetch disaster-related news
async function fetchNews(req, res) {
    const token = await getToken();
    if (!token) {
        res.status(500).json({ error: 'Failed to authenticate with Aylien API' });
        return;
    }

    // Construct the API endpoint URL with taxonomy and AQL filters
    const url = `https://api.aylien.com/v6/news/stories?aql=language:(en) 
    AND text:(disasters) 
    AND categories:({{taxonomy:aylien AND id:ay.lifesoc.recontr}} 
    OR {{taxonomy:aylien AND id:ay.lifesoc.fire}} 
    OR {{taxonomy:aylien AND id:ay.lifesoc.evacuate}} 
    OR {{taxonomy:aylien AND id:ay.lifesoc.disater}}) 
    AND entities:({{surface_forms.text:"new delhi" AND overall_prominence:>=0.65}}) 
    AND sentiment.title.polarity:(negative neutral positive)&cursor=*&published_at.end=NOW&published_at.start=NOW-1DAYS/DAY`;

    // Set up the request options with headers
    const requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'X-AYLIEN-NewsAPI-Application-ID': appId,
            'X-AYLIEN-NewsAPI-Application-Key': password  // Replace with your actual password (or API key)
        },
        redirect: 'follow'
    };

    // Fetch the news stories
    try {
        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            throw new Error('Error fetching news stories');
        }

        const result = await response.json();
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'Failed to fetch news stories' });
    }
}

module.exports = fetchNews;

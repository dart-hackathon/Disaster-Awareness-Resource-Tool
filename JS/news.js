// news.js

async function fetchNews() {
    const url = '/api/news'; // This points to the Vercel serverless function
    try {
        const response = await fetch(url);
        console.log("Response successful");
        const data = await response.json();

        if (response.ok) {
            console.log(data);
            displayNews(data.stories);
        } else {
            displayNews("Error in response");
        }
    } catch (err) {
        displayNews("Error in display, err");
        console.error("Error in fetch: ", err);
    }
}
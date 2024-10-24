async function fetchNews() {
    try {
        const response = await fetch('/api/news');  // Fetch from the Vercel serverless function
        const data = await response.json();

        if (response.ok) {
            displayNews(data);  // Display the news
        } else {
            displayNews("Error in response");
        }
    } catch (err) {
        console.error("Error fetching news: ", err);
        displayNews("Error fetching news");
    }
}
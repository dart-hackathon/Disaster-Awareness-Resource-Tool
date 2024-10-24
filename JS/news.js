// Aylien API credentials
const username = "513914@gr.balbharati.org"; // Replace with your actual Aylien username
const password = "DART@12345"; // Replace with your actual Aylien password
const appId = "071bb78f"; // Your Aylien App ID

// Get OAuth token
async function getToken() {
    try {
        const response = await fetch("https://api.aylien.com/v1/oauth/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(`${username}:${password}`),
            },
            body: new URLSearchParams({
                grant_type: "client_credentials"
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch token');
        }
        
        const data = await response.json();
        return data.access_token;
    } catch (err) {
        console.error("Error fetching token: ", err);
    }
}

// Fetch disaster news from Aylien News API
async function fetchNews() {
    const token = await getToken(); // Get OAuth token
    if (!token) {
        displayNews("Error retrieving token");
        return;
    }

    const url = 'https://api.aylien.com/v6/news/stories?categories.id=ay.lifesoc.recontr,ay.lifesoc.fire,ay.lifesoc.evacuate,ay.lifesoc.disaster&language=en&text=disaster&published_at.start=NOW-7DAYS/DAY';
    const headers = {
        "Authorization": `Bearer ${token}`,
        "X-AYLIEN-NewsAPI-Application-ID": appId,
        "X-AYLIEN-NewsAPI-Application-Key": password
    };

    try {
        const response = await fetch(url, { headers });
        const data = await response.json();

        if (response.ok) {
            displayNews(data.stories);  // Pass the fetched news stories to the display function
        } else {
            displayNews("Error in response");
        }
    } catch (err) {
        console.error("Error fetching news: ", err);
        displayNews("Error fetching news");
    }
}

// Display news articles on the page
function displayNews(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';  // Clear any existing news

    if (articles.length > 0) {
        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const imageUrl = article.media.length > 0 ? article.media[0].url : ''; // Use Aylien media URL if available

            newsItem.innerHTML = `
                <div class="news-image ${imageUrl ? '' : 'fallback'}">
                    ${imageUrl ? `<img src="${imageUrl}" alt="News Image">` : `<i class="fas fa-newspaper"></i>`}
                </div>
                <h4>${article.title}</h4>
                <p>${article.summary || 'No summary available'}</p>
                <small class="date">${new Date(article.published_at).toLocaleDateString()}</small>
                <a class="read-more" href="${article.links.permalink}" target="_blank">Read More</a>
            `;

            // Fallback if image doesn't load
            const img = newsItem.querySelector('img');
            if (img) {
                img.onerror = function() {
                    img.style.display = 'none';
                    newsItem.querySelector('.news-image').classList.add('fallback');
                    newsItem.querySelector('.news-image').innerHTML = `<i class="fas fa-newspaper"></i>`;
                };
            }

            newsContainer.appendChild(newsItem);
        });
    } else {
        newsContainer.innerHTML = '<p>No news available at the moment.</p>';
    }
}

// Fetch news when the page loads
document.addEventListener('DOMContentLoaded', fetchNews);

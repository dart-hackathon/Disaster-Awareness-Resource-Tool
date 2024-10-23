// news.js

// Your API key from NewsAPI
const API_KEY = 'ff989840ec55400fa35db84c645ee777';  // Replace with actual key

// Fetch disaster news from NewsAPI
async function fetchNews() {
    const url = `https://newsdata.io/api/1/news?apikey=pub_5695608439e5f2b46d80ceb59517e6761da7a&q=disaster%20&country=in&language=en`;
    try {
        const response = await fetch(url);
        console.log("Response successful");
        const display = await response.json();

        if (response.ok) {
            console.log(display);
            displayNews(display.results);
        } else {
            displayNews("Error in response");
        }
    } catch (err) {
        displayNews("Error in display, err");
        console.error("Error in fetch: ", err);
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

            const imageUrl = article.image_url || ''; // Use empty string for missing images

            newsItem.innerHTML = `
                <div class="news-image ${imageUrl ? '' : 'fallback'}">
                    ${imageUrl ? `<img src="${imageUrl}" alt="News Image">` : `<i class="fas fa-newspaper"></i>`}
                </div>
                <h4>${article.title}</h4>
                <p>${article.description || 'No description available'}</p>
                <small class="date">${new Date(article.pubDate).toLocaleDateString()}</small>
                <a class="read-more" href="${article.link}" target="_blank">Read More</a>
            `;

            // If the image fails to load, show fallback
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

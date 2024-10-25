// Fetch disaster-related articles from NewsData.io
async function fetchNewsArticles() {
    try {
        const response = await fetch('/api/disaster_news');
        if (response.ok) {
            const articles = await response.json();
            displayNewsArticles(articles);
        } else {
            console.error('Failed to fetch articles:', response.status);
        }
    } catch (err) {
        console.error('Error in fetch:', err);
    }
}

// Function to truncate text to a specific length
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...'; // Add ellipsis if truncated
    }
    return text;
}

// Display articles on the page
function displayNewsArticles(articles) {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';  // Clear existing articles

    if (articles && articles.length > 0) {
        articles.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.classList.add('news-item');

            const imageUrl = article.image_url || '';  // Use image if available
            const truncatedDescription = truncateText(article.description || 'No description available', 150); // Limit to 150 characters

            newsItem.innerHTML = `
                <div class="news-image ${imageUrl ? '' : 'fallback'}">
                    ${imageUrl ? `<img src="${imageUrl}" alt="News Image">` : `<i class="fas fa-newspaper"></i>`}
                </div>
                <h4>${article.title}</h4>
                <p>${truncatedDescription}</p>
                <small class="date">${new Date(article.pubDate).toLocaleDateString()}</small>
                <a class="read-more" href="${article.link}" target="_blank">Read More</a>
            `;

            // Handle image loading errors
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
        newsContainer.innerHTML = '<p>No relevant disaster-related news available at the moment.</p>';
    }
}

// Filter articles based on search input
function filterArticles() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const articles = document.querySelectorAll('.news-item');

    articles.forEach(article => {
        const title = article.querySelector('h4').textContent.toLowerCase();
        const body = article.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || body.includes(searchTerm)) {
            article.style.display = 'block'; // Show article
        } else {
            article.style.display = 'none'; // Hide article
        }
    });
}

// Fetch articles when the page loads
document.addEventListener('DOMContentLoaded', fetchNewsArticles);

console.log('news.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM content loaded');
  fetchNewsArticles().catch(error => console.error('Error fetching news:', error));
});

function filterArticles() {
  console.log('Filtering articles');
  // ... rest of the function
}
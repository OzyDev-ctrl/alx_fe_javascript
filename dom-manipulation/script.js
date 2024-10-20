const quoteDisplay = document.getElementById('quoteDisplay');
const categoryFilter = document.getElementById('categoryFilter');
const notification = document.getElementById('notification');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        const fetchedQuotes = data.map(post => ({
            text: post.body,
            category: 'Server' // Default category for server quotes
        }));

        // Sync quotes with the server data
        syncQuotes(fetchedQuotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Function to synchronize local quotes with the server quotes
function syncQuotes(fetchedQuotes) {
    // Check for conflicts and update local quotes
    if (JSON.stringify(quotes) !== JSON.stringify(fetchedQuotes)) {
        quotes = fetchedQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        notification.textContent = 'Data updated from server.';
        displayRandomQuote();
    }
}

// Function to periodically fetch quotes from the server
setInterval(fetchQuotesFromServer, 60000); // Check every minute

// Function to display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.textContent = quotes[randomIndex] ? quotes[randomIndex].text : 'No quotes available.';
}

// Function to add a new quote
async function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));

        // Post new quote to the server
        await postQuoteToServer(newQuote);

        displayRandomQuote();
        populateCategories();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(quote),
        });
        notification.textContent = 'New quote posted to server.';
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    quoteDisplay.textContent = filteredQuotes.length > 0 ? filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)].text : 'No quotes available.';
}

// Populate categories dynamically
function populateCategories() {
    const categories = [...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Initialize the app
function init() {
    fetchQuotesFromServer(); // Initial fetch
    populateCategories(); // Populate categories on load
    displayRandomQuote(); // Display a random quote
}

init();

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

        // Check for conflicts
        if (JSON.stringify(quotes) !== JSON.stringify(fetchedQuotes)) {
            // If there are discrepancies, update the local quotes with server quotes
            quotes = fetchedQuotes;
            localStorage.setItem('quotes', JSON.stringify(quotes));
            notification.textContent = 'Data updated from server.';
            displayRandomQuote();
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
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
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        const newQuote = { text: newQuoteText, category: newQuoteCategory };
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        displayRandomQuote();
        populateCategories();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
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

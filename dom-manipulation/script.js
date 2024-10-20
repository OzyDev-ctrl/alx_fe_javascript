// Load quotes from local storage or initialize with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Function to populate the categories in the dropdown
function populateCategories() {
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');

  // Clear existing categories except 'All Categories'
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  // Populate the dropdown with unique categories
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected category from local storage
  const savedCategory = localStorage.getItem('selectedCategory');
  if (savedCategory) {
    categoryFilter.value = savedCategory;
    filterQuotes();  // Apply the filter on page load
  }
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;

  // Save the selected category to local storage
  localStorage.setItem('selectedCategory', selectedCategory);

  let filteredQuotes = quotes;

  // Filter quotes based on category selection
  if (selectedCategory !== 'all') {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
  }

  // Display a random quote from the filtered list
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    document.getElementById('quoteDisplay').innerHTML = 
      `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
  } else {
    document.getElementById('quoteDisplay').innerHTML = `<p>No quotes available for this category.</p>`;
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    // Add the new quote to the quotes array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save updated quotes array to local storage
    localStorage.setItem('quotes', JSON.stringify(quotes));

    // Update the categories dropdown if a new category is introduced
    populateCategories();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert('New quote added successfully!');
  } else {
    alert('Please enter both the quote text and category.');
  }
}

// Function to export quotes to a JSON file
function exportToJsonFile() {
  const jsonQuotes = JSON.stringify(quotes);
  const blob = new Blob([jsonQuotes], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', url);
  downloadAnchorNode.setAttribute('download', 'quotes.json');
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();

  URL.revokeObjectURL(url); // Clean up the URL object
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("Please select a file to import.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        // Update quotes array and save to local storage
        quotes = importedQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();  // Re-populate categories after importing
        alert("Quotes imported successfully!");
      } else {
        throw new Error("Invalid file format.");
      }
    } catch (error) {
      alert("Error importing quotes: " + error.message);
    }
  };
  reader.readAsText(file);
}

// Load the last viewed quote from session storage (if available) on initialization
window.onload = function() {
  populateCategories();  // Populate categories on page load

  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = 
      `<p>"${lastQuote.text}" - <em>${lastQuote.category}</em></p>`;
  }
};

// Event listener to show a random quote
document.getElementById('newQuote').addEventListener('click', filterQuotes);

// Event listener for exporting quotes
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

// Event listener for importing quotes
document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);

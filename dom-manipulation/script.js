// Load quotes from local storage if they exist; otherwise, initialize with default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Save the last viewed quote to session storage
  sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));

  // Update the DOM with the random quote
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>`;
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
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchorNode); // required for Firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
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
    const importedQuotes = JSON.parse(event.target.result);
    if (Array.isArray(importedQuotes)) {
      quotes = importedQuotes;
      // Save imported quotes to local storage
      localStorage.setItem('quotes', JSON.stringify(quotes));
      alert("Quotes imported successfully!");
    } else {
      alert("Invalid file format.");
    }
  };
  reader.readAsText(file);
}

// Load the last viewed quote from session storage (if available) on initialization
window.onload = function() {
  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
    document.getElementById('quoteDisplay').innerHTML = `<p>"${lastQuote.text}" - <em>${lastQuote.category}</em></p>`;
  }
};

// Event listener to show a random quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for exporting quotes
document.getElementById('exportQuotes').addEventListener('click', exportToJsonFile);

// Event listener for importing quotes
document.getElementById('importQuotes').addEventListener('change', importFromJsonFile);

const fs = require('fs');

function readBooksFromFile(filePath) {
return new Promise((resolve, reject) => {
fs.readFile(filePath, 'utf8', (err, data) => {
if (err) {
reject(err);
return;
}
try {
const booksData = JSON.parse(data);
resolve(booksData);
} catch (parseError) {
reject(parseError);
}
});
});
}

const datasetFile = 'books_dataset.json';
const targetGenre = 'Fantasy';

readBooksFromFile(datasetFile)
.then((booksDataset) => {
// Filter books based on the target genre
const filteredBooks = booksDataset.filter((book) => book.genre === targetGenre);

    // Sort filtered books by published date in descending order
    const sortedBooks = filteredBooks.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    console.log(sortedBooks);

})
.catch((error) => {
console.error('Error reading dataset:', error);
});

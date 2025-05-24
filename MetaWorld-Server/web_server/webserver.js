const express = require('express');
const path = require('path');

const app = express();

// Get arguments from the command line
const args = process.argv.slice(2);
const PORT = args[0] || 3000; // Default port: 3000
const DIRECTORY = args[1] ? path.resolve(args[1]) : path.join(__dirname, 'public'); // Default directory: ./public

app.use(express.static(DIRECTORY));

app.listen(PORT, () => {
    console.log(`Serving files from ${DIRECTORY}`);
    console.log(`Server running at http://localhost:${PORT}`);
});
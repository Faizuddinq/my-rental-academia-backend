const https = require('https');
const fs = require('fs');
const path = require('path');

const CSV_URL = 'https://cdn2.gro.care/db424fd9fb74_1748258398689.csv';
const DATA_DIR = path.join(__dirname, '..', 'data');
const CSV_PATH = path.join(DATA_DIR, 'properties.csv');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

console.log('Downloading CSV file...');

// Download the CSV file
https.get(CSV_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download CSV: ${response.statusCode}`);
    process.exit(1);
  }

  const writeStream = fs.createWriteStream(CSV_PATH);
  response.pipe(writeStream);

  writeStream.on('finish', () => {
    console.log(`CSV file downloaded successfully to: ${CSV_PATH}`);
    console.log('You can now start the server with IMPORT_CSV=true to import the data.');
  });

  writeStream.on('error', (error) => {
    console.error('Error writing CSV file:', error);
    process.exit(1);
  });
}).on('error', (error) => {
  console.error('Error downloading CSV:', error);
  process.exit(1);
});

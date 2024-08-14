const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(bodyParser.json());
app.use(express.static('public'));

// Route untuk mengunggah file Excel dan menyimpan data sebagai JSON
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const workbook = XLSX.readFile(file.path);
  const sheetName = workbook.SheetNames[0];
  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

  fs.writeFileSync('data/race-data.json', JSON.stringify(sheetData));

  res.send('File uploaded and data saved.');
});

// Route untuk mendapatkan hasil balapan berdasarkan nomor BIB
app.get('/result/:bibNumber', (req, res) => {
  const bibNumber = req.params.bibNumber;
  const data = JSON.parse(fs.readFileSync('data/race-data.json'));

  const result = data.find(row => row[0] == bibNumber);
  if (result) {
    res.json({
      name: result[1],  // Nama pelari
      pace: result[2],  // Pace pelari
      time: result[3]   // Waktu pelari
    });
  } else {
    res.status(404).send('Bib number not found');
  }
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

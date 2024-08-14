const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

let raceData = [];  // Array untuk menyimpan data Excel sementara di memori

// Route untuk mengunggah file Excel dan menyimpan data di memori
app.post('/upload', upload.single('file'), (req, res) => {
  const workbook = XLSX.read(req.file.buffer);
  const sheetName = workbook.SheetNames[0];
  raceData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  res.send('File uploaded and data saved in memory.');
});

// Route untuk mendapatkan hasil balapan berdasarkan nomor BIB
app.get('/result/:bibNumber', (req, res) => {
  const bibNumber = req.params.bibNumber;
  const result = raceData.find(row => row[0] == bibNumber);

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

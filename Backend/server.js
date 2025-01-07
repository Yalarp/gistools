const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const cors = require('cors');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary upload directory

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const inputPath = path.join(__dirname, req.file.path);
  const outputPath = path.join(__dirname, 'uploads', `${req.file.filename}.glb`);

  exec(`obj2gltf -i ${inputPath} -o ${outputPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Conversion error:', stderr);
      return res.status(500).json({ message: 'File conversion failed', error: stderr });
    }
    res.json({ fileUrl: `http://localhost:3000/uploads/${req.file.filename}.glb` });
  });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

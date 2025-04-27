const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.redirect('/slike');
});

app.get('/slike', (req, res) => {
  const folderPath = path.join(__dirname, 'public', 'images');

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error reading images folder:', err);
      return res.status(500).send('Server error');
    }

    console.log('Files detected:', files);  // Add this line to check all the files

    const images = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.svg';
      })
      .map(file => ({
        url: `/images/${file}`
      }));

    res.render('slike', { images });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

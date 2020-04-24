const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const rootPath = path.join(__dirname, '..', 'build');


app.use(express.static(rootPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(rootPath, 'index.html'));
});

app.listen(port, () => {
    console.log('Server is running on port ', port);
})
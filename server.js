const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/auth-url', require('./api/auth-url'));
app.get('/api/auth-callback', require('./api/auth-callback'));
app.post('/api/refresh-token', require('./api/refresh-token'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

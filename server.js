const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;
const SECRET_KEY = 'mysecret';

app.use(bodyParser.json());

const users = [];

app.post('/api/v1/user/signup', (req, res) => {
  const { username, password, name } = req.body;

  if (!username || !password || !name) {
    return res.status(409).json({
      error: 'ALL fields are required',
    });
  }

  if (users.find((user) => user.username === username)) {
    return res.status(409).json({
      error: 'username already exists',
    });
  }

  users.push({ username, password, name });
  res.status(201).json({ message: 'user created successfully' });
});

app.post('/api/v1/user/signin', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, {
    expiresIn: '1h',
  });
  res.json({ token });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const app = express();

const port = process.env.PORT || 3000;

// Bodyparser Middleware
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
// Static folder
app.use(express.static(path.join('public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

// Signup Route
app.post('/', (req, res) => {
  const { fName, lName, email } = req.body;

  // Make sure fields are filled
  if (!fName || !lName || !email) {
    res.sendFile(__dirname + '/failure.html');
    return;
  }

  // Construct req data
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const apiKey = '1be2a21e9c307eab646a5ba9b733e5e2-us2';
  const listId = '1a1379af05';
  const X = '2';
  const url = `https://us${X}.api.mailchimp.com/3.0/lists/${listId}`;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `auth ${apiKey}`,
    },
    body: jsonData,
  };

  fetch(url, options)
    .then(
      res.statusCode === 200
        ? res.sendFile(__dirname + '/success.html')
        : res.sendFile(__dirname + '/fail.html')
    )
    .catch((err) => console.log(err));
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});
app.post('/success', (req, res) => {
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

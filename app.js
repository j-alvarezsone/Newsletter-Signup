const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
const port = '3000';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const listId = '1a1379af05';
  const X = '2';
  const apiKey = '1be2a21e9c307eab646a5ba9b733e5e2-us2';
  const url = `https://us${X}.api.mailchimp.com/3.0/lists/${listId}`;

  const options = {
    method: 'POST',
    auth: `key:${apiKey}`,
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + '/success.html');
    } else {
      res.sendFile(__dirname + '/failure.html');
    }

    response.on('data', (data) => {
      console.log(JSON.parse(data));
    });
  });

  // request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(process.env.PORT || port, () => {
  console.log('Server is running on port 3000');
});

// API key
// 1be2a21e9c307eab646a5ba9b733e5e2-us2

// List id
// 1a1379af05

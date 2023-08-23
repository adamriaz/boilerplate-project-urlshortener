require('dotenv').config();
const Link = require('./db').Link;
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const linkSchema = require('./schema').linkSchema;
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:url', function (req, res) {
  const urlId = req.params.url;
  const INVALID_URL = 'invalid url';
  if (urlId === '' || urlId === undefined) {
    res.json({ error: INVALID_URL })
  }

  Link.findOne({ urlId })
    .then((result) => {
      
      if (result) {
        console.log(result)
        res.writeHead(302, {
          Location: result.url
        });
        res.end();
      } else {
        res.json({ error: INVALID_URL })
      }
    })
    .catch(() => res.json({ error: INVALID_URL }))
});

app.post('/api/shorturl', function (req, res) {


  linkSchema.validate(req.body)
    .then((data) => {

      Link.findOne({ url: data.url })
        .then((result) => {

          if (result === null) {
            const link = new Link({
              url: data.url
            });
            link.save()
              .then((saved) => {
                res.json({
                  original_url: saved.url,
                  short_url: saved.urlId
                })
              })
              .catch((err) => res.json({ error: err.message }));

          } else {
            res.json({
              original_url: result.url,
              short_url: result.urlId
            })
          }
        });
    })
    .catch(e => {
      if (e) res.json({ error: e.message })
    });



});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

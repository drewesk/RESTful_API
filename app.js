const express = require('express');
const bodyParser = require('body-parser');
const monk = require('monk');
const port = process.env.PORT || 3000;
const db = monk(process.env.MONGODB_URI || 'localhost/chess-openings');
const games = db.get('openings');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/api/chess', (req, res) => {
  games.find({})
  .then((openings) => {
    res.json(openings);
  })
  .catch((err) => {
    res.json(err);
  })
})

app.get('/api/chess/:id', (req, res) => {
  let id = req.params.id;

  games.find({_id: id})
  .then((openings) => {
    res.json(openings[0]);
  })
  .catch((err) => {
    res.json(err);
  })
})

app.post('/api/chess', (req, res) => {
  games.insert(req.body)
  .then((opening) => {
    res.json(opening);
  })
  .catch((err) => {
    res.json(err);
  })
});

app.put('/api/chess/:id', (req, res) => {
  let id = req.params.id;

  games.findOneAndUpdate({_id: id}, req.body)
  .then((opening) => {
    res.json(opening);
  })
  .catch((err) => {
    res.json(err);
  })
});

app.delete('/api/chess/:id', (req, res) => {
  let id = req.params.id;

  games.findOneAndDelete({_id: id})
  .then(() => {
    res.json({status: 'deleted'});
  })
  .catch((err) => {
    res.json(err);
  });
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
})

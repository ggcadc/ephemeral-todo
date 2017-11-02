const app = require('express')();
const mongoose = require('mongoose');
const uri = require('./mongoconfig');
const Todo = require('./models/todo');

mongoose.connect(uri, { useMongoClient: true });

app.get('/', (req, res) => {
  res.send('please use /api/data');
});

app.get('/api/data', (req, res) => {
  Todo.find((err, data) => {
    if (err) {
      console.error(err);
    }
    const newTodos = data.filter(todoPost => parseInt(todoPost.expires, 10) > Date.now());
    return res.jsonp(newTodos);
  });
});

app.get('/api/post/:text', (req, res, next) => {
  const oneDay = 86400000;
  const post = new Todo({
    expires: Date.now() + oneDay,
    todo: req.params.text,
  });
  post.save((err, postText) => {
    if (err) {
      return next(err);
    }
    return res.sendStatus(201, postText);
  });
});

app.get('/api/delete/:id', (req, res) => {
  console.log(req.params.id);
  Todo.remove({ _id: req.params.id }, (err) => {
    if (!err) {
      res.sendStatus(200);
    } else {
      console.error(err);
    }
  });
});

app.get('/api/update/:id/:text', (req, res) => {
  console.log(req.params.id);
  Todo.findOneAndUpdate({ _id: req.params.id }, { $set: { todo: req.params.text } }, { new: true }, (err, doc) => {
    if (err) {
      console.error('Something wrong when updating data!');
    }
    return res.sendStatus(200, doc);
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('running on port process or 3001');
});

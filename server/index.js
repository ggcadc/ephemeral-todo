const app = require('express')();
const mongoose = require('mongoose');
const uri = require('./mongoconfig');
const Todo = require('./models/todo');
const cors = require('cors');

mongoose.Promise = global.Promise;

mongoose.connect(uri, { useMongoClient: true });

app.use(cors());

app.get('/', (req, res) => {
  res.send('please use responsibly');
});

const cleanupOld = (todos) => {
  todos.map((item) => {
    if (parseInt(item.expires, 10) < Date.now()) {
      Todo.remove({ _id: item.id }, () => null);
    }
  });
  return null;
};

app.get('/api/data/:session', (req, res) => {
  Todo.find((err, data) => {
    if (err) {
      console.error(err);
    }
    const returnTodos = data.filter(todoPost => parseInt(todoPost.expires, 10) > Date.now())
      .filter(todo => todo.session === req.params.session);
    cleanupOld(data);
    return res.jsonp(returnTodos);
  });
});

app.get('/api/post/:text/:session', (req, res, next) => {
  const oneDay = 86400000;
  const post = new Todo({
    expires: Date.now() + oneDay,
    todo: req.params.text,
    session: req.params.session,
  });
  post.save((err, postText) => {
    if (err) {
      return next(err);
    }
    return res.sendStatus(201, postText);
  });
});

app.get('/api/delete/:id', (req, res) => {
  Todo.remove({ _id: req.params.id }, (err) => {
    if (!err) {
      res.sendStatus(200);
    } else {
      console.error(err);
    }
  });
});

app.listen(process.env.PORT || 3001, () => {
  console.log('running on port process or 3001');
});

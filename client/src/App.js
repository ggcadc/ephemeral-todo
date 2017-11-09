import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import randomWords from 'random-words';
import './app.css'

class App extends Component {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.state = {
      session: "",
      input: "",
      uri: 'http://localhost:3001/api',
      todos: [],
    };
  }
  componentDidMount() {
    // this makes the initial fetch when the component mounts
    const session = randomWords();
    this.setState({
      session
    })
    window.addEventListener('beforeunload', this.todosCleanup);
  }
  todosCleanup() {
    this.state.todos.map((item) => [
      this.deleteItem(item._id)
    ])
  }
  // uses axios to make a simple fetch
  getData() {
    axios.get(`${this.state.uri}/data/${this.state.session}/`).then((data, err) => {
      if (err)console.log(err);
      return data;
    }).then((data) => {
      // sets the state to the data value
      this.setState({
        todos: data.data,
      });
    });
  }
  deleteItem(id) {
    axios.get(`${this.state.uri}/delete/${id}`)
      .then(data => console.log(data))
      .then(() => this.getData())
  }
  postItem(text) {
    axios.get(`${this.state.uri}/post/${text}/${this.state.session}`)
      .then(data => console.log(data))
      .then(() => this.getData())
      .then(() => this.setState({ input: "" }))
  }
  handleInput(evt) {
    this.setState({
      input: evt.target.value
    })
  }
  TodoList = () => (
    <ul>
      {this.state.todos.map(e => <li key={e._id}>
        <button onClick={() => this.deleteItem(e._id)}>
         <span role="img" aria-label="check">✔️</span>
        </button>{e.todo}</li>)}
    </ul>
  )
  InputTodo = () => (
    <div>
      <input 
        type="submit" 
        onClick={() => this.postItem(this.state.input)} 
        value="ToDo"
      />
      <input 
        type="text" 
        onChange={(e) => this.handleInput(e)} 
        value={this.state.input}
        onKeyPress={(event) => event.key === 'Enter' ? this.postItem(this.state.input) : null}
      />
    </div>
  )
  TodoWrapper = () => (
    <div className="flex">
        <div className="input">
          <this.InputTodo />
        </div>
      {this.state.todos.length > 0 ? <this.TodoList /> : <ul><li>Add Something</li></ul>}
    </div> 
  )
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" render={() => (<Redirect to={this.state.session} />)} />
          <Route path='/*' component={this.TodoWrapper} />
        </Switch>
      </Router>
    );
  }
}

export default App;

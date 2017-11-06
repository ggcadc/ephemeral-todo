import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import './app.css'

class App extends Component {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.state = {
      input: "",
      uri: 'http://localhost:3001/api',
      todos: [],
    };
  }
  componentDidMount() {
    // this makes the initial fetch when the component mounts
    this.getData();
  }
  // uses axios to make a simple fetch
  getData() {
    axios.get(`${this.state.uri}/data`).then((data, err) => {
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
    axios.get(`${this.state.uri}/post/${text}`)
      .then(data => console.log(data))
      .then(() => this.getData())
  }
  updateItem(text, id) {
    axios.get(`${this.state.uri}/update/${id}/${text}`)
      .then(data => console.log(data))
      .then(() => this.getData())
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
    <div className="inputBox">
      Todo:<input type="text" onChange={(e) => this.handleInput(e)} />
      <input type="submit" onClick={() => this.postItem(this.state.input)}/>
    </div>
  )
  render() {
    return (
      <Router>
        <div>
          <this.InputTodo />
          <this.TodoList />
        </div>
      </Router>
    );
  }
}

export default App;

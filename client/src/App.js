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
      loading: true,
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
        loading:false
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
    <div className="inputBox">
      <input type="text" onChange={(e) => this.handleInput(e)} value={this.state.input} />
      <input type="submit" onClick={() => this.postItem(this.state.input)} value="ToDo" />
    </div>
  )
  render() {
    return (
      <Router>
        <div>
          <this.InputTodo />
          {this.state.loading?<div className="loader">Loading...</div>:<this.TodoList />}
        </div>
      </Router>
    );
  }
}

export default App;

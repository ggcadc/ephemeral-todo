import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import axios from 'axios';


class App extends Component {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    // temporary stand in state data
    this.state = {
      data: '....',
    };
  }
  componentDidMount() {
    // this will fetch fresh data every 60 mins
    setInterval(() => {
      this.getData();
      console.log('re-fetching data');
    }, 3.6e+6);

    // this makes the initial fetch when the component mounts
    this.getData();
  }
  // uses axios to make a simple fetch
  getData() {
    axios.get('URL_OF_YOUR_DEPLOYED_NODE_API').then((data, err) => {
      if(err)console.log(err);
      return data
    }).then((data) => {
      // sets the state to the data value
      this.setState({
        subs: data.data[0],
      });
    });
  }
  render() {
    return (
      <Router>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
          <h1>a component with cool stuff will go here</h1>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;

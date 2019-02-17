import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar'
import AppEventChart from './components/AppEventChart'
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'

class App extends Component {
  render() {
    return (
      <div className="App">
       <AppNavbar/>
       <AppEventChart/>
      </div>
    );
  }
}

export default App;

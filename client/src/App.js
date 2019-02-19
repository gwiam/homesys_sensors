import React, { Component } from 'react';
import 'react-dates/initialize';
import './App.css';
import 'react-dates/lib/css/_datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AppNavbar from './components/AppNavbar'
import AppEventChart from './components/AppEventChart'

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

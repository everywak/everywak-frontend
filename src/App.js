import React, { Component } from 'react';
import styled from "styled-components";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './common/Header/Header.js';

class App extends Component {

  render() {
    return (
        <div className="App">
          <Router>
            <Header />
          </Router>
        </div>
    );

  }
}

export default App;

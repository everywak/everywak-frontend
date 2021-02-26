import React, { Component } from 'react';
import styled from "styled-components";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Header from './common/Header/Header.js';
import Footer from './common/Footer/Footer.js';
import Frontpage from './modules/frontpage/Frontpage.js';

class App extends Component {

  render() {
    return (
        <div className="App">
          <Router>
            <Header />
            <Route exact path="/" component={Frontpage}/>
            <Footer />
          </Router>
        </div>
    );

  }
}

export default App;

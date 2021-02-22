import React, { Component } from 'react';
import styled from "styled-components";
import { BrowserRouter as Router } from 'react-router-dom';

import Header from './common/Header/Header.js';
import BodyContainer from './common/BodyContainer.js';

class App extends Component {

  render() {
    return (
        <div className="App">
          <Header />
          <BodyContainer />
        </div>
    );

  }
}

export default App;

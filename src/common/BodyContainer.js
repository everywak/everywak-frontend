import React, { Component } from 'react';
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Bestwakki from '../modules/bestwakki/Bestwakki.js';
import Live from '../modules/live/Live.js';

class BodyContainer extends Component {
  render() {
    return (
      <Router>
        <div className="BodyContainer">
          <Route path="/bestwakki" component={Bestwakki} />
          <Route path="/live" component={Live} />
        </div>
      </Router>
    );
  }
}

export default BodyContainer;
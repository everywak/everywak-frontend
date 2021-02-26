import React, { Component, Fragment } from 'react';
import styled from "styled-components";
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Bestwakki from '../modules/bestwakki/Bestwakki.js';
import Live from '../modules/live/Live.js';

class BodyContainer extends Component {
  render() {
    const style ={
      height: '100%'
    }
    return (
      <Fragment>
          <Route path="/bestwakki" component={Bestwakki} />
          <Route path="/live" component={Live} />
      </Fragment>
    );
  }
}

export default BodyContainer;
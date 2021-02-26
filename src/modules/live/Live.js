import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import styled from "styled-components";

class Live extends Component {

  render() {
    const style ={
      background: 'white',
      height: '100%'
    }
    
    return (
      <div className="Live" style={style}>
        Live 모듈데스
      </div>
    );
  }
}

export default Live;
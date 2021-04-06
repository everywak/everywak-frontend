import React, { Component } from 'react';
import styles from './Spinner.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Spinner extends Component {
  static defaultProps = {
    caption: '',
    struct: null,
    structLength: 3,
  }
  

  render() {
    const { caption, struct, structLength } = this.props;
    const spin = 
    <div className="spinnerWrapper">
      <img src="images/spinner.svg" className="spinnerAnim" alt="" />
      <div className="caption">{caption}</div>
    </div>;
    const structs = [...Array(structLength).keys()].map(i => (struct));

    return (
      <div className="Spinner">
        {struct ? structs : spin}
      </div>
    );
  }
}

export default Spinner;
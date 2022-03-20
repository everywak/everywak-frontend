import React, { Component } from 'react';

import styles from './WakPlayerVolumeBar.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class WakPlayerVolumeBar extends Component {

  static defaultProps = {
    value: 50,
    onChangeValue: val => {},
    onChangePressed: val => {},
  }
  state = {
    volPressed: false,
  }

  constructor() {
    super();
    
    this.volSlider = React.createRef();
    this._pressedSlider = false; // 볼륨바 드래그중 커서가 WakPlayer 밖으로 나갔을 때 오버레이 유지되게 하는 용도
  }

  set pressedSlider(val) {
    this._pressedSlider = val;
    this.props.onChangePressed(val); // 오버레이 유지하라고 알림
  }

  get pressedSlider() {
    return this._pressedSlider;
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  /**
   * 값을 0~100 사이로 제한합니다.
   * 
   * @param {number} val
   * @returns {number}
   */
  clampValue = val => {
    return Math.min(Math.max(val, 0), 100);
  }

  /**
   * 브라우저상에서 볼륨 슬라이더가 위치한 죄표값을 반환합니다.
   * 
   * @returns {{top: number, left: number}}
   */
  getSliderOffset = () => {
    const volSlider = this.volSlider.current;
    if (!volSlider) { return; }

    const rect = volSlider.getBoundingClientRect();
    const offset = { 
      top: rect.top + window.scrollY, 
      left: rect.left + window.scrollX, 
    };

    return offset;
  }
  
  onMouseDown = e => {

    const offset = this.getSliderOffset();
    if (!offset) { return; }

    this.pressedSlider = true;

    const newValue = this.clampValue(e.pageX - offset.left - 8);
    if (newValue !== this.props.value) {
      this.props.onChangeValue(newValue);
    }

  }
  
  onMouseMove = e => {

    if (this.pressedSlider) {

      const offset = this.getSliderOffset();
      if (!offset) { return; }

      const newValue = this.clampValue(e.pageX - offset.left - 8);
      if (newValue !== this.props.value) {
        this.props.onChangeValue(newValue);
      }
    }

  }

  onMouseUp = () => {
    this.pressedSlider = false;
  }

  render() {

    const {
      value
    } = this.props;

    const btnLeft = {left: `${parseInt(value)}px`};
    const barWidth = {width: `${parseInt(value)}px`};

    return (
      <div className={cx('WakPlayerVolumeBar')} ref={this.volSlider} onMouseDown={this.onMouseDown}>
        <div className="sliderBg"></div>
        <div className="sliderBar" style={barWidth}></div>
        <div className="sliderBtn" style={btnLeft}></div>
      </div>
    );
  }
}

export default WakPlayerVolumeBar;
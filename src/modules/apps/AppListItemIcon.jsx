import React, { Component } from 'react';
import styles from './AppListItemIcon.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class AppListItemIcon extends Component {
  static defaultProps = {
    src: '',
    alt: '',
    iconPadding: '0px',
    themeColor: '#d3d3d3',
  }

  render() {
    const { alt, src, iconPadding, themeColor } = this.props;

    const icon = (
      typeof src == 'string' ? 
      <img src={src} alt={alt} onError={e => (e.target.style.display = 'none')} /> :
      src
    );

    return (
      <div className="AppListItemIcon" style={{'--themeColor': themeColor}}>
        <div className="bottomShadow"></div>
        <div className="iconWrapper">
          <div className="imgWrapper" style={{'--iconPadding': iconPadding}}>
            {icon}
          </div>
        </div>
      </div>
    );
  }
}
  
export default AppListItemIcon;
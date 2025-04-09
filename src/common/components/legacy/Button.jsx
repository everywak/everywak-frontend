import React, { Component } from 'react';
import styles from './Button.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Button extends Component {
  static defaultProps = {
    className: '',
    href: '',
    size: 'medium',
    iconSrc: '',
    iconBGColor: '',
    showLabel: false,
    label: '',
    labelSize: '12px',
    labelBGColor: '',
    onclick: null,
  };

  sizes = ['small', 'medium', 'big', 'fillWidth', 'fill'];

  render() {
    const {
      className,
      href,
      size,
      iconBGColor,
      iconSrc,
      showLabel,
      label,
      labelBGColor,
      labelSize,
      onclick,
    } = this.props;
    const btnSize = this.sizes.filter((val) => val === size).join() || 'medium';

    return (
      <a
        className={cx('Button', className, btnSize)}
        href={href}
        onClick={(e) => {
          if (onclick) {
            e.preventDefault();
            onclick(e);
          }
        }}
      >
        {iconSrc && (
          <div className={styles.icon} style={{ background: iconBGColor }}>
            {typeof iconSrc === 'object' ? (
              iconSrc
            ) : (
              <img src={iconSrc} alt={!showLabel && label ? label : ''} />
            )}
          </div>
        )}
        {iconSrc &&
          typeof iconSrc === 'object' &&
          (!showLabel && label ? <i className={styles.blind}>{label}</i> : '')}
        {showLabel && label && (
          <div className={styles.label} style={{ background: labelBGColor, fontSize: labelSize }}>
            {label}
          </div>
        )}
      </a>
    );
  }
}

export default Button;

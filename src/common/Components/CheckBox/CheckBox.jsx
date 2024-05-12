import React from 'react';

import './CheckBox.scss';
import cx from 'classnames';

/**
 * 체크박스
 * 
 * @param {{
 * className?: string, 
 * name: string, 
 * value: boolean, 
 * onChange?: ({target: {name: string, value: boolean}}) => void, 
 * accentColor: string, 
 * label?: JSX.Element|String
 * fillContainer: boolean}} props 
 */
function CheckBox(props) {
  
  const {
    className, 
    name,
    value, 
    onChange, 
    accentColor,
    label, 
    fillContainer = false,
    ...rest
  } = props;

  return (
    <button className={cx("CheckBox", className, {on: value, fillContainer})} onClick={e => onChange({target: {name, value: !value}})} {...rest} style={{'--accentColor': accentColor}}>
      <div className="label">{label}</div>
      <div className="indicator">
        <div className="marker"></div>
      </div>
    </button>
  );
}

export default CheckBox;
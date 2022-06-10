import styles from './CheckBox.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 체크박스
 * 
 * @param {{className?: string, name: string, value: boolean, onChange?: ({target: {name: string, value: boolean}}) => void, accentColor: string, label?: JSX.Element|String}} props 
 */
function CheckBox(props) {
  
  const {
    className, 
    name,
    value, 
    onChange, 
    accentColor,
    label, 
    ...rest
  } = props;

  return (
    <button className={cx("CheckBox", className, {on: value})} onClick={e => onChange({target: {name, value: !value}})} {...rest} style={{'--accentColor': accentColor}}>
      <div className="label">{label}</div>
      <div className="indicator">
        <div className="marker"></div>
      </div>
    </button>
  );
}

export default CheckBox;
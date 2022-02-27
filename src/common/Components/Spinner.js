import styles from './Spinner.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 
 * @param {{caption: String, struct: JSX.Element, structLength: Number}} props 
 */
function Spinner({caption = '', struct, structLength = 3}) {

  const spin = 
  <div className="spinnerWrapper">
    <img src="/images/spinner.svg" className="spinnerAnim" alt="" />
    <div className="caption">{caption}</div>
  </div>;
  const structs = [...Array(structLength).keys()].map(i => (struct));

  return (
    <div className="Spinner">
      {struct ? structs : spin}
    </div>
  );

}

export default Spinner;
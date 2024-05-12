import React, { useEffect } from 'react';

import './InputForm.scss';
import cx from 'classnames';

/**
 * 
 * @param {{
 * className: String, 
 * children: JSX.Element,
 * name: String, 
 * description?: String, 
 * }} props 
 * @returns {JSX.Element}
 */
function InputForm({className, children, name = '', description}) {
  return (
    <div className={cx('InputForm', className)}>
      <div className="name">{name}</div>
      <div className="formWrapper">
        <div className="inputWrapper">{children}</div>
        {description && <div className="description">{description}</div>}
      </div>
    </div>
  );
}

export default InputForm;
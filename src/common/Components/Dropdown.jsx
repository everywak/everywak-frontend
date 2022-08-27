import React, { useCallback, useState, useEffect, useRef } from 'react';

import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import styles from './Dropdown.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 드롭다운 메뉴
 * 
 * @param {{options: [{name: string, value: any}], value: any, onChange: function}} props 
 */
function Dropdown({ options = [], name, value, onChange = val => {}}) {
  
  const [opened, setOpened] = useState(false);
  const [dropdownAreaPos, setDropdownAreaPos] = useState({x: 0, y: 0});

  const btnSelect = useRef();
  const dropdownArea = useRef();
  const selectedItem = useRef();

  const setOption = useCallback((val) => {
    close();
    onChange({
      target: {
        value: val,
        name,
      }
    });
  }, [name]);

  function posList() {
    const nameRect = btnSelect.current.getBoundingClientRect();
    const list = dropdownArea.current;
    const listRect = list.getBoundingClientRect();
    const target = selectedItem.current;
    const targetRect = (target ? target : list).getBoundingClientRect();
    
    const tx = nameRect.left - (targetRect.left - listRect.left);
    const ty = nameRect.top - (targetRect.top - listRect.top) + 3;
    setDropdownAreaPos({
      x: tx,
      y: ty,
    });
  }

  function open() { 
    setOpened(true);
    posList(); 
  }
  function close() { setOpened(false); }

  useEffect(() => {
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close);

    return () => {
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close);
    };
  }, []);
    
  const list = options.map(
    item => (
      <div 
        key={item.value} 
        className={cx('option', {'checked': value === item.value})} 
        onClick={e => setOption(item.value)}>
        <div className="marker" />
        <span className="name" ref={value === item.value ? selectedItem : null}>
          {item.name}
        </span>
      </div>
    )
  );

  const dropdownAreaStyle = {
    '--left': `${dropdownAreaPos.x}px`,
    '--top': `${dropdownAreaPos.y}px`,
  };

  const selectedOption = options.find(item => item.value === value);

  return (
    <div className={cx('Dropdown', {'opened' : opened})} >
      <div className="dispArea" onClick={open}>
        <span className="currName" ref={btnSelect}>{(selectedOption && selectedOption.name) || ''}</span>
        <ExpandMoreRoundedIcon />
      </div>
      <div className="closeArea" onClick={close}></div>
      <div className="dropdownAreaWrapper" style={dropdownAreaStyle} ref={dropdownArea}>
        <div className="dropdownArea">{list}</div>
      </div>
    </div>
  );
}

export default Dropdown;
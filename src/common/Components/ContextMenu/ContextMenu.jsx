import React from 'react';

import styles from './ContextMenu.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * @typedef {'tl'|'tr'|'lt'|'ld'|'dl'|'dr'|'rt'|'rd'} ContextMenuDirection
 */
/**
 * @typedef {Object} ContextMenuItemProps
 * @property {string} className
 * @property {string} label
 * @property {string} subLabel
 * @property {string} name
 * @property {any} value
 * @property {boolean} selected
 * @property {boolean} disabled
 * @property {React.DOMAttributes<HTMLDivElement>.onClick?: React.MouseEventHandler<HTMLDivElement>} onClick
 * @property {({target: {name: string, value: number}}) => void} onChange 
 * @property {ContextMenuItemProps[]} items
 * @property {number} depth
 * @property {ContextMenuDirection} direction
 */

/**
 * 컨텍스트 메뉴
 * 
 * @param {{className: string, items: ContextMenuItemProps[], onChange: ({target: {name: string, value: number}}) => void, depth: number, direction: ContextMenuDirection}} props 
 * @returns {JSX.Element}
 */
function ContextMenu(props) {
  const {
    className, 
    items, 
    onChange = () => {},
    depth = 0,
    direction = 'tl',
    ...rest
  } = props;

  const [mainDirection, subDirection] = direction.split('');
  const list = items.map(item => <ContextMenuItem {...item} direction={subDirection + mainDirection} onChange={onChange} />);

  return (
    <div className={cx('ContextMenu', className, `m${mainDirection}`, `s${subDirection}`, {root: depth === 0}, {sub: depth > 0})} {...rest}>
      {list}
    </div>
  );
}

/**
 * 
 * @param {ContextMenuItemProps} props 
 * @returns {JSX.Element}
 */
function ContextMenuItem({ className, label, subLabel, name, value, selected, disabled, onClick = () => {}, onChange = () => {}, items, depth, direction }) {

  const _onClick = e => {

    onChange({
      target: {
        name, value,
      }
    });
    onClick(e);
  }

  return (
    <div className={cx('ContextMenuItem', className, {selected, disabled})} onClick={_onClick}>
      <div className="labelWrapper">
        <span className="label">{label}</span>
        {
          subLabel && <span className="subLabel">{subLabel}</span>
        }
      </div>
      {items && <ContextMenu depth={depth + 1} items={items} direction={direction} /> }
    </div>
  );
}

export default ContextMenu;
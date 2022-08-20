import React, { Component, useCallback, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../common/Components/Button';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';

import { WaktoonItem } from './WaktoonItem';

import ReactGA from 'react-ga';
import GAEvents from '../../common/GAEvents';

import styles from './WaktoonList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

function WaktoonList({
  className = '',
  ItemComponent = WaktoonItem,
  list = [], 
  defaultShowCount = 8, 
  perPageCount = 8, 
  maximumShowCount = 30, 
  moreTarget = '', 
  onMore = () => {}, 
  gaEventOnClickMore = () => {}, 
  gaEventOnClickItem = () => {}
}) {

  const [showCount, setShowCount] = useState(defaultShowCount);

  useEffect(() => {
    setShowCount(defaultShowCount);
  }, [defaultShowCount]);
  
  const onClickMore = e => {
    showMoreItems();
    onMore();

    ReactGA.event(gaEventOnClickMore);
  }

  const onClickItem = e => {
    ReactGA.event(gaEventOnClickItem);
  }

  const showMoreItems = useCallback(e => {
    setShowCount(prevValue => prevValue + perPageCount);
  }, [setShowCount]);

  const itemList = list.slice(0, showCount).map(item => <ItemComponent key={item.key} onClick={onClickItem} {...item} />);
  
  return (
    <div className={cx('WaktoonList', className)}>
      <ul className="itemList">
        {itemList}
      </ul>
      {
        showCount < maximumShowCount &&
        <div className="more">
          <Button 
            className={cx('moreLoad')} 
            href="" 
            size="fillWidth" 
            label={<ExpandMoreRoundedIcon />} 
            showLabel={true} 
            labelSize="14px" 
            labelBGColor="transparent" 
            onclick={onClickMore} />
        </div>
      }
    </div>
  );
}
  
export default WaktoonList;
import React, { useCallback, useState, useEffect } from 'react';

import Button from 'common/components/legacy/Button';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import { WaktoonItem } from './WaktoonItem';

import ReactGA from 'react-ga';

import './WaktoonList.scss';
import cx from 'classnames';

function WaktoonList({
  className = '',
  ItemComponent = WaktoonItem,
  list = [],
  defaultShowCount = 8,
  perPageCount = 8,
  maximumShowCount = 30,
  useSlide = false,
  moreTarget = '',
  onMore = () => {},
  gaEventOnClickMore = () => {},
  gaEventOnClickItem = () => {},
}) {
  const [showCount, setShowCount] = useState(defaultShowCount);

  const [mobileCursor, setMobileCursor] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setMobileCursor((prevValue) => (prevValue + 1) % defaultShowCount);
    }, 8000);
  }, [mobileCursor]);

  useEffect(() => {
    setShowCount(defaultShowCount);
  }, [defaultShowCount]);

  const onClickMore = (e) => {
    showMoreItems();
    onMore();

    ReactGA.event(gaEventOnClickMore);
  };

  const onClickItem = (e) => {
    ReactGA.event(gaEventOnClickItem);
  };

  const showMoreItems = useCallback(
    (e) => {
      setShowCount((prevValue) => prevValue + perPageCount);
    },
    [setShowCount],
  );

  const itemList = list
    .slice(0, showCount)
    .map((item, i) => (
      <ItemComponent
        key={item.key}
        highlight={i === mobileCursor}
        onClick={onClickItem}
        {...item}
      />
    ));

  return (
    <div className={cx('WaktoonList', className, { useSlide: useSlide })}>
      <ul className="itemList">{itemList}</ul>
      {showCount < maximumShowCount && (
        <div className="more">
          <Button
            className={cx('moreLoad')}
            href=""
            size="fillWidth"
            label={<ExpandMoreRoundedIcon />}
            showLabel={true}
            labelSize="14px"
            labelBGColor="transparent"
            onclick={onClickMore}
          />
        </div>
      )}
    </div>
  );
}

export default WaktoonList;

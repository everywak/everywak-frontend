import React from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import SectionHeader from './SectionHeader';

import './AsidePanel.scss';
import cx from 'classnames';

/**
 * Frontpage에 들어가는 aside panel
 *
 * @param {{title: string, description?: string, moreLabel?: string, moreLink?: string, children: JSX.Element | string}} props
 * @returns {JSX.Element}
 */
function AsidePanel({ title, description, moreLabel, moreLink, children }) {
  return (
    <section className={cx('AsidePanel', { headerOnly: !children })}>
      <SectionHeader
        title={title}
        description={description}
        moreLabel={moreLabel}
        moreLink={moreLink}
        width="spaceBetween"
      />
      {children && <div className="contentWrapper">{children}</div>}
    </section>
  );
}

export default AsidePanel;

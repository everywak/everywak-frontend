import React from 'react';
import { Link } from 'react-router-dom';

import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';

import './CommonHeader.scss';
import cx from 'classnames/bind';

/**
 * @typedef LinkItem
 * @property {string} key
 * @property {string} name
 * @property {string} href
 */
/**
 * @typedef CommonHeaderProps
 * @property {string} className
 * @property {string} title
 * @property {boolean} isBeta
 * @property {LinkItem[]} categories
 * @property {string} subtitle
 * @property {string} description
 * @property {LinkItem[]} moreLink
 * @property {JSX.Element|string} children
 */

/**
 *
 * @param {CommonHeaderProps} props
 * @returns {JSX.Element}
 */
function CommonHeader({
  className,
  title,
  isBeta = false,
  categories,
  subtitle,
  description,
  moreLink,
  children,
}) {
  const categoryList = categories.map(({ key, ...item }) => (
    <li className="categoryItem" key={key}>
      {item.href.match(/^\//) ? (
        <Link to={item.href}>{item.name}</Link>
      ) : (
        <a href={item.href}>{item.name}</a>
      )}
    </li>
  ));

  const moreLinkList = moreLink.map(({ key, ...item }) => (
    <Link key={key} to={item.href} className="btnMore">
      {item.name} <KeyboardArrowRightRoundedIcon fontSize="small" />
    </Link>
  ));

  return (
    <header className={cx('CommonHeader', className)}>
      <div className="headerWrapper">
        <div className="titleWrapper">
          <h1 className="title">
            {title}
            {isBeta && <span className="beta">βeta</span>}
          </h1>
          <nav className="category">
            <ul className="categoryList">{categoryList}</ul>
            {/*<EverywakLoginArea />*/}
          </nav>
        </div>
        <div className="highlight">
          <div className="intro">
            <h2 className="subtitle">{subtitle}</h2>
            <div className="description">{description}</div>
            <div className="moreLink">{moreLinkList}</div>
          </div>
          <div className="contentWrapper">{children}</div>
        </div>
      </div>
    </header>
  );
}

export default CommonHeader;

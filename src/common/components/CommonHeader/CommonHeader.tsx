import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { KeyboardArrowRightRounded } from '@mui/icons-material';
import styles from './CommonHeader.module.scss';

export interface Props {
  className?: string;
  title: string;
  isBeta?: boolean;
  links: SideLinkProps[];
  subtitle: string;
  description: string;
  more: SideLinkProps[];
  children: React.ReactNode;
}

export const CommonHeader = ({
  className,
  title,
  isBeta = false,
  links,
  subtitle,
  description,
  more,
  children,
}: Props) => {
  const linkList = links.map(({ key, ...item }) => <SideLink key={key} {...item} />);

  const moreLinkList = more.map(({ key, ...item }) => (
    <Link key={key} to={item.href} className={styles.btnMore}>
      {item.name} <KeyboardArrowRightRounded fontSize="small" />
    </Link>
  ));

  return (
    <header className={clsx('CommonHeader', styles.container, className)}>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>
            {title}
            {isBeta && <span className={styles.beta}>βeta</span>}
          </h1>
          <nav className={styles.links}>
            <ul className={styles.list}>{linkList}</ul>
          </nav>
        </div>
        <div className={styles.highlight}>
          <div className={styles.intro}>
            <h2 className={styles.subtitle}>{subtitle}</h2>
            <div className={styles.description}>{description}</div>
            <div className={styles.more}>{moreLinkList}</div>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </header>
  );
};

export interface SideLinkProps {
  key: string;
  name: string;
  href: string;
}

export const SideLink = (props: SideLinkProps) => {
  return (
    <li className={styles.sideLink}>
      {props.href.match(/^\//) ? (
        <Link to={props.href}>{props.name}</Link>
      ) : (
        <a href={props.href}>{props.name}</a>
      )}
    </li>
  );
};

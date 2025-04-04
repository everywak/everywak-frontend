import React from 'react';
import { ChatBadge } from 'components/withlive/LiveChat/LiveChat.type';
import { FanclubBadge } from './Badge/FanclubBadge';
import { ManagerBadge } from './Badge/ManagerBadge';
import { SubscriberBadge } from './Badge/SubscriberBadge';
import { TopfanBadge } from './Badge/TopfanBadge';
import styles from './Badge.module.scss';

export type Props = {
  badge: ChatBadge;
};

const BadgeContent = (badge: ChatBadge) => {
  if (badge.id === 'manager') {
    return <ManagerBadge />;
  }
  if (badge.id === 'topfan') {
    return <TopfanBadge />;
  }
  if (badge.id === 'fan') {
    return <FanclubBadge />;
  }
  if (badge.id.includes('-sub-') && badge.icon === '') {
    return <SubscriberBadge month={parseInt(badge.id.split('-')[2])} />;
  }
  return <img src={badge.icon} alt={badge.name} />;
};

export const Badge = React.memo(
  (props: Props) => (
    <div className={styles.Badge}>
      <BadgeContent {...props.badge} />
      <div className={styles.tip}>
        <span>{props.badge.name}</span>
      </div>
    </div>
  ),
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.badge) === JSON.stringify(nextProps.badge),
);

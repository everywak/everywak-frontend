import { ChatBadge } from 'components/withlive/LiveChat/LiveChat.type';

import styles from './Badge.module.scss';
import { FanclubBadge } from './Badge/FanclubBadge';
import { ManagerBadge } from './Badge/ManagerBadge';
import { SubscriberBadge } from './Badge/SubscriberBadge';

export type Props = {
  badge: ChatBadge;
};

const BadgeContent = (badge: ChatBadge) => {
  if (badge.id === 'manager') {
    return <ManagerBadge />;
  }
  if (badge.id === 'fan') {
    return <FanclubBadge />;
  }
  if (badge.id.includes('-sub-') && badge.icon === '') {
    return <SubscriberBadge month={parseInt(badge.id.split('-')[2])} />;
  }
  return <img src={badge.icon} alt={badge.name} />;
};

export function Badge(props: Props) {
  return (
    <div className={styles.Badge}>
      <BadgeContent {...props.badge} />
      <div className={styles.tip}>
        <span>{props.badge.name}</span>
      </div>
    </div>
  );
}

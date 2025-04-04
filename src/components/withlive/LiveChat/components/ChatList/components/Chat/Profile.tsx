import { ChatProfile } from 'components/withlive/LiveChat/LiveChat.type';
import React from 'react';
import { Badge } from './Badge';

import styles from './Profile.module.scss';

export type Props = {
  profile: ChatProfile;
};

export function Profile(props: Props) {
  return (
    <span
      className={styles.Profile}
      style={{ '--color': props.profile.color } as React.CSSProperties}
    >
      {props.profile.badge.length > 0 && (
        <span className={styles.badges}>
          {props.profile.badge.map((badge) => (
            <Badge key={badge.id} badge={badge} />
          ))}
        </span>
      )}
      <span className={styles.name}>
        {props.profile.name !== props.profile.id && props.profile.id
          ? `${props.profile.name}(${props.profile.id})`
          : props.profile.name}
      </span>
    </span>
  );
}

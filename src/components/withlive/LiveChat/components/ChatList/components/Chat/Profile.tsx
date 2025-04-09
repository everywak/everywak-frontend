import { ChatProfile } from 'components/withlive/LiveChat/LiveChat.type';
import React from 'react';
import { Badge } from './Badge';

import styles from './Profile.module.scss';

export interface Props {
  profile: ChatProfile;
  isHideUserId: boolean;
}

export const Profile = React.memo(
  ({ profile, isHideUserId }: Props) => (
    <span className={styles.Profile} style={{ '--color': profile.color } as React.CSSProperties}>
      {profile.badge.length > 0 && (
        <span className={styles.badges}>
          {profile.badge.map((badge) => (
            <Badge key={badge.id} badge={badge} />
          ))}
        </span>
      )}
      <span className={styles.name}>
        {profile.name !== profile.id && profile.id && !isHideUserId
          ? `${profile.name}(${profile.id})`
          : profile.name}
      </span>
    </span>
  ),
  (prevProps, nextProps) =>
    `${JSON.stringify(prevProps.profile)}${prevProps.isHideUserId ? '1' : '0'}` ===
    `${JSON.stringify(nextProps.profile)}${nextProps.isHideUserId ? '1' : '0'}`,
);

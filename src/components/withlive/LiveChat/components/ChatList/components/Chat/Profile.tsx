import { ChatProfile } from 'components/withlive/LiveChat/LiveChat.type';
import React from 'react';
import { Badge } from './Badge';

import styles from './Profile.module.scss';

export interface Props {
  profile: ChatProfile;
}

export const Profile = React.memo(
  ({ profile }: Props) => (
    <span className={styles.Profile} style={{ '--color': profile.color } as React.CSSProperties}>
      {profile.badge.length > 0 && (
        <span className={styles.badges}>
          {profile.badge.map((badge) => (
            <Badge key={badge.id} badge={badge} />
          ))}
        </span>
      )}
      <span className={styles.name}>
        {profile.name !== profile.id && profile.id
          ? `${profile.name}(${profile.id})`
          : profile.name}
      </span>
    </span>
  ),
  (prevProps, nextProps) => JSON.stringify(prevProps.profile) === JSON.stringify(nextProps.profile),
);

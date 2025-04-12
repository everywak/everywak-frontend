import React from 'react';
import { ChatBadge, ChatProfile } from 'components/withlive/LiveChat/LiveChat.type';
import { Badge } from './Badge';

import styles from './Profile.module.scss';

export interface Props {
  profile: ChatProfile;
  isHideUserId: boolean;
  isDarkMode?: boolean;
  isHideFanBadge?: boolean;
  isHideAllBadge?: boolean;
}

export const Profile = React.memo(
  ({ profile, isHideUserId, isDarkMode, isHideFanBadge, isHideAllBadge }: Props) => {
    const filterBadge = (badge: ChatBadge) => {
      if (isHideAllBadge) return false;
      if (isHideFanBadge) {
        return !badge.id.includes('fan');
      }
      return true;
    };

    const filteredBadges = profile.badge.filter(filterBadge);
    return (
      <span
        className={styles.Profile}
        style={
          {
            '--color': isDarkMode ? profile.colorDarkmode : profile.color,
          } as React.CSSProperties
        }
      >
        {filteredBadges.length > 0 && (
          <span className={styles.badges}>
            {filteredBadges.map((badge) => (
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
    );
  },
  (prevProps, nextProps) =>
    `${JSON.stringify(prevProps.profile)}${prevProps.isHideUserId ? '1' : '0'}${prevProps.isDarkMode ? '1' : '0'}${prevProps.isHideAllBadge ? '1' : '0'}${prevProps.isHideFanBadge ? '1' : '0'}` ===
    `${JSON.stringify(nextProps.profile)}${nextProps.isHideUserId ? '1' : '0'}${nextProps.isDarkMode ? '1' : '0'}${nextProps.isHideAllBadge ? '1' : '0'}${nextProps.isHideFanBadge ? '1' : '0'}`,
);

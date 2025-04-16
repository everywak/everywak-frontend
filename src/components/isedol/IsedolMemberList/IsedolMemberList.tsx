import React from 'react';
import clsx from 'clsx';
import { useMember } from 'hooks';
import IsedolMemberItem from './IsedolMemberItem';
import styles from './IsedolMemberList.module.scss';

export const IsedolMemberList = () => {
  const members = useMember();
  const isedol = members.filter((member) => member.role === 'isedol');

  const list = isedol.map((member) => (
    <IsedolMemberItem
      key={member.name}
      name={member.name}
      profileImg={member.profile.profileImage.replace('s88', 's256')}
      social={{
        afreecatv: member.livePlatform.find((item) => item.type === 'afreeca')!.channelId,
        youtube: member.youtubeChannel.find((ch) => ch.type === 'main')!.channelId,
        instagram: member.social.find((item) => item.type === 'instagram')!.name,
      }}
    />
  ));

  return <ul className={clsx('IsedolMemberList', styles.container)}>{list}</ul>;
};

import React from 'react';
import { Button } from 'common/components';
import { useLiveChatActions } from '../LiveChat.context';
import { KeyboardTabRounded, SettingsRounded } from '@mui/icons-material';
import styles from './Header.module.scss';

export function Header() {
  const { setOpenedSetting } = useLiveChatActions();

  return (
    <div className={styles.container}>
      <Button color="black-transparent">
        <KeyboardTabRounded />
      </Button>
      채팅
      <Button color="black-transparent" onClick={() => setOpenedSetting(true)}>
        <SettingsRounded />
      </Button>
    </div>
  );
}

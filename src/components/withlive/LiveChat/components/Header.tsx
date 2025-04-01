import React from 'react';

import classNames from 'classnames';
import styles from './Header.module.scss';
import { Button } from 'common/components';
import { useLiveChatActions } from '../LiveChat.context';
import { KeyboardTabRounded, SettingsRounded } from '@mui/icons-material';
const cx = classNames.bind(styles);

export type Props = {};
export function Header(props: Props) {
  const { setOpenedSetting } = useLiveChatActions();
  return (
    <div className={styles.Header}>
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

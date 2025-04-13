import React from 'react';
import { Button } from 'common/components';
import { useLiveChatActions } from '../LiveChat.context';
import { KeyboardTabRounded, SettingsRounded } from '@mui/icons-material';
import styles from './Header.module.scss';

export interface Props {
  onClickHide?: () => void;
}

export const Header = ({ onClickHide }: Props) => {
  const { setOpenedSettingState } = useLiveChatActions();

  return (
    <div className={styles.container}>
      <Button color="black-transparent" onClick={onClickHide}>
        <KeyboardTabRounded />
      </Button>
      채팅
      <Button color="black-transparent" onClick={() => setOpenedSettingState('general')}>
        <SettingsRounded />
      </Button>
    </div>
  );
};

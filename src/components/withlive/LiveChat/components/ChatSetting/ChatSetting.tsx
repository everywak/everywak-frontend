import { useEffect } from 'react';
import { useInputs } from 'hooks/useInputs';
import { useLiveChatActions, useLiveChatValue } from '../../LiveChat.context';
import { SettingPage } from '..';
import { Button } from 'common/components';
import { CloseRounded } from '@mui/icons-material';
import { ComponentProps } from '../SettingPage/types';
import { Theme, useTheme } from 'contexts/ThemeContext';

export const ChatSetting = () => {
  const { theme, setTheme } = useTheme();
  const { openedSettingState, option } = useLiveChatValue();
  const { setOpenedSettingState, updateOption } = useLiveChatActions();

  const [form, onChange] = useInputs(option);

  useEffect(() => {
    updateOption(form);
  }, [form]);

  const closeButton = (
    <Button color="black-transparent" onClick={() => setOpenedSettingState('off')}>
      <CloseRounded />
    </Button>
  );

  const body: ComponentProps[] = [
    {
      type: 'group',
      title: '채팅 설정',
    },
    {
      type: 'checkbox',
      name: 'isHideUserId',
      value: form.isHideUserId,
      onChange: onChange,
      label: '아이디 숨기기',
    },
    {
      type: 'checkbox',
      name: 'isHideProfile',
      value: form.isHideProfile,
      onChange: onChange,
      label: '닉네임 숨기기',
    },
    {
      type: 'checkbox',
      name: 'isShowTimestamp',
      value: form.isShowTimestamp,
      onChange: onChange,
      label: '타임스탬프 보기',
    },
    {
      type: 'select',
      name: 'theme',
      value: theme,
      onChange: (e) => {
        setTheme(e.target.value as Theme);
      },
      options: [
        {
          name: '밝게',
          value: 'light',
        },
        {
          name: '어둡게',
          value: 'dark',
        },
        {
          name: '시스템 설정',
          value: 'preferred',
        },
      ],
      label: '테마',
    },

    {
      type: 'group',
      title: '채팅 필터',
    },
    {
      type: 'checkbox',
      name: 'isShowOnlyManager',
      value: form.isShowOnlyManager,
      onChange: onChange,
      label: '매니저 이상 채팅만 보기',
    },
    {
      type: 'checkbox',
      name: 'isShowOnlySubscriber',
      value: form.isShowOnlySubscriber,
      onChange: onChange,
      label: '구독자 이상 채팅만 보기',
    },
    {
      type: 'checkbox',
      name: 'isShowOnlyFan',
      value: form.isShowOnlyFan,
      onChange: onChange,
      label: '팬클럽 이상 채팅만 보기',
    },
    {
      type: 'checkbox',
      name: 'isShowCollectorChat',
      value: form.isShowCollectorChat,
      onChange: onChange,
      label: '채팅 콜렉터',
      onClick: () => {
        setOpenedSettingState('collector');
      },
    },
    {
      type: 'group',
      title: '멀티뷰 설정',
    },
    {
      type: 'checkbox',
      name: 'isShowAllMultiView',
      value: form.isShowAllMultiView,
      onChange: onChange,
      label: '모든 방송 채팅 같이 보기',
    },
  ];

  if (openedSettingState !== 'general') {
    return <></>;
  }
  return <SettingPage title="채팅 설정" rightButton={closeButton} items={body} />;
};

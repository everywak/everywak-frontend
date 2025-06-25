import { useInputs } from '@/hooks/useInputs';
import { useLiveChatActions, useLiveChatValue } from '../../LiveChat.context';
import { SettingPage } from '..';
import { Button } from '@/common/components';
import { ArrowBackRounded, CloseRounded } from '@mui/icons-material';
import { ComponentProps } from '../SettingPage/types';
import { useEffect } from 'react';
import { ChatGroup, ChatRole } from '../../LiveChat.type';

export const CollectorSetting = () => {
  const { openedSettingState, collectorOption } = useLiveChatValue();
  const { setOpenedSettingState, updateCollectorOption } = useLiveChatActions();

  const [form, onChange] = useInputs<{
    isIncludeWakgood: boolean;
    isIncludeIsedol: boolean;
    isIncludeGomem: boolean;
    isIncludeGomemAcademy: boolean;
    isIncludeGomemHardcore: boolean;
    isIncludeManager: boolean;
    isIncludeSubscriber: boolean;
    isIncludeFan: boolean;
  }>({
    isIncludeWakgood: collectorOption.byRole.includes('master'),
    isIncludeIsedol: collectorOption.byRole.includes('isedol'),
    isIncludeGomem: collectorOption.byRole.includes('gomem'),
    isIncludeGomemAcademy: collectorOption.byRole.includes('academy'),
    isIncludeGomemHardcore: collectorOption.byRole.includes('hardcore'),
    isIncludeManager: collectorOption.byGroup.includes('manager'),
    isIncludeSubscriber: collectorOption.byGroup.includes('sub'),
    isIncludeFan: collectorOption.byGroup.includes('fan'),
  });

  useEffect(() => {
    const newOption = {
      byRole: [] as ChatRole[],
      byGroup: [] as ChatGroup[],
    };
    if (form.isIncludeWakgood) {
      newOption.byRole.push('master');
    }
    if (form.isIncludeIsedol) {
      newOption.byRole.push('isedol');
    }
    if (form.isIncludeGomem) {
      newOption.byRole.push('gomem');
    }
    if (form.isIncludeGomemAcademy) {
      newOption.byRole.push('academy');
    }
    if (form.isIncludeGomemHardcore) {
      newOption.byRole.push('hardcore');
    }
    if (form.isIncludeManager) {
      newOption.byGroup.push('manager');
    }
    if (form.isIncludeSubscriber) {
      newOption.byGroup.push('sub');
    }
    if (form.isIncludeFan) {
      newOption.byGroup.push('fan');
    }
    updateCollectorOption(newOption);
  }, [form]);

  const backButton = (
    <Button color="black-transparent" onClick={() => setOpenedSettingState('general')}>
      <ArrowBackRounded />
    </Button>
  );

  const closeButton = (
    <Button color="black-transparent" onClick={() => setOpenedSettingState('off')}>
      <CloseRounded />
    </Button>
  );

  const body: ComponentProps[] = [
    {
      type: 'group',
      title: '왁타버스',
    },
    {
      type: 'checkbox',
      name: 'isIncludeWakgood',
      value: form.isIncludeWakgood,
      onChange,
      label: '우왁굳',
    },
    {
      type: 'checkbox',
      name: 'isIncludeIsedol',
      value: form.isIncludeIsedol,
      onChange,
      label: '이세계아이돌',
    },
    {
      type: 'checkbox',
      name: 'isIncludeGomem',
      value: form.isIncludeGomem,
      onChange,
      label: '고멤 클래식',
    },
    {
      type: 'checkbox',
      name: 'isIncludeGomemAcademy',
      value: form.isIncludeGomemAcademy,
      onChange,
      label: '고멤 아카데미',
    },
    {
      type: 'checkbox',
      name: 'isIncludeGomemHardcore',
      value: form.isIncludeGomemHardcore,
      onChange,
      label: '고멤 하드코어',
    },

    {
      type: 'group',
      title: '채팅 그룹',
    },
    {
      type: 'checkbox',
      name: 'isIncludeManager',
      value: form.isIncludeManager,
      onChange,
      label: '채팅 매니저',
    },
    {
      type: 'checkbox',
      name: 'isIncludeSubscriber',
      value: form.isIncludeSubscriber,
      onChange,
      label: '정기구독자',
    },
    {
      type: 'checkbox',
      name: 'isIncludeFan',
      value: form.isIncludeFan,
      onChange,
      label: '팬클럽',
    },

    {
      type: 'group',
      title: '커스텀 필터',
    },
    {
      type: 'collectorCustomInput',
    },
  ];

  if (openedSettingState !== 'collector') {
    return <></>;
  }

  return (
    <SettingPage
      title="채팅 콜렉터"
      leftButton={backButton}
      rightButton={closeButton}
      items={body}
    />
  );
};

import { LiveChat } from './LiveChat';
import {
  useWithliveActions,
  useWithliveValues,
} from 'contexts/WithliveContext';
import StretchableContainer from 'common/Components/StretchableContainer/StretchableContainer';
import styles from './Chat.module.scss';

export function Chat() {
  const {
    watchingChannels,
    isEnabledMultiView,
    isChatVisible,
    multiViewLayout,
  } = useWithliveValues();
  const { setIsChatVisible } = useWithliveActions();

  const channelIds = watchingChannels
    .filter(
      (player) =>
        player.order <
        (isEnabledMultiView
          ? multiViewLayout.startsWith('one-side')
            ? 7
            : 999
          : 1),
    )
    .map((channel) => channel.memberId);

  return (
    isChatVisible && (
      <StretchableContainer
        className={styles.container}
        rotation="right"
        minSize={64}
        defaultSize={360}
      >
        <LiveChat
          className={styles.chat}
          channelIds={channelIds}
          onClickHide={() => setIsChatVisible(false)}
        />
      </StretchableContainer>
    )
  );
}

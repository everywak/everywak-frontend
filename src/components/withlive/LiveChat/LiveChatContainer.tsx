import { Stretchable } from 'common/components';
import { useWithliveActions, useWithliveValues } from 'contexts/withlive';
import { LiveChat } from './LiveChat';
import styles from './LiveChatContainer.module.scss';

export function LiveChatContainer() {
  const { watchingChannels, isEnabledMultiView, isChatVisible, multiViewLayout } =
    useWithliveValues();
  const { setIsChatVisible } = useWithliveActions();

  const channelIds = watchingChannels
    .filter(
      (player) =>
        player.order <
        (isEnabledMultiView ? (multiViewLayout.startsWith('one-side') ? 7 : 999) : 1),
    )
    .map((channel) => channel.memberId);

  return (
    isChatVisible && (
      <Stretchable className={styles.container} rotation="right" minSize={64} defaultSize={360}>
        <LiveChat
          className={styles.chat}
          channelIds={channelIds}
          onClickHide={() => setIsChatVisible(false)}
        />
      </Stretchable>
    )
  );
}

import clsx from 'clsx';

import { useWithliveValues } from 'contexts/withlive';
import { StreamTimer, ViewerCounter } from './components';
import styles from './StreamInfo.module.scss';

export function StreamInfo(props: { channelId: string }) {
  const { channels } = useWithliveValues();

  const channel = channels.find((channel) => channel.memberId === props.channelId);

  return (
    <section className={styles.streamInfo}>
      <div className={styles.left}>
        <div
          className={clsx(styles.profile, {
            [styles.offline]: !channel?.streamInfo?.isLive,
          })}
        >
          <div className={styles.profileWrapper}>
            <img
              src={channel?.profileImage ?? ''}
              alt={props.channelId}
              className={styles.profileImage}
            />
          </div>
        </div>
        <div className={styles.desc}>
          <div className={styles.title}>
            {channel?.streamInfo?.title ?? '생방송이 종료되었습니다.'}
          </div>
          <div className={styles.name}>{channel?.nickname ?? ''}</div>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.control}></div>
        <div
          className={clsx(styles.counter, {
            [styles.offline]: !channel?.streamInfo?.isLive,
          })}
        >
          <div className={styles.viewers}>
            <ViewerCounter viewer={channel?.streamInfo?.viewerCount ?? 0} />
          </div>
          <div className={styles.time}>
            <StreamTimer startedTime={channel?.streamInfo?.startedTime ?? Date.now()} />
          </div>
        </div>
      </div>
    </section>
  );
}

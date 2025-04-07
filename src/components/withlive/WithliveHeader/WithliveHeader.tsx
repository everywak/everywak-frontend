import { CSSProperties, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWithliveValues } from 'contexts/WithliveContext';
import { VideocamRounded } from '@mui/icons-material';
import { ChannelItem } from './components';
import styles from './WithliveHeader.module.scss';

export function WithliveHeader() {
  const { channels, watchingChannels, isExpanded } = useWithliveValues();
  const [hoverChannel, setHoverChannel] = useState<{
    thumbnailUrl: string;
    title: string;
    top: number;
  } | null>(null);

  const channelList = channels
    .sort((a, b) => {
      const left =
        (a.streamInfo?.isLive ? -1 : 0) +
        (watchingChannels.findIndex(
          (watchingChannel) => watchingChannel.memberId === a.memberId,
        ) === -1
          ? 0
          : -5);

      const right =
        (b.streamInfo?.isLive ? -1 : 0) +
        (watchingChannels.findIndex(
          (watchingChannel) => watchingChannel.memberId === b.memberId,
        ) === -1
          ? 0
          : -5);

      return left - right;
    })
    .map((channel) => (
      <ChannelItem
        key={channel.memberId}
        channelId={channel.memberId}
        profileImageUrl={channel.profileImage}
        isLive={channel.streamInfo?.isLive || false}
        isWatching={
          watchingChannels.find(
            (watchingChannel) => watchingChannel.memberId === channel.memberId,
          ) !== undefined
        }
        thumbnailUrl={channel.streamInfo?.thumbnail}
        title={channel.streamInfo?.title}
        setHoverChannel={setHoverChannel}
      />
    ));

  return (
    <>
      {!isExpanded && (
        <header className={styles.container}>
          <div
            className={styles.content}
            onMouseLeave={() => setHoverChannel(null)}
          >
            <Link to="/" className={styles.logo}>
              <img src="/logo/logo.svg" alt="logo" />
            </Link>
            <ul className={styles.channels}>
              <VideocamRounded className={styles.videoLogo} />
              {channelList}
            </ul>
          </div>

          {hoverChannel && (
            <div
              className={styles.thumbnailWrapper}
              style={{ '--top': hoverChannel.top } as CSSProperties}
            >
              <img src={hoverChannel.thumbnailUrl} alt="방송 썸네일" />
              <div className={styles.desc}>
                <span className={styles.title}>{hoverChannel.title!}</span>
              </div>
            </div>
          )}
        </header>
      )}
    </>
  );
}

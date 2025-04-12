import { CSSProperties, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWithliveValues } from 'contexts/withlive';
import { VideocamRounded } from '@mui/icons-material';
import { ChannelItem } from './components';
import styles from './WithliveHeader.module.scss';

export function WithliveHeader() {
  const { channels, watchingChannels, isExpanded, isEnabledMultiView } = useWithliveValues();
  const [hoverChannel, setHoverChannel] = useState<{
    thumbnailUrl: string;
    title: string;
    top: number;
  } | null>(null);

  const defaultOrder = channels.map((channel) => channel.memberId);
  const getPlayer = (memberId: string) =>
    watchingChannels.find(
      (watchingChannel) =>
        watchingChannel.memberId === memberId &&
        (isEnabledMultiView || watchingChannel.order === 0),
    );

  const channelList = channels
    .map((channel, i) => ({
      memberId: channel.memberId,
      index: i,
      channel,
      player: getPlayer(channel.memberId),
    }))
    .sort((a, b) => {
      const left = a.index + (a.channel.streamInfo?.isLive ? -200 : 0) + (a.player ? -400 : 0);
      const right = b.index + (b.channel.streamInfo?.isLive ? -200 : 0) + (b.player ? -400 : 0);
      return left - right;
    })
    .map(({ memberId, channel, player }) => (
      <ChannelItem
        key={memberId}
        channelId={memberId}
        profileImageUrl={channel.profileImage}
        isLive={channel.streamInfo?.isLive || false}
        isWatching={!!player}
        thumbnailUrl={channel.streamInfo?.thumbnail}
        title={channel.streamInfo?.title}
        setHoverChannel={setHoverChannel}
      />
    ));

  return (
    <>
      {!isExpanded && (
        <header className={styles.container}>
          <div className={styles.content} onMouseLeave={() => setHoverChannel(null)}>
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

import { WithliveProvider } from 'contexts/WithliveContext';
import { WithliveHeader, PlayerContainer, LiveChatContainer } from 'components/withlive';
import styles from './Page.module.scss';

export default function Page() {
  return (
    <WithliveProvider>
      <div className={styles.container}>
        <WithliveHeader />
        <section className={styles.main}>
          <PlayerContainer />
          <LiveChatContainer />
        </section>
      </div>
    </WithliveProvider>
  );
}

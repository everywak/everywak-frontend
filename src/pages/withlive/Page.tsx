import { WithliveProvider } from 'contexts/WithliveContext';
import { WithliveHeader, PlayerContainer, Chat } from 'components/withlive';
import styles from './Page.module.scss';

export default function Page() {
  return (
    <WithliveProvider>
      <div className={styles.container}>
        <WithliveHeader />
        <section className={styles.main}>
          <PlayerContainer />
          <Chat />
        </section>
      </div>
    </WithliveProvider>
  );
}

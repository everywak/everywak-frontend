import { WithliveProvider } from 'contexts/withlive';
import {
  WithliveHeader,
  PlayerContainer,
  LiveChatContainer,
  Redirect,
  ParseUrlQuery,
} from 'components/withlive';
import styles from './Page.module.scss';

export const Page = () => {
  return (
    <WithliveProvider>
      <Redirect />
      <ParseUrlQuery />
      <div className={styles.container}>
        <WithliveHeader />
        <section className={styles.main}>
          <PlayerContainer />
          <LiveChatContainer />
        </section>
      </div>
    </WithliveProvider>
  );
};
export default Page;

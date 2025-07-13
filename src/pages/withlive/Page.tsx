import { useEffect } from 'react';
import * as func from '@/common/functions';
import { WithliveProvider } from '@/contexts/withlive';
import {
  WithliveHeader,
  PlayerContainer,
  LiveChatContainer,
  Redirect,
  ParseUrlQuery,
} from '@/components/withlive';
import styles from './Page.module.scss';

export const Page = () => {
  useEffect(() => {
    func.setBrowserTitle('같이보기');
  }, []);

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

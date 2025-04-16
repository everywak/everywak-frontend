import clsx from 'clsx';
import { EverywakLogo } from 'common/components';
import { LivePreview } from 'components/live';
import { WeatherPanel } from '../common';
import { AppList } from './components';
import styles from './MobileFrontPage.module.scss';

export const MobileFrontPage = () => {
  return (
    <main className={clsx('FrontPage', styles.container)}>
      <header className={styles.header}>
        <div className={styles.circle1}></div>
        <div className={styles.circle2}></div>
        <div className={styles.headerWrapper}>
          <div className={styles.highlight}>
            <LivePreview
              className={styles.livePreview}
              memberId="01HTYWPTRQPMBBN03797C60NZQ"
              hideProfile
            />
          </div>
          <div className={styles.title}>
            <EverywakLogo className={styles.logo} type="text" />
          </div>
        </div>
      </header>
      <div className={styles.apps}>
        <div className={styles.appsWrapper}>
          <AppList />
        </div>
      </div>
      <div className={styles.footer}>
        <WeatherPanel />
      </div>
    </main>
  );
};

import { Link } from 'react-router-dom';
import clsx from 'clsx';
import LivePreview from 'modules/isedol/LivePreview';
import FrontWeatherPanel from 'modules/weather/FrontWeatherPanel';
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
            <Link to="/" className={styles.logo}>
              <img src="/images/everywak_logo.png" alt="Everywak 로고" />
            </Link>
          </div>
        </div>
      </header>
      <div className={styles.apps}>
        <div className={styles.appsWrapper}>
          <AppList />
        </div>
      </div>
      <div className={styles.footer}>
        <FrontWeatherPanel />
      </div>
    </main>
  );
};

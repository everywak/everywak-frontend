import clsx from 'clsx';
import { CommonLink } from '../CommonLink/CommonLink';
import styles from './EverywakLogo.module.scss';

export interface Props {
  className?: string;
  type: 'logo' | 'text';
}

export const EverywakLogo = (props: Props) => {
  return (
    <CommonLink
      href="/"
      className={clsx(styles.container, props.className, {
        [styles.text]: props.type === 'text',
        [styles.logo]: props.type === 'text',
      })}
    >
      {props.type === 'logo' ? (
        <img src="/logo/logo.svg" alt="Everywak 로고" />
      ) : (
        <img src="/images/everywak_logo.png" alt="Everywak 로고" />
      )}
    </CommonLink>
  );
};

import styles from './SubscriberBadge.module.scss';

export type Props = {
  month: number;
};

export const SubscriberBadge = (props: Props) => {
  return <div className={styles.SubscriberBadge}>{props.month}</div>;
};

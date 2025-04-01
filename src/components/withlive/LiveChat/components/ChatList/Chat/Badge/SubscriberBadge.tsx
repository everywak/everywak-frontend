import styles from './SubscriberBadge.module.scss';

export type Props = {
  month: number;
};

export function SubscriberBadge(props: Props) {
  return <div className={styles.SubscriberBadge}>{props.month}</div>;
}

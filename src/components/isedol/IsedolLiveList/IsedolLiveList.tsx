import { LivePreview } from 'components/live';

import styles from './IsedolLiveList.module.scss';

export const IsedolLiveList = () => {
  const isedol = [
    '01HTYXH5RAR4NPW1Y1QD96FF6M',
    '01HTYXYSS3YFAAPBR648J2DPHD',
    '01HTYY59CYV8A58633V2BYWGGD',
    '01HTYYB6AKM8QS519FD9WMKNPG',
    '01HTYYFXH1GSSQD584HDTVMN2V',
    '01HTYYN8ZGT1X22F9DM5BVB1RG',
  ];
  const liveList = isedol.map((id) => <LivePreview key={id} memberId={id} />);

  return <ul className={styles.container}>{liveList}</ul>;
};

import { LayoutType } from 'utils/types/withlive.type';

import {
  GridIcon,
  OneSideBottomIcon,
  OneSideLeftIcon,
  OneSideRightIcon,
  OneSideTopIcon,
} from 'assets/withlive-layout';

export const layoutIcons: Record<LayoutType, React.ReactNode> = {
  grid: <GridIcon />,
  'one-side-l': <OneSideLeftIcon />,
  'one-side-r': <OneSideRightIcon />,
  'one-side-t': <OneSideTopIcon />,
  'one-side-b': <OneSideBottomIcon />,
  free: <GridIcon />,
};

export const layoutLabels: { value: LayoutType; label: string }[] = [
  {
    value: 'one-side-r',
    label: '하나에 집중-오른쪽',
  },
  {
    value: 'one-side-l',
    label: '하나에 집중-왼쪽',
  },
  {
    value: 'one-side-t',
    label: '하나에 집중-위쪽',
  },
  {
    value: 'one-side-b',
    label: '하나에 집중-아래쪽',
  },
  {
    value: 'grid',
    label: '그리드',
  },
];

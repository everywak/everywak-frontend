import React from 'react';

import * as func from '@/common/functions';
import { Desktop, NotDesktop } from '@/common/MediaQuery';

import { DesktopFrontPage, MobileFrontPage } from '@/components/frontpage';

const Frontpage = () => {
  func.setBrowserTitle('메인');
  return (
    <>
      <Desktop>
        <DesktopFrontPage />
      </Desktop>
      <NotDesktop>
        <MobileFrontPage />
      </NotDesktop>
    </>
  );
};
export default Frontpage;

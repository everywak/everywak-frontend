import React from 'react';
import MediaQuery from 'react-responsive';

import SearchRounded from '@mui/icons-material/SearchRounded';
import ThumbUpRounded from '@mui/icons-material/ThumbUpRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import SmartDisplayRoundedIcon from '@mui/icons-material/SmartDisplayRounded';
import BottomNavigationBar from '../../common/Components/BottomNavigationBar/BottomNavigationBar';
import BottomNavigationLinkList from '../../common/Components/BottomNavigationBar/BottomNavigationLinkList';

import { NotDesktop } from '../../common/MediaQuery';

import './WaktoonBottomNavigationBar.scss';
import cx from 'classnames';

const bottomNavigationList = [
  {
    key: 'search',
    label: '검색',
    icon: <SearchRounded fontSize="medium" />,
    href: '/waktoon/search',
  },
  {
    key: 'best',
    label: '베스트',
    icon: <ThumbUpRounded fontSize="medium" />,
    href: '/waktoon/best',
  },
  {
    key: 'general',
    label: '모든 작품',
    icon: <ListAltRoundedIcon fontSize="medium" />,
    href: '/waktoon/all',
  },/*
  {
    key: 'video',
    label: '영상툰',
    icon: <SmartDisplayRoundedIcon fontSize="medium" />,
    href: '/waktoon/video',
  },*/
];
export default function WaktoonBottomNavigationBar(props) {

  return (
    <NotDesktop>
      <BottomNavigationBar className="WaktoonBottomNavigationBar">
        <BottomNavigationLinkList items={bottomNavigationList} />
      </BottomNavigationBar>
    </NotDesktop>
  );
}

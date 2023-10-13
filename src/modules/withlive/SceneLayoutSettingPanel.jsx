import React, { useEffect, useState, useRef } from 'react';

import ClearRoundedIcon from '@mui/icons-material/ClearRounded';

import BasicButton from '../../common/Components/Button/BasicButton';
import CircleImg from '../../common/Components/CircleImg';
import Spinner from '../../common/Components/Spinner';
import TransparentButton from '../../common/Components/Button/TransparentButton';

import { Waktaverse } from '../../common/constants';

import TransformAnimation from './TransformAnimation';

import * as func from '../../common/funtions';
import * as service from '../../services/LiveWakApi';
import useInputs from '../../hooks/useInputs';
import useWindowEvent from '../../hooks/useWindowEvent';

import styles from './SceneLayoutSettingPanel.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/** 
 * @typedef {object} SceneLayoutSettingPanelProps
 * @property {import("./WithLive").ViewLayoutOption} viewLayout
 * @property {import("./WithLive").LivePlayerItem[]} liveList
 * @property {() => {}} onClose
 * @property {() => { viewLayout: import("./WithLive").ViewLayoutOption, liveList: import("./WithLive").LivePlayerItem[]}} onSubmit
 */

/**
 * 같이보기 레이아웃 설정 패널
 * 
 * @param {SceneLayoutSettingPanelProps} props
 * @returns {JSX.Element}
 */
export default function SceneLayoutSettingPanel({ viewLayout, liveList, onClose = () => {}, onSubmit = () => {} }) {
  /** @type {[service.MemberInfoItem[], React.Dispatch<React.SetStateAction<{ ...service.MemberInfoItem, broadcaster: 'TWITCH' | 'YOUTUBE' | undefined }[]>>]} */
  const [allMemberList, setAllMemberList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [layoutSetting, onChange] = useInputs({
    viewLayout: viewLayout,
    liveList: liveList.filter(v => v).map(item => item.id), 
  });

  const [dragItemState, setDragItemState] = useState({
    mode: 'NONE',
    cursor: null,
    toIndex: -1,
  })

  useEffect(() => {
    onChange({
      target: {
        name: 'liveList',
        value: liveList.filter(v => v).map(item => item.id)
      }
    })
  }, [liveList]);

  useEffect(() => {
    if (layoutSetting.viewLayout === 'main-side' && layoutSetting.liveList.length > 8) {
      onChange({
        target: {
          name: 'liveList',
          value: layoutSetting.liveList.filter(v => v).slice(0, 8),
        }
      });
    }
  }, [layoutSetting]);

  useEffect(() => {
    const fetchWaktaverseMembersInfo = async () => {
      setLoading(true);
      const waktaverseInfo = await service.getWaktaverseInfo();
      const broadcastInfo = await service.getWaktaverseBroadcastInfo();

      const waktaverseInfoWithBroadcast = waktaverseInfo
        .sort((a, b) => (
          (Waktaverse.findIndex(member => member.login_name === a.login) - (broadcastInfo.find(item => item.loginName === a.login)?.broadcaster ? 100 : 0)) - 
          (Waktaverse.findIndex(member => member.login_name === b.login) - (broadcastInfo.find(item => item.loginName === b.login)?.broadcaster ? 100 : 0))
          ))
        .map(member => ({
          ...member, 
          broadcaster: broadcastInfo.find(item => item.loginName === member.login)?.broadcaster
        }));
      
      setAllMemberList(waktaverseInfoWithBroadcast);
      setLoading(false);
    }
    fetchWaktaverseMembersInfo();
  }, []);

  const memberList = allMemberList.filter(member => !layoutSetting.liveList.includes(member.login) && !(member.login === dragItemState.cursor && dragItemState.toIndex != -1)).map(member => (
    <MemberItem 
      key={`member_${member.login}`} 
      loginName={member.login} 
      nickname={member.display_name} 
      profileImg={member.profile_image_url} 
      broadcaster={member.broadcaster} 
      selected={member.login === dragItemState.cursor}
      onMouseDown={e => selectLiveItem('ADD', member.login)} 
    />
  ));

  const genePreviewList = (list, dragItemState) => {
    const {
      mode, cursor, toIndex
    } = dragItemState;

    const filteredIfMoving = list.filter(loginName => !(loginName == cursor && mode === 'MOVE'));
    const insertedList = cursor && toIndex != -1 ?
      [...filteredIfMoving.slice(0, toIndex), cursor, ...filteredIfMoving.slice(toIndex)] :
      [...list];
    
    if (mode === 'ADD' && toIndex != list.length) {
      insertedList.push(null);
    }
    return layoutSetting.viewLayout === 'main-side' ? insertedList.slice(0, 9) : insertedList;
  }
  const previewList = genePreviewList(layoutSetting.liveList, dragItemState);
  const previewItems = previewList.map((loginName, i) => {
    const member = allMemberList.find(member => member.login === loginName);
    return <TransformAnimation 
      key={loginName}
      className={cx('previewItemWrapper', {selected: dragItemState.toIndex === i})}
      onMouseEnter={e => (dragItemState.mode != 'NONE' && setDragItemState({ ...dragItemState, toIndex: Math.min(layoutSetting.liveList.length, i) }))}
    >
      <div 
        className={cx('PreviewItem', {selected: dragItemState.toIndex === i})}  
        onMouseDown={e => { !e.target?.className.includes('btnRemove') && selectLiveItem('MOVE', member.login, i) }} 
      >
        <TransparentButton className={styles.btnRemove} onClick={e => removeLiveItem(member.login)}><ClearRoundedIcon className={styles.btnRemoveIcon} /></TransparentButton>
        {
          member && 
          <MemberItem 
            loginName={member.login} 
            nickname={member.display_name} 
            profileImg={member.profile_image_url} 
            broadcaster={member.broadcaster} 
            selected={member.login === dragItemState.cursor}
          />
        }
      </div>
    </TransformAnimation>;
  });

  const applyInserting = () => {
    if (dragItemState.mode != 'NONE' && dragItemState.toIndex != -1) {
      const tempLiveList = layoutSetting.liveList.filter(loginName => !(dragItemState.mode === 'MOVE' && loginName == dragItemState.cursor));
      onChange({
        target: {
          name: 'liveList',
          value: [
            ...tempLiveList.slice(0, dragItemState.toIndex), 
            dragItemState.cursor, 
            ...tempLiveList.slice(dragItemState.toIndex)
          ].filter(v => v)
        }
      });
    }
    setDragItemState({
      ...dragItemState,
      mode: 'NONE',
      cursor: null,
      toIndex: -1,
    });
  }
  useWindowEvent('mouseup', applyInserting, [dragItemState, layoutSetting]);

  const selectLiveItem = (mode, loginName, toIndex = -1) => {
    setDragItemState({
      ...dragItemState,
      mode,
      cursor: loginName,
      toIndex,
    });
  }
  const removeLiveItem = loginName => {
    onChange({
      target: {
        name: 'liveList',
        value: layoutSetting.liveList.filter(item => item !== loginName),
      }
    });
  }

  const onSubmitHandler = async e => {
    const broadcastInfo = await service.getWaktaverseBroadcastInfo();
    const liveListFormatted = layoutSetting.liveList.map((item, i) => ({
      name: allMemberList.find(member => member.login === item).display_name,
      id: item,
      broadcasterType: broadcastInfo.find(live => live.loginName == item)?.broadcaster || 'TWITCH',
      videoId: broadcastInfo.find(live => live.loginName == item)?.videoId,
      pos: i,
      volume: 1, 
    }));
    onSubmit({
      viewLayout: layoutSetting.viewLayout,
      liveList: liveListFormatted,
    })
  }

  const itemCount = layoutSetting.liveList.length + (dragItemState.mode === 'ADD' ? 1 : 0);
  const gridRows = Math.ceil(Math.sqrt(itemCount));
  const gridColumns = Math.ceil(itemCount / gridRows);

  return <div className={cx('SceneLayoutSettingPanel')}>
    <header>
      <div className={styles.left}>
        레이아웃 설정
      </div>
      <div className="right">
        <TransparentButton onClick={onClose}>취소하고 닫기</TransparentButton>
        <BasicButton onClick={onSubmitHandler} disabled={layoutSetting.liveList.length < 1}>저장</BasicButton>
      </div>
    </header>
    <div className={styles.content}>
      <div 
        className={cx('layoutPreview', layoutSetting.viewLayout, {isDragging: dragItemState.mode != 'NONE', hideLast: dragItemState.mode === 'ADD' && dragItemState.toIndex !== layoutSetting.liveList.length})} 
        style={{'--gridColumns': gridColumns, '--gridRows': gridRows}}
        onMouseLeave={e => (dragItemState.mode == 'ADD' && setDragItemState({ ...dragItemState, toIndex: -1 }))}
      >
        {isLoading ? <Spinner /> : previewItems}
      </div>
      <div className={styles.aside}>
        <SceneLayoutContentSection className={styles.layoutSelector} title="화면 구성">
          <SceneLayoutSelect name="viewLayout" value={layoutSetting.viewLayout} onChange={onChange} />
        </SceneLayoutContentSection>
        <SceneLayoutContentSection className={styles.waktaverseMemberList} title="같이 볼 멤버 선택">
          <ul className={styles.memberList}>
            {isLoading ? <Spinner /> : memberList}
          </ul>
        </SceneLayoutContentSection>
      </div>
    </div>
    {
      dragItemState.mode == 'ADD' && 
      <CursorMemberItem 
        loginName={dragItemState.cursor} 
        nickname={allMemberList.find(member => member.login === dragItemState.cursor).display_name} 
        profileImg={allMemberList.find(member => member.login === dragItemState.cursor).profile_image_url} 
      />
    }
  </div>;
}

function SceneLayoutContentSection({ className, title, children }) {
  return <div className={cx('SceneLayoutContentSection', className)}>
    <div className={styles.title}>{title}</div>
    <div className={styles.contentWrapper}>
      {children}
    </div>
  </div>;
}

function SceneLayoutSelect({ name, value, onChange = () => {} }) {
  const options = [
    {
      value: 'main-side',
      label: '하나에 집중',
      icon: <MainSideSvgIcon />,
    },
    {
      value: 'grid',
      label: '그리드',
      icon: <GridSvgIcon />,
    },
  ];

  const optionList = options.map(item => <div key={item.value} className={cx('option', {selected: item.value === value})} onClick={e => onChange({
    target: {
      name, value: item.value,
    },
  })}>
    <div className={styles.iconWrapper}>
      {item.icon}
    </div>
    <div className={styles.label}>{item.label}</div>
  </div>);

  return <div className={cx('SceneLayoutSelect')}>
    {optionList}
  </div>;
}

function CursorMemberItem({ loginName, nickname, profileImg }) {

  const refElement = useRef();
  useWindowEvent('mousemove', e => {
    const {
      clientX: x,
      clientY: y
    } = e;
    const style = `--x: ${x};--y: ${y};opacity: .8`;
    refElement.current.style = style;
  }, [loginName]);

  return <MemberItem _ref={refElement} className="CursorMemberItem" loginName={loginName} nickname={nickname} profileImg={profileImg} />;
}

function MemberItem({ className, loginName, nickname, profileImg, selected = false, broadcaster = undefined, onMouseDown = e => {}, _ref, ...rest }) {
  return <div className={cx('MemberItem', className, { liveYoutube: broadcaster === 'YOUTUBE', liveTwitch: broadcaster === 'TWITCH', selected })} draggable="false" onMouseDown={onMouseDown} ref={_ref} {...rest}>
    <div className={styles.profileCircle}>
      <div className={styles.circleWrapper}>
        <CircleImg className={styles.CircleImg} src={profileImg} />
      </div>
    </div>
    <div className={styles.nickname}>
      {nickname}
    </div>
  </div>;
}

function MainSideSvgIcon({ className = '' }) {
  return <svg className={cx(className)} width="96" height="54" viewBox="0 0 96 54" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect id="Rectangle 50" width="66" height="54" rx="2"/>
      <rect id="Rectangle 47" x="70.8" width="25.2" height="15" rx="2"/>
      <rect id="Rectangle 48" x="70.8" y="19.2002" width="25.2" height="15.6" rx="2"/>
      <rect id="Rectangle 49" x="70.8" y="39" width="25.2" height="15" rx="2"/>
    </g>
  </svg>;  
}
function GridSvgIcon({ className = '' }) {
  return <svg className={cx(className)} width="86" height="58" viewBox="0 0 86 58" xmlns="http://www.w3.org/2000/svg">
    <g>
      <rect id="Rectangle 51" y="0.5" width="40.2" height="26" rx="2"/>
      <rect id="Rectangle 53" y="31.9004" width="40.2" height="26" rx="2"/>
      <rect id="Rectangle 52" x="45" y="0.5" width="40.2" height="26" rx="2"/>
      <rect id="Rectangle 54" x="45" y="31.9004" width="40.2" height="26" rx="2"/>
    </g>
  </svg>;  
}
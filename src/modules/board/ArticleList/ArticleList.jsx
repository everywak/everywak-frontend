import React, { Fragment } from 'react';
import styled, { keyframes } from "styled-components";
import MediaQuery  from 'react-responsive';

import SkeletonLoader from '../../../common/Components/SkeletonLoader';
import Button from '../../../common/Components/Button';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';

import styles from './ArticleList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

/**
 * 게시글 목록을 표시하는 리스트
 * 
 * @param {{
 * data: Array, 
 * front: boolean, 
 * loaded: boolean, 
 * loadedLength: number, 
 * pagination: 'none'|'more'|'page', 
 * onMore: function
 * responsiveMode: 'auto'|'mobile'|'desktop'}} props 
 */
function ArticleList({data, front = false, loaded = false, pagination = 'more', loadedLength, onMore, responsiveMode = 'auto'}) {

  const responsiveLayoutMode = {
    resAuto:    responsiveMode != 'mobile' && responsiveMode != 'desktop', 
    resMobile:  responsiveMode == 'mobile', 
    resDesktop: responsiveMode == 'desktop',
  };

  const skeleton = 
  <li className={cx('Article', 'skeleton')}>
    <span className="txt_area">
      <span className="board_txt"><span className="skeletonItem">ㅇㅇㅇㅇㅇ</span></span>
      <strong className="tit"><span className="skeletonItem">ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span></strong>
      <div className="user_area pc">
        <span className="nickname"><span className="skeletonItem">ㅇㅇㅇㅇ</span></span>
        <span className="datetime"><span className="skeletonItem">00:00:00</span></span>
        <span className="view"><span className="skeletonItem">000</span></span>
        <span className="like"><span className="skeletonItem">000</span></span>
        <span className="comment"><span className="skeletonItem">000</span></span>
      </div>
      <div className="user_area mobile">
        <span className="skeletonItem">ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span>
      </div>
    </span>
    <span className="thumb_area">
      <div className="thumb skeletonItem">
      </div>
    </span>
  </li>;

  const list = data.slice(0, front ? Math.min(4, data.length) : data.length).map(
    data => (<Article key={`articleItem${data.articleId}`} {...data} />)
  );

  return (
    <Fragment>
      <ul className={cx('ArticleList', responsiveLayoutMode)}>
        <Article header={true} key={`articleItemHeader`} />
        {list}
        {!loaded && <SkeletonLoader skeleton={skeleton} length={front ? 4 : 8} />}
        {
          pagination != 'none' &&
          <div className="pagination">
            <MoreArticleButton 
              hide={!loaded || !loadedLength} 
              onClick={onMore} />
          </div>
        }
      </ul>
    </Fragment>
  );
}

/**
 * 인기글 더보기 버튼
 * 
 * @param {{hide: boolean, onClick: function}} props 
 */
function MoreArticleButton({hide, onClick}) {
  return (
    <Button 
      className={cx('MoreArticleButton', {hide: hide})} 
      href="" 
      size="fillWidth" 
      label={<span>더 보기<ExpandMoreRoundedIcon /></span>} 
      showLabel={true} 
      labelSize="14px" 
      labelBGColor="transparent" 
      onclick={onClick} />
  );
}

/**
 * 게시글 아이템
 * 
 * @param {{ 
 *  articleId: string,
 *  menuName: string,
 *  subject: string,
 *  nickname: string,
 *  aheadOfWriteDate: string,
 *  readCount: string,
 *  upCount: string,
 *  commentCount: string,
 *  representImage: string, 
 *  header: boolean }} props 
 */
function Article({ 
  articleId = '-1',
  menuName = '게시판',
  subject = '제목',
  nickname = '작성자',
  aheadOfWriteDate = '작성일',
  readCount = '조회',
  upCount = '좋아요',
  commentCount = '',
  representImage = '', 
  header = false }) {

  const href = (
    !header ? 'https://cafe.naver.com/steamindiegame/' + articleId.replace(/[^0-9]/g, '') : ''
  );
  const thumb_area = 
  <a href={href} className="thumb_area" target="_blank" rel="noreferrer">
    <div className="thumb">
      <img src={representImage} alt="썸네일" onError={i => i.target.style.display = 'none'} referrerPolicy="no-referrer"/>
    </div>
  </a>;
  return (
    <li className={cx('Article', {'listHeader': header})}>
      <a href={href} className="txt_area" target="_blank" rel="noreferrer">
        <span className="icon_new_txt">•</span>
        <span className="board_txt">{menuName}</span>
        <strong className="tit">{subject}</strong>

        <div className="user_area">
          <span className="nickname">
            <i className="blind">작성자</i>{nickname}
          </span>
          <span className="datetime">{aheadOfWriteDate}</span>
          <span className="view">
            <i className="blind">조회수</i>
            <VisibilityRoundedIcon className="icon" fontSize="small" />
            {readCount}
          </span>
          <span className="like">
            <i className="blind">좋아요</i>
            <FavoriteRoundedIcon className="icon" fontSize="small" />
            {upCount}
          </span>
          <span className="comment">
            <i className="blind">댓글</i>
            <CommentRoundedIcon className="icon" fontSize="small" />
            {commentCount}
          </span>
        </div>
      </a>
      {representImage && thumb_area}
    </li>
  );
}

export default ArticleList;
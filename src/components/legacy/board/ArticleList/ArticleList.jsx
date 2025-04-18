import React, { Fragment } from 'react';

import SkeletonLoader from 'common/components/legacy/SkeletonLoader';
import Button from 'common/components/legacy/Button';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import CommentRoundedIcon from '@mui/icons-material/CommentRounded';

import './ArticleList.scss';
import cx from 'classnames';

/**
 * 게시글 목록을 표시하는 리스트
 *
 * @param {{
 * data: Array,
 * front?: boolean,
 * isLoading: boolean,
 * hasNextPage?: boolean,
 * pagination: 'none'|'more'|'page',
 * onMore: function
 * responsiveMode: 'auto'|'mobile'|'desktop'}} props
 */
function ArticleList({
  data,
  front = false,
  isLoading = false,
  pagination = 'more',
  hasNextPage,
  onMore,
  responsiveMode = 'auto',
}) {
  const responsiveLayoutMode = {
    resAuto: responsiveMode != 'mobile' && responsiveMode != 'desktop',
    resMobile: responsiveMode == 'mobile',
    resDesktop: responsiveMode == 'desktop',
  };

  const skeleton = (
    <li className={cx('Article', 'skeleton')}>
      <span className="txt_area">
        <span className="board_txt">
          <span className="skeletonItem">ㅇㅇㅇㅇㅇ</span>
        </span>
        <strong className="tit">
          <span className="skeletonItem">ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span>
        </strong>
        <div className="user_area pc">
          <span className="nickname">
            <span className="skeletonItem">ㅇㅇㅇㅇ</span>
          </span>
          <span className="datetime">
            <span className="skeletonItem">00:00:00</span>
          </span>
          <span className="view">
            <span className="skeletonItem">000</span>
          </span>
          <span className="like">
            <span className="skeletonItem">000</span>
          </span>
          <span className="comment">
            <span className="skeletonItem">000</span>
          </span>
        </div>
        <div className="user_area mobile">
          <span className="skeletonItem">ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ</span>
        </div>
      </span>
      <span className="thumb_area">
        <div className="thumb skeletonItem"></div>
      </span>
    </li>
  );

  const list = data
    .slice(0, front ? Math.min(4, data.length) : data.length)
    .map((data) => <Article key={`articleItem${data.articleId}`} {...data} />);

  return (
    <Fragment>
      <ul className={cx('ArticleList', responsiveLayoutMode)}>
        <Article header={true} key={`articleItemHeader`} />
        {list}
        {isLoading && <SkeletonLoader skeleton={skeleton} length={front ? 4 : 8} />}
        {pagination != 'none' && (
          <div className="pagination">
            <MoreArticleButton hide={isLoading || !hasNextPage} onClick={onMore} />
          </div>
        )}
      </ul>
    </Fragment>
  );
}

/**
 * 인기글 더보기 버튼
 *
 * @param {{hide: boolean, onClick: function}} props
 */
function MoreArticleButton({ hide, onClick }) {
  return (
    <Button
      className={cx('MoreArticleButton', { hide: hide })}
      href=""
      size="fillWidth"
      label={
        <span>
          더 보기
          <ExpandMoreRoundedIcon />
        </span>
      }
      showLabel={true}
      labelSize="14px"
      labelBGColor="transparent"
      onclick={onClick}
    />
  );
}

/**
 * 게시글 아이템
 *
 * @param {{
 *  articleId: number,
 *  menuName: string,
 *  subject: string,
 *  nickname: string,
 *  publishedTimestamp: string,
 *  readCount: string,
 *  upCount: string,
 *  commentCount: string,
 *  representImage: string,
 *  header: boolean }} props
 */
function Article({
  articleId = -1,
  menuName = '게시판',
  subject = '제목',
  nickname = '작성자',
  publishedTimestamp = '작성일',
  readCount = '조회',
  upCount = '좋아요',
  commentCount = '',
  representImage = '',
  header = false,
}) {
  const href = !header
    ? 'https://cafe.naver.com/steamindiegame/' + articleId.toString().replace(/[^0-9]/g, '')
    : '';
  const thumb_area = (
    <a href={href} className="thumb_area" target="_blank" rel="noreferrer">
      <div className="thumb">
        <img
          src={representImage}
          alt="썸네일"
          onError={(i) => (i.target.style.display = 'none')}
          referrerPolicy="no-referrer"
        />
      </div>
    </a>
  );
  const today = new Date().toLocaleString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const published = new Date(publishedTimestamp).toLocaleString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const aheadOfWriteDate =
    published.slice(0, 11) === today.slice(0, 11)
      ? published.substring(12, 17)
      : published.substring(0, 11).replaceAll(' ', '');
  return (
    <li className={cx('Article', { listHeader: header })}>
      <a href={href} className="txt_area" target="_blank" rel="noreferrer">
        <span className="icon_new_txt">•</span>
        <span className="board_txt">{menuName}</span>
        <strong className="tit">{subject}</strong>

        <div className="user_area">
          <span className="nickname">
            <i className="blind">작성자</i>
            {nickname}
          </span>
          <span className="datetime">{header ? '작성일' : aheadOfWriteDate}</span>
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

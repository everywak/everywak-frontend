import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import useInputs from '../../../hooks/useInputs';

import BasicButton from '../../../common/Components/Button/BasicButton';
import TransparentButton from '../../../common/Components/Button/TransparentButton';
import InputForm from '../../../common/Components/InputForm/InputForm';
import TextInput from '../../../common/Components/TextInput/TextInput';
import BasicSelect from '../../../common/Components/Select/BasicSelect';
import BasicImage from '../../../common/Components/Image/BasicImage';

import BasicSearchBar from '../../../common/Components/SearchBar/BasicSearchBar';

import KeyboardArrowLeftRoundedIcon from '@material-ui/icons/KeyboardArrowLeftRounded';
import FileUploadRoundedIcon from '@material-ui/icons/CloudUploadRounded';
import PhotoLibraryRoundedIcon from '@material-ui/icons/PhotoLibraryRounded';
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';


import * as func from '../../../common/funtions';
import * as service from '../../../services/Waktoon';

import WaktoonEpisodeList from './WaktoonEpisodeList';

import styles from './WaktoonEditor.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

export default function WaktoonEditor({location, history}) {

  const [target, setTarget] = useState({});

  const { toonId } = useParams();

  useEffect(async () => {
    const res = await service.getWaktoons({ queryTarget: 'uuid', queryTxt: toonId });
    const {
      waktoonList
    } = res.result;
    setTarget(waktoonList ? waktoonList[0] : ({}));
  }, [toonId])

  return (
    <div className={cx('WaktoonEditor')}>
      <div className="headerWrapper">
        <header>
          <Link className="btnBackToPage" onClick={e => history.goBack()}>
            <KeyboardArrowLeftRoundedIcon fontSize="medium"/> 목록으로
          </Link>
          <div className="infoWrapper">
            <h1 className="subject">웹툰 정보 수정</h1>
            <div className="actionList">
              <BasicButton className="btnDelete" background="#DB0000">왁툰 삭제</BasicButton>
              <BasicButton className="btnSubmit">변경 사항 저장</BasicButton>
            </div>
          </div>
        </header>
      </div>
      <div className="editorFormWrapper">
        <WaktoonEditorForm waktoon={target} />
        <div className="waktoonEpisodeListWrapper">
          <div className="episodeListHeader">
            <div className="titleArea">
              <h2 className="title">에피소드 목록</h2>
              <div className="description">총 {target ? target.episodeNumber : 0}개 에피소드</div>
            </div>
            <TransparentButton><RefreshRoundedIcon fontSize="small" />새로 고침</TransparentButton>
          </div>
          <WaktoonEpisodeList uuid={toonId} />
        </div>
      </div>
    </div>
  );
}

function WaktoonEditorForm({ waktoon }) {
  
  const [inputValue, onChange, reset] = useInputs(waktoon);

  useEffect(() => {
    reset();
  }, [waktoon]);

  useEffect(() => {
    console.log(inputValue)
  }, [inputValue])

  return (
    <div className="WaktoonEditorForm">
      <div className="inputFormArea">
        <InputForm name="제목" description="웹툰 메인화면과 에피소드 리스트에 표시되는 작품의 제목입니다.">
          <TextInput name="title" value={inputValue.title} placeholder="제목을 입력하세요." onChange={onChange} />
        </InputForm>
        <InputForm name="연재 상태" description="작품의 연재 상태를 설정합니다.">
        <BasicSelect options={[{name: '연재중', value: 'continuing'}, {name: '휴재', value: 'paused'}, {name: '완결', value: 'ended'}]} name="serialStatus" value={inputValue.serialStatus} onChange={onChange} />
        </InputForm>
        <InputForm name="소개글" description="에피소드 리스트의 작품 정보에 표시되는 소개글입니다. 3줄 이내로 적는 것을 추천합니다.">
          <TextInput name="description" value={inputValue.description} placeholder="소개글을 입력하세요." onChange={onChange} />
        </InputForm>
        <InputForm name="제목 검색 키워드" description="작품의 최신 에피소드를 등록할 때 필요한 키워드입니다.
  예를 들어 키워드를 '만화'로 설정한 뒤 왁물원 웹툰 게시판에 작품을 올리면, 제목에 '만화'를 포함한 게시글만 해당 작품의 에피소드로 등록이 됩니다.">
          <TextInput name="parseKeyword" value={inputValue.parseKeyword} placeholder="제목 검색 키워드를 입력하세요." onChange={onChange} />
        </InputForm>
      </div>
      <div className="thumbnailArea">
        <div className="thumbnailWrapper">
          <BasicImage src={process.env.NODE_ENV !== 'development' && inputValue.thumbnails && inputValue.thumbnails.replace('100_100', '200_200')} alt="표지 이미지" noReferrer />
        </div>
        <div className="thumbnailFooter">
          <div className="thumbnailTxt">표지 이미지</div>
          <div className="btnList">
            <TransparentButton onClick={e => {}}><FileUploadRoundedIcon fontSize="small" /></TransparentButton>
            <TransparentButton onClick={e => {}}><PhotoLibraryRoundedIcon fontSize="small" /></TransparentButton>
          </div>
        </div>
      </div>
    </div>
  );
}
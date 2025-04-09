import React, { useEffect, useState, useRef } from 'react';

import { useInputs } from 'hooks/useInputs';

import VideoContentPlayer from './VideoContentPlayer';

function TestForm({ onApply }) {
  const [form, onChange] = useInputs({
    mediaType: 'youtubeLive',
    mediaId: 'FJfwehhzIhw',
    title: 'title',
    description: 'description',
  });

  return (
    <div className="TestForm">
      <div className="line">
        mediaType{' '}
        <select name="mediaType" value={form.mediaType} onChange={onChange}>
          <option value="twitchLive">트위치 생방송</option>
          <option value="youtubeVideo">유튜브 동영상</option>
          <option value="youtubeLive">유튜브 생방송</option>
          <option value="hls">HLS 스트리밍</option>
          <option value="video">URL 영상</option>
        </select>
      </div>
      <div className="line">
        mediaid
        <input type="text" name="mediaId" value={form.mediaId} onChange={onChange} />
      </div>
      <div className="line">
        title
        <input type="text" name="title" value={form.title} onChange={onChange} />
      </div>
      <div className="line">
        description
        <input type="text" name="description" value={form.description} onChange={onChange} />
      </div>
      <button
        onClick={(e) => {
          onApply(form);
        }}
      >
        apply
      </button>
    </div>
  );
}
function TestPage({ className, mediaType = 'twitchLive', mediaId = 'gosegugosegu', ...rest }) {
  const [data, setData] = useState({
    mediaType: 'youtubeVideo',
    mediaId: 'Nxq3g4Xydh8',
    title: 'title',
    description: 'description',
  });

  return (
    <div className="TestPage">
      <TestForm onApply={setData} />
      <div className="currData">{JSON.stringify(data)}</div>
      <VideoContentPlayer {...data} />
    </div>
  );
}
export default TestPage;

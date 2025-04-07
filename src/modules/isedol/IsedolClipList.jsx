import React, { Component } from 'react';

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/functions';
import * as service from '../../services/Isedol';
import * as videoApi from '../../services/everywak.video';

import VideoList from './VideoList';

import './IsedolClipList.scss';
import cx from 'classnames';

class IsedolClipList extends Component {
  static defaultProps = {};

  state = {
    itemList: [],
    defaultShowCount: 8,
  };

  constructor(props) {
    super(props);
  }

  updateTwitchClips = async (reset = true) => {
    const SECONDS_OF_DAY = 24 * 60 * 60;

    const options = {
      type: 'youtubeClip',
      twitchId: 'isedol',
      orderBy: 'view',
      beginAt: parseInt(Date.now() / 1000) - 7 * SECONDS_OF_DAY,
      endAt: parseInt(Date.now() / 1000),
    };

    const response = await videoApi.getVideos(options);
    const { videoList, videoCount } = response.result;

    if (videoList) {
      this.setState({
        itemList: videoList.map((item) => {
          const target = Waktaverse.find((mb) => mb.login_name == item.twitchId);
          const thumbnails = JSON.parse(item.thumbnails);
          const thumbnail = thumbnails.high ||
            thumbnails.medium ||
            thumbnails.default || { url: '' };
          return {
            key: `isedolYTItem-${item.videoId}`,
            href: `https://youtu.be/${item.videoId}`,
            thumbnail: thumbnail.url,
            title: item.title,
            datetime: item.publishedAt * 1000,
            formattedDateTime: func.formatDateTimeString(new Date(item.publishedAt * 1000)),
            author: item.nickname,
            duration: item.duration,
            viewCount: item.viewCount,
            authorProfileImg: target.profileImg?.replace('{size}', '240'),
          };
        }),
      });
    }
  };

  componentDidMount() {
    this.updateTwitchClips();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {}

  render() {
    const {} = this.props;
    const { itemList, defaultShowCount } = this.state;

    return <VideoList list={itemList} defaultShowCount={defaultShowCount} />;
  }
}

export default IsedolClipList;

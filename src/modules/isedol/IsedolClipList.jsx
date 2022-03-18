import React, { Component } from 'react';

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/funtions';
import * as service from '../../services/Isedol';

import VideoList from './VideoList';

import styles from './IsedolClipList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class IsedolClipList extends Component {
  static defaultProps = {
  };

  state = {
    itemList: [],
    defaultShowCount: 8,
  };

  constructor (props) {
    super(props);
  };

  
  updateTwitchClips = async (reset = true) => {

    const { videoList, videoCount } = await service.getTwitchClips();
    
    if (videoList) {
      this.setState({
        itemList: videoList.map(item => {
          const target = Waktaverse.find(mb => mb.login_name == item.twitchId);
          const thumbnails = JSON.parse(item.thumbnails);
          const thumbnail = thumbnails.high || thumbnails.medium || thumbnails.default || {url: ''};
          return({
            key: `isedolClipItem-${item.videoId}`,
            href: `https://clips.twitch.tv/${item.videoId}`,
            thumbnail: thumbnail.url,
            title: item.title,
            datetime: item.publishedAt * 1000,
            formattedDateTime: func.formatDateTimeString(new Date(item.publishedAt * 1000)),
            author: item.nickname,
            duration: item.duration,
            viewCount: item.viewCount,
            authorProfileImg: target.profileImg.replace('{size}', '240'),
          });
        })
      })
    }
  }

  componentDidMount() {
    this.updateTwitchClips();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {
  }

  render() {
    const {  } = this.props;
    const { itemList, defaultShowCount } = this.state;
    
    return (
      <VideoList list={itemList} defaultShowCount={defaultShowCount} />
    );
  }
}
  
export default IsedolClipList;
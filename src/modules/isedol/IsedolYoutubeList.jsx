import React, { Component } from 'react';

import { Waktaverse } from '../../common/constants';
import * as func from '../../common/funtions';
import * as service from '../../services/Isedol';

import VideoList from './VideoList';

import styles from './IsedolYoutubeList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class IsedolYoutubeList extends Component {
  static defaultProps = {
  };

  state = {
    itemList: [],
    defaultShowCount: 8,
  };

  constructor (props) {
    super(props);
  };

  
  updateIsedolYotube = async (reset = true) => {

    const { videoList, videoCount } = await service.getYoutubeVideos();
    
    if (videoList) {
      this.setState({
        itemList: videoList.map(item => {
          const target = Waktaverse.find(mb => mb.login_name == item.twitchId);
          const thumbnails = JSON.parse(item.thumbnails);
          const thumbnail = thumbnails.high || thumbnails.medium || thumbnails.default || {url: ''};
          return({
            key: `isedolYTItem-${item.videoId}`,
            href: `https://youtu.be/${item.videoId}`,
            thumbnail: thumbnail.url,
            title: item.title,
            datetime: item.publishedAt * 1000,
            formattedDateTime: func.formatDateTimeString(new Date(item.publishedAt * 1000)),
            author: item.nickname,
            authorProfileImg: target.profileImg.replace('{size}', '240'),
          });
        })
      })
    }
  }

  componentDidMount() {
    this.updateIsedolYotube();
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
  
export default IsedolYoutubeList;
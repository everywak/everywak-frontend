import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as func from '../../common/funtions';
import * as service from '../../services/Isedol';

import Button from '../../common/Components/Button';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';

import VideoList from './VideoList';

import styles from './IsedolClipList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class IsedolClipList extends Component {
  static defaultProps = {
    href: '',
  };

  state = {
    list: [],
  };

  constructor (props) {
    super(props);
  };

  
  updateTwitchClips = async (reset = true) => {

    const { videoList, videoCount } = await service.getTwitchClips();
    
    if (videoList) {
      this.setState({
        list: videoList.map(item => {
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
            authorProfileImg: '',
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
    const { href } = this.props;
    const { list } = this.state;
    
    return (
      <VideoList list={list} />
    );
  }
}
  
export default IsedolClipList;
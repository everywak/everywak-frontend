import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import VideoItem from './VideoItem';

import styles from './VideoList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class VideoList extends Component {
  static defaultProps = {
    list: [],
    showCount: 8,
    moreTarget: '',
  };

  state = {
  };

  constructor (props) {
    super(props);
  };

  componentDidMount() {
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {
  }

  render() {
    const { moreTarget, list, showCount } = this.props;
    const {  } = this.state;

    const itemList = list.slice(0, showCount).map(item => <VideoItem key={item.key} {...item} />);
    
    return (
      <React.Fragment>
        <ul className={cx('VideoList')}>
          {itemList}
        </ul>
        <Link to={moreTarget}>
        </Link>
      </React.Fragment>
    );
  }
}
  
export default VideoList;
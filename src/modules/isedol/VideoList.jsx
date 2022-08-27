import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Button from '../../common/Components/Button';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

import VideoItem from './VideoItem';

import styles from './VideoList.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class VideoList extends Component {
  static defaultProps = {
    list: [],
    defaultShowCount: 8,
    perPageCount: 8,
    maximumShowCount: 30,
    moreTarget: '',
    onMore: () => {},
  };

  state = {
    showCount: 8,
  };

  constructor (props) {
    super(props);
  };

  componentDidMount() {
    if (this.props.defaultShowCount !== this.state.showCount) {
      this.setState({
        showCount: this.props.defaultShowCount,
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  componentWillUnmount() {
  }

  onClickMore = e => {
    this.showMoreItems();
    this.props.onMore();
  }

  showMoreItems = e => {
    this.setState({
      showCount: this.state.showCount + this.props.perPageCount,
    });
  }

  render() {
    const { list, maximumShowCount } = this.props;
    const { showCount } = this.state;

    const itemList = list.slice(0, showCount).map(item => <VideoItem key={item.key} {...item} />);
    
    return (
      <div className={cx('VideoList')}>
        <ul className="itemList">
          {itemList}
        </ul>
        {
          showCount < maximumShowCount &&
          <div className="more">
            <Button 
              className={cx('moreLoad')} 
              href="" 
              size="fillWidth" 
              label={<ExpandMoreRoundedIcon />} 
              showLabel={true} 
              labelSize="14px" 
              labelBGColor="transparent" 
              onclick={this.onClickMore} />
          </div>
        }
      </div>
    );
  }
}
  
export default VideoList;
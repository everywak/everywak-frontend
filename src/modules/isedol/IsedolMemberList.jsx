import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Waktaverse } from '../../common/constants';

import IsedolMemberItem from './IsedolMemberItem';

import './IsedolMemberList.scss';
import cx from 'classnames';

class IsedolMemberList extends Component {
  static defaultProps = {
    isedol: [
      {
        name: '아이네',
        social: {
          instagram: 'ine_hamine',
        },
      },
      {
        name: '징버거',
        social: {
          instagram: 'jing_burger',
        },
      },
      {
        name: '릴파',
        social: {
          instagram: 'lilpaaaaaa_',
        },
      },
      {
        name: '주르르',
        social: {
          instagram: 'ju_ruru_',
        },
      },
      {
        name: '고세구',
        social: {
          instagram: 'gosegu_official',
        },
      },
      {
        name: '비챤',
        social: {
          instagram: 'viichan6',
        },
      },
    ],
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
    const { isedol } = this.props;
    const {  } = this.state;

    const isedolData = isedol.map(mb => {
      const dataFromWtvs = Waktaverse.find(item => item.name === mb.name);
      return ({
        key: `isedolmember_${dataFromWtvs.login_name}`,
        name: mb.name,
        profileImg: dataFromWtvs.profileImg.replace('{size}', 480),
        social: {
          afreecatv: dataFromWtvs.afreeca.channelId,
          youtube: dataFromWtvs.youtube.channelId,
          ...(mb.social),
        },
      });
    })
    const itemList = isedolData.map(item => <IsedolMemberItem key={item.key} {...item} />);
    
    return (
      <ul className={cx('IsedolMemberList')}>
        {itemList}
      </ul>
    );
  }
}
  
export default IsedolMemberList;
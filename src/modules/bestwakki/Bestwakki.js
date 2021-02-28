import React, { Component } from 'react';
import styles from './Bestwakki.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);

class Bestwakki extends Component {
  static defaultProps = {
    front: false
  };

  render() {
    
    return (
      <div className={cx('Bestwakki', {'front': this.props.front})}>
        <ArticleList front={this.props.front} />
        <div className="more"><svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" viewBox="0 0 24 24" width="18px" height="18px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><g><path d="M12,8c1.1,0,2-0.9,2-2s-0.9-2-2-2s-2,0.9-2,2S10.9,8,12,8z M12,10c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,10,12,10z M12,16c-1.1,0-2,0.9-2,2s0.9,2,2,2s2-0.9,2-2S13.1,16,12,16z"/></g></g></g></svg></div>
      </div>
    );
  }
}

class ArticleList extends Component {
  static defaultProps = {
    data: [
      {
        "updatedTimeStamp":"1614355203",
        "articleId":"3072277",
        "writeDateTimestamp":"1614336538",
        "subject":"싱글벙글 ㅍ허브.gif",
        "readCount":"484",
        "upCount":"10",
        "commentCount":"16",
        "menuName":"유머,정보 게시판",
        "nickname":"종성이랑",
        "representImage":"https:\/\/cafeptthumb-phinf.pstatic.net\/MjAyMTAyMjZfMjQ1\/MDAxNjE0MzM2NTM2ODg3.X_brcY31wjQGDyOXGYDK1955EwZ1Zcz1f8VwmdGlqNog.SEWfOEDw-KSynNC2PLEGURc-O24gEUnXt7YUW8xz6h4g.GIF\/IMG_1960.GIF?type=f100_100",
        "aheadOfWriteDate":"21.02.26."
      },
      {
        "updatedTimeStamp":"1614355203",
        "articleId":"3072099",
        "writeDateTimestamp":"1614332857",
        "subject":"시선강간이란?",
        "readCount":"523",
        "upCount":"4",
        "commentCount":"13",
        "menuName":"유머,정보 게시판",
        "nickname":"ino0103",
        "representImage":"https:\/\/cafeptthumb-phinf.pstatic.net\/MjAyMTAyMjZfMTMg\/MDAxNjE0MzMyODU2Mjc1.paeEdRlDW6aKcDrvhPBBTHwO1eczl5cUpgLHs6lTEeYg.iD63uUpJXE2-f-QsbP2vQcHiyF0tZjhS_otp2EtTNIYg.PNG\/1611205882156.png?type=f100_100",
        "aheadOfWriteDate":"21.02.26."
      },
      {
        "updatedTimeStamp":"1614355203",
        "articleId":"3071769",
        "writeDateTimestamp":"1614325547",
        "subject":"방송의 아이 [ 放送の子 ]",
        "readCount":"199",
        "upCount":"24",
        "commentCount":"23",
        "menuName":"웹툰 게시판",
        "nickname":"온디씨",
        "representImage":"https:\/\/cafeptthumb-phinf.pstatic.net\/MjAyMTAyMjZfMTE4\/MDAxNjE0MzM2Mjk1MTky.HOC1eb0ltYWO89-cqZSgpPunPHKeP__oC_4fuPjxKqQg.ZR5O1n1oOk2V_CTfFOgSSlSFHhLOiG13L-JoD75s1Xwg.PNG\/%B9%E6%BC%DB%C0%C7_%BE%C6%C0%CC.png?type=f100_100",
        "aheadOfWriteDate":"21.02.26."
      },
      {
        "updatedTimeStamp":"1614355203",
        "articleId":"3071719",
        "writeDateTimestamp":"1614324288",
        "subject":"이쁜 누나들이 90도로 인사해주는 pc방",
        "readCount":"631",
        "upCount":"0",
        "commentCount":"16",
        "menuName":"유머,정보 게시판",
        "nickname":"우왁굳 동생",
        "representImage":"https:\/\/cafeptthumb-phinf.pstatic.net\/MjAyMTAyMjZfMTYw\/MDAxNjE0MzI0Mjg2Njg2.sNKQhOUx_-kSEBTC18rhMmEHMdrnFc66lki-6nDllmkg.RErbTUHy6UxwAtjUpXjT8o_hMlmbqhrh067VUhGY6VYg.JPEG\/99b983892094b5c6d2fc3736e15da7d1.jpg?type=f100_100",
        "aheadOfWriteDate":"21.02.26."
      },
      {
        "updatedTimeStamp":"1614355203",
        "articleId":"3071576",
        "writeDateTimestamp":"1614320433",
        "subject":"중국이 지금 한국에게 계속 나대는 이유 + 미국을 이길 수 없는 이유",
        "readCount":"434",
        "upCount":"24",
        "commentCount":"19",
        "menuName":"유머,정보 게시판",
        "nickname":"아카시아",
        "representImage":"https:\/\/cafeptthumb-phinf.pstatic.net\/MjAyMTAyMjZfMjc4\/MDAxNjE0MzIwNDgzNzgy.Oj1Vwc7tq8Y82wgiGRO-kaw5BpuAJF_nuBu2x75FUDYg.vqpou1rnCUHuF8APi7Z2U3zJyO5BXnLe_a9IhXZspeIg.JPEG\/%C1%DF%B1%B9%A3%DF%C0%CE%B1%B81.jpg?type=f100_100",
        "aheadOfWriteDate":"21.02.26."
      }
    ],
    front: false
  }

  render() {
    const { data } = this.props;
    const list = data.slice(0, this.props.front ? Math.min(5, data.length) : data.length).map(
      data => (<Article key={data.articleId} data={data} />)
    );

    return (
      <ul className="ArticleList">
        {list}
      </ul>
    );
  }
}

class Article extends Component {
  static defaultProps = {
    data: {
      articleId: "",
      menuName: "",
      subject: "",
      nickname: "",
      aheadOfWriteDate: "",
      readCount: "0",
      upCount: "0",
      commentCount: "0",
      representImage: "",
    }
  };

  render() {
    const { 
      articleId, menuName, subject, nickname, aheadOfWriteDate, readCount, upCount, commentCount, representImage 
    } = this.props.data;
    const href = "https://cafe.naver.com/steamindiegame/" + articleId.replace(/[^0-9]/g, '');
    return (
      <li className="Article">
        <a href={href} className="txt_area" target="_blank" rel="noreferrer">
          <span className="icon_new_txt">•</span>
          <span className="board_txt">{menuName}</span>
          <strong className="tit">{subject}</strong>

          <div className="user_area">
            <span className="nickname">{nickname}</span>
            <span className="datetime">{aheadOfWriteDate}</span>
            <span className="view">{readCount}</span>
            <span className="like">{upCount}</span>
            <span className="comment">{commentCount}</span>
          </div>
        </a>
        <a href={href} className="thumb_area" target="_blank" rel="noreferrer">
          <div className="thumb">
            <img src={representImage} width="64px" height="64px" alt="썸네일" onError={i => i.target.style.display = 'none'} referrerPolicy="no-referrer"/>
          </div>
        </a>
      </li>
    );
  }
}

export default Bestwakki;
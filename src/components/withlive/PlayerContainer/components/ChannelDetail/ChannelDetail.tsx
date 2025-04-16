import { SetStateAction, useState } from 'react';
import clsx from 'clsx';
import { useQueryNotice } from 'hooks/useQueryNotice';
import { TabSelect } from 'common/components/Select/variants';
import { BasicImage, Section } from 'common/components';
import { VideoContentList } from 'components/video';
import { useQueryMember } from 'hooks/useQueryMember';
import { InputChangeHandler } from 'hooks/useInputs';
import { Member } from 'services/api-v2/module/member.type';
import { socialHref, socialLogoImgSrc } from './constants';
import { StreamInfo } from './components';
import styles from './ChannelDetail.module.scss';

export interface Props {
  memberId: string;
  className?: string;
}

export function ChannelDetail(props: Props) {
  const { isLoading, data } = useQueryNotice({ memberId: props.memberId });
  const { data: members } = useQueryMember();
  const member = members?.find((item) => item.id === props.memberId);

  const noticeTitle = isLoading ? '로딩 중...' : (data?.[0]?.subject ?? '공지사항이 없습니다.');
  return (
    <section className={clsx(styles.container, props.className)}>
      <StreamInfo memberId={props.memberId} />
      <section className={styles.channelPage}>
        <a
          href={data?.[0] && `https://cafe.naver.com/steamindiegame/${data?.[0].articleId}`}
          className={styles.notice}
          target="_blank"
        >
          <div className={styles.tag}>공지</div>
          <span className={styles.title}>{noticeTitle}</span>
        </a>
        {member && <TabContent member={member} />}
      </section>
    </section>
  );
}

const TabContent = ({ member }: { member: Member }) => {
  const isExistVod = member.youtubeChannel.length;

  const getBoardName = (memberId: string) => {
    switch (memberId) {
      case '01HTYWPTRQPMBBN03797C60NZQ':
        return ['형이봤', '왁굳이야기'];
      case '01HTYXH5RAR4NPW1Y1QD96FF6M':
        return ['아이봤', '이네이야기'];
      case '01HTYXYSS3YFAAPBR648J2DPHD':
        return ['징이봤', '버거이야기'];
      case '01HTYY59CYV8A58633V2BYWGGD':
        return ['릴이봤', '릴파이야기'];
      case '01HTYYB6AKM8QS519FD9WMKNPG':
        return ['주이봤', '르르이야기'];
      case '01HTYYFXH1GSSQD584HDTVMN2V':
        return ['고이봤', '세구이야기'];
      case '01HTYYN8ZGT1X22F9DM5BVB1RG':
        return ['챤이봤', '챠니이야기'];
      default:
        if (member?.role === 'gomem' || member?.role === 'academy') {
          return ['', '고멤이야기'];
        }
        return ['', ''];
    }
  };
  const [ibwat, memberBoard] = getBoardName(member.id);

  const options = [
    ...(isExistVod ? [{ name: 'VOD', value: 'videoContent' }] : []),
    ...(ibwat !== '' ? [{ name: ibwat, value: 'didYouSeeThisBro' }] : []),
    ...(memberBoard !== '' ? [{ name: memberBoard, value: 'memberBoard' }] : []),
    { name: 'SNS', value: 'social' },
  ];

  const [tab, setTab] = useState(options[0].value);

  const onChangeTab: InputChangeHandler<SetStateAction<string>> = (e) => {
    setTab(e.target.value);
  };

  return (
    <section className={styles.content}>
      <TabSelect
        className={styles.categories}
        options={options}
        name="tab"
        value={tab}
        onChange={onChangeTab}
      />
      <div className="content">
        {tab === 'videoContent' && <VideoContentTab member={member} />}
        {tab === 'didYouSeeThisBro' && <WIPTab member={member} />}
        {tab === 'memberBoard' && <WIPTab member={member} />}
        {tab === 'social' && <SocialTab member={member} />}
      </div>
      <FooterCopyright />
    </section>
  );
};

const VideoContentTab = ({ member }: { member: Member }) => {
  return (
    <div className="VideoContentTab tab">
      <Section className="main clip" title="클립" width="spaceBetween">
        <VideoContentList
          options={{
            type: 'youtubeClip',
            twitchId: member.livePlatform.find((platform) => platform.type === 'twitch')?.name,
          }}
          backgroundColor={'var(--color-background-white)'}
          type="slide"
          hideProfileCircle
        />
      </Section>
      <Section className="main replay" title="다시보기" width="spaceBetween">
        <VideoContentList
          options={{
            type: 'youtubeVOD',
            twitchId: member.livePlatform.find((platform) => platform.type === 'twitch')?.name,
          }}
          backgroundColor={'var(--color-background-white)'}
          type="slide"
          hideProfileCircle
        />
      </Section>
    </div>
  );
};

const WIPTab = ({ member }: { member: Member }) => {
  return <div className={clsx('WIPTab', styles.tab, styles.wipTab)}>Coming soon</div>;
};

const SocialTab = ({ member }: { member: Member }) => {
  const panel = member.social.map((item) => (
    <a
      key={item.type}
      href={`${socialHref[item.type as keyof typeof socialHref]}${
        item.type === 'cafe' ? item.userId : item.name
      }`}
      className={styles.social}
      target="_blank"
    >
      <BasicImage
        className={clsx(styles.logo, styles[item.type])}
        src={socialLogoImgSrc[item.type as keyof typeof socialLogoImgSrc]}
        alt={`${member.name} ${item.type}`}
      />
      {item.name && (
        <span className={styles.label}>{item.type === 'cafe' ? member.name : `@${item.name}`}</span>
      )}
    </a>
  ));
  return <div className={clsx('SocialTab', styles.tab, styles.socialTab)}>{panel}</div>;
};

const FooterCopyright = () => (
  <p className={styles.footer}>
    에브리왁굳 같이보기 페이지는 YouTube 및 SOOP의 서드파티 사이트로 YouTube 및 SOOP에서 운영하는
    사이트가 아닙니다.
    <br />
    'YouTube' 및 '유튜브'는 YouTube, LLC의 등록상표이며, 'SOOP'은 주식회사 숲의 등록상표입니다.
    <br />
    &nbsp;
    <br />
    에브리왁굳 © 2020-2025.{' '}
    <a href="https://github.com/wei756" className="copyrighter_site_footer">
      백수맛팬치
    </a>
    . All rights reserved.
  </p>
);

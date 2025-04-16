import { Section, SubSection } from 'common/components';
import { MusicChart, RecentMusicList } from './components';

export const EverymusicSection = () => {
  return (
    <Section
      title="에브리뮤직"
      more={{
        link: 'https://everywak.kr/music/concert/index.html',
        label: '지난 이세돌 콘서트 바로가기',
      }}
      width="spaceBetween"
    >
      <SubSection title="이 주의 신곡">
        <RecentMusicList />
      </SubSection>
      <SubSection title="일간 인기차트">
        <MusicChart />
      </SubSection>
    </Section>
  );
};

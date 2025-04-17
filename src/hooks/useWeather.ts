import { useEffect } from 'react';
import { useStorage } from '.';
import { OBI } from 'services/everywak/v2/types/obi';
import { useObiQuery } from './queries/obi';
import { orderNickname } from 'components/weather/weather.common';

export const useWeather = () => {
  const [weatherInfo, setWeatherInfo] = useStorage<{
    latest: OBI[];
    recent: OBI[][];
    updatedTime: string;
  }>('everywak.weather.datas', {
    latest: [],
    recent: [],
    updatedTime: new Date().toString(),
  });
  const { isLoading, data } = useObiQuery();

  useEffect(() => {
    if (!isLoading && data?.length) {
      const dates = new Set(data.map((item) => item.date));
      const [latest, ...recent] = [...dates].sort().reverse();
      const latestItems = data.filter((item) => item.date === latest).sort(orderByNickname);
      const recentByDate: OBI[][] = [];
      recent.forEach((date) => {
        recentByDate.push(data.filter((item) => item.date === date).sort(orderByNickname));
      });
      setWeatherInfo({
        latest: latestItems,
        recent: recentByDate,
        updatedTime: data[0]?.updatedTimestamp,
      });
    }
  }, [isLoading, data]);

  return { isLoading, weatherInfo };
};

const orderByNickname = (a: OBI, b: OBI) =>
  orderNickname[a.member.name as keyof typeof orderNickname] -
  orderNickname[b.member.name as keyof typeof orderNickname];

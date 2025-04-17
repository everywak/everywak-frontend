import { z } from 'zod';
import { MemberSimple } from './member';
import { OBISelectSchema } from '../schemas/obi';

export const OBIWeatherEnum = z.enum([
  'fog',
  'rain',
  'sunny',
  'cloudy',
  'partly_cloudy',
  'cloudy_s_sunny',
  'sunny_s_rain',
  'sunny_s_cloudy',
]);
export type OBIWeather = z.infer<typeof OBIWeatherEnum>;
export type OBISelectParams = z.input<typeof OBISelectSchema>;
export type OBI = {
  id: string;
  date: string;
  updatedTimestamp: string;
  publishedTimestamp: string;
  weather: OBIWeather;
  rawInfo: string;
  description: string;
  member: MemberSimple;
};

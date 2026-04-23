export type ApiError = {
  message: string;
  statusCode: number;
};

export type ReadonlyRecord<P extends string = string, Q = P> = Readonly<
  Record<P, Q>
>;

export type YoutubeChannelType = 'main' | 'sub' | 'clip' | 'replay';

export const YoutubeChannelEnum: ReadonlyRecord<YoutubeChannelType> = {
  main: 'main',
  sub: 'sub',
  clip: 'clip',
  replay: 'replay',
};
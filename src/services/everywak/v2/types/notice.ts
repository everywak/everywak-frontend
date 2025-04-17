import { Member } from './member';

export type MemberNotice = {
  readonly articleId: number;
  readonly publishedTimestamp: Date;
  readonly subject: string;
  readonly member: Member;
  readonly menuId: number;
  readonly menuName: string;
  readonly readCount: number;
  readonly commentCount: number;
  readonly upCount: number;
  readonly representImage: string;
  readonly representImageType: string;
  readonly imageCount: number;
};

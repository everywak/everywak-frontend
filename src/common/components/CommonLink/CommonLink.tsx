import { Link } from 'react-router-dom';
import { isExternalUrl } from 'common/functions';

export type Props = React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>;

export const CommonLink = ({ href, target, ...rest }: Props) => {
  const isExternal = !href || isExternalUrl(href);
  const _target = target || (isExternal ? '_blank' : undefined);
  if (isExternal) {
    return <a href={href} target={_target} {...rest} />;
  } else {
    return <Link to={href} target={_target} {...rest} />;
  }
};

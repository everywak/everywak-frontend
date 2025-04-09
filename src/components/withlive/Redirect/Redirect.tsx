export const Redirect = () => {
  // 만약 url이 /withlive/isedol이면 /withlive로 리다이렉트
  if (window.location.pathname === '/withlive/isedol') {
    window.location.replace('/withlive');
  }
  // 만약 url이 /live이면 /withlive로 리다이렉트
  if (window.location.pathname === '/live') {
    window.location.replace('/withlive');
  }
  return <></>;
};

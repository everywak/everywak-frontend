import { useEffect } from 'react';
import { useWithliveActions, useWithliveValues } from '@/contexts/withlive';

export const ParseUrlQuery = () => {
  const { addWatchingChannel } = useWithliveActions();
  const { channels } = useWithliveValues();
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const main = searchParams.get('main');
    if (main && channels.find((channel) => channel.memberId === main)) {
      addWatchingChannel(main);
      // remove main from searchParams
      searchParams.delete('main');

      // apply uri
      const newUrl = `${window.location.pathname}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [channels]);

  return <></>;
};

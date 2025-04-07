import { useQuery } from '@tanstack/react-query';

import * as everywakApi from '../services/everywak-api/index';

/**
 * 왁타버스 멤버 정보와 생방송 정보를 가져옵니다.
 *
 * @param {{ loginName: string, broadcasterId:string }} params
 */
function useQueryWaktaverseLive({ loginName, broadcasterId, ...rest }) {
  const fetchWaktaverseLiveInfo = async () => {
    const forAll = !(loginName || broadcasterId);

    const resWaktaverseInfo = await everywakApi.live.getWaktaverseInfo({
      loginName,
      broadcasterId,
    });
    if (resWaktaverseInfo.message.status !== 200 || !resWaktaverseInfo.message.result[0]) {
      throw resWaktaverseInfo;
    }

    const resLiveInfo = await everywakApi.live.getWaktaverseLiveInfo({
      broadcasterId: !forAll ? resWaktaverseInfo.message.result[0].broadcasterId : undefined,
    });
    if (resLiveInfo.message.status !== 200 || (!forAll && !resLiveInfo.message.result[0])) {
      throw resLiveInfo;
    }

    const targetInfo = resWaktaverseInfo.message.result;
    const targetBroadcast = resLiveInfo.message.result;

    return {
      members: targetInfo,
      lives: targetBroadcast,
    };
  };

  return useQuery([`waktaverseLiveInfo-${loginName}-${broadcasterId}`], fetchWaktaverseLiveInfo, {
    staleTime: 15000,
    ...rest,
  });
}
export default useQueryWaktaverseLive;

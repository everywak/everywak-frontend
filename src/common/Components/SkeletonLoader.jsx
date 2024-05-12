import React from 'react';

import './SkeletonLoader.scss';

/**
 * 스켈레톤 로더
 * @param {{skeleton: JSX.Element, length: Number}} props 
 */
function SkeletonLoader({skeleton, length = 3}) {

  const structs = Array(length).fill(skeleton);

  return (
    <div className="SkeletonLoader">
      {structs}
    </div>
  );

}

export default SkeletonLoader;
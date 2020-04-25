import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

const ShimmerLoader = ({ count, circle }) => (
  <SkeletonTheme color="#d3d3d3" highlightColor="#c0c0c0">
    <p>
      {circle ? (
        <Skeleton circle={circle} height={250} width={250} />
      ) : (
        <Skeleton count={count} />
      )}
    </p>
  </SkeletonTheme>
);

export default ShimmerLoader;
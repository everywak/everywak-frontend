import { useEffect, useState } from 'react';

import * as predictionApi from 'services/everywak.prediction';

import PredictionItem from './PredictionItem';

import './PredictionList.scss';
import cx from 'classnames';

function PredictionList({ channelId }) {
  const [predictionList, setPredictionList] = useState([]);

  const fetchPredictions = async () => {
    const response = await predictionApi.getPredictions({ loginName: channelId });
    const { oldPredictions } = response.result;

    if (oldPredictions) {
      setPredictionList(oldPredictions);
    }
  };
  useEffect(() => {
    fetchPredictions();
  }, [channelId]);

  const list = predictionList
    .slice(0, 12)
    .map((item) => (
      <PredictionItem
        key={item.id}
        {...item}
        createdAt={new Date().toDateString()}
        endedAt={item.endedAt || 'a'}
      />
    ));
  return <div className="PredictionList">{list}</div>;
}

export default PredictionList;

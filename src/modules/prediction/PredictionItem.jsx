import { useEffect, useState } from 'react';

import './PredictionItem.scss';
import cx from 'classnames';

const numberWithCommas = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatNumber = (n) => {
  if (n < 10000) {
    return numberWithCommas(n);
  } else if (n < 100000000) {
    return `${numberWithCommas(parseInt(n / 1000) / 10)}만`;
  } else {
    return `${numberWithCommas(parseInt(n / 10000000) / 10)}억`;
  }
};

function PredictionItem(props) {
  const { title, outcomes, createdAt, endedAt, predictionWindowSeconds, winningOutcome } = props;

  const createdTime = new Date(createdAt).getTime();
  console.log('winningOutcome0', winningOutcome);

  const cn = {
    umvsum: outcomes.length == 2,
    multiple: outcomes.length > 2,
    leftWin: outcomes[0].id === winningOutcome?.id,
    rightWin: outcomes[1].id === winningOutcome?.id,
    muhyo: endedAt && !winningOutcome,
    ended: endedAt,
  };
  return (
    <div
      className={cx('PredictionItem', cn, 'show')}
      style={{
        '--multipleOutcomeItemLength': outcomes.length,
        '--extendedMultipleHeight':
          'calc(70px + /*36px +*/ var(--multipleOutcomeItemHeight) * var(--multipleOutcomeItemLength))',
      }}
    >
      <div className="remainedTime">
        <div
          id="remainingTimeBar"
          className="timeBar"
          style={{
            '--width':
              Math.max(createdTime + predictionWindowSeconds * 1000 - Date.now(), 0) /
              1000 /
              predictionWindowSeconds,
          }}
        ></div>
      </div>
      {outcomes.length == 2 ? (
        <BlueRedOutcomes
          title={title}
          blue={outcomes[0]}
          red={outcomes[1]}
          winningId={winningOutcome?.id}
        />
      ) : (
        <MultipleOutcomes title={title} outcomes={outcomes} winningId={winningOutcome?.id} />
      )}
      <div className="resultMsg">예측 결과는???</div>
      {/*<canvas id="particle" width="360" height="300"></canvas>*/}
    </div>
  );
}

/**
 *
 * @param {{value: number, fractionDigits: number, formatFn: function}}
 */
function AnimatedNumber({ value, fractionDigits = 2, formatFn = (n) => n }) {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    const loopAnimation = () => {
      let nextDisplayed = displayedValue;
      const diffVal = (value - parseFloat(displayedValue.toFixed(fractionDigits))) / 5;

      if (isNaN(nextDisplayed)) {
        nextDisplayed = 0;
      }

      nextDisplayed +=
        diffVal > 0
          ? Math.max(diffVal, Math.pow(10, -fractionDigits))
          : diffVal < 0
            ? Math.min(diffVal, -Math.pow(10, -fractionDigits))
            : 0;
      if (parseFloat(nextDisplayed.toFixed(fractionDigits)) == value) {
        nextDisplayed = value;
      }
      const displayedValueStr = String(
        formatFn(parseFloat(displayedValue.toFixed(fractionDigits))),
      );
      const resultStr = String(formatFn(parseFloat(nextDisplayed.toFixed(fractionDigits))));
      if (resultStr != displayedValueStr) {
        setDisplayedValue(nextDisplayed);
      }
    };
    const loop = setInterval(loopAnimation, 50);
    return () => {
      clearInterval(loop);
    };
  }, [value, fractionDigits, displayedValue]);

  return String(formatFn(parseFloat(displayedValue.toFixed(fractionDigits))));
}

function BlueRedOutcomes({ title, blue, red, winningId }) {
  const wholePoints = blue.totalPoints + red.totalPoints;
  const blueBaedang = parseFloat((wholePoints / blue.totalPoints).toFixed(2));
  const redBaedang = parseFloat((wholePoints / red.totalPoints).toFixed(2));

  return (
    <>
      <div className="contentWrapper">
        <div className="title">
          <img src="/images/predictions/prediction.svg" />
          <span id="title">{title}</span>
        </div>
        <div className="contentLine peopleWrapper">
          <div className="content people win">
            <img src="/images/predictions/people.svg" />
            <span className="peopleCount">
              <AnimatedNumber value={blue.totalUsers} fractionDigits={0} formatFn={formatNumber} />
              명
            </span>
          </div>
          <div className="content people lose">
            <img src="/images/predictions/people.svg" />
            <span className="peopleCount">
              <AnimatedNumber value={red.totalUsers} fractionDigits={0} formatFn={formatNumber} />명
            </span>
          </div>
        </div>
        <div className="contentLine pointsWrapper">
          <div className="contentLineWrapper win">
            <div className="content points win">
              <img src="/images/predictions/point.svg" />
              <span className="pointsCount">
                <AnimatedNumber
                  value={blue.totalPoints}
                  fractionDigits={0}
                  formatFn={formatNumber}
                />
              </span>
              <span className="baedangCount">
                <AnimatedNumber value={blueBaedang} fractionDigits={2} />배
              </span>
            </div>
            <img className="winnerIcon" src="/images/predictions/winner.svg" />
          </div>
          <div className="contentLineWrapper lose">
            <div className="content points lose">
              <img src="/images/predictions/point.svg" />
              <span className="pointsCount">
                <AnimatedNumber
                  value={red.totalPoints}
                  fractionDigits={0}
                  formatFn={formatNumber}
                />
              </span>
              <span className="baedangCount">
                <AnimatedNumber value={redBaedang} fractionDigits={2} />배
              </span>
            </div>
            <img className="winnerIcon" src="/images/predictions/winner.svg" />
          </div>
        </div>
      </div>
      <div className="ratioBar">
        <div
          className="blueBar bar"
          style={{ '--width': (blue.totalPoints / wholePoints) * 100 }}
        ></div>
        <div
          className="redBar bar"
          style={{ '--width': (red.totalPoints / wholePoints) * 100 }}
        ></div>
        <div className="captionOverlay">
          <div className="labelWrapper win">
            <span id="labelTitleWin" className="title">
              {blue.title}
            </span>
            <span className="ratio">
              <AnimatedNumber
                value={Math.round((blue.totalPoints / wholePoints) * 100)}
                fractionDigits={0}
              />
              %
            </span>
          </div>
          <div className="labelWrapper lose">
            <span id="labelTitleLose" className="title">
              {red.title}
            </span>
            <span className="ratio">
              <AnimatedNumber
                value={Math.round((red.totalPoints / wholePoints) * 100)}
                fractionDigits={0}
              />
              %
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function MultipleOutcomes({ title, outcomes, winningId }) {
  const wholePoints = outcomes.reduce((whole, item) => whole + item.totalPoints, 0);
  const list = outcomes.map((item, i) => (
    <MultipleOutcomeItem
      i={i}
      wholePoints={wholePoints}
      outcome={item}
      isWin={item.id === winningId}
    />
  ));
  return (
    <>
      <div className="contentWrapper">
        <div className="title">
          <img src="/images/predictions/prediction.svg" />
          <span id="title">{title}</span>
        </div>
      </div>
      <div className="multipleOutcomeWrapper">{list}</div>
    </>
  );
}

function MultipleOutcomeItem({ i, wholePoints, outcome, isWin }) {
  const baedang = parseFloat((wholePoints / outcome.totalPoints).toFixed(2));

  return (
    <div className={cx('MultipleOutcomeItem', { win: isWin })}>
      <div
        className="ratioBar"
        style={{ '--width': (outcome.totalPoints / wholePoints) * 100 }}
      ></div>
      <div class="left">
        <img src={`/images/predictions/badges/${i + 1}.png`} alt={i + 1} />
        <div class="labelWrapper">
          <div class="titleWrapper">
            <div class="title">{outcome.title}</div>
            <img class="winnerIcon" src="/images/predictions/winner.svg" />
          </div>
          <div class="desc">
            <span class="percent">
              <AnimatedNumber
                value={Math.round((outcome.totalPoints / wholePoints) * 100)}
                fractionDigits={0}
              />
              %
            </span>
            <span class="baedang">
              <AnimatedNumber value={baedang} fractionDigits={2} />배
            </span>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="pointsWrapper">
          <img src="/images/predictions/point.svg" />
          <div class="points">
            <AnimatedNumber
              value={outcome.totalPoints}
              fractionDigits={0}
              formatFn={formatNumber}
            />
          </div>
        </div>
        <div class="peopleWrapper">
          <img src="/images/predictions/people.svg" />
          <div class="people">
            <AnimatedNumber value={outcome.totalUsers} fractionDigits={0} formatFn={formatNumber} />
            명
          </div>
        </div>
      </div>
    </div>
  );
}
export default PredictionItem;

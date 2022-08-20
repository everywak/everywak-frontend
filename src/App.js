import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import useGAPageTracking from './common/GAPageTracking';
import ScrollToTop from './common/ScrollToTop';

import Header from './common/Header/Header';
import Footer from './common/Footer/Footer';
import Frontpage from './modules/frontpage/Frontpage';
import Bestwakki from './modules/bestwakki/Bestwakki';
import Live from './modules/live/Live';
import WithLive from './modules/withlive/WithLive';

import Waktoon from './modules/waktoon/Waktoon';
import WaktoonEpisodeViewer from './modules/waktoon/waktoonEpisodeViewer/WaktoonEpisodeViewer';
import WaktoonViewer from './modules/waktoon/waktoonViewer/WaktoonViewer';
import WaktoonEditor from './modules/waktoon/waktoonEditor/WaktoonEditor';
import WaktoonChart from './modules/waktoon/waktoonChart/WaktoonChart';
import AllWaktoons from './modules/waktoon/allWaktoons/AllWaktoons';
import BestWaktoons from './modules/waktoon/bestWaktoons/BestWaktoons';

import Isedol from './modules/isedol/Isedol';
import NotFoundPage from './modules/notfoundpage/NotFoundPage';

export default function App(props) {

  useGAPageTracking();

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <Switch>
        <Route exact path="/" component={Frontpage}/>
        <Route path="/bestwakki" component={Bestwakki}/>
        <Route path="/live" component={Live}/>
        <Route path="/isedol" component={Isedol}/>

        <Route path="/waktoon/all" component={AllWaktoons}/>
        <Route path="/waktoon/best" component={BestWaktoons}/>
        <Route path="/waktoon/chart" component={WaktoonChart}/>
        <Route path="/waktoon/episode/:articleId" component={WaktoonEpisodeViewer}/>
        <Route path="/waktoon/:toonId/edit" component={WaktoonEditor}/>
        <Route path="/waktoon/:toonId/episode/:episodeNumber" component={WaktoonViewer}/>
        <Route path="/waktoon/:toonId" component={WaktoonViewer}/>
        <Route path="/waktoon" component={Waktoon}/>
        
        <Route path="/withlive/:group" component={WithLive}/>
        <Route path="/withlive" component={WithLive}/>
        <Route path="*" component={NotFoundPage} />
      </Switch>
      <Footer />
    </div>
  );
}

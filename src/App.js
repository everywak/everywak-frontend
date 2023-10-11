import React, { lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useGAPageTracking from './common/GAPageTracking';
import ScrollToTop from './common/ScrollToTop';

import NotFoundPage  from './modules/notfoundpage/NotFoundPage';

import Header from './common/Header/Header';
import Footer from './common/Footer/Footer';
import Frontpage from './modules/frontpage/Frontpage';
import Bestwakki from './modules/bestwakki/Bestwakki';
import Live from './modules/live/Live';

const Weather = lazy(() => import('./modules/weather/Weather'));

const WithLive = lazy(() => import('./modules/withlive/WithLive'));

const Waktoon = lazy(() => import('./modules/waktoon/Waktoon'));
const WaktoonEpisodeViewer = lazy(() => import('./modules/waktoon/waktoonEpisodeViewer/WaktoonEpisodeViewer'));
const WaktoonViewer = lazy(() => import('./modules/waktoon/waktoonViewer/WaktoonViewer'));
const WaktoonEditor = lazy(() => import('./modules/waktoon/waktoonEditor/WaktoonEditor'));
const WaktoonChart = lazy(() => import('./modules/waktoon/waktoonChart/WaktoonChart'));
const AllWaktoons = lazy(() => import('./modules/waktoon/allWaktoons/AllWaktoons'));
const BestWaktoons = lazy(() => import('./modules/waktoon/bestWaktoons/BestWaktoons'));

const Isedol = lazy(() => import('./modules/isedol/Isedol'));

const queryClient = new QueryClient();

export default function App(props) {

  useGAPageTracking();

  return (
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <ScrollToTop />
      <Switch>
        <Route exact path="/" component={Frontpage}/>
        <Route path="/bestwakki" component={Bestwakki}/>
        <Route path="/live" component={Live}/>
        <Route path="/isedol" component={Isedol}/>
        <Route path="/weather" component={Weather}/>

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
    </QueryClientProvider>
  );
}

import React, { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { clarity } from 'react-microsoft-clarity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useGAPageTracking from './common/GAPageTracking';
import ScrollToTop from './common/ScrollToTop';

import './common/common.scss';

import NotFoundPage from './modules/notfoundpage/NotFoundPage';

import Footer from './common/Footer/Footer';
import { ThemeProvider } from 'contexts/ThemeContext';

const Frontpage = lazy(() => import('./modules/frontpage/Frontpage'));

const Live = lazy(() => import('./modules/live/Live'));

const Bestwakki = lazy(() => import('./modules/bestwakki/page'));

const Weather = lazy(() => import('./modules/weather/Weather'));

const VideoWatch = lazy(() => import('./modules/video/VideoWatch'));

const WithLive = lazy(() => import('./modules/withlive/WithLive'));
const WithLiveV2 = lazy(() => import('./pages/withlive/Page'));
const ChatPopupPage = lazy(() => import('./modules/live/ChatPopupPage'));

const Waktoon = lazy(() => import('./modules/waktoon/Waktoon'));
const WaktoonEpisodeViewer = lazy(
  () => import('./modules/waktoon/waktoonEpisodeViewer/WaktoonEpisodeViewer'),
);
const WaktoonViewer = lazy(() => import('./modules/waktoon/waktoonViewer/WaktoonViewer'));
const WaktoonEditor = lazy(() => import('./modules/waktoon/waktoonEditor/WaktoonEditor'));
const WaktoonChart = lazy(() => import('./modules/waktoon/waktoonChart/WaktoonChart'));
const AllWaktoons = lazy(() => import('./modules/waktoon/allWaktoons/AllWaktoons'));
const BestWaktoons = lazy(() => import('./modules/waktoon/bestWaktoons/BestWaktoons'));

const Isedol = lazy(() => import('./modules/isedol/Isedol'));

const queryClient = new QueryClient();

export default function App() {
  useGAPageTracking();
  useEffect(() => {
    import.meta.env.VITE_CLARITY_ID && clarity.init(import.meta.env.VITE_CLARITY_ID);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="App">
          <ScrollToTop />

          <Routes>
            <Route path="/" element={<Frontpage />} />
            <Route path="/bestwakki" element={<Bestwakki />} />
            <Route path="/live/chat/:platform/:channelId" element={<ChatPopupPage />} />
            <Route path="/live" element={<Live />} />
            <Route path="/isedol" element={<Isedol />} />
            <Route path="/weather" element={<Weather />} />

            <Route path="/video/watch/:videoId" element={<VideoWatch />} />
            <Route path="/video/watch" element={<VideoWatch />} />

            <Route path="/waktoon/all" element={<AllWaktoons />} />
            <Route path="/waktoon/best" element={<BestWaktoons />} />
            <Route path="/waktoon/chart" element={<WaktoonChart />} />
            <Route path="/waktoon/episode/:articleId" element={<WaktoonEpisodeViewer />} />
            <Route path="/waktoon/:toonId/edit" element={<WaktoonEditor />} />
            <Route path="/waktoon/:toonId" element={<WaktoonViewer />} />
            <Route path="/waktoon" element={<Waktoon />} />

            <Route path="/withlive/:group" element={<WithLive />} />
            <Route path="/withlive" element={<WithLive />} />
            <Route path="/v2/withlive" element={<WithLiveV2 />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

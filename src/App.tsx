import React, { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { clarity } from 'react-microsoft-clarity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useGAPageTracking from './common/GAPageTracking';
import ScrollToTop from './common/ScrollToTop';

import './common/common.scss';

import Footer from './common/Footer/Footer';
import { ThemeProvider } from 'contexts/ThemeContext';

const NotFoundPage = lazy(() => import('./pages/notfoundpage/Page'));

const Frontpage = lazy(() => import('./modules/frontpage/Frontpage'));

const Bestwakki = lazy(() => import('./modules/bestwakki/page'));

const Weather = lazy(() => import('./modules/weather/Weather'));

const VideoWatch = lazy(() => import('./modules/video/VideoWatch'));

const Withlive = lazy(() => import('./pages/withlive/Page'));

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
            <Route path="/withlive" element={<Withlive />} />
            <Route path="/withlive/isedol" element={<Withlive />} /> {/* 레거시 리다이렉트용 */}
            <Route path="/live" element={<Withlive />} /> {/* 레거시 리다이렉트용 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Footer />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

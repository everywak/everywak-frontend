import React, { lazy, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { clarity } from 'react-microsoft-clarity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useGAPageTracking from './common/GAPageTracking';
import { useScrollToTop } from 'hooks';

import './common/common.scss';

import { ThemeProvider } from 'contexts/ThemeContext';

const NotFoundPage = lazy(() => import('./pages/notfoundpage/Page'));

const Frontpage = lazy(() => import('./pages/frontpage/Page'));

const Bestwakki = lazy(() => import('./pages/bestwakki/Page'));

const Weather = lazy(() => import('./components/legacy/weather/Weather'));

const VideoWatch = lazy(() => import('./components/legacy/video/VideoWatch'));

const Withlive = lazy(() => import('./pages/withlive/Page'));

const Waktoon = lazy(() => import('./components/legacy/waktoon/Waktoon'));
const WaktoonEpisodeViewer = lazy(
  () => import('./components/legacy/waktoon/waktoonEpisodeViewer/WaktoonEpisodeViewer'),
);
const WaktoonViewer = lazy(() => import('./components/legacy/waktoon/waktoonViewer/WaktoonViewer'));
const WaktoonEditor = lazy(() => import('./components/legacy/waktoon/waktoonEditor/WaktoonEditor'));
const WaktoonChart = lazy(() => import('./components/legacy/waktoon/waktoonChart/WaktoonChart'));
const AllWaktoons = lazy(() => import('./components/legacy/waktoon/allWaktoons/AllWaktoons'));
const BestWaktoons = lazy(() => import('./components/legacy/waktoon/bestWaktoons/BestWaktoons'));

const Isedol = lazy(() => import('./pages/isedol/Page'));

const queryClient = new QueryClient();

export default function App() {
  useGAPageTracking();
  useScrollToTop();
  useEffect(() => {
    import.meta.env.VITE_CLARITY_ID && clarity.init(import.meta.env.VITE_CLARITY_ID);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="App">
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
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

import React, { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useGAPageTracking from './common/GAPageTracking';
import { useScrollToTop } from 'hooks';

import './common/common.scss';

import { ThemeProvider } from '@/contexts/ThemeContext';

const NotFoundPage = lazy(() => import('./pages/notfoundpage/Page'));

const Frontpage = lazy(() => import('./pages/frontpage/Page'));

const Yourinfo = lazy(() => import('./pages/yourinfo/Page'));

const Weather = lazy(() => import('./pages/weather/Page'));

const VideoWatch = lazy(() => import('./components/legacy/video/VideoWatch'));

const Withlive = lazy(() => import('./pages/withlive/Page'));

const Isedol = lazy(() => import('./pages/isedol/Page'));

const queryClient = new QueryClient();

export default function App() {
  useGAPageTracking();
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Frontpage />} />
            <Route path="/policy" element={<Yourinfo />} />
            <Route path="/isedol" element={<Isedol />} />
            <Route path="/weather" element={<Weather />} />
            {/* <Route path="/video/watch/:videoId" element={<VideoWatch />} /> */}
            <Route path="/video/watch" element={<VideoWatch />} />
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

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import SuspenseFallback from './common/SuspenseFallback/SuspenseFallback';
import FixMobileViewportHeight from './common/FixMobileViewportHeight';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <FixMobileViewportHeight />
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
);

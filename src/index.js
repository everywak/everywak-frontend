import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import SuspenseFallback from './common/SuspenseFallback/SuspenseFallback';
import FixMobileViewportHeight from './common/FixMobileViewportHeight';

import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root')
);
root.render(
  //<React.StrictMode>
  <>
    <FixMobileViewportHeight />
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </>,
  //</React.StrictMode>,
  document.getElementById('root')
);

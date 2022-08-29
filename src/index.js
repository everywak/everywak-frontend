import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import SuspenseFallback from './common/SuspenseFallback/SuspenseFallback';
import App from './App';
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<SuspenseFallback />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

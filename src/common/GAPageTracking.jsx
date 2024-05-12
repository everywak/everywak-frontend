import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga';

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;;

const useGAPageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ReactGA.initialize(TRACKING_ID);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default useGAPageTracking;
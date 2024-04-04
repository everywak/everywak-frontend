import React, { useEffect } from "react";

function FixMobileViewportHeight(props) {
  useEffect(() => {
    const resizeWindowSize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    resizeWindowSize();

    return () => {
      window.removeEventListener('resize', resizeWindowSize);
    }
  }, []);

  return (<></>);
}

export default FixMobileViewportHeight;
import React from 'react';
import { DARK, LIGHT, CLOSED, OPENED, EXPANDED, LANDSCAPE, PORTRAIT } from '../../common/constants';

export const LiveContext = React.createContext({
  rotation: PORTRAIT,
  setRotation: () => {},
  chatStyle: DARK,
  expandHeader: false,
  toggleExpandHeader: () => {},
  expandScreen: false,
  toggleExpandScreen: () => {},
  playerOverlay: CLOSED,
  setPlayerOverlay: () => {},
});
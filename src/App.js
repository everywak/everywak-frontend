import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import useGAPageTracking from './common/GAPageTracking';
import ScrollToTop from './common/ScrollToTop';

import Header from './common/Header/Header';
import Footer from './common/Footer/Footer';
import Frontpage from './modules/frontpage/Frontpage';
import Bestwakki from './modules/bestwakki/Bestwakki';
import Live from './modules/live/Live';
import WithLive from './modules/withlive/WithLive';
import Isedol from './modules/isedol/Isedol';
import NotFoundPage from './modules/notfoundpage/NotFoundPage';

export default function App(props) {

  useGAPageTracking();

  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <Switch>
        <Route exact path="/" component={Frontpage}/>
        <Route path="/bestwakki" component={Bestwakki}/>
        <Route path="/live" component={Live}/>
        <Route path="/isedol" component={Isedol}/>
        <Route path="/withlive/:group" component={WithLive}/>
        <Route path="/withlive" component={WithLive}/>
        <Route path="*" component={NotFoundPage} />
      </Switch>
      <Footer />
    </div>
  );
}

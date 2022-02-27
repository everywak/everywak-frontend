import { BrowserRouter as Router, Route } from 'react-router-dom';

import ScrollToTop from './common/ScrollToTop';

import Header from './common/Header/Header';
import Footer from './common/Footer/Footer';
import Frontpage from './modules/frontpage/Frontpage';
import Bestwakki from './modules/bestwakki/Bestwakki';
import Live from './modules/live/Live';
import Isedol from './modules/isedol/Isedol';

export default function App(props) {

  return (
    <div className="App">
      <Router>
        <ScrollToTop />
        <Header />
        <Route exact path="/" component={Frontpage}/>
        <Route path="/bestwakki" component={Bestwakki}/>
        <Route path="/live" component={Live}/>
        <Route path="/isedol" component={Isedol}/>
        <Footer />
      </Router>
    </div>
  );
}

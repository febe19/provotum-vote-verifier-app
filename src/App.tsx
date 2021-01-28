import React, { useRef, useEffect } from 'react';
import Header from './Components/Header';
import Scanner from "./Components/Scanner";
import Result from './Components/Result';
import Intro from './Components/Intro';
import NotFound from './Components/NotFound';
import { Route, Switch } from 'react-router-dom';


function App() {
  return (
    <main >
      <div>
        <Header />
      </div>

      <div>
        <Switch>
          <Route path="/" component={Intro} exact />
          <Route path="/scanner" component={Scanner} />
          <Route path="/result" component={Result} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </main>
  );
}

export default App;

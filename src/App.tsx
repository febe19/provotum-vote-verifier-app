import React, { useRef, useEffect } from 'react';
import HeaderAndHelp from './Components/HeaderAndHelp';
import Scanner from './Components/Scanner';
import Result from './Components/Result';
import Intro from './Components/Intro';
import NotFound from './Components/NotFound';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from "react-redux"
import {
  RAT
} from './Redux/Reducer'

function App() {
  const dispatch = useDispatch()
  const headerRef: any = useRef(null);
  const bodyRef: any = useRef(null);
  var usableHeight: number = 0;

  // Resize handler for windw size detection. This is used for the scanner size
  // Size is stored into the Redux Store
  useEffect(() => {
    const resizeHandler = () => {
      usableHeight = window.innerHeight - headerRef.current!.clientHeight;  
      dispatch({
        type: RAT.WINDOWHEIGHT,
        payload: usableHeight
      })
    }
    resizeHandler()
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  }, [])
    
  return (
    <main >
      <div ref={headerRef}>
        <HeaderAndHelp />
      </div>

      <div ref={bodyRef}>
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

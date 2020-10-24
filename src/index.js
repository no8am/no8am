import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import ReactGA from 'react-ga';
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire';
import { CircularProgress } from '@material-ui/core';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkWHAFIpHkP0G_fdB7tyofLYD6qln8MAg",
  authDomain: "no8am-98c5d.firebaseapp.com",
  databaseURL: "https://no8am-98c5d.firebaseio.com",
  projectId: "no8am-98c5d",
  storageBucket: "no8am-98c5d.appspot.com",
  messagingSenderId: "89195393370",
  appId: "1:89195393370:web:4835959da983875616c363",
  measurementId: "G-S1FZ0QF5RK"
};

function FirebaseApp() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <SuspenseWithPerf fallback={<CircularProgress color="inherit" size={20} />} traceId={'load-app-status'}>
        <App />
      </SuspenseWithPerf>
    </FirebaseAppProvider>
  );
}


import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

const theme = createMuiTheme({
    typography: {
      fontFamily: [
        'Prompt'
      ].join(','),
    },
  });

const trackingId = "UA-159254061-1"; // Google Analytics tracking ID
ReactGA.initialize(trackingId);
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <FirebaseApp/>
    </ThemeProvider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
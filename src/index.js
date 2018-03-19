import React from 'react';
import { render } from 'react-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

const bootstrap = () => {
  const App = require('./App').default;
  render(<App />, document.getElementById('root'));
};

if (process.env.NODE_ENV === 'development' || !window.requirejs) {
  bootstrap();
} else {
  window.requirejs(
    ['https://cdn.polyfill.io/v2/polyfill.min.js?features=es5&flags=gated'],
    bootstrap,
    // http://requirejs.org/docs/api.html#errbacks
    bootstrap
  );
}

registerServiceWorker();

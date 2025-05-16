import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

// Manually extend the Amplify config with your Lex bot info
Amplify.configure({
  ...awsExports,
  Interactions: {
    bots: {
      CloudAssistantBot: {
        name: 'CloudAssistantBot',
        alias: '$LATEST',
        region: 'us-east-1',
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

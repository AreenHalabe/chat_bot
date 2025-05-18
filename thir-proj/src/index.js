// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import Auth from '@aws-amplify/auth';

// import { Amplify } from 'aws-amplify';
// import awsExports from './aws-exports';

// Amplify.configure(awsExports);
// Auth.configure(awsExports);

// // Manually extend the Amplify config with your Lex bot info
// // Amplify.configure({
// //   ...awsExports,
// //   Interactions: {
// //     bots: {
// //       CloudAssistantBot: {
// //         name: 'CloudAssistantBot',
// //         alias: '$LATEST',
// //         region: 'us-east-1',
// //       },
// //     },
// //   },
// // });

// Amplify.configure({
//   ...awsExports,
//   Interactions: {
//     bots: {
//       CloudAssistantBot: {
//         name: 'CloudAssistantBot',
//         alias: '$LATEST',
//         region: 'us-east-1',
//       },
//     },
//   },
// });

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// reportWebVitals();


import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';

Amplify.configure({
  ...awsExports,
  // No need to import or configure Auth separately here
  Interactions: {
    bots: {
      CloudAssistantBot: {
        name: 'CloudAssistantBot',
        alias: 'Final',
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

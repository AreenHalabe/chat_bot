// import React from 'react';
// import { Authenticator } from '@aws-amplify/ui-react';
// import '@aws-amplify/ui-react/styles.css';

// import LexV2Chat from './components/LexV2Chat';

// function App() {
//   return (
//     <Authenticator>
//       {({ signOut, user }) => (
//         <main style={{ padding: '1rem' }}>
//           <h2>Welcome, {user.username}!</h2>
//           <LexV2Chat />
//           <button onClick={signOut} style={{ marginTop: '1rem' }}>
//             Sign Out
//           </button>
//         </main>
//       )}
//     </Authenticator>
//   );
// }

// export default App;


import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import LexV2Chat from './components/LexV2Chat';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main >
          <LexV2Chat user={user} />
          {/* <button onClick={signOut} style={{ marginTop: '1rem' }}>
            Sign Out
          </button> */}
        </main>
      )}
    </Authenticator>
  );
}

export default App;
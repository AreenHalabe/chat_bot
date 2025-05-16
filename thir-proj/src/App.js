import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import ChatBot from './components/ChatBot';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main style={{ padding: '1rem' }}>
          <h2>Welcome, {user.username}!</h2>
          <ChatBot />
          <button onClick={signOut} style={{ marginTop: '1rem' }}>
            Sign Out
          </button>
        </main>
      )}
    </Authenticator>
  );
}

export default App;

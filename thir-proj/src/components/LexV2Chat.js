// import React, { useState, useEffect } from 'react';
// import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';
// import * as Auth from '@aws-amplify/auth';

// const botId = '8D7BQUTCVY';          // Find this in AWS Lex V2 console
// const botAliasId = 'R6G8EFULHH';  // Find this in AWS Lex V2 console
// const localeId = 'en_US';             // Your bot's locale
// const region = 'us-east-1';           // Your bot's region

// function LexV2Chat() {
//   const [messages, setMessages] = useState([
//     { from: 'bot', text: 'Hi! How can I help you?' },
//   ]);
//   const [input, setInput] = useState('');
//   const [lexClient, setLexClient] = useState(null);
//   const [sessionId, setSessionId] = useState('');

//   // Initialize Lex client with AWS credentials from Cognito Identity Pool
//   useEffect(() => {
//     async function init() {
//       const credentials = await Auth.currentCredentials();
//       const client = new LexRuntimeV2Client({
//         region,
//         credentials,
//       });
//       setLexClient(client);
//       setSessionId('session-' + Date.now()); // simple unique session id
//     }
//     init();
//   }, []);

//   async function sendMessage() {
//     if (!input || !lexClient) return;

//     setMessages((msgs) => [...msgs, { from: 'user', text: input }]);

//     const params = {
//       botId,
//       botAliasId,
//       localeId,
//       sessionId,
//       text: input,
//     };

//     try {
//       const command = new RecognizeTextCommand(params);
//       const response = await lexClient.send(command);
//       const messagesFromBot = response.messages || [];
//       const botText = messagesFromBot.map((msg) => msg.content).join(' ');
//       setMessages((msgs) => [...msgs, { from: 'bot', text: botText || '...' }]);
//     } catch (error) {
//       console.error('Lex V2 error:', error);
//       setMessages((msgs) => [
//         ...msgs,
//         { from: 'bot', text: 'Sorry, something went wrong.' },
//       ]);
//     }

//     setInput('');
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: 'auto' }}>
//       <div
//         style={{
//           minHeight: 300,
//           border: '1px solid #ccc',
//           padding: '1rem',
//           marginBottom: '1rem',
//           overflowY: 'auto',
//         }}
//       >
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             style={{
//               textAlign: msg.from === 'user' ? 'right' : 'left',
//               margin: '0.5rem 0',
//             }}
//           >
//             <span
//               style={{
//                 display: 'inline-block',
//                 padding: '0.5rem 1rem',
//                 borderRadius: '15px',
//                 backgroundColor: msg.from === 'user' ? '#007bff' : '#e5e5ea',
//                 color: msg.from === 'user' ? 'white' : 'black',
//                 maxWidth: '70%',
//                 wordWrap: 'break-word',
//               }}
//             >
//               {msg.text}
//             </span>
//           </div>
//         ))}
//       </div>

//       <input
//         type="text"
//         placeholder="Type your message"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//         style={{ width: '80%', padding: '0.5rem' }}
//       />
//       <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>
//         Send
//       </button>
//     </div>
//   );
// }

// export default LexV2Chat;


import React, { useState, useEffect } from 'react';
import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';
import * as Auth from '@aws-amplify/auth';  // import all as Auth

const botId = '8D7BQUTCVY';         // Replace with your Lex V2 bot ID (UUID)
const botAliasId = 'R6G8EFULHH'; // Replace with your Lex V2 bot alias ID (UUID)
const localeId = 'en_US';            // Your bot's locale
const region = 'us-east-1';          // Your bot's region

function LexV2Chat() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you?' },
  ]);
  const [input, setInput] = useState('');
  const [lexClient, setLexClient] = useState(null);
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const session = await Auth.fetchAuthSession();
        const credentials = await session.credentials; // credentials is a Promise
        const client = new LexRuntimeV2Client({
            region,
            credentials,
        });
        setLexClient(client);
        setSessionId('session-' + Date.now());
      } catch (error) {
        console.error('Error initializing Lex client:', error);
      }
    }
    init();
  }, []);

  async function sendMessage() {
    if (!input || !lexClient) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: input }]);

    const params = {
      botId,
      botAliasId,
      localeId,
      sessionId,
      text: input,
    };

    try {
      const command = new RecognizeTextCommand(params);
      const response = await lexClient.send(command);

      const messagesFromBot = response.messages || [];
      const botText = messagesFromBot.map((msg) => msg.content).join(' ');

      setMessages((msgs) => [...msgs, { from: 'bot', text: botText || '...' }]);
    } catch (error) {
      console.error('Lex V2 error:', error);
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    }

    setInput('');
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <div
        style={{
          minHeight: 300,
          border: '1px solid #ccc',
          padding: '1rem',
          marginBottom: '1rem',
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.from === 'user' ? 'right' : 'left',
              margin: '0.5rem 0',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '15px',
                backgroundColor: msg.from === 'user' ? '#007bff' : '#e5e5ea',
                color: msg.from === 'user' ? 'white' : 'black',
                maxWidth: '70%',
                wordWrap: 'break-word',
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem 1rem' }}>
        Send
      </button>
    </div>
  );
}

export default LexV2Chat;

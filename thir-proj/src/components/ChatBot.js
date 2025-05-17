import React, { useState } from 'react';
import { Interactions } from '@aws-amplify/interactions';


import { Amplify } from 'aws-amplify';
import awsExports from '../aws-exports';

Amplify.configure({
  ...awsExports,
  Interactions: {
    bots: {
      CloudAssistantBot: {
        name: 'CloudAssistantBot',
        alias: 'LATEST',
        region: 'us-east-1',
      },
    },
  },
});

function ChatBot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you?' },
  ]);
  const [input, setInput] = useState('');

  async function sendMessage() {
    if (!input) return;

    setMessages((msgs) => [...msgs, { from: 'user', text: input }]);

    try {
      const response = await Interactions.send('CloudAssistantBot', input);
      setMessages((msgs) => [...msgs, { from: 'bot', text: response.message }]);
    } catch (error) {
      console.error('Lex error:', error);
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

export default ChatBot;

 import { sendMessageToGraphQL } from '../utils/sendMessage.js';

 import { fetchUserMessages } from '../utils/fetchMessages.js';



// import React, { useState, useEffect } from 'react';
// import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';
// import * as Auth from '@aws-amplify/auth';  // import all as Auth

// const botId = 'E3AMTGB5QT';         // Replace with your Lex V2 bot ID (UUID)
// const botAliasId = 'TSTALIASID'; // Replace with your Lex V2 bot alias ID (UUID)
// const localeId = 'en_US';            // Your bot's locale
// const region = 'us-east-1';          // Your bot's region

// function LexV2Chat() {
//   const [messages, setMessages] = useState([
//     { from: 'bot', text: 'Hi! How can I help you?' },
//   ]);
//   const [input, setInput] = useState('');
//   const [lexClient, setLexClient] = useState(null);
//   const [sessionId, setSessionId] = useState('');

//   useEffect(() => {
//     console.log('useEffect triggered');

//     async function init() {
//       try {
//         const session = await Auth.fetchAuthSession();
//         const credentials = await session.credentials; // credentials is a Promise
//         const client = new LexRuntimeV2Client({
//             region,
//             credentials,
//         });
//         setLexClient(client);
//         setSessionId('session-' + Date.now());

//         const pastMessages = await fetchUserMessages();
//       console.log("📜 User's full message history:", pastMessages);
//       } catch (error) {
//         console.error('Error initializing Lex client:', error);
//       }
//     }
//     init();
//   }, []);

 
//   async function sendMessage() {
//     if (!input || !lexClient) return;

//     const userText = input;
//     setMessages((msgs) => [...msgs, { from: 'user', text: userText }]);
//     await sendMessageToGraphQL(userText, 'user'); // 👈 save user message

//     const params = { botId, botAliasId, localeId, sessionId, text: userText };

//     try {
//       const command = new RecognizeTextCommand(params);
//       const response = await lexClient.send(command);
//       const messagesFromBot = response.messages || [];
//       const botText = messagesFromBot.map((msg) => msg.content).join(' ') || '...';

//       setMessages((msgs) => [...msgs, { from: 'bot', text: botText }]);
//       await sendMessageToGraphQL(botText, 'bot'); // 👈 save bot message
//     } catch (error) {
//       console.error('Lex V2 error:', error);
//       const errMsg = 'Sorry, something went wrong.';
//       setMessages((msgs) => [...msgs, { from: 'bot', text: errMsg }]);
//       await sendMessageToGraphQL(errMsg, 'bot'); // 👈 save error message
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


import React, { useState, useEffect, useRef } from 'react';
import { LexRuntimeV2Client, RecognizeTextCommand } from '@aws-sdk/client-lex-runtime-v2';
import * as Auth from '@aws-amplify/auth';
import { FiSend, FiUser, FiMessageSquare, FiHome, FiHelpCircle, FiPlus, FiMenu, FiLogOut } from 'react-icons/fi';
import { BsRobot, BsLightning, BsShieldCheck, BsQuestionCircle } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { Authenticator } from '@aws-amplify/ui-react';

const botId = 'E3AMTGB5QT';
const botAliasId = 'HEMGHLY8F0';
const localeId = 'en_US';
const region = 'us-east-1';

// أوامر سريعة مسبقة
const quickCommands = [
  { command: " يمكنني إعادة تعيين كلمة ", desc: "تعليمات استعادة الحساب" },
  { command: "ما هي ساعات العمل؟", desc: "معلومات الاتصال" },
  { command: "كيفية إنشاء طلب جديد؟", desc: "دليل استخدام النظام" },
  { command: "أريد الإبلاغ عن مشكلة", desc: "فتح تذكرة دعم" }
];

// سياسات الأمان
const securityPolicies = [
  { title: "حماية البيانات", content: "جميع بياناتك محمية بتقنيات تشفير متقدمة" },
  { title: "الخصوصية", content: "لا نشارك معلوماتك الشخصية مع أطراف ثالثة" },
  { title: "الأمان", content: "نظامنا يحقق أعلى معايير الأمان الإلكتروني" }
];

function LexV2Chat({ user, signOut }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'مرحباً! كيف يمكنني مساعدتك اليوم؟' },
  ]);
  const [input, setInput] = useState('');
  const [lexClient, setLexClient] = useState(null);
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // الصفحة الرئيسية افتراضياً
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function init() {
      try {
        const session = await Auth.fetchAuthSession();
        const credentials = await session.credentials;
        const client = new LexRuntimeV2Client({
          region,
          credentials,
        });
        setLexClient(client);
        setSessionId('session-' + Date.now());
        const pastMessages = await fetchUserMessages();
       console.log("📜 User's full message history:", pastMessages);
      } catch (error) {
        console.error('Error initializing Lex client:', error);
      }
    }
    init();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  async function sendMessage() {
    if (!input.trim() || !lexClient || isLoading) return;

    setIsLoading(true);
    const userMessage = input;
    setMessages((msgs) => [...msgs, { from: 'user', text: userMessage }]);
    await sendMessageToGraphQL(userMessage, 'user'); ////////////////////////////////////////////
    setInput('');

    const params = {
      botId,
      botAliasId,
      localeId,
      sessionId,
      text: userMessage,
    };

    try {
      const command = new RecognizeTextCommand(params);
      const response = await lexClient.send(command);
      const messagesFromBot = response.messages || [];
      const botText = messagesFromBot.map((msg) => msg.content).join(' ');

      setMessages((msgs) => [...msgs, { from: 'bot', text: botText || '...' }]);
      await sendMessageToGraphQL(botText, 'bot'); // 👈 save bot message
    } catch (error) {
      console.error('Lex V2 error:', error);
      const errMsg = 'Sorry, something went wrong.';
      setMessages((msgs) => [
        ...msgs,
        { from: 'bot', text: 'عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى.' },
      ]);
      await sendMessageToGraphQL(errMsg, 'bot'); // 👈 save error message

    } finally {
      setIsLoading(false);
    }
  }

  // إرسال أمر سريع
  const sendQuickCommand = (command) => {
    setInput(command);
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <div className="app-container">
      {/* الشريط الجانبي */}
      <motion.div
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sidebar-header">
          <BsRobot className="sidebar-logo" />
          <h2>AWS ChatBot</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(false)}
          >
            &times;
          </button>
        </div>

        <div className="sidebar-menu">
          <button
            className={`menu-item ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <FiHome className="menu-icon" />
            Home
          </button>

          <button
            className={`menu-item ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <FiMessageSquare className="menu-icon" />
            Chat
            <span className="badge">New</span>
          </button>

          <button
            className={`menu-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <FiHelpCircle className="menu-icon" />
            Help
          </button>

          <div className="menu-section">
            <span className="section-title">Fast Tools</span>
            <button
              className="menu-item"
              onClick={() => setActiveTab('commands')}
            >
              <BsLightning className="menu-icon" />
              Fast Comand
            </button>
            <button
              className="menu-item"
              onClick={() => setActiveTab('security')}
            >
              <BsShieldCheck className="menu-icon" />
              Security
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">{user.username?.charAt(0) || 'م'}</div>
            <div className="user-info">
              <span className="username">{user.username || 'مستخدم'}</span>
              <span className="user-email">{user.attributes?.email || 'user@example.com'}</span>
            </div>
          </div>

          <Authenticator>
                {({ signOut, user }) => (
                  <main >
                    <button className="logout-btn" onClick={signOut}>
                      <FiLogOut />
                    </button>
                  </main>
                )}
              </Authenticator>
          
        </div>
      </motion.div>

      <div className="main-content">
        <div className="top-bar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </button>

          <div className="search-bar">
            <input type="text" placeholder="Search..." />
          </div>

          <div className="top-bar-actions">
            <button
              className="action-btn"
              onClick={() => setActiveTab('chat')}
            >
              <FiPlus />
            </button>
            <div className="notifications">
              <span className="badge">3</span>
            </div>
          </div>
        </div>

        <div className="page-content">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div
                className="chat-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="page-header">
                  <h2> Technical Support Chat</h2>
                  <p>Chat with our smart assistant for assistance.</p>
                </div>

                <div className="chat-container">
                  <div className="chat-messages">
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        className={`message ${msg.from}`}
                        initial={{ opacity: 0, x: msg.from === 'user' ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="message-content">
                          {msg.from === 'bot' ? (
                            <BsRobot className="message-icon" />
                          ) : (
                            <FiUser className="message-icon" />
                          )}
                          <div className="message-text">{msg.text}</div>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                    {isLoading && (
                      <div className="message bot">
                        <div className="message-content">
                          <BsRobot className="message-icon" />
                          <div className="message-text typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <motion.div
                    className="chat-input-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <input
                      type="text"
                      placeholder=" Write Your massege ..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      disabled={isLoading}
                      className="chat-input"
                    />
                    <motion.button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="send-button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiSend className="send-icon" />
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {activeTab === 'home' && (
              <motion.div
                className="home-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="page-header">
                  <h2>Welcome to your smart assistant.</h2>
                  <p>Use the chatbot for instant help.</p>
                </div>

                <div className="cards-container">
                  <motion.div
                    className="card"
                    whileHover={{ y: -5 }}
                    onClick={() => setActiveTab('chat')}
                  >
                    <div className="card-icon blue">
                      <FiMessageSquare />
                    </div>
                    <h3>Start New Chat</h3>
                    <p> Chat with our smart assistant now.</p>
                  </motion.div>

                  <motion.div
                    className="card"
                    whileHover={{ y: -5 }}
                    onClick={() => setActiveTab('commands')}
                  >
                    <div className="card-icon purple">
                      <BsLightning />
                    </div>
                    <h3>Quick Comand </h3>
                    <p>Use ready-made commands for quick response</p>
                  </motion.div>

                  <motion.div
                    className="card"
                    whileHover={{ y: -5 }}
                    onClick={() => setActiveTab('security')}
                  >
                    <div className="card-icon green">
                      <BsShieldCheck />
                    </div>
                    <h3>Security Center</h3>
                    <p>Learn about privacy and security policies</p>
                  </motion.div>

                </div>

                {/* قسم الإحصائيات */}
<div className="stats-section">
  <h3>Usage Statistics</h3>
  <div className="stats-grid">
    <div className="stat-card">
      <div className="stat-value">24/7</div>
      <div className="stat-label">Technical Support Available</div>
    </div>
    <div className="stat-card">
      <div className="stat-value">98%</div>
      <div className="stat-label">Customer Satisfaction</div>
    </div>
    <div className="stat-card">
      <div className="stat-value">5 minutes</div>
      <div className="stat-label">Average Response Time</div>
    </div>
  </div>
</div>

              </motion.div>
            )}

            {/* صفحة الأوامر السريعة */}
         {activeTab === 'commands' && (
  <motion.div
    className="commands-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="page-header">
      <h2>Quick Commands</h2>
      <p>Use these commands for fast responses</p>
    </div>

    <div className="commands-grid">
      {quickCommands.map((cmd, index) => (
        <motion.div
          key={index}
          className="command-card"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setActiveTab('chat');
            sendQuickCommand(cmd.command);
          }}
        >
          <div className="command-icon">
            <BsLightning />
          </div>
          <div className="command-content">
            <h3>{cmd.command}</h3>
            <p>{cmd.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </motion.div>
)}

{/* Security & Privacy Page */}
{activeTab === 'security' && (
  <motion.div
    className="security-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="page-header">
      <h2>Security & Privacy Center</h2>
      <p>Learn about our policies to protect your data</p>
    </div>

    <div className="security-grid">
      {securityPolicies.map((policy, index) => (
        <div key={index} className="policy-card">
          <div className="policy-icon">
            <BsShieldCheck />
          </div>
          <div className="policy-content">
            <h3>{policy.title}</h3>
            <p>{policy.content}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="security-tips">
      <h3>Security Tips</h3>
      <ul>
        <li>Do not share your login details with anyone</li>
        <li>Use strong passwords and change them regularly</li>
        <li>Make sure to log out from shared devices</li>
        <li>Report any suspicious activity to us immediately</li>
      </ul>
    </div>
  </motion.div>
)}


            {/* صفحة المساعدة */}
        {activeTab === 'help' && (
  <motion.div
    className="help-page"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="page-header">
      <h2>Help Center</h2>
      <p>How can we assist you?</p>
    </div>

    <div className="faq-section">
      <div className="faq-item">
        <h3>How do I start a conversation?</h3>
        <p>Click the chat button in the sidebar and start typing your message. You will be immediately replied to by our smart assistant.</p>
      </div>

      <div className="faq-item">
        <h3>What are the support hours?</h3>
        <p>The smart assistant service is available 24/7. To contact the human support team, please use the contact form.</p>
      </div>

      <div className="faq-item">
        <h3>How do I save my conversations?</h3>
        <p>Conversations are automatically saved in your record and can be accessed anytime through the "Conversation History" section.</p>
      </div>

      <div className="faq-item">
        <h3>Are the chats secure?</h3>
        <p>Yes, all your chats are encrypted and subject to our privacy and security policies.</p>
      </div>
    </div>

    <div className="contact-support">
      <h3>Contact Support</h3>
      <p>If you need further assistance, feel free to contact us:</p>
      <div className="contact-methods">
        <div className="contact-method">
          <BsQuestionCircle className="contact-icon" />
          <span>support@example.com</span>
        </div>
        <div className="contact-method">
          <BsQuestionCircle className="contact-icon" />
          <span>+966 12 345 6789</span>
        </div>
      </div>
    </div>
  </motion.div>
)}

          </AnimatePresence>
        </div>
      </div>

      {/* أنماط CSS */}
      <style jsx>{`
        /* الأنماط الأساسية */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        .app-container {
          display: flex;
          height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f5f7fa;
          overflow: hidden;
        }
        
        /* أنماط الشريط الجانبي */
        .sidebar {
          width: 280px;
          height: 100%;
          background: linear-gradient(135deg, #2c3e50 0%, #1a1a2e 100%);
          color: white;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 100;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar-header {
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .sidebar-logo {
          font-size: 24px;
          color: #667eea;
        }
        
        .sidebar-header h2 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        
        .sidebar-toggle {
          background: transparent;
          border: none;
          color: white;
          font-size: 20px;
          margin-left: auto;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s;
        }
        
        .sidebar-toggle:hover {
          opacity: 1;
        }
        
        .sidebar-menu {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }
        
        .menu-item {
          width: 100%;
          padding: 12px 20px;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.8);
          display: flex;
          align-items: center;
          gap: 12px;
          text-align: right;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: white;
        }
        
        .menu-item.active {
          background: rgba(102, 126, 234, 0.2);
          color: white;
          border-right: 3px solid #667eea;
        }
        
        .menu-icon {
          font-size: 16px;
        }
        
        .badge {
          background-color: #667eea;
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          margin-right: auto;
        }
        
        .menu-section {
          margin-top: 30px;
          padding: 0 20px;
        }
        
        .section-title {
          display: block;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        
        .sidebar-footer {
          padding: 15px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
        }
        
        .avatar {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
        }
        
        .user-info {
          display: flex;
          flex-direction: column;
        }
        
        .username {
          font-size: 14px;
          font-weight: 500;
        }
        
        .user-email {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
        }
        
        .logout-btn {
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 18px;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .logout-btn:hover {
          color: white;
        }
        
        /* أنماط المحتوى الرئيسي */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .top-bar {
          height: 60px;
          background: white;
          display: flex;
          align-items: center;
          padding: 0 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          z-index: 10;
        }
        
        .menu-toggle {
          background: transparent;
          border: none;
          font-size: 20px;
          color: #555;
          cursor: pointer;
          margin-right: 15px;
        }
        
        .search-bar {
          flex: 1;
          max-width: 500px;
        }
        
        .search-bar input {
          width: 100%;
          padding: 8px 15px;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          outline: none;
          transition: all 0.3s;
        }
        
        .search-bar input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .top-bar-actions {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-left: 20px;
        }
        
        .action-btn {
          background: transparent;
          border: none;
          font-size: 18px;
          color: #555;
          cursor: pointer;
          transition: color 0.2s;
        }
        
        .action-btn:hover {
          color: #667eea;
        }
        
        .notifications {
          position: relative;
          cursor: pointer;
        }
        
        .notifications .badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background-color: #ff4757;
          color: white;
          font-size: 10px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .page-content {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          background-color: #f5f7fa;
        }
        
        .page-header {
          margin-bottom: 30px;
        }
        
        .page-header h2 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 5px;
        }
        
        .page-header p {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        /* أنماط صفحة المحادثة */
        .chat-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
        }
        
        .chat-messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background-color: #f8f9fa;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .message {
          max-width: 70%;
          align-self: flex-start;
        }
        
        .message.user {
          align-self: flex-end;
        }
        
        .message-content {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        
        .message-icon {
          font-size: 18px;
          margin-top: 2px;
          color: #7f8c8d;
        }
        
        .message.user .message-icon {
          color: #667eea;
        }
        
        .message-text {
          padding: 12px 16px;
          border-radius: 18px;
          background-color: white;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          font-size: 14px;
          line-height: 1.5;
          color: #333;
        }
        
        .message.user .message-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .message.bot .message-text {
          border-bottom-left-radius: 4px;
        }
        
        .chat-input-container {
          display: flex;
          padding: 15px;
          background-color: white;
          border-top: 1px solid #e9ecef;
        }
        
        .chat-input {
          flex: 1;
          padding: 12px 15px;
          border: 1px solid #e9ecef;
          border-radius: 24px;
          outline: none;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .chat-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        
        .send-button {
          width: 48px;
          height: 48px;
          margin-left: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .send-button:disabled {
          background: #e9ecef;
          color: #adb5bd;
          cursor: not-allowed;
        }
        
        .send-icon {
          font-size: 18px;
        }
        
        .typing-indicator {
          display: flex;
          align-items: center;
          height: 20px;
        }
        
        .typing-indicator span {
          width: 8px;
          height: 8px;
          margin: 0 2px;
          background-color: #7f8c8d;
          border-radius: 50%;
          display: inline-block;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .typing-indicator span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-indicator span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        /* أنماط الصفحة الرئيسية */
        .cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .card-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 15px;
          color: white;
        }
        
        .card-icon.blue {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .card-icon.purple {
          background: linear-gradient(135deg, #9f7aea 0%, #6b46c1 100%);
        }
        
        .card-icon.green {
          background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
        }
        
        .card h3 {
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 18px;
        }
        
        .card p {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        .stats-section {
          margin-top: 40px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .stats-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 18px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }
        
        .stat-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          text-align: center;
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #667eea;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #7f8c8d;
        }
        
        /* أنماط صفحة الأوامر السريعة */
        .commands-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 20px;
        }
        
        .command-card {
          background: white;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 15px;
          transition: all 0.3s;
        }
        
        .command-card:hover {
          background: #f8f9fa;
        }
        
        .command-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #9f7aea 0%, #6b46c1 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }
        
        .command-content {
          flex: 1;
        }
        
        .command-content h3 {
          color: #2c3e50;
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .command-content p {
          color: #7f8c8d;
          font-size: 13px;
        }
        
        /* أنماط صفحة الأمان والخصوصية */
        .security-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .policy-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: flex-start;
          gap: 15px;
        }
        
        .policy-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #48bb78 0%, #2f855a 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
          flex-shrink: 0;
        }
        
        .policy-content h3 {
          color: #2c3e50;
          font-size: 16px;
          margin-bottom: 8px;
        }
        
        .policy-content p {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        .security-tips {
          margin-top: 30px;
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .security-tips h3 {
          color: #2c3e50;
          font-size: 18px;
          margin-bottom: 15px;
        }
        
        .security-tips ul {
          padding-left: 20px;
        }
        
        .security-tips li {
          margin-bottom: 10px;
          color: #7f8c8d;
        }
        
        /* أنماط صفحة المساعدة */
              /* أنماط صفحة المساعدة */
          .faq-section {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          }

          .faq-section h3 {
            color: #2c3e50;
            font-size: 18px;
            margin-bottom: 15px;
          }

          .faq-item {
            margin-bottom: 20px;
          }

          .faq-item h4 {
            color: #2c3e50;
            font-size: 16px;
            margin-bottom: 5px;
          }

          .faq-item p {
            color: #7f8c8d;
            font-size: 14px;
          }

          .faq-item button {
            background: transparent;
            border: 1px solid #667eea;
            padding: 8px 16px;
            border-radius: 4px;
            color: #667eea;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s;
          }

          .faq-item button:hover {
            background-color: #667eea;
            color: white;
          }

          /* أنماط التنقل في الشريط العلوي */
          .top-bar-navigation {
            display: flex;
            gap: 20px;
            align-items: center;
            margin-right: 30px;
          }

          .nav-item {
            font-size: 16px;
            color: #555;
            cursor: pointer;
            transition: all 0.3s;
          }

          .nav-item:hover {
            color: #667eea;
          }

          .nav-item.active {
            font-weight: 600;
            color: #667eea;
          }

          /* أنماط الشريط الجانبي المتجاوب */
          @media (max-width: 768px) {
            .app-container {
              flex-direction: column;
            }

            .sidebar {
              width: 100%;
              height: auto;
              box-shadow: none;
              position: relative;
            }

            .main-content {
              flex: 1;
            }

            .sidebar-header {
              padding: 15px;
            }

            .sidebar-menu {
              padding: 10px 0;
            }

            .menu-item {
              padding: 10px 15px;
            }

            .sidebar-footer {
              display: none;
            }

            .top-bar {
              padding: 10px;
            }

            .search-bar input {
              padding: 8px 10px;
            }

            .top-bar-actions {
              display: none;
            }
          }

          @media (max-width: 576px) {
            .top-bar {
              display: none;
            }

            .sidebar {
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              height: 100vh;
              z-index: 999;
              transform: translateX(-100%);
              transition: transform 0.3s ease-in-out;
            }

            .sidebar.show {
              transform: translateX(0);
            }

            .sidebar-toggle {
              display: block;
              position: absolute;
              top: 20px;
              left: 20px;
              z-index: 1000;
            }
          }
      `}</style>
    </div>
  )
}


export default LexV2Chat;
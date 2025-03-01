// import React from 'react';
// import './ChatbotConversation.css';

// const ChatbotConversation = ({ conversation, options=[], conversationEndRef, isTyping, handleOptionClick, disabledOptions = new Set() }) => (
//     <div className="chatbot-conversation">
//         {conversation.map(({ text, isBot, options }, index) => (
//             <div key={index}>
//                 <div className={`chatbot-message ${isBot ? 'bot' : 'user'}`}>
//                     <i className={`icon ${isBot ? 'fas fa-robot' : 'fas fa-user'}`}></i>
//                     {text}
//                 </div>
//                 {isBot && options && options.length > 0 && (
//                     <div className="chatbot-options">
//                         {options.map((option, i) => (
//                             <button
//                                 key={i}
//                                 className="chatbot-option-button"
//                                 onClick={() => handleOptionClick(option)}
//                                 disabled={disabledOptions.has(option)}
//                             >
//                                 {option}
//                             </button>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         ))}
//         <div ref={conversationEndRef} />
//         {isTyping && (
//             <div className="typing">
//                 <div className="typing-indicator"></div>
//                 <div className="typing-indicator"></div>
//                 <div className="typing-indicator"></div>
//             </div>
//         )}
//     </div>
// );

// export default ChatbotConversation;


import React from 'react';
import './ChatbotConversation.css';

const ChatbotConversation = ({ conversation, options = [], conversationEndRef, isTyping, handleOptionClick, disabledOptions = new Set() }) => (
    <div className="chatbot-conversation">
        {conversation.map(({ text, isBot, options }, index) => (
            <div key={index}>
                <div className={`chatbot-message ${isBot ? 'bot' : 'user'}`}>
                    <i className={`icon ${isBot ? 'fas fa-robot' : 'fas fa-user'}`}></i> {/* Icon class based on isBot */}
                    {text}
                </div>
                {isBot && options?.length > 0 && (
                    <div className="chatbot-options">
                        {options.map((option, i) => (
                            <button
                                key={i}
                                className="chatbot-option-button"
                                onClick={() => handleOptionClick(option)}
                                disabled={disabledOptions?.has(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        ))}
        <div ref={conversationEndRef} />
        {isTyping && (
            <div className="typing">
                <div className="typing-indicator"></div>
                <div className="typing-indicator"></div>
                <div className="typing-indicator"></div>
            </div>
        )}
    </div>
);

export default ChatbotConversation;

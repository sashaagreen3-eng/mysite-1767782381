class CustomMessagesArea extends HTMLElement {
    constructor() {
        super();
        this.messages = [];
        this.contact = null;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
        this.bindEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .messages-area {
                    flex: 1;
                    background: #f8fafc;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .message {
                    max-width: 70%;
                    padding: 0.75rem 1rem;
                    border-radius: 1rem;
                    position: relative;
                    animation: slideIn 0.3s ease-out;
                }

                .own-message {
                    align-self: flex-end;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-bottom-right-radius: 0.25rem;
                }

                .other-message {
                    align-self: flex-start;
                    background: white;
                    color: #1f2937;
                    border: 1px solid #e5e7eb;
                    border-bottom-left-radius: 0.25rem;
                }

                .message-text {
                    word-wrap: break-word;
                    line-height: 1.4;
                }

                .message-time {
                    font-size: 0.75rem;
                    margin-top: 0.25rem;
                }

                .own-message .message-time {
                    color: rgba(255, 255, 255, 0.8);
                    text-align: right;
                }

                .other-message .message-time {
                    color: #9ca3af;
                }

                .no-messages {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #6b7280;
                }

                .no-messages-icon {
                    margin-bottom: 1rem;
                    color: #d1d5db;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @media (max-width: 768px) {
                    .message {
                        max-width: 85%;
                    }
                    
                    .messages-area {
                        padding: 0.75rem;
                    }
                }
            </style>

            <div class="messages-area" id="messages-container">
                ${this.renderMessages()}
            </div>
        `;
    }

    renderMessages() {
        if (!this.contact) {
            return `
                <div class="no-messages">
                    <i data-feather="message-circle" width="48" height="48" class="no-messages-icon"></i>
                    <p>Выберите контакт для начала переписки</p>
                </div>
            `;
        }

        if (this.messages.length === 0) {
            return `
                <div class="no-messages">
                    <i data-feather="send" width="48" height="48" class="no-messages-icon"></i>
                    <p>Начните переписку!</p>
                </div>
            `;
        }

        return this.messages.map(message => `
            <div class="message ${message.isOwn ? 'own-message' : 'other-message'} message-animation">
                <div class="message-text">${message.text}</div>
                <div class="message-time">${formatTime(message.timestamp)}</div>
            </div>
        `).join('');
    }

    bindEvents() {
        // Scroll to bottom when new messages arrive
        this.shadowRoot.getElementById('messages-container').addEventListener('DOMNodeInserted', () => {
            this.scrollToBottom();
        });
    }

    scrollToBottom() {
        const container = this.shadowRoot.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    updateMessages(contact, messages) {
        this.contact = contact;
        this.messages = messages;
        this.render();
        this.scrollToBottom();
    }

    addMessage(message) {
        this.messages.push(message);
        this.render();
        this.scrollToBottom();
    }
}

customElements.define('custom-messages-area', CustomMessagesArea);

// Listen for messages
document.addEventListener('contactSelected', (e) => {
    const messagesArea = document.querySelector('custom-messages-area');
    if (messagesArea) {
        messagesArea.updateMessages(e.detail.contact, e.detail.messages);
});

document.addEventListener('newMessage', (e) => {
    const messagesArea = document.querySelector('custom-messages-area');
    if (messagesArea) {
        messagesArea.addMessage(e.detail.message);
    }
});
class CustomChatHeader extends HTMLElement {
    constructor() {
        super();
        this.contact = null;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .chat-header {
                    background: white;
                    border-bottom: 1px solid #e5e7eb;
                    padding: 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .contact-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                }

                .contact-info {
                    flex: 1;
                }

                .contact-name {
                    font-weight: 600;
                    color: #1f2937;
                    font-size: 1.125rem;
                }

                .contact-status {
                    font-size: 0.875rem;
                    color: #6b7280;
                }

                .online {
                    color: #10b981;
                }

                .header-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .action-btn {
                    background: none;
                    border: none;
                    color: #6b7280;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .action-btn:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                @media (max-width: 768px) {
                    .chat-header {
                        padding: 1rem;
                    }
                }
            </style>

            <div class="chat-header">
                ${this.contact ? `
                    <img src="${this.contact.avatar}" alt="${this.contact.name}" class="contact-avatar">
                    <div class="contact-info">
                        <div class="contact-name">${this.contact.name}</div>
                        <div class="contact-status ${this.contact.online ? 'online' : ''}">
                            ${this.contact.online ? 'В сети' : 'Не в сети'}
                        </div>
                    </div>
                    
                    <div class="header-actions">
                        <button class="action-btn" id="call-btn">
                            <i data-feather="phone"></i>
                        </button>
                        <button class="action-btn" id="video-btn">
                            <i data-feather="video"></i>
                        </button>
                        <button class="action-btn" id="info-btn">
                            <i data-feather="info"></i>
                        </button>
                    </div>
                ` : `
                    <div class="contact-info">
                        <div class="contact-name">Выберите контакт</div>
                `}
            </div>
        `;
        feather.replace();
    }

    updateContact(contact) {
        this.contact = contact;
        this.render();
    }
}

customElements.define('custom-chat-header', CustomChatHeader);

// Listen for contact selection
document.addEventListener('contactSelected', (e) => {
    const chatHeader = document.querySelector('custom-chat-header');
    if (chatHeader) {
        chatHeader.updateContact(e.detail.contact);
});
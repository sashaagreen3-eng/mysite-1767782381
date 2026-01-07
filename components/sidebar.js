class CustomSidebar extends HTMLElement {
    constructor() {
        super();
        this.contacts = [];
        this.selectedContact = null;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
        this.bindEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .sidebar {
                    width: 320px;
                    background: white;
                    border-right: 1px solid #e5e7eb;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .sidebar-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e5e7eb;
                }

                .search-container {
                    position: relative;
                }

                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 0.75rem;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }

                .search-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                }

                .contacts-list {
                    flex: 1;
                    overflow-y: auto;
                    padding: 0.5rem;
                }

                .contact-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem;
                    border-radius: 0.75rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    margin-bottom: 0.25rem;
                }

                .contact-item:hover {
                    background: #f3f4f6;
                }

                .contact-item.selected {
                    background: #e0e7ff;
                    border-left: 3px solid #667eea;
                }

                .contact-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    position: relative;
                }

                .online-indicator {
                    position: absolute;
                    bottom: 2px;
                    right: 2px;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border: 2px solid white;
                    border-radius: 50%;
                }

                .contact-info {
                    flex: 1;
                    min-width: 0;
                }

                .contact-name {
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 0.25rem;
                }

                .last-message {
                    font-size: 0.875rem;
                    color: #6b7280;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .contact-meta {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.25rem;
                }

                .message-time {
                    font-size: 0.75rem;
                    color: #9ca3af;
                }

                .unread-count {
                    background: #667eea;
                    color: white;
                    font-size: 0.75rem;
                    padding: 0.125rem 0.5rem;
                    border-radius: 1rem;
                    min-width: 1.25rem;
                    text-align: center;
                }

                @media (max-width: 768px) {
                    .sidebar {
                        width: 280px;
                    }
                }

                @media (max-width: 640px) {
                    .sidebar {
                        width: 100%;
                        position: absolute;
                        z-index: 40;
                    }
                }
            </style>

            <div class="sidebar">
                <div class="sidebar-header">
                    <div class="search-container">
                        <i data-feather="search" class="search-icon"></i>
                        <input type="text" 
                               placeholder="Поиск контактов..." 
                               class="search-input">
                    </div>
                </div>
                
                <div class="contacts-list" id="contacts-list">
                    ${this.renderContacts()}
                </div>
            </div>
        `;
        feather.replace();
    }

    renderContacts() {
        if (this.contacts.length === 0) {
            return '<div class="text-center text-gray-500 py-8">Контакты не найдены</div>';
        }

        return this.contacts.map(contact => `
            <div class="contact-item ${this.selectedContact?.id === contact.id ? 'selected' : ''}" 
                 data-contact-id="${contact.id}">
                <div class="contact-avatar">
                    <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
                    ${contact.online ? '<div class="online-indicator"></div>' : ''}
                </div>
                
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="last-message">${contact.lastMessage}</div>
                </div>
                
                <div class="contact-meta">
                    <div class="message-time">${formatTime(new Date())}</div>
                    ${contact.unread > 0 ? `<div class="unread-count">${contact.unread}</div>` : ''}
                </div>
            </div>
        `).join('');
    }

    bindEvents() {
        this.shadowRoot.querySelector('.search-input').addEventListener('input', debounce((e) => {
            this.filterContacts(e.target.value);
        }, 300));

        this.shadowRoot.getElementById('contacts-list').addEventListener('click', (e) => {
            const contactItem = e.target.closest('.contact-item');
            if (contactItem) {
                const contactId = parseInt(contactItem.dataset.contactId);
                const contact = this.contacts.find(c => c.id === contactId);
                if (contact) {
                    this.selectContact(contact);
                }
            }
        });
    }

    filterContacts(query) {
        const filtered = query ? this.contacts.filter(contact => 
            contact.name.toLowerCase().includes(query.toLowerCase()) ||
            contact.lastMessage.toLowerCase().includes(query.toLowerCase())
        ) : this.contacts;

        this.contacts = filtered;
        this.render();
    }

    selectContact(contact) {
        this.selectedContact = contact;
        this.render();
        document.dispatchEvent(new CustomEvent('contactSelected', { detail: { contact } }));
    }

    updateContacts(contacts) {
        this.contacts = contacts;
        this.render();
    }
}

customElements.define('custom-sidebar', CustomSidebar);

// Listen for contacts loaded
document.addEventListener('contactsLoaded', (e) => {
    const sidebar = document.querySelector('custom-sidebar');
    if (sidebar) {
        sidebar.updateContacts(e.detail.contacts);
    }
});
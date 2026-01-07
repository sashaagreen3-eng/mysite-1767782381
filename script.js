// Mock database for demonstration
const mockUsers = [
    { email: 'user@example.com', password: 'password123', name: 'Иван Петров', id: 1 },
    { email: 'test@test.com', password: 'test123', name: 'Мария Сидорова', id: 2 }
];

const mockContacts = [
    { id: 2, name: 'Мария Сидорова', email: 'test@test.com', lastMessage: 'Привет! Как дела?', unread: 2, online: true, avatar: 'http://static.photos/people/200x200/1' },
    { id: 3, name: 'Алексей Козлов', email: 'alex@example.com', lastMessage: 'Встречаемся в 18:00', unread: 0, online: false, avatar: 'http://static.photos/people/200x200/2' },
    { id: 4, name: 'Елена Васнецова', email: 'elena@example.com', lastMessage: 'Отправил файлы', unread: 1, online: true, avatar: 'http://static.photos/people/200x200/3' }
];

const mockMessages = {
    2: [
        { id: 1, senderId: 2, text: 'Привет! Как дела?', timestamp: new Date(Date.now() - 3600000), isOwn: false },
        { id: 2, senderId: 1, text: 'Привет! Всё отлично, спасибо!', timestamp: new Date(Date.now() - 3500000), isOwn: true },
        { id: 3, senderId: 2, text: 'Отлично! Хочешь встретиться завтра?', timestamp: new Date(Date.now() - 3400000), isOwn: false }
    ],
    3: [
        { id: 1, senderId: 3, text: 'Встречаемся в 18:00', timestamp: new Date(Date.now() - 86400000), isOwn: false },
        { id: 2, senderId: 1, text: 'Хорошо, буду вовремя', timestamp: new Date(Date.now() - 86000000), isOwn: true }
    ],
    4: [
        { id: 1, senderId: 4, text: 'Отправил файлы', timestamp: new Date(Date.now() - 7200000), isOwn: false },
        { id: 2, senderId: 1, text: 'Получил, спасибо!', timestamp: new Date(Date.now() - 7000000), isOwn: true }
    ]
};

class ChatApp {
    constructor() {
        this.currentUser = null;
        this.selectedContact = null;
        this.isRegisterMode = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
    }

    bindEvents() {
        // Auth form submission
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuth();
        });

        // Switch between login and register
        document.getElementById('switch-to-register').addEventListener('click', () => {
            this.toggleAuthMode();
        });

        // Logout
        document.addEventListener('logout', () => {
            this.logout();
        });

        // Contact selection
        document.addEventListener('contactSelected', (e) => {
            this.selectContact(e.detail.contact);
        });

        // Message sending
        document.addEventListener('sendMessage', (e) => {
            this.sendMessage(e.detail.text);
        });
    }

    toggleAuthMode() {
        this.isRegisterMode = !this.isRegisterMode;
        const form = document.getElementById('auth-form');
        const submitBtn = form.querySelector('button[type="submit"]');
        const switchText = document.querySelector('#switch-to-register').parentElement;

        if (this.isRegisterMode) {
            submitBtn.textContent = 'Зарегистрироваться';
            switchText.innerHTML = 'Уже есть аккаунт? <button id="switch-to-register" class="text-blue-500 hover:text-blue-700 font-medium">Войти</button>';
        } else {
            submitBtn.textContent = 'Войти';
            switchText.innerHTML = 'Нет аккаунта? <button id="switch-to-register" class="text-blue-500 hover:text-blue-700 font-medium">Зарегистрироваться</button>';
        }

        // Re-bind event for the new button
        document.getElementById('switch-to-register').addEventListener('click', () => {
            this.toggleAuthMode();
        });
    }

    handleAuth() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (this.isRegisterMode) {
            this.register(email, password);
        } else {
            this.login(email, password);
        }
    }

    login(email, password) {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            this.showChatScreen();
            this.showNotification('Успешный вход!', 'success');
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user } }));
        document.dispatchEvent(new CustomEvent('contactsLoaded', { detail: { contacts: mockContacts } }));
        this.selectContact(mockContacts[0]);
        this.updateUserStatus(true);
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        this.showNotification('Неверный email или пароль', 'error');
    }
}

register(email, password) {
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
        this.showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }

    // Create new user
    const newUser = {
        email,
        password,
        name: email.split('@')[0],
        id: Date.now()
    };

    mockUsers.push(newUser);
    this.currentUser = newUser;
    this.showChatScreen();
    this.showNotification('Аккаунт успешно создан!', 'success');
    document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user: newUser } }));
    document.dispatchEvent(new CustomEvent('contactsLoaded', { detail: { contacts: mockContacts } }));
    this.selectContact(mockContacts[0]);
    this.updateUserStatus(true);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
}

logout() {
    this.currentUser = null;
    this.selectedContact = null;
    this.updateUserStatus(false);
    localStorage.removeItem('currentUser');
    this.showAuthScreen();
    this.showNotification('Вы вышли из системы', 'info');
}

checkAuth() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        this.currentUser = JSON.parse(savedUser);
        this.showChatScreen();
        document.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { user: this.currentUser } }));
        document.dispatchEvent(new CustomEvent('contactsLoaded', { detail: { contacts: mockContacts } }));
        this.selectContact(mockContacts[0]);
    } else {
        this.showAuthScreen();
    }
}

showAuthScreen() {
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('chat-screen').classList.add('hidden');
}

showChatScreen() {
    document.getElementById('auth-screen').classList.add('hidden');
    document.getElementById('chat-screen').classList.remove('hidden');
}

selectContact(contact) {
    this.selectedContact = contact;
    const messages = mockMessages[contact.id] || [];
    document.dispatchEvent(new CustomEvent('contactSelected', { detail: { contact, messages } }));
}

sendMessage(text) {
    if (!text.trim() || !this.selectedContact) return;

    const newMessage = {
        id: Date.now(),
        senderId: this.currentUser.id,
        text: text.trim(),
        timestamp: new Date(),
        isOwn: true
    };

    // Add to mock database
    if (!mockMessages[this.selectedContact.id]) {
        mockMessages[this.selectedContact.id] = [];
    }
    mockMessages[this.selectedContact.id].push(newMessage);

    // Simulate reply after 1-3 seconds
    setTimeout(() => {
        const replies = [
            'Отлично!',
            'Интересно...',
            'Согласен с тобой',
            'Подумаю над этим',
            'Спасибо за информацию!'
        ];
        
        const replyMessage = {
            id: Date.now() + 1,
            senderId: this.selectedContact.id,
            text: replies[Math.floor(Math.random() * replies.length)],
            timestamp: new Date(),
            isOwn: false
        };

        mockMessages[this.selectedContact.id].push(replyMessage);
        document.dispatchEvent(new CustomEvent('newMessage', { detail: { message: replyMessage } }));
    }, 1000 + Math.random() * 2000);

    document.dispatchEvent(new CustomEvent('newMessage', { detail: { message: newMessage } }));
}

updateUserStatus(online) {
    // In real app, this would update user status on server
    console.log(`User ${this.currentUser?.email} is now ${online ? 'online' : 'offline'}`);
}

showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    
    notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-50`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

// Utility functions
function formatTime(date) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(date) {
    return date.toLocaleDateString('ru-RU', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
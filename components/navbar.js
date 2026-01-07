class CustomNavbar extends HTMLElement {
    constructor() {
        super();
        this.user = null;
    }

    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.render();
        this.bindEvents();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .navbar {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 0 1.5rem;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }

                .logo {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .user-name {
                    font-weight: 500;
                }

                .logout-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .logout-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                    .user-name {
                        display: none;
                    }
                    
                    .navbar {
                        padding: 0 1rem;
                    }
                }
            </style>

            <nav class="navbar">
                <div class="logo">
                    <i data-feather="message-circle"></i>
                    <span>ChatterBox</span>
                </div>
                
                <div class="user-info">
                    <span class="user-name">${this.user?.name || 'Пользователь'}</span>
                    <img class="avatar" src="http://static.photos/people/200x200/4" alt="Avatar">
                    <button class="logout-btn" id="logout-btn">
                        <i data-feather="log-out"></i>
                        Выйти
                    </button>
                </div>
            </nav>
        `;
        feather.replace();
    }

    bindEvents() {
        this.shadowRoot.getElementById('logout-btn').addEventListener('click', () => {
            document.dispatchEvent(new CustomEvent('logout'));
        });
    }

    updateUser(user) {
        this.user = user;
        this.render();
    }
}

customElements.define('custom-navbar', CustomNavbar);

// Listen for user login
document.addEventListener('userLoggedIn', (e) => {
    const navbar = document.querySelector('custom-navbar');
    if (navbar) {
        navbar.updateUser(e.detail.user);
    }
});
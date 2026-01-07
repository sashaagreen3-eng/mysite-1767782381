```javascript
class CustomMessageInput extends HTMLElement {
    constructor() {
        super();
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
                .message-input-container {
                    background: white;
                    border-top: 1px solid #e5e7eb;
                    padding: 1rem 1.5rem;
                }

                .input-wrapper {
                    display: flex;
                    gap: 0.75rem;
                    align-items: flex-end;
                }

                .message-input {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 1.5rem;
                    resize: none;
                    font-family: inherit;
                    font-size: 0.875rem;
                    line-height:
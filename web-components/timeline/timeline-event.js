class TimelineEvent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 15px;
                    border: 2px solid #ddd;
                    border-radius: 10px;
                    background: white;
                    transform: translateY(20px);
                    opacity: 0;
                    transition: all 0.5s ease;
                }
                :host(.visible) {
                    transform: translateY(0);
                    opacity: 1;
                }
                .year {
                    font-weight: bold;
                    color: #555;
                }
                .title {
                    margin: 5px 0;
                    font-size: 18px;
                    color: #333;
                }
                .content {
                    font-size: 14px;
                    color: #666;
                }
            </style>
            <div>
                <span class="year">${this.getAttribute('year')}</span>
                <div class="title">${this.getAttribute('title')}</div>
                <div class="content">
                    <slot></slot>
                </div>
            </div>
        `;
    }
}

customElements.define('timeline-event', TimelineEvent);

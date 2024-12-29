import { phone } from "../../data/phone.js";
import { sharedState } from "../../scripts/shared-state.js";

class TimelineContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.observer = null; // Intersection Observer instance
  }

  connectedCallback() {
    const item = phone.find(
      (item) => item.timelineId === this.getAttribute("data-timeline-id")
    );
    const id = item.timelineId;
    const imageUrl = item ? item.timelineId + ".png" : "";
    const description = item ? item.description : "";
    const year = item ? item.year : "";
    const highlight = item ? item.highlight : null;

    this.shadowRoot.innerHTML = `
    <style>
        :host {
            display: block;
            height: 100vh;
            padding: 20px;
            overflow: hidden;
            border: 1px solid white;
        }
        .timeline {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        }
        .image {
            width: 100px;
            aspect-ratio: 1;
        }
            .highlight {
                background: none;
                color: red;
                text-shadow: 0 0 4px #ff0000;
                font-size: 40px;
            }
        @media (min-width: 768px) {
            .timeline {
            }
        }
    </style>
    <section id="${id}" class="timeline">
        <timeline-image timelineId=${id}></timeline-image>
    </section>
    `;

    // Set up Intersection Observer
    this.initObserver(item);
  }

  initObserver(item) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: "0px",
      threshold: 0.4, // Trigger when 40% of the component is visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(item.timelineId);
          console.log(entry.target.getAttribute("data-timeline-id"));
          sharedState.setState("currentTimelineId", item.timelineId);
          // Trigger animation when the component enters view
          this.initAnimations(item.highlight, item.year, item.description);
        }
      });
    }, observerOptions);

    this.observer.observe(this);
  }

  initAnimations(highlight, year, description) {
    const elements = this.shadowRoot.querySelectorAll(".title");
    elements.forEach((el) => {
      el.style.transform = "translateX(0)";
    });

    anime({
      targets: elements,
      translateX: 270,
    });

    const yearSpan = this.shadowRoot.querySelectorAll(".timeline .year");
    anime({
      targets: yearSpan,
      innerText: [1900, year],
      round: 1,
      easing: "easeInOutExpo",
      duration: 1000,
    });
  }

  disconnectedCallback() {
    // Clean up observer when component is removed
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

customElements.define("timeline-container", TimelineContainer);

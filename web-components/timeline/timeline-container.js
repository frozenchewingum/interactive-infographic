import { phone } from "../../data/phone.js";
import { sharedState } from "../../scripts/shared-state.js";

class TimelineContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.observer = null; // Intersection Observer instance
    this.nameEl = null;
    this.descriptionComponent = null;
    this.directionAnim = null;
    this.opacityAnim = null;
    this.phone = phone.find(
      (item) => item.timelineId === this.getAttribute("data-timeline-id")
    );
  }

  connectedCallback() {
    const id = this.phone.timelineId;
    if(id === phone[0].timelineId) {
      this.scrollIntoView();
    }
    this.shadowRoot.innerHTML = `
    <style>
        :host {
            display: block;
            height: calc(100vh - 130px);
            padding: 10px;
            overflow: hidden;
            scroll-snap-align: start;
        }
        .timeline {
            width: 75%;
            height: 100%;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            margin: 0 auto;
            opacity: 0;
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

        @media (max-width: 600px) {
          :host {
          }
          .timeline {
            gap: 5px;
            width: 90%;
            justify-content: flex-start;
          }

          #name {
            font-size: 16px;
          }

        }
          
        @media (min-width: 601px) and (max-width: 1024px) {
          :host {
          }
          .timeline {
            gap: 10px;
            width: 85%;
            justify-content: flex-start;
          }
            
          #name {
            font-size: 16px;
          }
        }

    </style>
    <section id="${id}" class="timeline">
        <div id="name"></div>
        <timeline-image timelineId=${id}></timeline-image>
        <timeline-description timelineId=${id}></timeline-description>
    </section>
    `;

    // Set up Intersection Observer
    this.initObserver(this.phone);
    this.initListener();
    this.initAnimations();
  }

  initListener() {
    this.descriptionComponent = this.shadowRoot.querySelector(
      "timeline-description"
    );
    this.nameEl = this.shadowRoot.getElementById("name");
    const phoneName = this.phone.name;
    const timelineId = this.getAttribute("data-timeline-id");
    // Listen to reveal-phone event to reveal description
    this.addEventListener("reveal-phone", (event) => {
      if (timelineId === event.detail.timelineId) {
        this.descriptionComponent.reveal();
        var nameTyped = new Typed(this.nameEl, {
          strings: [phoneName],
          cursorChar: "",
          typeSpeed: 30
        })
      }
    });
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
          sharedState.setState("currentTimelineId", item.timelineId);
          // Trigger animation when the component enters view
          this.playAnimations();
        } else {
          // Reset animation when the component leaves view
          this.resetAnimations();
        }
      });
    }, observerOptions);

    this.observer.observe(this);
  }

  initAnimations() {
    const timelineId = this.getAttribute("data-timeline-id");
    const timelineContainerEl = this.shadowRoot.getElementById(timelineId);
    const randomNumber = Math.floor(Math.random() * 2);
    const direction = randomNumber === 1 ? "100%" : "-100%";
    timelineContainerEl.style.transform = `translateX(${direction})`;

    this.directionAnim = anime({
      targets: timelineContainerEl,
      translateX: [
        { value: direction, duration: 250 },
        { value: "0%", duration: 500 },
      ],
      easing: "easeInOutQuad",
      autoplay: false
    });

    this.opacityAnim = anime({
      targets: timelineContainerEl,
      opacity: [
        { value: 0, duration: 250 },
        { value: 0.5, duration: 500 },
        { value: 1, duration: 500 },
      ],
      autoplay: false
    });
  }

  playAnimations() {
    if(this.directionAnim) {
      this.directionAnim.play();
    }
    if(this.opacityAnim) {
      this.opacityAnim.play();
    }
  }

  resetAnimations() {
    if(this.directionAnim) {
      this.directionAnim.reset();
    }
    if(this.opacityAnim) {
      this.opacityAnim.reset();
    }
  }

  disconnectedCallback() {
    // Clean up observer when component is removed
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

customElements.define("timeline-container", TimelineContainer);

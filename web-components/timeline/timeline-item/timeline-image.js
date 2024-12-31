import { sharedState } from "../../../scripts/shared-state.js";
class TimelineImage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    var timelineId = this.getAttribute("timelineId");
    this.shadowRoot.innerHTML = `
        <style>
         :host {
         }

         #image {
            height: 40vh;
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            mask-image: url('/assets/images/phones/${timelineId}.png');
            background-color: #1a1b1b;
            mask-size: contain;
            mask-repeat: no-repeat;
            mask-position: center;
            cursor: pointer;
         }

         #image.revealed {
            mask: none;
            background-color: transparent;
            background-image: url('/assets/images/phones/${timelineId}.png');
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
            cursor: unset;
         }

         #question {
            transform-origin: center bottom;
            font-size: 26px;
         }

         #question.hide {
            display: none;
         }


        </style>
        <div id="image">
            <span id="question">?</span>
            <span></span>
        </div>
              `;

    this.initListener();
  }

  initListener() {
    var timelineId = this.getAttribute("timelineId");
    var isRevealed = false;
    const imageEl = this.shadowRoot.getElementById("image");
    const questionEl = this.shadowRoot.getElementById("question");
    const component = this;
    var animation = anime({
      targets: questionEl,
      rotateZ: [0, 30, -30, 30, -30, 0],
      loop: true,
      duration: 1500,
      autoplay: false,
      easing: "easeInOutSine",
    });

    var revealImageMovementAnimation = anime({
      targets: imageEl,
      translateX: [
        { value: 0, duration: 150 },
        { value: -5, duration: 150 },
        { value: 5, duration: 150 },
        { value: -5, duration: 150 },
        { value: 5, duration: 150 },
        { value: 0, duration: 150 },
      ],
      loop: true,
      easing: "easeInOutSine",
      autoplay: false,
    });

    var revealImageBackgroundAnimation = anime({
      targets: imageEl,
      backgroundColor: ["#1a1b1b", "#fff"],
      duration: 2000,
      easing: "easeInOutSine",
      autoplay: false,
      complete: function (anim) {
        if (anim.completed) {
          imageEl.classList.add("revealed");
          imageEl.style.backgroundColor = "transparent";
          revealImageMovementAnimation.reset();
          component.dispatchEvent(
            new CustomEvent("reveal-phone", {
              detail: { timelineId: timelineId },
              bubbles: true,
              composed: true,
            })
          );
        }
      },
    });

    imageEl.addEventListener("mouseover", (event) => {
      animation.play();
    });
    imageEl.addEventListener("mouseleave", (event) => {
      animation.reset();
    });

    imageEl.addEventListener("click", (event) => {
      if (isRevealed) return;
      questionEl.classList.add("hide");
      revealImageMovementAnimation.play();
      revealImageBackgroundAnimation.play();
      isRevealed = true;
    });
  }

}

customElements.define("timeline-image", TimelineImage);

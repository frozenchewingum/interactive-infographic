import { phone } from "../../../data/phone.js";
class TimelineDescription extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.timelineId = this.getAttribute("timelineId");
    this.phone = phone.find((item) => item.timelineId === this.timelineId);
    this.descriptionTyped = null;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
         :host {
            width: 100%;
          }
         .glow {
            display: inline-block;
            text-shadow: 0 0 2px rgba(255, 0, 128, 1), 0 0 5px rgba(255, 0, 128, 1), 0 0 10px rgba(255, 0, 128, 1), 0 0 15px rgba(255, 0, 128, 1), 0 0 20px rgba(255, 0, 128, 1);
          }

          #wrapper {
            display: block;
            text-align: center;
          }

          #highlight {
            display: block;
            text-align: center;
            width: 37.5px;
            transition: width 5s ease;
          }

        #highlight:not(.revealed) {
            cursor: pointer;
        }

        #highlight:not(.revealed):hover {
            font-weight: bold;
        }

        </style>
        <div id="wrapper">
          <span id="description">
              [?]
          </span>
        </div>
              `;
  }

  reveal() {
    const descriptionEl = this.shadowRoot.getElementById("description");
    const wrapperEl = this.shadowRoot.getElementById("wrapper");
    const component = this;
    const highlightElWidth = this.calculateTextWidth(this.phone.highlight);

    if (this.phone) {
      const highlightValue = this.phone.highlight;
      this.descriptionTyped = new Typed(descriptionEl, {
        strings: [this.phone.description],
        cursorChar: "_",
        typeSpeed: 1,
        onBegin: function () {
          wrapperEl.style.textAlign = "justify";
        },
        onStringTyped: function (pos, self) {
          descriptionEl.nextSibling.style.display = "none";
          const highlightEl = component.shadowRoot.getElementById("highlight");
          highlightEl.style.width = highlightElWidth + "px";
          const glowEl = component.shadowRoot.querySelector(".glow");

          anime({
            targets: glowEl,
            textShadow: [
              "0 0 2px rgba(255, 0, 128, 1), 0 0 0px rgba(255, 0, 128, 1), 0 0 5px rgba(255, 0, 128, 1), 0 0 7px rgba(255, 0, 128, 1), 0 0 10px rgba(255, 0, 128, 1)",
              "0 0 2px rgba(255, 0, 128, 1), 0 0 5px rgba(255, 0, 128, 1), 0 0 10px rgba(255, 0, 128, 1), 0 0 15px rgba(255, 0, 128, 1), 0 0 20px rgba(255, 0, 128, 1)",
              "0 0 5px rgba(255, 0, 128, 1), 0 0 10px rgba(255, 0, 128, 1), 0 0 20px rgba(255, 0, 128, 1), 0 0 30px rgba(255, 0, 128, 1), 0 0 40px rgba(255, 0, 128, 1)", // Glowing effect
              "0 0 2px rgba(255, 0, 128, 1), 0 0 5px rgba(255, 0, 128, 1), 0 0 10px rgba(255, 0, 128, 1), 0 0 15px rgba(255, 0, 128, 1), 0 0 20px rgba(255, 0, 128, 1)",
              "0 0 2px rgba(255, 0, 128, 1), 0 0 0px rgba(255, 0, 128, 1), 0 0 5px rgba(255, 0, 128, 1), 0 0 7px rgba(255, 0, 128, 1), 0 0 10px rgba(255, 0, 128, 1)",
            ],
            duration: 1500,
            easing: "easeInOutQuad",
            loop: true,
          });

          highlightEl.addEventListener("click", (event) => {
            if (!event.currentTarget.classList.contains("revealed")) {
              if (isNaN(highlightValue)) {
                var highlightTyped = new Typed(highlightEl, {
                  strings: [highlightValue],
                  cursorChar: "",
                  typeSpeed: 30,
                  onBegin: function () {
                    highlightEl.style.textAlign = "justify";
                  },
                  onStringTyped: function (pos, self) {
                    highlightEl.classList.add("revealed");
                    highlightEl.nextSibling.style.display = "none";
                    anime.remove(glowEl);
                  },
                });
              } else {
                anime({
                  targets: highlightEl,
                  innerText: ["0", highlightValue],
                  round: 1,
                  duration: 1000,
                  easing: "easeInOutExpo",
                  complete: function (anim) {
                    highlightEl.classList.add("revealed");
                    anime.remove(glowEl);
                  },
                });
              }
            }
          });
        },
      });
    }
  }

  calculateTextWidth(text, fontSize = "20px", fontFamily = "DevilChildren") {
    // Create a canvas element
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set the font properties
    context.font = `${fontSize} ${fontFamily}`;

    // Measure the text width
    const metrics = context.measureText(text);

    return metrics.width; // Returns the width of the text
  }
}

customElements.define("timeline-description", TimelineDescription);

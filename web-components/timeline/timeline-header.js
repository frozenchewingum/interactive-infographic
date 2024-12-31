import { phone } from "../../data/phone.js";
import { sharedState } from "../../scripts/shared-state.js";
class TimelineHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.observer = null; // Intersection Observer instance
  }

  connectedCallback() {    
    this.shadowRoot.innerHTML = `
        <style>
         :host {
        }
         header {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background-color: #1a1b1b;
            color: white;
            padding: 20px;
            text-align: center;
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center; 
            }
        
           header.minimized {
            padding: 10px;
            height: 90px;
            background-color: #0a0a0a;
          }

        #currentTimeline {
            display: none;
            font-size: 32px;
        }

        #currentTimeline.show {
            display: block;
        }

        </style>
        <header>
            <span id="header-content">
                <span id="header-title"></span>
                <span id="year-range">
                    <span id="year-from"></span>
                    <span id="year-to"></span>
                </span>
            </span>
            <span id="currentTimeline"></span>
        </header>
              `;

    this.initHeaderAnimation();
  }

  initListener() {
    const currentTimelineEl = this.shadowRoot.getElementById("currentTimeline");
    sharedState.addListener((state) => {
        if(state.currentTimelineId !== '' && state.currentTimelineId !== undefined) {
            var currentYear = phone.find((item) => item.timelineId === state.currentTimelineId).year;
            currentTimelineEl.classList.add('show');
            anime({
                targets: currentTimelineEl,
                innerText: [currentYear],
                round: 1,
                easing: "easeInOutExpo",
                duration: 2000,
              });
        } else {  
            currentTimelineEl.classList.remove('show');
        }
    });
  }

  initScrollListener() {
    const header = this.shadowRoot.querySelector("header");
    const appContainer = document.getElementById("app-container");
    const headerContentEl = this.shadowRoot.getElementById("header-content");
    let lastScrollPosition = 0;
    window.addEventListener("scroll", () => {
      const currentScrollPosition = window.scrollY;
      if (currentScrollPosition > 130) {
        // Minimize the header when scrolling down past 100px
        header.classList.add("minimized");
        appContainer.classList.add("minimized");
        document.body.classList.add("minimized");
        document.documentElement.style.scrollSnapType = 'y mandatory';
        document.documentElement.style.scrollPaddingTop = '110px';
        anime({
          targets: headerContentEl,
          fontSize: "14px",
          easing: "easeInOutQuad",
          duration: 500,
        });
      } else if (currentScrollPosition <= 130) {
        // Restore the header when scrolling up or near the top
        header.classList.remove("minimized");
        appContainer.classList.remove("minimized");
        document.body.classList.remove("minimized");
        document.documentElement.style.scrollSnapType = '';
        document.documentElement.style.scrollPaddingTop = '';
        // reset current timeline id
        sharedState.setState("currentTimelineId", ''); 
        anime({
          targets: headerContentEl,
          fontSize: "26px",
          easing: "easeInOutQuad",
          duration: 500,
        });
      }
    });
  }

  initHeaderAnimation() {
    const component = this;
    const headerTitleEl = this.shadowRoot.getElementById("header-title");
    const yearFromEl = this.shadowRoot.getElementById("year-from");
    const yearToEl = this.shadowRoot.getElementById("year-to");
    const firstPhone = phone[0];
    const lastPhone = phone[phone.length-1];
    // Animating from title > year from > year to using typed js and anime js
    var headerTitleTyped = new Typed(headerTitleEl, {
      strings: ["The Evolution of Mobile Phones"],
      cursorChar: "_",
      typeSpeed: 50,
      onStringTyped: function () {
        headerTitleEl.nextSibling.style.display = "none";
        var yearFromTyped = new Typed(yearFromEl, {
          strings: ["1900"],
          cursorChar: "_",
          typeSpeed: 50,
          onStringTyped: function () {
            yearFromEl.nextSibling.style.display = "none";
            anime({
              targets: yearFromEl,
              innerText: ["1900", firstPhone.year],
              round: 1,
              easing: "easeInOutExpo",
              duration: 1000,
              complete: function (anim) {
                if (anim.completed) {
                  var yearToTyped = new Typed(yearToEl, {
                    strings: [`- ${firstPhone.year}`],
                    cursorChar: "_",
                    typeSpeed: 50, 
                    onStringTyped: function () {
                      yearToEl.nextSibling.style.display = "none";
                      anime({
                        targets: yearToEl,
                        innerText: [`- ${firstPhone.year}`, `- ${lastPhone.year}`],
                        round: 1,
                        easing: "easeInOutExpo",
                        duration: 1000,
                        complete: function(anim) {
                          if(anim.completed) {
                            // enable scrolling
                            document.documentElement.style.overflow = 'overlay';
                            component.initScrollListener();
                            component.initListener();
                          }
                        }
                      });
                    },
                  });
                }
              },
            });
          },
        });
      },
    });
  }
}

customElements.define("timeline-header", TimelineHeader);

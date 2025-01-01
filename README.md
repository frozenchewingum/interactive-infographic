# Interactive Infographic

An interactive and visually engaging timeline that showcases the evolution of mobile phones from 1982 to 2018. Built using modern Web Components, this project demonstrates modular, reusable, and responsive design principles.

## Features

- **Custom Web Components**:
  - `timeline-header`: Animates the title and year as it scrolls through the timeline. The header will be minimized once scrolled down.
  - `timeline-container`: Represents individual events with sub-components such as `timeline-description` and `timeline-image`.
  - `timeline-description`: Reveals the description after the `timeline-image` is triggered to show. Also contains show/hide interactive functionality with the highlight data.
  - `timeline-image`: Animates the image from the project’s local folder, with interactive show/hide functionality.

- **Interactive Animations**:
  - Events slide and fade in as they appear in the viewport.

  - Text is animated using both Anime.js and Typed.js.

  - Interactable reveal animation:  
    Descriptions and images are revealed with smooth animations when interacted with.
 
- **Responsive Design**:
  - Optimized layout for mobile and desktop screens.

## Getting Started

### Prerequisites

To run this project, you need a local server to avoid CORS issues. Here are two recommended options:
1. Install [Node.js](https://nodejs.org/) and use `http-server`.
2. Use Python's built-in HTTP server.

### Installation

1. Clone the Repository:
   ```bash
   git clone https://github.com/your-username/timeline-webcomponents.git](https://github.com/frozenchewingum/interactive-infographic.git
   cd interactive-infographic

2. Start a Local Server:
   - Using `http-server` (Node.js):
     ```bash
     npx http-server
     ```
   - Using Live Server (Visual Studio Code Extension):
       1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) in Visual Studio Code.
       2. Right-click on `index.html` in the file explorer.
       3. Select **"Open with Live Server"**.
       4. Your browser will automatically open at the local server address (e.g., `http://127.0.0.1:5500`).


3. Open in Browser:
   Navigate to `http://localhost:8080` (Node.js) OR `http://127.0.0.1:5500` (Live Server) or the port displayed in your terminal.

## Usage

### Templatable Timeline

This project is designed to be fully templatable. You can define your timeline data in a separate JavaScript file and import it into the project to dynamically render the timeline.

### Example Data File

Create a file named `data.js` with the following structure:

```javascript
export const phone = [
  {
    timelineId: "1982-mobira-senator",
    name: "Nokia Mobira Senator",
    description: `Widely considered as the first true mobile phone available to consumers, the Mobira Senator (produced by Nokia) was probably more effort to use than it was worth. Weighing an incredible <span class="glow"><span id="highlight">[?]</span></span> kilograms, there’s no chance that you’d be able to carry one of these around all day. This pioneering mobile phone used a network called Nordic Mobile Telephony (NMT) Standard, part of the first generation (1G) of wireless cellular technology.`,
    year: 1982,
    highlight: 10,
    specifications: {},
  }
];
```

### Data Properties

- **`timelineId`**:  
  Unique ID for the section in the timeline (used for section anchors).

- **`name`**:  
  Display name for the timeline event.

- **`description`**:  
  A detailed description with an interactive `<span>` element for highlighting text. Example:
  ```html
  <span class="glow"><span id="highlight">[?]</span></span>
  ```
  Styling and content for this element can be customized.
  Interactivity is handled to show/hide details on click.

- **`highlight`**:  
  A numerical value that will be animated in the description.

- **`specifications`**:  
  Reserved for future enhancements like detailed specifications or additional metadata.

### Assumptions
- The `data.js` file is essential for the timeline functionality, as it contains the event data.
- Event Data must have attributes `timelineId`, `name`, `description`,`year` and `highlight`.
- Browser support for Web Components (modern browsers like Chrome, Edge, and Firefox).
  
### Limitations
- All events are hardcoded in the `data.js` file; they cannot be dynamically changed without modifying the code.
- No fallback for browsers without Web Component support.
- Static events unless dynamically updated via JavaScript.

### References
- [The Evolution of Mobile Phones](https://flauntdigital.com/blog/evolution-mobile-phones/#content_4)

### Demo
- [Live Demo](https://relaxed-khapse-928605.netlify.app/)

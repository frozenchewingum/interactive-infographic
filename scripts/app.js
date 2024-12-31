import { phone } from '../data/phone.js';

const createComponents = (data) => {
  const container = document.getElementById('app-container');
  data.forEach(item => {
    const component = document.createElement('timeline-container');
    component.dataset.timelineId = item.timelineId;
    container.appendChild(component);
  });
};

createComponents(phone);
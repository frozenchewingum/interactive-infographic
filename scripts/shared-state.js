// shared-state.js
export const sharedState = {
    data: {}, // Store shared data here
  
    listeners: [],
  
    // Method to update the state
    setState(key, value) {
      this.data[key] = value;
      this.notifyListeners();
    },
  
    // Method to retrieve the state
    getState(key) {
      return this.data[key];
    },
  
    // Add a listener for state changes
    addListener(listener) {
      this.listeners.push(listener);
    },
  
    // Notify listeners when state changes
    notifyListeners() {
      this.listeners.forEach((listener) => listener(this.data));
    },
  };
  
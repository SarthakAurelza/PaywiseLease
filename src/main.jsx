import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot from 'react-dom/client'
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import store from './redux/store';
import App from './App';

// Get the root element from your HTML
const rootElement = document.getElementById('root');

// Create a root and render the App component
const root = ReactDOM.createRoot(rootElement);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

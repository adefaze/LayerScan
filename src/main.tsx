import React from 'react';
import ReactDOM from 'react-dom/client';
import { framer } from 'framer-plugin';
import App from './ui/App';
import './styles.css';

// Show the Framer plugin UI
framer.showUI({
    width: 320,
    height: 480,
    resizable: true,
});

// Render the React app
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

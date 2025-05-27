import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ Ensure Tailwind classes are correctly applied
import './CSS/components/loading.css';
import './CSS/components/buttons.css';
import './CSS/components/alerts.css';
import './CSS/components/form.css';
import './CSS/media.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // ✅ Keep Bootstrap if needed
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

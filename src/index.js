import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './CSS/components/loading.css';
import './CSS/components/buttons.css';
import './CSS/components/alerts.css';
import './CSS/components/form.css';
import './CSS/media.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // ✅ إضافة react-query

const queryClient = new QueryClient(); // ⚙️ تهيئة العميل

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);

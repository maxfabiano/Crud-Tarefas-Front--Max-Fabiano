// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Estilos globais (opcional, pode ser Tailwind, SCSS, etc.)
import { BrowserRouter } from 'react-router-dom'; // Para roteamento

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);
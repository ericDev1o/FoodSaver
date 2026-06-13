import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './app/App';
import { foodSaverStore } from './store';

import './index.css';

import './i18n';

const rootElement = document.getElementById('root');
if(rootElement) {
  const root = createRoot(rootElement);
  
  root.render(
    <StrictMode>
      <Provider store={foodSaverStore}>
        <App />
      </Provider>
    </StrictMode>,
  );
}
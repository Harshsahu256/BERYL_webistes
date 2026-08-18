import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party browser extension injection errors
if (typeof window !== 'undefined') {
  const isExtensionError = (errorObj: unknown): boolean => {
    if (!errorObj) return false;
    const str = String(
      (errorObj as { message?: string })?.message ||
      (errorObj as { reason?: string })?.reason ||
      errorObj
    ).toLowerCase();
    return (
      str.includes('metamask') ||
      str.includes('ethereum') ||
      str.includes('wallet') ||
      str.includes('chrome-extension') ||
      str.includes('failed to connect to metamask') ||
      str.includes('evm') ||
      str.includes('web3')
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isExtensionError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event) => {
      if (isExtensionError(event.message) || isExtensionError(event.error)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

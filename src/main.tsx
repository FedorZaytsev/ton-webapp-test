import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider
      manifestUrl="https://raw.githubusercontent.com/FedorZaytsev/ton-webapp-test/refs/heads/main/src/manifest/tonconnect-manifest.json"
      language="en"  >
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
)

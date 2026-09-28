import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'maplibre-gl/dist/maplibre-gl.css'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider'
import { I18nProvider } from './i18n/I18nProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </Provider>
  </StrictMode>,
)

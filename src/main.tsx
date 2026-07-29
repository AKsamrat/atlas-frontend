import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ContentProvider } from './context/ContentContext'
import { CartProvider } from './store/cartStore'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ContentProvider>
        <CartProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </CartProvider>
      </ContentProvider>
    </AuthProvider>
  </StrictMode>,
)

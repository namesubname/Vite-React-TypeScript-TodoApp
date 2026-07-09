import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import RegisterForm from "./components/RegisterForm/RegisterForm.tsx"
import LoginForm from "./components/LoginForm/LoginForm.tsx"
import "./index.css"

function AppRouter() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'register'>('register')

  if (currentScreen === 'register') {
    return <RegisterForm onNavigate={() => setCurrentScreen('login')} />
  }

  return <LoginForm onNavigate={() => setCurrentScreen('register')} />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)

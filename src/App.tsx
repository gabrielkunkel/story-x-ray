import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StartPage from './pages/StartPage'
import StorySetupPage from './pages/StorySetupPage'
import StoryWorkspacePage from './pages/StoryWorkspacePage'
import { usePWAInstall } from './hooks/usePWAInstall'

export default function App() {
  const { isInstallable } = usePWAInstall()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/setup" element={<StorySetupPage />} />
        <Route path="/story/:id" element={<StoryWorkspacePage isInstallable={isInstallable} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

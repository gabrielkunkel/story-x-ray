import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import StartPage from './pages/StartPage'
import StorySetupPage from './pages/StorySetupPage'
import StoryWorkspacePage from './pages/StoryWorkspacePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/setup" element={<StorySetupPage />} />
        <Route path="/story/:id" element={<StoryWorkspacePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

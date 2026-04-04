import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
}

export default function BoardHeader({ title }: Props) {
  const navigate = useNavigate()

  return (
    <header className="board-header">
      <button className="btn-ghost board-header__back" onClick={() => navigate('/')}>
        ←
      </button>
      <h1 className="board-header__title">{title}</h1>
    </header>
  )
}

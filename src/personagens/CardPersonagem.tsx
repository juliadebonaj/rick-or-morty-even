import { useFavoritos } from '../favoritos/FavoritosContext'
import type { Personagem } from '../shared/types'

interface Props {
  personagem: Personagem
  selecionado: boolean
  onToggle: (personagem: Personagem) => void
}

export function CardPersonagem({ personagem, selecionado, onToggle }: Props) {
  const { state, dispatch } = useFavoritos()
  const ehFavorito = state.favoritos.some((p) => p.id === personagem.id)

  function handleFavoritar(e: React.MouseEvent) {
    e.stopPropagation()
    if (ehFavorito) {
      dispatch({ type: 'REMOVER', payload: personagem.id })
    } else {
      dispatch({ type: 'ADICIONAR', payload: personagem })
    }
  }

  return (
    <article
      className={`card-personagem status-${personagem.status.toLowerCase()}${selecionado ? ' selecionado' : ''}`}
      onClick={() => onToggle(personagem)}
    >
      <img src={personagem.image} alt={personagem.name} />
      <div className="info">
        <h3>
          {personagem.name}
          {personagem.status.toLowerCase() === 'dead' && (
            <span className="rip">RIP</span>
          )}
        </h3>
        <div className="tags">
          <span className={`tag status-${personagem.status.toLowerCase()}`}>
            {personagem.status.charAt(0).toUpperCase() + personagem.status.slice(1)}
          </span>
          <span className={`tag species-${personagem.species.toLowerCase().replace(/\s+/g, '-')}`}>
            {personagem.species}
          </span>
        </div>
      </div>
      <button
        className={`estrela-favoritar${ehFavorito ? ' ativa' : ''}`}
        onClick={handleFavoritar}
        title={ehFavorito ? 'Remover dos favoritos' : 'Favoritar'}
      >
        {ehFavorito ? '★' : '☆'}
      </button>
      {selecionado && <span className="check">✓</span>}
    </article>
  )
}

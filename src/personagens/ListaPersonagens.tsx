import type { Personagem } from '../shared/types'
import { CardPersonagem } from './CardPersonagem'

interface Props {
  personagens: Personagem[]
  carregando: boolean
  erro: string | null
  selecionados: Personagem[]
  onToggle: (personagem: Personagem) => void
}

export function ListaPersonagens({ personagens, carregando, erro, selecionados, onToggle }: Props) {
  if (carregando) {
    return <p className="mensagem-vazia">Carregando personagens...</p>
  }

  if (erro) {
    return <p className="mensagem-erro">{erro}</p>
  }

  if (personagens.length === 0) {
    return <p className="mensagem-vazia">Nenhum personagem nesta página com esse filtro.</p>
  }

  return (
    <ul className="lista-personagens">
      {personagens.map((p) => (
        <li key={p.id}>
          <CardPersonagem
            personagem={p}
            selecionado={selecionados.some((s) => s.id === p.id)}
            onToggle={onToggle}
          />
        </li>
      ))}
    </ul>
  )
}

import { useState } from 'react'
import { FavoritosProvider, useFavoritos } from './favoritos/FavoritosContext'
import { ListaFavoritos } from './favoritos/ListaFavoritos'
import { BarraSeleção } from './favoritos/BarraSeleção'
import { Busca } from './personagens/Busca'
import { Filtros } from './personagens/Filtros'
import { ListaPersonagens } from './personagens/ListaPersonagens'
import { Paginacao } from './personagens/Paginacao'
import { useCharacters } from './personagens/useCharacters'
import { Header } from './shared/Header'
import type { Personagem } from './shared/types'
import './App.css'

function Conteudo() {
  const [busca, setBusca] = useState('')
  const [status, setStatus] = useState('')
  const [species, setSpecies] = useState('')
  const [pagina, setPagina] = useState(1)
  const [selecionados, setSelecionados] = useState<Personagem[]>([])

  const { personagens, carregando, erro, totalPaginas } = useCharacters({ busca, status, species, pagina })
  const { state, dispatch } = useFavoritos()

  function handleBuscaChange(valor: string) {
    setBusca(valor)
    setPagina(1)
  }

  function handleStatusChange(valor: string) {
    setStatus(valor)
    setPagina(1)
  }

  function handleSpeciesChange(valor: string) {
    setSpecies(valor)
    setPagina(1)
  }

  function toggleSelecionado(personagem: Personagem) {
    setSelecionados((prev) =>
      prev.some((p) => p.id === personagem.id)
        ? prev.filter((p) => p.id !== personagem.id)
        : [...prev, personagem]
    )
  }

  function favoritarSelecionados() {
    selecionados.forEach((p) => dispatch({ type: 'ADICIONAR', payload: p }))
    setSelecionados([])
  }

  function removerSelecionados() {
    selecionados.forEach((p) => dispatch({ type: 'REMOVER', payload: p.id }))
    setSelecionados([])
  }

  const todosSaoFavoritos = selecionados.length > 0 &&
    selecionados.every((p) => state.favoritos.some((f) => f.id === p.id))

  const algumEhFavorito = selecionados.some((p) =>
    state.favoritos.some((f) => f.id === p.id)
  )

  return (
    <>
      <Header />
      <main>
        <section className="coluna-principal">
          <Busca valor={busca} onChange={handleBuscaChange} />
          <Filtros
            status={status}
            species={species}
            onStatusChange={handleStatusChange}
            onSpeciesChange={handleSpeciesChange}
          />
          <ListaPersonagens
            personagens={personagens}
            carregando={carregando}
            erro={erro}
            selecionados={selecionados}
            onToggle={toggleSelecionado}
          />
          <Paginacao
            paginaAtual={pagina}
            totalPaginas={busca.trim() ? 1 : totalPaginas}
            onChange={setPagina}
          />
        </section>
        <ListaFavoritos />
      </main>
      {selecionados.length > 0 && (
        <BarraSeleção
          quantidade={selecionados.length}
          todosSaoFavoritos={todosSaoFavoritos}
          algumEhFavorito={algumEhFavorito}
          onFavoritar={favoritarSelecionados}
          onRemover={removerSelecionados}
          onCancelar={() => setSelecionados([])}
        />
      )}
    </>
  )
}

function App() {
  return (
    <FavoritosProvider>
      <Conteudo />
    </FavoritosProvider>
  )
}

export default App

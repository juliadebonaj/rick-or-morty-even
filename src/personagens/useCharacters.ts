import { useState, useEffect } from 'react'
import type { Personagem } from '../shared/types'

interface ApiResposta {
  info: {
    pages: number
  }
  results: Personagem[]
}

interface Filtros {
  busca: string
  status: string
  species: string
  pagina: number
}

interface UseCharactersResult {
  personagens: Personagem[]
  carregando: boolean
  erro: string | null
  totalPaginas: number
}

function montarUrl(busca: string, status: string, species: string, pagina: number): string {
  const params = new URLSearchParams()
  if (busca.trim()) params.set('name', busca.trim())
  if (status) params.set('status', status)
  if (species) params.set('species', species)
  params.set('page', String(pagina))
  return `https://rickandmortyapi.com/api/character?${params}`
}

export function useCharacters({ busca, status, species, pagina }: Filtros): UseCharactersResult {
  const [personagens, setPersonagens] = useState<Personagem[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [totalPaginas, setTotalPaginas] = useState(1)

  useEffect(() => {
    setCarregando(true)
    setErro(null)

    const termo = busca.trim().toLowerCase()

    const timer = setTimeout(async () => {
      try {
        // Primeira chamada: pega a página 1 e descobre quantas páginas existem
        const primeiraRes = await fetch(montarUrl(busca, status, species, termo ? 1 : pagina))

        if (primeiraRes.status === 404) {
          setPersonagens([])
          setTotalPaginas(1)
          setErro('Nenhum personagem encontrado.')
          return
        }

        if (!primeiraRes.ok) throw new Error(`Erro ${primeiraRes.status}`)

        const primeiraData = (await primeiraRes.json()) as ApiResposta

        // Sem busca: comporta normal, paginação da API funciona
        if (!termo) {
          setPersonagens(primeiraData.results)
          setTotalPaginas(primeiraData.info.pages)
          return
        }

        // Com busca: precisa pegar todas as páginas para filtrar por "começa com"
        let todosResultados = primeiraData.results

        if (primeiraData.info.pages > 1) {
          const promessas: Promise<ApiResposta>[] = []
          for (let p = 2; p <= primeiraData.info.pages; p++) {
            promessas.push(
              fetch(montarUrl(busca, status, species, p)).then((r) => r.json())
            )
          }
          const demais = await Promise.all(promessas)
          todosResultados = [
            ...todosResultados,
            ...demais.flatMap((d) => d.results),
          ]
        }

        const filtrados = todosResultados.filter((p) =>
          p.name.split(' ').some((palavra) =>
            palavra.toLowerCase().startsWith(termo)
          )
        )

        setPersonagens(filtrados)
        setTotalPaginas(1)
      } catch (err) {
        setErro((err as Error).message)
        setPersonagens([])
        setTotalPaginas(1)
      } finally {
        setCarregando(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [busca, status, species, pagina])

  return { personagens, carregando, erro, totalPaginas }
}

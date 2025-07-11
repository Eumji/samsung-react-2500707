import { useQuery } from '@tanstack/react-query'
import Loader from '@/components/Loader'

interface Movie {
  Title: string
  Year: string
  imdbID: string
  Type: string
  Poster: string
}

export default function Movies() {
  const { data: movies, isLoading } = useQuery<Movie[]>({
    queryKey: ['movies'],
    queryFn: async () => {
      const res = await fetch('https://omdbapi.com?apikey=7035c60c&s=batman')
      const { Search } = await res.json()
      return Search
    },
    staleTime: 1000 * 60 * 5
  })

  return (
    <>
      {isLoading && <Loader size={100} />}
      <ul>
        {movies?.map(movie => {
          return <li key={movie.imdbID}>{movie.Title}</li>
        })}
      </ul>
    </>
  )
}

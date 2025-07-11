import { useOutlet } from 'react-router'
import MovieSearcher from '@/components/movies/MovieSearcher'
import MovieList from '@/components/movies/MovieList'

export default function Movies() {
  const outlet = useOutlet()
  return (
    <main className="mx-auto max-w-[1200px] p-4">
      <MovieSearcher />
      <MovieList />
      {outlet}
    </main>
  )
}

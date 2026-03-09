import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data } = await axios.get('/api/movies');
        setMovies(data);
        // group by genre for rows (simplified: just use static categories)
        const bongoClassics = data.filter(m => m.year < 2010);
        const newTz = data.filter(m => m.year >= 2020);
        setGenres({
          'New Tanzanian Movies': newTz,
          'Bongo Classics': bongoClassics,
          'Trending Now': data.slice(0, 10),
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="relative h-screen bg-netflix-dark">
      <Navbar />
      <Hero />
      <main className="relative pb-24 -mt-32 space-y-8">
        {Object.entries(genres).map(([title, movies]) => (
          <MovieRow key={title} title={title} movies={movies} />
        ))}
      </main>
    </div>
  );
    const [continueWatching, setContinueWatching] = useState([]);

useEffect(() => {
  if (user) {
    axios.get('/api/movies/user/continue-watching')
      .then(({ data }) => setContinueWatching(data.map(item => item.movie)))
      .catch(console.error);
  }
}, [user]);
}
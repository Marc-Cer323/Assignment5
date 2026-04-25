import './App.css';
import MovieHeader from './components/movieheader';
import MovieList from './components/movielist';
import MovieDetail from './components/moviedetail';
import Authentication from './components/authentication';
import MovieSearch from './components/moviesearch';
import {HashRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <HashRouter>
        <MovieHeader />
        <Routes>
          <Route path="/" element={<MovieList />} />
          <Route path="/movielist" element={<MovieList />} />
          <Route path="/movie/:movieTitle" element={<MovieDetail />} />
          <Route path="/search" element={<MovieSearch />} />
          <Route path="/signin" element={<Authentication />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

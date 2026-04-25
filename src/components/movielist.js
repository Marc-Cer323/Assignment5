import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovies, setMovie } from '../actions/movieActions';
import { Link } from 'react-router-dom';
import { Image, Nav, Carousel } from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';

function MovieList() {
    const dispatch = useDispatch();
    const movies = useSelector(state => state.movie.movies);
    const loggedIn = useSelector(state => state.auth.loggedIn);

    const memoizedMovies = useMemo(() => movies, [movies]);

    useEffect(() => {
        if (loggedIn) {
            dispatch(fetchMovies());
        }
    }, [dispatch, loggedIn]);

    const handleSelect = (selectedIndex) => {
        dispatch(setMovie(memoizedMovies[selectedIndex]));
    };

    const handleClick = (movie) => {
        dispatch(setMovie(movie));
    };

    if (!loggedIn) {
        return (
            <div className="text-center mt-5">
                <h3>Please <a href="#/signin">sign in</a> to view movies.</h3>
            </div>
        );
    }

    if (!memoizedMovies || memoizedMovies.length === 0) {
        return <div className="text-center mt-5">Loading movies...</div>;
    }

    return (
        <Carousel onSelect={handleSelect} className="bg-dark text-light p-4 rounded">
            {memoizedMovies.map((movie) => (
                <Carousel.Item key={movie._id}>
                    <Nav.Link
                        as={Link}
                        to={`/movie/${encodeURIComponent(movie.title)}`}
                        onClick={() => handleClick(movie)}
                    >
                        <Image
                            className="image"
                            src={movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                            thumbnail
                            style={{ maxHeight: '400px', objectFit: 'cover' }}
                        />
                    </Nav.Link>
                    <Carousel.Caption>
                        <h3>{movie.title}</h3>
                        <p>
                            <BsStarFill color="#f5c518" />
                            {' '}{movie.avgRating ? movie.avgRating.toFixed(1) : 'No ratings'} &nbsp;|&nbsp; {movie.releaseDate} &nbsp;|&nbsp; {movie.genre}
                        </p>
                        <p>{movie.movieReviews ? `${movie.movieReviews.length} review(s)` : '0 reviews'}</p>
                    </Carousel.Caption>
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default MovieList;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchMovies, setMovie } from '../actions/movieActions';
import { Form, Button, InputGroup, Card, Row, Col, Badge, Spinner } from 'react-bootstrap';
import { BsStarFill, BsStar, BsSearch } from 'react-icons/bs';

function MovieSearch() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setSearched(false);
        const data = await dispatch(searchMovies(query.trim()));
        setResults(data || []);
        setSearched(true);
        setLoading(false);
    };

    const handleMovieClick = (movie) => {
        dispatch(setMovie(movie));
        navigate(`/movie/${encodeURIComponent(movie.title)}`);
    };

    const renderStars = (value) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < Math.round(value || 0)
                ? <BsStarFill key={i} color="#f5c518" />
                : <BsStar key={i} color="#ccc" />
        );
    };

    return (
        <div className="container mt-4">
            <h3 className="mb-4">Search Movies</h3>

            <Form onSubmit={handleSearch} className="mb-4">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Search by movie title or actor name..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        size="lg"
                    />
                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading
                            ? <Spinner animation="border" size="sm" />
                            : <BsSearch />
                        }
                        {' '}{loading ? 'Searching...' : 'Search'}
                    </Button>
                </InputGroup>
            </Form>

            {searched && (
                <>
                    <p className="text-muted">
                        {results.length > 0
                            ? `Found ${results.length} result(s) for "${query}"`
                            : `No results found for "${query}"`
                        }
                    </p>
                    <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                        {results.map((movie) => (
                            <Col key={movie._id}>
                                <Card
                                    className="h-100 shadow-sm"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleMovieClick(movie)}
                                >
                                    <Card.Img
                                        variant="top"
                                        src={movie.imageUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                                        style={{ height: '280px', objectFit: 'cover' }}
                                    />
                                    <Card.Body>
                                        <Card.Title style={{ fontSize: '1rem' }}>{movie.title}</Card.Title>
                                        <Card.Text as="div">
                                            <small className="text-muted">{movie.releaseDate} &nbsp;|&nbsp; {movie.genre}</small>
                                            <div className="mt-1">
                                                {renderStars(movie.avgRating)}
                                                {' '}
                                                <Badge bg="warning" text="dark">
                                                    {movie.avgRating ? movie.avgRating.toFixed(1) : 'N/A'}
                                                </Badge>
                                            </div>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}
        </div>
    );
}

export default MovieSearch;

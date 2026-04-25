import React, { useEffect, useState } from 'react';
import { fetchMovie, submitReview } from '../actions/movieActions';
import { useDispatch, useSelector } from 'react-redux';
import { Card, ListGroup, ListGroupItem, Image, Form, Button, Table, Badge } from 'react-bootstrap';
import { BsStarFill, BsStar } from 'react-icons/bs';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
    const dispatch = useDispatch();
    const { movieTitle } = useParams();
    const selectedMovie = useSelector(state => state.movie.selectedMovie);
    const reviewSubmitted = useSelector(state => state.movie.reviewSubmitted);

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (movieTitle) {
            dispatch(fetchMovie(decodeURIComponent(movieTitle)));
        }
    }, [dispatch, movieTitle]);

    // Reload movie after review submitted
    useEffect(() => {
        if (reviewSubmitted && movieTitle) {
            dispatch(fetchMovie(decodeURIComponent(movieTitle)));
            setMessage('Review submitted!');
            setReviewText('');
            setRating(5);
            setSubmitting(false);
        }
    }, [reviewSubmitted, dispatch, movieTitle]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) return;
        setSubmitting(true);
        setMessage('');
        await dispatch(submitReview(selectedMovie._id, reviewText, rating));
    };

    const renderStars = (value) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < value
                ? <BsStarFill key={i} color="#f5c518" />
                : <BsStar key={i} color="#f5c518" />
        );
    };

    if (!selectedMovie) {
        return <div className="text-center mt-5">Loading movie...</div>;
    }

    return (
        <div className="container mt-4">
            <Card className="mb-4 shadow">
                <Card.Header as="h4">{selectedMovie.title}</Card.Header>
                <Card.Body className="d-flex flex-wrap gap-4">
                    <Image
                        src={selectedMovie.imageUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
                        thumbnail
                        style={{ maxWidth: '200px', height: 'auto' }}
                    />
                    <div>
                        <p><strong>Year:</strong> {selectedMovie.releaseDate}</p>
                        <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                        <p>
                            <strong>Average Rating:</strong>{' '}
                            {renderStars(Math.round(selectedMovie.avgRating || 0))}
                            {' '}<Badge bg="warning" text="dark">
                                {selectedMovie.avgRating ? selectedMovie.avgRating.toFixed(1) : 'N/A'} / 5
                            </Badge>
                        </p>
                        <p><strong>Cast:</strong></p>
                        <ListGroup variant="flush">
                            {selectedMovie.actors && selectedMovie.actors.map((actor, i) => (
                                <ListGroupItem key={i} className="py-1">
                                    <strong>{actor.actorName}</strong> as {actor.characterName}
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                </Card.Body>
            </Card>

            {/* Reviews Table */}
            <Card className="mb-4 shadow">
                <Card.Header as="h5">
                    Reviews ({selectedMovie.reviews ? selectedMovie.reviews.length : 0})
                </Card.Header>
                <Card.Body>
                    {selectedMovie.reviews && selectedMovie.reviews.length > 0 ? (
                        <Table striped bordered hover responsive size="sm">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Rating</th>
                                    <th>Review</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedMovie.reviews.map((review, i) => (
                                    <tr key={i}>
                                        <td><strong>{review.username}</strong></td>
                                        <td>{renderStars(review.rating)} {review.rating}/5</td>
                                        <td>{review.review}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-muted">No reviews yet. Be the first to review!</p>
                    )}
                </Card.Body>
            </Card>

            {/* Add Review Form */}
            <Card className="shadow">
                <Card.Header as="h5">Add Your Review</Card.Header>
                <Card.Body>
                    {message && <div className="alert alert-success">{message}</div>}
                    <Form onSubmit={handleSubmitReview}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Form.Select
                                value={rating}
                                onChange={e => setRating(Number(e.target.value))}
                            >
                                <option value={5}>★★★★★ (5)</option>
                                <option value={4}>★★★★☆ (4)</option>
                                <option value={3}>★★★☆☆ (3)</option>
                                <option value={2}>★★☆☆☆ (2)</option>
                                <option value={1}>★☆☆☆☆ (1)</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Write your review here..."
                                value={reviewText}
                                onChange={e => setReviewText(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default MovieDetail;

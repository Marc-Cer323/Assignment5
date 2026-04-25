import actionTypes from '../constants/actionTypes';
const env = process.env;

function moviesFetched(movies) {
    return { type: actionTypes.FETCH_MOVIES, movies };
}

function movieFetched(movie) {
    return { type: actionTypes.FETCH_MOVIE, selectedMovie: movie };
}

function movieSet(movie) {
    return { type: actionTypes.SET_MOVIE, selectedMovie: movie };
}

export function setMovie(movie) {
    return dispatch => { dispatch(movieSet(movie)); };
}

// Fetch all movies sorted by avgRating
export function fetchMovies() {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        })
        .then(res => { if (!res.ok) throw Error(res.statusText); return res.json(); })
        .then(res => dispatch(moviesFetched(res)))
        .catch(e => console.log(e));
    };
}

// Fetch single movie with reviews and avgRating
export function fetchMovie(movieTitle) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/movies/${encodeURIComponent(movieTitle)}?reviews=true`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            mode: 'cors'
        })
        .then(res => { if (!res.ok) throw Error(res.statusText); return res.json(); })
        .then(res => dispatch(movieFetched(res)))
        .catch(e => console.log(e));
    };
}

// Submit a review - username pulled from JWT on server
export function submitReview(movieId, review, rating) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ movieId, review, rating: Number(rating) }),
            mode: 'cors'
        })
        .then(res => { if (!res.ok) throw Error(res.statusText); return res.json(); })
        .then(res => {
            dispatch({ type: actionTypes.SET_REVIEW_SUBMITTED });
            return res;
        })
        .catch(e => console.log(e));
    };
}

// Search movies by partial title or actor name - returns results without overwriting movie list
export function searchMovies(query) {
    return () => {
        return fetch(`${env.REACT_APP_API_URL}/search`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ query }),
            mode: 'cors'
        })
        .then(res => { if (!res.ok) throw Error(res.statusText); return res.json(); })
        .catch(e => { console.log(e); return []; });
    };
}

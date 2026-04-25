import actionTypes from '../constants/actionTypes';
const env = process.env;

function userLoggedIn(username) {
    return {
        type: actionTypes.USER_LOGGEDIN,
        username: username
    }
}

function logout() {
    return {
        type: actionTypes.USER_LOGOUT
    }
}

export function submitLogin(data) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        }).then(async (response) => {
            const json = await response.json();
            if (!response.ok) {
                return { success: false, message: json.msg || json.message || 'Login failed. Please try again.' };
            }
            localStorage.setItem('username', data.username);
            localStorage.setItem('token', json.token);
            dispatch(userLoggedIn(data.username));
            return { success: true };
        }).catch(() => {
            return { success: false, message: 'Unable to connect to server. Please try again.' };
        });
    }
}

export function submitRegister(data) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        }).then(async (response) => {
            const json = await response.json();
            if (!response.ok) {
                return { success: false, message: json.msg || json.message || 'Registration failed. Please try again.' };
            }
            // Auto-login after successful register
            return dispatch(submitLogin(data));
        }).catch(() => {
            return { success: false, message: 'Unable to connect to server. Please try again.' };
        });
    }
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        dispatch(logout());
    }
}

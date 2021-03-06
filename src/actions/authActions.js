import axios from 'axios'
import jwtDecode from 'jwt-decode'
import {
    SET_CURRENT_USER
} from '../constants'
import setAuthorizationToken from '../utils/setAuthorizationToken';
import environment from '../environment.js';

export const setCurrentUser = (user, isGoogleLogin) => {
    let obj = {
        type: SET_CURRENT_USER,
        user,
        isGoogleLogin: isGoogleLogin
    };
    return obj;
};


export const login = data => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            axios.post(environment.login_url + '/api/auth/signin', data).then((res) => {
                if (res.data.code === 200) {
                    const token = res.data.token;
                    let isGoogleLogin = false;
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('isGoogleLogin', false);
                    setAuthorizationToken(token);
                    let user = jwtDecode(token).userJson;
                    dispatch(setCurrentUser(user, isGoogleLogin));
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            }).catch((resError) => {
                reject(resError);
            });
        });
    }
};

export const googleLogin = data => {
    return dispatch => {
        let token = data.token;
        let isGoogleLogin = true;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('isGoogleLogin', true);
        setAuthorizationToken(token);
        let user = data.user;
        dispatch(setCurrentUser(user, isGoogleLogin));
    }
};

export const logout = () => {
    return dispatch => {
        localStorage.removeItem('jwtToken'); // Clear the token stored in localStorage
        setAuthorizationToken(false); // Delete the header authentication Authorization, without the header
        // authentication information in the future
        dispatch(setCurrentUser({}, false)); // Pass in an empty object
    }
};

import { getUserData } from './util.js';

const host = 'https://parseapi.back4app.com';
const appId = 'hO7tCJxwxDAVOQwsgPg0hwnWwSMT5OiikKHYUtIw';
const apiKey = '8KejOIe8LaHa1SLHqjDdbmodQPsEMwxs5zqQI44Z';


async function request(method, url, data) {

    // Set my headers.
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-REST-API-Key': apiKey
        }
    }

    // I add classes here so I do not have to send it with all urls I need.
    if (url.slice(0, 6) == '/users' || url.slice(0, 6) == '/login') {
        options.headers['X-Parse-Revocable-Session'] = 1;
    } else {
        url = '/classes' + url
    }

    // Set data if given to function.
    if (data != undefined) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    const userData = getUserData();
    // Log me in if authorized.
    if (userData) {
        options.headers['X-Parse-Session-Token'] = userData.sessionToken;
    }

    try {
        const res = await fetch(host + url, options);

        if (res.ok != true) {
            // I do all these variables so I get the error code and make a notification instead of an alert in my login page if wrong info is given.
            const error = await res.json();
            const err = new Error(error.error);
            err.code = error.code;
            throw err;
        }

        if (res.status == 204) {
            return res;
        } else {
            return res.json();
        }
    } catch (err) {
        console.error(err);
        throw err;
    }

}


export async function get(url) {
    return request('get', url);
}

export async function post(url, data) {
    return request('post', url, data);
}

export async function put(url, data) {
    return request('put', url, data);
}

export async function del(url) {
    return request('delete', url);
}
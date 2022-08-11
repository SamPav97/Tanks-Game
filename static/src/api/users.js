 import * as api from './api.js'
import { clearUserData, setUserData } from './util.js';

 export async function login(username, password) {
    const result = await api.post('/login', { username, password });
    // I set user data from what server returns.
    const userData = {
        username: result.username,
        id: result.objectId,
        sessionToken: result.sessionToken
    };
    setUserData(userData);

    return result;
 }

 export async function register(username, password) {
    const result = await api.post('/users', { username, password });
    // Server does not return username so I take it from input.
    const userData = {
        username: username,
        id: result.objectId,
        sessionToken: result.sessionToken
    };
    setUserData(userData);

    return result;
 }

 export function logout() {
    api.post('/logout');
    clearUserData();
 }





//  {
//     "objectId":"AHRLeYvh0d",
//     "username":"newUserName",
//     "createdAt":"2018-11-08T13:50:56.843Z",
//     "updatedAt":"2018-11-08T13:50:56.843Z",
//     "sessionToken":"r:8d975a0f207fab1211752da3be0a3c81"
//   }
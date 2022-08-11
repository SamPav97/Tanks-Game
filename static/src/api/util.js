export function getUserData() {
    return JSON.parse(sessionStorage.getItem('userData'));
}

export function setUserData(data) {
    return sessionStorage.setItem('userData', JSON.stringify(data));
}

export function clearUserData() {
    return sessionStorage.removeItem('userData');
}

// Submit handler function.
export function bindForm(callback) {
    return async function (event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const asObject = Object.fromEntries([...formData.entries()].map(([k, v]) => [k, v.trim()]));

        // Disable all input fields after submission so that user does not send more requests.
        const inputs = [...event.target.querySelectorAll('input, button, textarea, select')];
        inputs.forEach(i => i.disabled = true);
        try {
            await callback(asObject, event.target);
        } catch (err) {
            // If false data is given do nothing. It shows us alert from api.
            console.log(err.message);
        } finally {
            // Lets us try again.
            inputs.forEach(i => i.disabled = false);
        }
    }
}
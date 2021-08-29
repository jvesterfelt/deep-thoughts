let db;
const request = indexedDB.open('deep-thoughts', 1);

request.onupgradeneeded = function(e) {
    const db = e.target.result;
    db.createObjectStore('new_user', { autoIncrement: true });
};

// Reference to db in global variable
request.onsuccess = function(e) {
    db = e.target.result;

    // Check if app is online
    if (navigator.onLine) {
        uploadUser();
    }
};

// Log errors
request.onerror = function(e) {
    console.log(e.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['new_user'], 'readwrite');

    const userObjectStore = transaction.objectStore('new_user');

    // Add user to store
    userObjectStore.add(record);
};

function uploadUser() {
    const transaction = db.transaction(['new_user'], 'readwrite');

    const pizzaObjectStore = transaction.objectStore('new_user');

    const getAll = userObjectStore.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch('/api/users', {
                    method: 'POST',
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverReseponse);
                    }

                    const transaction = db.transaction(['new_user'], 'readwrite');
                    const userObjectStore = transaction.objectStore('new_user');

                    pizzaObjectStore.clear();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };
}

window.addEventListener('online', uploadUser);
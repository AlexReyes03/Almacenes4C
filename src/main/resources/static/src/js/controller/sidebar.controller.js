const URL2 = 'http://localhost:8080';

const employeeLogged = JSON.parse(localStorage.getItem('user'));
let storageManaged = [];
let employeeInfo = {};

const findAllStoragesForUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        //window.location.replace('http://localhost:8080/index.html');
        return;
    }

    await fetch(`${URL}/api/storage`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        storageManaged = responseData.data || [];
        console.log(storageManaged);
        
    })
    .catch(error => {
        if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED") || error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
            //localStorage.removeItem('token');
            //window.location.replace('http://localhost:8080/index.html');
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });
}

const findUser = async () => {
    const token = localStorage.getItem('token');

    await fetch(`${URL2}/api/user/${employeeLogged.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        employeeInfo = responseData.data || {};
        console.log(employeeInfo);
        
    })
    .catch(error => {
        if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED") || error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
            //localStorage.removeItem('token');
            //window.location.replace('http://localhost:8080/index.html');
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });

}

const getRoleEmployee = (roleName) => {
    switch (roleName) {
        case 'ROLE_ADMIN':
            return 'Administrador';
        case 'ROLE_EMPLOYEE':
            return 'Empleado';
        default:
            return 'No definido'; // Para roles no definidos
    }
}

const sidebarSecurity = async () => {
    await findUser();
    const roleClass = getRoleEmployee(employeeLogged.rol);

    const managedStorage = storageManaged.find(storage => storage.user.id === employeeInfo.id);

    console.log(managedStorage || {});
    

    const profile = document.getElementById('profile');
    const article = document.getElementById('article');
    const user = document.getElementById('user');
    const storage = document.getElementById('storage');
    const category = document.getElementById('category');
    const userStorage = document.getElementById('userStorage');

    if (roleClass === 'Empleado' && managedStorage) {
        profile.hidden = false;
        article.hidden = true;
        user.hidden = true;
        storage.hidden = true;
        category.hidden = true;
        userStorage.hidden = false;
    } else if (roleClass === 'Empleado' && !managedStorage) {
        profile.hidden = false;
        article.hidden = true;
        user.hidden = true;
        storage.hidden = true;
        category.hidden = true;
        userStorage.hidden = true;
    } else if (roleClass === 'Administrador' && managedStorage) {
        profile.hidden = false;
        article.hidden = false;
        user.hidden = false;
        storage.hidden = false;
        category.hidden = false;
        userStorage.hidden = false;
    } else if (roleClass === 'Administrador' && !managedStorage) {
        profile.hidden = false;
        article.hidden = false;
        user.hidden = false;
        storage.hidden = false;
        category.hidden = false;
        userStorage.hidden = true;
    }
}

(async () => {
    await findAllStoragesForUser();
    await sidebarSecurity();
})()
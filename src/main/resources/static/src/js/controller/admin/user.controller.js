const URL = 'http://localhost:8080';

// Variables globales definidas en la vista
let userList = [];
const userLogged = JSON.parse(localStorage.getItem('user'));

const loadProfileData = async () => {
    if (userLogged) {
        console.log(userLogged.username);  // Mostrar el nombre de usuario en el sidebar
        console.log(userLogged.email);     // Mostrar el email del usuario
        console.log(userLogged.id);        // Mostrar el ID del usuario
        console.log(userLogged.rol);       // Mostrar el rol del usuario (ROLE_ADMIN, etc.)

        const profileText = document.getElementById("profile-text");
        
            profileText.innerText = `Perfil de ${userLogged.username}`;
    }
}

const roleList = [
    { id: 1, name: "ROLE_ADMIN" },
    { id: 2, name: "ROLE_EMPLOYEE" }
];

// TABLE CONFIGURATION
const findAllUsers = async () => {
    const token = localStorage.getItem('token');

    // Al cargar a todos los usuarios, como es una función que se carga al inicio es importante
    // Validar si el token recibido es válido, sino lo es debe redirigir a la vista de index

    if (!token) {
        window.location.replace('http://localhost:8080/view/employee/profile.html');
        return;
    } else if (userLogged.rol != 'ROLE_ADMIN') {
        window.location.replace('http://localhost:8080/403.html');
    }

    await fetch(`${URL}/api/user`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
        userList = responseData.data || [];
    }).catch(error => {
        if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED") || error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });
}

const getRoleName = (roleName) => {
    switch (roleName) {
        case 'ROLE_ADMIN':
            return 'Administrador';
        case 'ROLE_EMPLOYEE':
            return 'Almacenista';
        default:
            return 'No definido'; // Para roles no definidos
    }
}

const loadTable = async () => {
    await findAllUsers();

    let tbody = document.getElementById("tbody");
    let content = '';

    if (userList.length === 0) {
        content = `
            <tr>
                <td colspan="5" class="text-center" style="height: 200px;">
                    Aún no hay registros
                </td>
            </tr>
        `;
    } else {
        userList.forEach((user, index) => {
            const roleClass = getRoleName(user.rol.name);

            const ButtonDisabled = (user.id === userLogged.id) ? 'disabled' : '';
            const ButtonVisually = (user.id === userLogged.id) ? 'd-none' : '';
            const btnGroup = (user.id === userLogged.id) ? '' : 'btn-group';
            const titleEditDisabled = (user.id === userLogged.id) ? 'No puedes editar tu propio usuario desde aquí.' : 'Editar';
            const titleDeleteDisabled = (user.id === userLogged.id) ? 'No puedes Eliminar tu propio usuario.' : 'Eliminar';
            const toggle = (user.id === userLogged.id) ? '' : 'modal';
            
            content += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td class="text-truncate">${user.name} ${user.surname} ${user.lastname || ''}</td>
                            <td>${user.email}</td>
                            <td>${roleClass}</td>
                            <td>
                                <div class="${btnGroup} gap-1" role="group">
                                    <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#readUser" title="Ver más" onclick="readUser(${user.id})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-primary ${ButtonVisually}" data-bs-toggle="${toggle}" title="${titleEditDisabled}" data-bs-content="Intenta editar desde otro perfil" data-bs-target="#updateUser" onclick="loadUser(${user.id})" ${ButtonDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger ${ButtonVisually}" onclick="confirmDelete(${user.id})" title="${titleDeleteDisabled}" ${ButtonDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                            fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
        });
    }

    tbody.innerHTML = content;
}

// Después de definir tu método debes crear tu función anónima ya que esta es la que permite cargar
// Métodos al entrar a la vista, es muy importante para métodos que debes cargar siempre al inicio de todo
(async () => {
    await loadTable();
    await loadProfileData();
})()

const loadData = async () => {
    let roleSelect = document.getElementById('roleList');
    let content = "<option selected value='' disabled>Roles</option>";

    if (roleList.length === 0) {
        content += `<option selected disabled>No hay roles disponibles</option>`;
    } else  {
        roleList.forEach(item => {
            const roleClass = getRoleName(item.name);
            content += `<option value="${item.id}">${roleClass}</option>`;
        })
    }
    roleSelect.innerHTML = content;
}

const findUserById = async id => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/user/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
        user = responseData.data;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

const loadUser = async id => {
    await findUserById(id);

    if (user.id === userLogged.id) {
        showError('No puedes modificar este Usuario','Para modificar tus datos debes ir a la vista Perfil');
        return;
    } else {
        let roleSelect = document.getElementById('u_roleList');

        let content = '';

        if (roleList.length === 0) {
            content += `<option selected disabled>No hay roles disponibles</option>`;
        } else  {
            roleList.forEach(item => {
                const roleClass = getRoleName(item.name);
                content += `<option value="${item.id}">${roleClass}</option>`;
            })
        }
        roleSelect.innerHTML = content;

        document.getElementById('u_name').value = user.name;
        document.getElementById('u_surname').value = user.surname;
        document.getElementById('u_lastname').value = user.lastname;
        document.getElementById('u_email').value = user.email;
        document.getElementById('u_username').value = user.username;
        roleSelect.value = user.rol.id;
    }
}

const search = async () => {
    // Cargar todas las categorías
    await findAllUsers();

    const userInput = document.getElementById('inputSearchUser');

    // Obtener el nombre de la categoría desde el input
    let userName = userInput.value.trim().toLowerCase();

    // Filtrar categorías que contengan el texto buscado
    let foundUsers = userList.filter(item => item.name.toLowerCase().includes(userName) || item.surname.toLowerCase().includes(userName) || item.lastname?.toLowerCase().includes(userName));

    // Obtener el tbody de la tabla
    let tbody = document.getElementById("tbody");
    if (!tbody) {
        console.error("No se encontró el elemento tbody");
        return;
    }

    let content = '';

    if (foundUsers.length > 0) {
        // Llenar la tabla con las categorías encontradas
        foundUsers.forEach((user, index) => {
            const roleClass = getRoleName(user.rol.name);

            const ButtonDisabled = (user.id === userLogged.id) ? 'disabled' : '';
            const ButtonVisually = (user.id === userLogged.id) ? 'd-none' : '';
            const btnGroup = (user.id === userLogged.id) ? '' : 'btn-group';
            const titleEditDisabled = (user.id === userLogged.id) ? 'No puedes editar tu propio usuario desde aquí.' : 'Editar';
            const titleDeleteDisabled = (user.id === userLogged.id) ? 'No puedes Eliminar tu propio usuario.' : 'Eliminar';
            const toggle = (user.id === userLogged.id) ? '' : 'modal';

            content += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td class="text-truncate">${user.name} ${user.surname} ${user.lastname || ''}</td>
                            <td>${user.email}</td>
                            <td>${roleClass}</td>
                            <td>
                                <div class="${btnGroup} gap-1" role="group">
                                    <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#readUser" title="Ver más" onclick="readUser(${user.id})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-primary ${ButtonVisually}" data-bs-toggle="${toggle}" title="${titleEditDisabled}" data-bs-content="Intenta editar desde otro perfil" data-bs-target="#updateUser" onclick="loadUser(${user.id})" ${ButtonDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger ${ButtonVisually}" onclick="confirmDelete(${user.id})" title="${titleDeleteDisabled}" ${ButtonDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                            fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
        });
    } else {
        // Mensaje si no hay registros que coincidan
        content = `<tr>
                <td colspan="5" class="text-center" style="height: 200px;">
                    No hay registros que coincidan con la búsqueda
                </td>    
            </tr>`;
    }

    // Actualizar el contenido de la tabla
    tbody.innerHTML = content;
    userInput.value = "";
};

const readUser = async id => {
    await findUserById(id);

    const roleClass = getRoleName(user.rol.name);

    document.getElementById('r_name').value = user.name || "Sin nombhre";
    document.getElementById('r_surname').value = user.surname || "Sin apellido";
    document.getElementById('r_lastname').value = user.lastname || "Sin apellido materno";
    document.getElementById('r_email').value = user.email || "Sin correo electrónico";
    document.getElementById('r_username').value = user.username || "Sin nombre de usuario";
    document.getElementById('r_roleList').value = roleClass || "Sin rol asignado";
}

// Crear usuario
const saveUser = async () => {
    const token = localStorage.getItem('token');

    let form = document.getElementById("saveForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('createUser'));

    // Variables para el formulario
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const lastnameInput = document.getElementById('lastname');
    const emailInput = document.getElementById('email');
    const usernameInput = document.getElementById('username');
    let roleSelect = document.getElementById('roleList');

    // Patterns
    const namePattern = /^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\s*)*$/;
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernamePattern = /^[a-zA-Z0-9]+$/;

        if (
            !namePattern.test(nameInput.value) ||
            !namePattern.test(surnameInput.value) ||
            (lastnameInput.value && !namePattern.test(lastnameInput.value)) || // Permite vacío, pero si tiene valor, debe cumplir el patrón
            !emailPattern.test(emailInput.value) ||
            !usernamePattern.test(usernameInput.value) ||
            !roleSelect.value
        ) {
            form.classList.add('was-validated');
    
            let title = "Campos incompletos o inválidos";
            let message = "";
    
            if (!nameInput.value || !surnameInput.value || !emailInput.value || !usernameInput.value || !roleSelect.value) {
                message = "Asegúrate de llenar correctamente todos los campos.";
            } else if (!namePattern.test(nameInput.value)) {
                message = "El campo de nombre no cumple con el formato requerido.";
            } else if (!namePattern.test(surnameInput.value)) {
                message = "El campo de apellido paterno no cumple con el formato requerido.";
            } else if (lastnameInput.value && !namePattern.test(lastnameInput.value)) {
                message = "El campo de apellido materno no cumple con el formato requerido.";
            } else if (!emailPattern.test(emailInput.value)) {
                message = "El campo de correo no cumple con el formato requerido.";
            } else if (!usernamePattern.test(usernameInput.value)) {
                message = "El campo de nombre de usuario no cumple con el formato requerido.";
            } else if (!roleSelect.value) {
                message = "Selecciona un rol válido.";
            }
    
            showError(title, message);
            return;
        }

    // No es necesario definir una constante para un body JSON
    user = {
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        lastname: document.getElementById('lastname').value || null, // Ese null está bien implementado
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        rol: {
            id: document.getElementById('roleList').value
        }
    };

    await fetch(`${URL}/api/user`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(async responseData => {
        console.log(responseData);
        user = {}; // Recuerda siempre limpiar el objeto JSON después de hacer cualquier consulta POST o PUT
        await showSuccess("Registro exitoso", "Usuario registrado exitosamente.");
        await loadTable(); // Procura volver a cargar la tabla antes de cerrar el modal
        form.reset();
        // Por eso es importante definir una variable "modal" ya no es necesario meter ese montón de código
        modal.hide();
    })
    .catch(error => {
        console.error('Error al registrar el usuario:', error.message);
        // Recuerda también resetear el modal y ocultarlo si ocurre un error inesperado
        form.reset();
        modal.hide();
        showError("Registro fallido", "Ha ocurrido un error y el usuario no pudo ser registrado.");
    });
}

// Actualizar usuario
const updateUser = async () => {
    const token = localStorage.getItem('token');

    let form = document.getElementById("updateForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('updateUser'));

    // Variables para el formulario
    const nameInput = document.getElementById('u_name');
    const surnameInput = document.getElementById('u_surname');
    const lastnameInput = document.getElementById('u_lastname');
    const emailInput = document.getElementById('u_email');
    const usernameInput = document.getElementById('u_username');
    let roleInput = document.getElementById('u_roleList');

    // Patterns
    const namePattern = /^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\s*)*$/;
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const usernamePattern = /^[a-zA-Z0-9]+$/;

    if (!form.checkValidity() || !namePattern.test(nameInput.value, surnameInput.value, lastnameInput.value) || !emailPattern.test(emailInput.value) || !usernamePattern.test(usernameInput.value)) {
        form.classList.add('was-validated');
        let title = "Campos incompletos o inválidos"
        let message = ""
        if (!nameInput.value || !surnameInput.value || !emailInput.value || !usernameInput.value || !roleInput.value) {
            message = "Asegúrate de llenar correctamente todos los campos.";
        } else if (!namePattern.test(nameInput.value)) {
            message = "El campo de nombre no cumple con el formato requerido";
        } else if (!namePattern.test(surnameInput.value)) {
            message = "El campo de apellido paterno no cumple con el formato requerido";
        } else if (!namePattern.test(lastnameInput.value)) {
            message = "El campo de apellido materno no cumple con el formato requerido";
        } else if (!emailPattern.test(emailInput.value)) {
            message = "El campo de correo no cumple con el formato requerido";
        } else if (!usernamePattern.test(usernameInput.value)) {
            message = "El campo de nombre de usuario no cumple con el formato requerido";
        } else if (!roleInput.value) {
            message = "Selecciona un rol válido";
        }
        
        showError(title, message);
        return;
    }

    updated = {
        id: user.id,
        name: document.getElementById('u_name').value,
        surname: document.getElementById('u_surname').value,
        lastname: document.getElementById('u_lastname').value || null,
        email: document.getElementById('u_email').value,
        username: document.getElementById('u_username').value,
        rol: {
            id: document.getElementById('u_roleList').value
        }
    };

    await fetch(`${URL}/api/user`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updated)
    })
    .then(response => response.json())
    .then(async responseData => {
        console.log(responseData);
        await showSuccess("Usuario actualizado", "El usuario se actualizó correctamente.");
        form.reset();
        modal.hide();
        await loadTable();
    })
    .catch(error => {
        console.error('Error al actualizar el usuario:', error.message);
        showError("Actualización fallida", "Ha ocurrido un error y el usuario no pudo ser actualizado.");
        modal.hide();
    });
};

// Eliminar usuario
const deleteUser = async (userId) => {
    const token = localStorage.getItem('token');

    const deleted = {id: userId}

    await fetch(`${URL}/api/user`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(deleted)
    })
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
        showSuccess("Eliminación exitosa", "Usuario eliminado exitosamente.");
        loadTable();
    })
    .catch(error => {
        console.error('Error al eliminar el usuario:', error.message);
        showError("Eliminación fallida", "Ha ocurrido un error y el usuario no pudo ser eliminado.");
    });
};

const confirmDelete = async (id) => {
    const token = localStorage.getItem('token');

    let user;
    let isManager = false;

    await fetch(`${URL}/api/user/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(responseData => {
        user = responseData.data;
    })
    .catch(error => {
        console.error('Error fetching user:', error);
    });

    await fetch(`${URL}/api/storage`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(responseData => {
        responseData.data.forEach(storage => {
            if (storage.user && storage.user.id === user.id) {
                isManager = true;
            }
        });
    })
    .catch(error => {
        console.error('Error fetching storages:', error);
    });

    if (isManager) {
        await showError(
            'No puedes eliminar este usuario', 
            'No puedes eliminar un usuario encargado de un almacén, deberías cambiar al encargado de ese almacén primero.'
        );
    } else if (user.id === userLogged.id) {
        await showError(
            'No puedes eliminarte a ti mismo!', 
            'Estás tratando de eliminar a tu propio usuario.'
        );
    } else {
        let title = "¿Eliminar usuario?";
        let message = "¿Estás seguro de que deseas eliminar este usuario?";
        await showWarningAlert(title, message, id);
    }
}

const logOut = async () => {
    await showLogoutWarning("¿Estás seguro de que deseas cerrar sesión?");
};

// BÚSQUEDA HEADER
const filterByRole = async (roleId) => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/user/rol/${roleId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
        
        const users = responseData.data || []; // Asegurar que sea un array
        console.log(users);
        
        const tbody = document.getElementById("tbody");

        if (!tbody) {
            console.error("No se encontró el elemento tbody");
            return;
        }

        let content = '';

        if (users.length > 0) {
            users.forEach((user, index) => {
                const roleClass = getRoleName(user.rol.name);

            const ButtonDisabled = (user.id === userLogged.id) ? 'disabled' : '';
            const ButtonVisually = (user.id === userLogged.id) ? 'd-none' : '';
            const btnGroup = (user.id === userLogged.id) ? '' : 'btn-group';
            const titleEditDisabled = (user.id === userLogged.id) ? 'No puedes editar tu propio usuario desde aquí.' : 'Editar';
            const titleDeleteDisabled = (user.id === userLogged.id) ? 'No puedes Eliminar tu propio usuario.' : 'Eliminar';
            const toggle = (user.id === userLogged.id) ? '' : 'modal';
            
            content += `<tr>
                            <th scope="row">${index + 1}</th>
                            <td class="text-truncate">${user.name} ${user.surname} ${user.lastname || ''}</td>
                            <td>${user.email}</td>
                            <td>${roleClass}</td>
                            <td>
                                <div class="${btnGroup} gap-1" role="group">
                                    <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#readUser" title="Ver más" onclick="readUser(${user.id})">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-primary ${ButtonVisually}" data-bs-toggle="${toggle}" title="${titleEditDisabled}" data-bs-content="Intenta editar desde otro perfil" data-bs-target="#updateUser" onclick="loadUser(${user.id})" ${ButtonDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-danger ${ButtonVisually}" onclick="confirmDelete(${user.id})" title="${titleDeleteDisabled}" ${ButtonDisabled}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                            fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
            });
        } else {
            content = `<tr>
                        <td colspan="5" class="text-center" style="height: 200px;">
                            No hay usuarios con este rol.
                        </td>
                    </tr>`;
        }

        tbody.innerHTML = content; // Actualizar el contenido del tbody
    })
    .catch(error => {
        if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED") || error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
        } else {
            console.error('Error fetching users by role:', error.message);
        }
    });
};


document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('roles');
    
    // Agregar evento change al select de roles
    roleSelect.addEventListener('change', async (event) => {
        const selectedRole = event.target.value;

        if (selectedRole) {
            try {
                await filterByRole(selectedRole);
            } catch (error) {
                console.error('Error al filtrar por rol:', error.message);
            }
        }
    });
});




/** ALERTS */
const showWarningAlert = (title, message, id) => {
    Swal.fire({
        icon: 'warning',
        title: title,
        text: message,
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Entendido',
        cancelButtonText: 'Cancelar',
        footer: '<span class="text-danger fw-bold">Nota: No podrás deshacer el cambio</span>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        customClass: {
            popup: document.body.classList.contains('swal-dark') ? 'swal-dark' : 'swal-light',
            confirmButton: 'btn btn-outline-danger disabled', // Inicialmente deshabilitado
            cancelButton: 'btn btn-outline-secondary',
        },
        html: `
            <div style="margin-top: 10px;">
                <p style="margin-bottom: 10px;">${message}</p>
                <div id="progress-bar" style="height: 5px; width: 0; background-color: #d33; transition: width 3s;"></div>
            </div>
        `,
        didOpen: () => {
            const confirmButton = Swal.getConfirmButton();
            const progressBar = document.getElementById('progress-bar');
            confirmButton.disabled = true;
            progressBar.style.width = '100%';

            setTimeout(() => {
                confirmButton.disabled = false;
                confirmButton.classList.remove('btn-outline-danger');
                confirmButton.classList.add('btn-danger');
                confirmButton.classList.remove('disabled');
            }, 3000);
        }
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(id);
        }
    });
};

function showSuccess(title, message) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        iconColor: 'white',
        icon: 'success',
        title: title,
        text: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
            popup: 'no-select-popup colored-toast'
        }
    });
}

function showError(title, error) {
    Swal.fire({
        toast: true,
        position: 'top-end',
        iconColor: 'white',
        icon: 'error',
        title: title,
        text: error,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
            popup: 'no-select-popup colored-toast'
        }
    });
}

function showLogoutWarning(message) {
    Swal.fire({
        icon: 'warning',
        title: '¡Cuidado!',
        text: message,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, salir',
        footer: '<span class="text-warning fw-bold">Nota: Tendrás que iniciar sesión de nuevo</span>',
        reverseButtons: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        stopKeydownPropagation: true,
        customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-outline-secondary',
            popup: 'no-select-popup',
        }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.replace('http://localhost:8080/index.html');
            localStorage.removeItem('token');
        }
    });
}
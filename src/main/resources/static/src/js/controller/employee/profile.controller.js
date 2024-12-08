const URL = 'http://localhost:8080';

const userLogged = JSON.parse(localStorage.getItem('user'));

let storageList = [];
let userInfo = {};

const roleMapping = {
    "ROLE_ADMIN": 1,
    "ROLE_EMPLOYEE": 2
}

const findAllStorage = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.replace('http://localhost:8080/401.html');
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
        storageList = responseData.data || [];
    })
    .catch(error => {
        if (error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
            localStorage.removeItem('token');
            window.location.replace('http://localhost:8080/401.html');
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });
}

const findUserById = async () => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/user/${userLogged.id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(responseData => {
        userInfo = responseData.data || {};
        console.log(userInfo);
        
    })
    .catch(error => {
        if (error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
            localStorage.removeItem('token');
            window.location.replace('http://localhost:8080/401.html');
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });

}

const loadData = async () => {
    await findUserById();

    document.getElementById('u_name').value = userInfo.name;
    document.getElementById('u_surname').value = userInfo.surname;
    document.getElementById('u_lastname').value = userInfo.lastname;
    document.getElementById('u_email').value = userInfo.email;
}

const updateUser = async () => {
    const token = localStorage.getItem('token');

    let form = document.getElementById("updateForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('updateUser'));

    // Captura de valores del formulario
    const nameInput = document.getElementById('u_name').value.trim();
    const surnameInput = document.getElementById('u_surname').value.trim();
    const lastnameInput = document.getElementById('u_lastname').value.trim() || null;
    const emailInput = document.getElementById('u_email').value.trim();

    // Validaciones
    const namePattern = /^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\s*)*$/;
    const emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!form.checkValidity() || !namePattern.test(nameInput) || !namePattern.test(surnameInput) || !emailPattern.test(emailInput)) {
        form.classList.add('was-validated');

        let title = "Campos incompletos o inválidos";
        let message = "";
        if (!namePattern.test(nameInput)) message = "El campo de nombre no cumple con el formato requerido.";
        else if (!namePattern.test(surnameInput)) message = "El campo de apellido paterno no cumple con el formato requerido.";
        else if (!emailPattern.test(emailInput)) message = "El campo de correo no cumple con el formato requerido.";
        else message = "Asegúrate de llenar correctamente todos los campos.";

        showError(title, message);
        return;
    }

    // Datos actualizados
    const updated = {
        id: userLogged.id, // Aquí se asume que tienes el ID del usuario logueado disponible
        name: nameInput,
        surname: surnameInput,
        lastname: lastnameInput,
        email: emailInput,
        username: userLogged.username, // El username no se modifica
        rol: {
            id: roleMapping[userLogged.rol]
        }
    };

    // Petición para actualizar datos del usuario
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
        await showSuccess("Perfil modificado", "Tu perfil se modificó correctamente.");
        form.reset();
        modal.hide();
        await loadProfileInfo();
    }). catch(error => {
        console.error('Error al actualizar el perfil:', error.message);
        showSuccess("Modificación fallida", "Ha ocurrido un error y tu perfil no pudo ser modificado.");
        modal.hide();
    })
}

const updatePassword = async (newPassword) => {
    const token = localStorage.getItem('token');

    let form = document.getElementById("updatePasswordForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('updatePassword'));

    console.log('Contrasena recibida: ', newPassword);

    // Datos actualizados
    const updated = {
        id: userLogged.id,
        name: userInfo.name,
        surname: userInfo.surname,
        lastname: userInfo.lastname,
        email: userInfo.email,
        username: userLogged.username,
        password: newPassword,
        rol: {
            id: roleMapping[userLogged.rol]
        }
    };

    console.log(updated);

    // Petición para actualizar datos del usuario
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
        await showSuccess("Contraseña actualizada", "Tu contraseaña se modificó correctamente.");
        form.reset();
        modal.hide();
    }). catch(error => {
        console.error('Error al actualizar la contraseña:', error.message);
        showSuccess("Modificación fallida", "Ha ocurrido un error y tu contraseña no pudo ser modificada.");
        modal.hide();
    })
}

const loadProfileData = async () => {
    if (userLogged) {
        console.log(userLogged);
        console.log(userLogged.rol);

        const profileText = document.getElementById("profile-text");
        
        profileText.innerText = `Perfil de ${userLogged.username}`;
    }
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

const loadProfileInfo = async () => {
    await findUserById();
    const roleClass = getRoleName(userLogged.rol);

    document.getElementById('username').innerText = userLogged.username || "No disponible";
    document.getElementById('role').innerText = roleClass || "No disponible";
    document.getElementById('email').innerText = userInfo.email || "No disponible";

    const name = userInfo.name;
    const surname = userInfo.surname;
    const lastname = userInfo.lastname || "";

    document.getElementById('fullName').innerText = `${name} ${surname} ${lastname}`;

    const managedStorage = storageList.find(storage => storage.user.id === userInfo.id);

    if (managedStorage) {
        document.getElementById('storageName').innerText = managedStorage.name;
        document.getElementById('visitStorage').hidden = false;
        document.getElementById('divVisitor').classList.remove('d-none');
    } else {
        document.getElementById('storageName').innerText = 'No gestionas ningún almacén';
        document.getElementById('divVisitor').classList.add('d-none');
    }
}

(async () => {
    await findAllStorage();
    await loadProfileData();
    await loadProfileInfo();
})()

const visitStorage = async () => {
    window.location.replace('http://localhost:8080/view/employee/e.storage.html');
}

function showPassword() {
    const eyeOpen = document.querySelector(".eyeOpen");
    const eyeClose = document.querySelector(".eyeClose");
    var password = document.getElementById("currentPassword");

    if (password.type === "password") {
        password.type = "text";
        eyeOpen.style.display = "block";
        eyeClose.style.display = "none";
    } else {
        password.type = "password";
        eyeOpen.style.display = "none";
        eyeClose.style.display = "block";
    }
}
function showPassword1() {
    const eyeOpen = document.querySelector(".eyeOpen1");
    const eyeClose = document.querySelector(".eyeClose1");
    var password1 = document.getElementById("newPassword");

    if (password1.type === "password") {
        password1.type = "text";
        eyeOpen.style.display = "block";
        eyeClose.style.display = "none";
    } else {
        password1.type = "password";
        eyeOpen.style.display = "none";
        eyeClose.style.display = "block";
    }
}
//Funcion para mostrar contraseña doble
function showDoublePassword() {
    const eyeOpen = document.querySelector(".eyeOpen2");
    const eyeClose = document.querySelector(".eyeClose2");
    var password2 = document.getElementById("confirmPassword");

    if (password2.type === "password") {
        password2.type = "text";
        eyeOpen.style.display = "block";
        eyeClose.style.display = "none";
    } else {
        password2.type = "password";
        eyeOpen.style.display = "none";
        eyeClose.style.display = "block";
    }
}

const confirmUpdatePassword = async () => {
    let form = document.getElementById("updatePasswordForm");

    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();

    if (newPassword !== confirmPassword || !currentPassword || !newPassword || !confirmPassword) {
        form.classList.add('was-validated');

        let title = "Campos incompletos o inválidos";
        let message = "";
        if (!currentPassword) message = "La contraseña actual es obligatoria.";
        else if (!newPassword) message = "La nueva contraseña es obligatoria.";
        else if (newPassword !== confirmPassword) message = "Las contraseñas no coinciden.";

        showError(title, message);
        return;
    }

        // Verificar si la contraseña actual es correcta
        const authLoginDTO = {
            user: userLogged.username,
            password: currentPassword
        };
    
        const response = await fetch(`${URL}/auth/verifyCurrentPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(authLoginDTO),
        });
    
        if (!response.ok) {
            form.classList.add('was-validated');
            showError("Contraseña incorrecta", "La contraseña actual no es correcta.");
            return;
        }

        console.log('Enviando contrasena: ', newPassword);
    await showUpdatePassword('¿Estás seguro de que deseas cambiar tu contraseña?', newPassword);
}

const logOut = async () => {
    await showLogoutWarning("¿Estás seguro de que deseas cerrar sesión?");
}

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

function showUpdatePassword(message, newPassword) {
    Swal.fire({
        icon: 'warning',
        title: '¡Cuidado!',
        text: message,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, salir',
        footer: '<span class="text-warning fw-bold">Nota: Tu sesión actual expirará y tendrás que iniciar sesión de nuevo</span>',
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
            console.log('Contraseña nueva es: ', newPassword);
            
            updatePassword(newPassword);
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
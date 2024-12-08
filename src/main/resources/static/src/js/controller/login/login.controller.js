document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById('loginForm');
    let formButton = document.getElementById('formButton');
    let spinner = document.getElementById('loginSpinner');

    if (formButton) {
        formButton.addEventListener('click', async event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                let title = "Campos incompletos"
                let message = "Debes ingresar tu correo electrónico y contraseña para acceder."
                showErrorWarning(title, message);
            } else {
                spinner.classList.remove('visually-hidden');
                await login();
            }
            form.classList.add('was-validated');
        });
    }

    form.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            formButton.click();
        }
    });
});

const login = async () => {
    let dto = {
        password: document.getElementById('floatingPassword').value, 
        user: document.getElementById('floatingInput').value,
    }

    // Bloques de una petición FETCH
    await fetch('http://localhost:8080/auth', { // Bloque Configuración
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dto)
    })
    .then(response => {
        console.log("Respuesta del servidor recibida:", response);
        return response.json();
    })
    .then(responseData => { // Bloque Transformación y Manipulación
        // DEBUGGING ELIMINAR POSTERIORMENTE
        console.log("Datos procesados desde el servidor:", responseData);
        if (responseData.data) {
            localStorage.setItem('token', responseData.data.token);
            localStorage.setItem('user', JSON.stringify(responseData.data.user));
            let title = "¡Bienvenido!"
            let message = "Redirigiendo a la ventana de inicio"
            showSuccess(title, message);
            // DEBUGGING ELIMINAR POSTERIORMENTE
            console.log("Login exitoso, token guardado y redirigiendo.");
            return responseData.data.user;
        } else {
            // DEBUGGING ELIMINAR POSTERIORMENTE
            console.error("Error: No se recibió un token válido.");
            let title = "Credenciales inválidas"
            let message = "El usuario y/o contraseña NO son correctos."
            showErrorWarning(title, message);
        }
    })
    .catch(error => {
        // DEBUGGING ELIMINAR POSTERIORMENTE
        console.error("Error en la solicitud de login:", error);
        let message = "Error al intentar iniciar sesión. ¿El servidor estará caido?"
        let title = "Fallo inesperado"
        showErrorWarning(title, message);
    });
}

function showPassword() {
    const eyeOpen = document.querySelector(".eyeOpen1");
    const eyeClose = document.querySelector(".eyeClose1");
    var password1 = document.getElementById("floatingPassword");

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

function showErrorWarning(title, error) {
    let spinner = document.getElementById('loginSpinner');
    Swal.fire({
        toast: true,
        position: 'top-end',
        iconColor: 'white',
        icon: 'error',
        title: title,
        text: error,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        customClass: {
            popup: 'no-select-popup colored-toast'
        }
    });
    setTimeout(function() {
        spinner.classList.add('visually-hidden');
    }, 250);
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
        timer: 1500,
        timerProgressBar: true,
        customClass: {
            popup: 'no-select-popup colored-toast'
        }
    });
    setTimeout(function() {
        window.location.replace('http://localhost:8080/view/employee/profile.html');
    }, 1500);
}
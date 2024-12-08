const URL = 'http://localhost:8080';

let categoryList = [];
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

// Configuración de la tabla
const findAllCategoy = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.replace('http://localhost:8080/view/employee/profile.html');
        return;
    } else if (userLogged.rol != 'ROLE_ADMIN') {
        window.location.replace('http://localhost:8080/403.html');
    }

    await fetch (`${URL}/api/category`, {
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
        categoryList = responseData.data;
    }).catch(error => {
        console.error('Error fetching category data:', error);
    })
};

const loadTable = async () => {
    await findAllCategoy();
    console.log(categoryList)

    let tbody = document.getElementById("tbody");
    if (!tbody) {
        console.error("No se encontró el elemento tbody");
        return;
    }

    let content = '';

    if (categoryList.length === 0) {
        content = `
        <tr>
            <td colspan="3" class="text-center" style="height: 200px;">
                Aún no hay registros
            </td>    
        </tr>
        `;
    } else {
        categoryList.forEach((item, index) => {
            const colorName = colorType(item.color);
            content += `<tr>
                <th scope="row">${index + 1}</th>
                <td>${item.name}</td>
                <td><h5><span class="badge ${colorName} user-select-none shadow-sm">${colorName}</span></h5></td>
                <td>
                    <div class="btn-group gap-2" role="group" title="Editar">
                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateCategory" onclick="loadCategory(${item.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>`;

        });
    }

    tbody.innerHTML = content;
}
const findCategoryById = async id => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/category/${id}`, {
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
        category = responseData.data;
    }).catch(error => {
        console.error('Error fetching category data:', error);
    });
}

const loadCategory = async id => {
    await findCategoryById(id);

    document.getElementById('u_name').value = category.name;
}

(async () => {
    await loadTable();
    await loadProfileData();
})();

const colorType =  (idColor) => {
    switch(idColor){
        case 0:
            return 'Neutro';
        case 1:
            return 'Azul';
        case 2:
            return 'Verde';
        case 3:
            return 'Rojo';
        case 4:
            return 'Amarillo';
        case 5:
            return 'Naranja';
        case 6:
            return 'Morado';
    }
}

const search = async () => {
    // Cargar todas las categorías
    await findAllCategoy();

    const categoryInput = document.getElementById('buscarCategoria');

    // Obtener el nombre de la categoría desde el input
    let categoryName = document.getElementById('buscarCategoria').value.trim().toLowerCase();

    // Filtrar categorías que contengan el texto buscado
    let foundCategories = categoryList.filter(item => item.name.toLowerCase().includes(categoryName));

    // Obtener el tbody de la tabla
    let tbody = document.getElementById("tbody");
    if (!tbody) {
        console.error("No se encontró el elemento tbody");
        return;
    }

    let content = '';

    if (foundCategories.length > 0) {
        // Llenar la tabla con las categorías encontradas
        foundCategories.forEach((item, index) => {
            const colorName = colorType(item.color);
            content += `<tr>
                <th scope="row">${index + 1}</th>
                <td>${item.name}</td>
                <td><h5><span class="badge ${colorName} user-select-none shadow-sm">${colorName}</span></h5></td>
                <td>
                    <div class="btn-group gap-2" role="group" title="Editar">
                        <button class="btn btn-sm btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateCategory" onclick="loadCategory(${item.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>`;
        });
    } else {
        // Mensaje si no hay registros que coincidan
        content = `<tr>
                <td colspan="4" class="text-center" style="height: 200px;">
                    No hay registros que coincidan con la búsqueda
                </td>    
            </tr>`;
    }

    // Actualizar el contenido de la tabla
    tbody.innerHTML = content;
    document.getElementById('buscarCategoria').value = "";
};

const saveCategory = async () => {
    const token = localStorage.getItem('token');

    let form = document.getElementById("saveForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('createCategory'));

    const nameInput = document.getElementById('name');
    const colorList = document.getElementById('colorList');
    
    const namePattern = /^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\s*)*$/;
    if (!form.checkValidity() || !namePattern.test(nameInput.value)){
        form.classList.add('was-validated');
        let message = "";
        let title = "Campos incompletos o no validos"
        if(!nameInput.value){
            message = "El campo de nombre esta vacio";
        } else if (!namePattern.test(nameInput.value)){
            message = "El campo de nombre no cumple con el formato que se requiere"
        } else if (!colorList.value) {
            message = "Selecciona un color válida";
        } 
        showError(title, message);
        return;
    }
        category = {
            name: document.getElementById('name').value,
            color: document.getElementById('colorList').value
        };

        await fetch(`${URL}/api/category`,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(category)
        })
        .then(response => response.json())
        .then(async responseData => {
            console.log(responseData);
            category = {};
            await showSuccess("Registro exitoso", "Categoria registrada exitosamente");
            await loadTable();
            form.reset();
            modal.hide();
        }).catch(error => {
            console.error('Error fetching category data:', error);
            form.reset();
            modal.hide();
            showError("Registro fallido", "Ha ocurrido un error al registrar la categoria");
        });
}

const updateCategory = async () => {

    const token = localStorage.getItem('token');

    let form = document.getElementById('updateForm');
    let modal = bootstrap.Modal.getInstance(document.getElementById('updateCategory'));

    const nameInput = document.getElementById('u_name');
    const colorList = document.getElementById('u_colorList');
    const namePattern = /^([A-ZÁÉÍÓÚÑ]{1}[a-záéíóúñ]+\s*)*$/;

    if (!form.checkValidity() || !namePattern.test(nameInput.value)){
        form.classList.add('was-validated');
        let message = "";
        let title = "Campos incompletos o no validos"
        if(!nameInput.value){
            message = "El campo de nombre esta vacio";
        } else if (!namePattern.test(nameInput.value)){
            message = "El campo de nombre no cumple con el formato que se requiere"
        } else if (!colorList.value) {
            message = "Selecciona un color válida";
        } 
        showError(title, message);
        return;
    }
    let updated = {
        id: category.id,
        name: document.getElementById('u_name').value,
        color: document.getElementById('u_colorList').value
    };
    await fetch(`${URL}/api/category`,{
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updated)
    })
    .then(response => response.json())
    .then(async responseData =>{
        console.log(responseData);
        category = {};
        await showSuccess('Actualizacion exitosa','Categoria actualizada correctamente');
        await loadTable();
        form.reset();
        modal.hide();
    }).catch(error => {
        console.error('Error fetching category data:', error);
        form.reset();
        showError("Actualización fallida", "Ha ocurrido un error y la categoria no pudo ser actualizado")
        
    })


    
    


}

function confirmDelete (id) {
    let title = "¿Eliminar categoría?";
    let message = "¿Estás seguro de que deseas eliminar este categoría?";
    showWarningAlert(title, message, id);
}

const logOut = async () => {
    await showLogoutWarning("¿Estás seguro de que deseas cerrar sesión?");
}

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
            window.dispatchEvent(new Event('swal:open'));
            const confirmButton = Swal.getConfirmButton();
            const progressBar = document.getElementById('progress-bar');

            confirmButton.disabled = true;
            progressBar.style.width = '100%';

            // Habilitar botón después de 3 segundos
            setTimeout(() => {
                confirmButton.disabled = false;
                confirmButton.classList.remove('btn-outline-danger');
                confirmButton.classList.add('btn-danger');
                confirmButton.classList.remove('disabled');
            }, 3000);
        },
        didClose: () => {
            window.dispatchEvent(new Event('swal:close'));
        }
    }).then((result) => {
        if (result.isConfirmed) {
            deleteStorage(id);
        }
    });
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
        timer: 2000,
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
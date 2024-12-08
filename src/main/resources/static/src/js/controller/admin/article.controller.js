const URL = 'http://localhost:8080';

let articleList = [];
let storgeList = [];
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

// Obtiene todos los articulos
const findAllArticle = async () =>{
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.replace('http://localhost:8080/view/employee/profile.html');
        return;
    } else if (userLogged.rol != 'ROLE_ADMIN') {
        window.location.replace('http://localhost:8080/403.html');
    }

    await fetch(`${URL}/api/articles`, {
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
        articleList = responseData.data || [];
    }).catch(error => {
        if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED")) {
            console.error('Error al conectar con el servidor:', error.message);
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });
}

const loadCards = async () => {
    await findAllArticle();

    const articleContainer = document.getElementById("articleContainer");
    articleContainer.innerHTML = ''; 

    if (articleList.length === 0) {
        articleContainer.innerHTML = `
            <div class="text-center my-5">
                <p class="fs-4">No hay artículos registrados.</p>
            </div>
        `;
        return;
    }

    articleList.forEach(article => {
        const categoryClass = getCategoryBadgeClass(article.category.color);

        const card = document.createElement('div');
        card.classList.add('col-12', 'col-md-6', 'col-lg-4');
        card.innerHTML = `
            <div class="card border">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-start mb-0 text-truncate">${article.name}</h5>
                            <p class="text-end mb-0 text-truncate"><small class="text-body-secondary user-select-none">${article.registeredOn}</small></p>
                    </div>
                    <h5 class="card-text text-start"><span class="badge ${categoryClass} user-select-none shadow-sm">${article.category.name || 'Sin categoría'}</span></h5>
                    <p class="card-text text-start"><strong>Stock:</strong> ${article.onStock}</p>
                </div>
                <div class="card-footer text-end">
                    <div class="btn-group gap-1">
                        <button type="button" class="btn btn-outline-info" onclick="showDescription('${article.name}', '${article.description}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-primary" onclick="editArticle(${article.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                            </svg>
                        </button>
                        <button type="button" class="btn btn-outline-danger" onclick="confirmDelete(${article.id})">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        articleContainer.appendChild(card);
    });
};

(async () => {
    await loadCards();
    await loadProfileData();
})()



// Función para ver la descripcion
const showDescription = (title, description) => {
    const modalTitle = document.getElementById("modalTitle");
    modalTitle.textContent = title;

    const modalBody = document.getElementById("modalBody");
    modalBody.value = description;

    const descriptionModal = new bootstrap.Modal(document.getElementById("descriptionModal"));
    descriptionModal.show();
};


// Función para cargar datos en el modal de edición
const editArticle = async (id) => {
    await findArticleById(id);

    const storageIds = article.storageIds || [];

    document.getElementById('editArticleId').value = article.id;
    document.getElementById('editArticleName').value = article.name;
    document.getElementById('editArticleDescription').value = article.description;
    document.getElementById('editArticleStock').value = article.onStock;
    const categorySelect = document.getElementById('editArticleCategory');

    if (storageIds.length > 0) {
        categorySelect.disabled = true;
    }

    categorySelect.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>';
    categoryList.forEach(category => {
        const selected = article.category?.id === category.id ? 'selected' : '';
        categorySelect.innerHTML += `<option value="${category.id}" ${selected}>${category.name}</option>`;
    });

    const editModal = new bootstrap.Modal(document.getElementById('editArticleModal'));
    editModal.show();
};

// Guardar cambios en el artículo
document.addEventListener('DOMContentLoaded', () => {
    const saveArticleButton = document.getElementById('saveArticleChanges');
    if (saveArticleButton) {
        saveArticleButton.addEventListener('click', async () => {
            const id = document.getElementById('editArticleId').value;
            const name = document.getElementById('editArticleName').value;
            const description = document.getElementById('editArticleDescription').value;
            const category = document.getElementById('editArticleCategory').value;
            const stock = document.getElementById('editArticleStock').value;

            const updatedArticle = {
                id: parseInt(id),
                name,
                description,
                onStock: parseInt(stock),
                category: { id: parseInt(category) }
            };

            try {
                const response = await fetch(`${URL}/api/articles`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(updatedArticle)
                });

                if (response.ok) {
                    showSuccess('Artículo actualizado exitosamente');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editArticleModal'));
                    modal.hide();
                    loadCards();
                } else {
                    const error = await response.json();
                    showError(`Error al actualizar: ${error.message}`);
                }
            } catch (err) {
                console.error('Error al actualizar artículo:', err);
                showError("Error al actualizar artículos", "No se pudieron actualizar los artículos. Por favor, inténtalo nuevamente.");
            }
        });
    }
});

// Obtiene todas las categorías
const findAllCategory = async () => {
    const token = localStorage.getItem('token');
    await fetch(`${URL}/api/category`, {
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
        categoryList = responseData.data || [];
    })
    .catch(error => {
        console.error('Error fetching category data:', error);
    });
};

// Obtiene todos los almacenes
const findAllStorages = async () => {
    const token = localStorage.getItem('token');
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
        console.log(responseData);
        storageList = responseData.data || [];
    })
    .catch(error => {
        console.error('Error fetching storge data:', error);
    });
};

// Obtiene todos los usuarios
const findAllUser = async () => {
    const token = localStorage.getItem('token');

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
        userList = responseData.data;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

const getCategoryBadgeClass = (idColor) => {
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

(async () => {
    await findAllCategory();
    await findAllUser();
    await findAllStorages();
})();

// MODALS CONFIGURATION
const loadData = async () => {
    await findAllCategory();
    await findAllUser();
    await findAllStorages();

    let categorySelect = document.getElementById('categoryList');
    let userSelect = document.getElementById('userList');
    let content = "<option selected value='' disabled>Categorías</option>";

    if (categoryList.length === 0) {
        content += `<option selected disabled>No hay categorías registradas</option>`;
    } else  {
        categoryList.forEach(item => {
            content += `<option value="${item.id}">${item.name}</option>`;
        })
    };
    categorySelect.innerHTML = content;
}

const findArticleById = async id => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/articles/${id}`, {
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
        article = responseData.data;
        storgeList = article.storages || [];
    }).catch(error => {
        console.error('Error fetching category data:', error);
    });
}

function addRow(button) {
    // Obtener la fila actual (donde se hizo clic en el botón)
    const currentRow = button.closest('tr');
    // Obtener el cuerpo de la tabla
    const tableBody = currentRow.parentElement;

    // Clonar la fila actual para crear una nueva fila vacía
    const newRow = currentRow.cloneNode(true);

    // Limpiar los valores de los campos en la nueva fila
    const inputs = newRow.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number') {
            input.value = '';
        } else if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        }
    });

    // Insertar la nueva fila después de la fila actual
    currentRow.insertAdjacentElement('afterend', newRow);

    // Actualizar los índices de todas las filas
    updateRowIndices();
}

// Función para eliminar una fila de la tabla
function removeRow(button) {
    // Obtener la fila actual y el cuerpo de la tabla
    const row = button.closest('tr');
    const tableBody = row.parentElement;

    // Eliminar la fila si no es la única
    if (tableBody.children.length > 1) {
        row.remove();
        // Actualizar los índices de todas las filas
        updateRowIndices();
    } else {
        showErrorAlert('No se puede eliminar la única fila.');
    }
}

function updateRowIndices() {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach((row, index) => {
        const indexCell = row.querySelector('th');
        if (indexCell) {
            indexCell.textContent = index + 1; // Actualizar el índice de la fila
        }
    });
}

const saveArticles = async () => {
    const token = localStorage.getItem('token');
    const tableBody = document.querySelector('#articleTable tbody');
    const rows = tableBody.querySelectorAll('tr');

    const articles = [];
    let isValid = true;

    rows.forEach((row, index) => {
        const nameInput = row.querySelector('input[name="name"]');
        const descriptionInput = row.querySelector('input[name="description"]');
        const onStockInput = row.querySelector('input[name="onStock"]');
        const categorySelect = row.querySelector('select');

        if (!nameInput.value || !descriptionInput.value || !onStockInput.value || !categorySelect.value) {
            isValid = false;
            showError("Campos incompletos", `Por favor, completa todos los campos en la fila ${index + 1}.`);
            return;
        }

        const article = {
            name: nameInput.value,
            description: descriptionInput.value,
            onStock: parseInt(onStockInput.value),
            category: { id: parseInt(categorySelect.value) }
        };

        articles.push(article);
    });

    if (!isValid) {
        return;
    }

    try {
        const response = await fetch(`${URL}/api/articles/batch`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(articles)
        });

        if (response.ok) {
            const result = await response.json();
            showSuccess("Registro exitoso", "Los artículos han sido registrados correctamente.");
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerArticles'));
            modal.hide();
            await loadCards();
        } else {
            const error = await response.json();
            showError("Error al registrar artículos", error.message || "Ocurrió un error inesperado.");
        }
    } catch (error) {
        console.error('Error al registrar artículos:', error);
        showError("Error al registrar artículos", "No se pudieron registrar los artículos. Por favor, inténtalo nuevamente.");
    }
};

const search = async () => {
    // Cargar todos los artículos
    await findAllArticle();

    // Obtener el valor ingresado por el usuario
    const articleInput = document.getElementById('searchArticle');
    const articleName = articleInput.value.trim().toLowerCase();

    // Filtrar los artículos que coincidan con el término de búsqueda
    const foundArticles = articleList.filter(item =>
        item.name.toLowerCase().includes(articleName)
    );

    // Obtener el contenedor de las cards
    const articleContainer = document.getElementById("articleContainer");
    articleContainer.innerHTML = ''; // Limpiar el contenido previo

    if (foundArticles.length > 0) {
        // Crear las cards para los artículos encontrados
        foundArticles.forEach(article => {
            const categoryClass = getCategoryBadgeClass(article.category.color);

            const card = document.createElement('div');
            card.classList.add('col-12', 'col-md-6', 'col-lg-4');
            card.innerHTML = `
                <div class="card border">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-start mb-0 text-truncate">${article.name}</h5>
                            <p class="text-end mb-0 text-truncate"><small class="text-body-secondary user-select-none">${article.registeredOn}</small></p>
                        </div>
                        <h5 class="card-text text-start"><span class="badge ${categoryClass} user-select-none shadow-sm">${article.category.name || 'Sin categoría'}</span></h5>
                        <p class="card-text text-start"><strong>Stock:</strong> ${article.onStock}</p>
                    </div>
                    <div class="card-footer text-end">
                        <div class="btn-group gap-1">
                            <button type="button" class="btn btn-outline-info" onclick="showDescription('${article.name}', '${article.description}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-primary" onclick="editArticle(${article.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-danger" onclick="confirmDelete(${article.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                    fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            articleContainer.appendChild(card);
        });
    } else {
        // Mensaje si no hay resultados
        articleContainer.innerHTML = `
            <div class="text-center my-5">
                <p class="fs-4">No hay registros que coincidan con la búsqueda.</p>
            </div>
        `;
    }

    // Limpiar el campo de búsqueda
    articleInput.value = '';
};


const deleteArticle = async (articleId) => {
    const token = localStorage.getItem('token');

    try {
        // Verificar si el artículo tiene almacenes asignados
        const response = await fetch(`${URL}/api/articles/${articleId}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la información del artículo.");
        }

        const article = await response.json();
        const storageIds = article.data?.storages?.map(storage => storage.id) || [];

        if (storageIds.length > 0) {
            showError("No se puede eliminar", "El artículo está asignado a uno o más almacenes.");
            return;
        }

        // Si no tiene almacenes, proceder con la eliminación
        const deleteResponse = await fetch(`${URL}/api/articles/${articleId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!deleteResponse.ok) {
            throw new Error("Error en la eliminación del artículo.");
        }

        showSuccess("Eliminación exitosa", "El artículo fue eliminado exitosamente.");
        await loadCards(); // Recargar las tarjetas
    } catch (error) {
        console.error("Error al eliminar el artículo:", error.message);
        showError("Error al eliminar", error.message || "No se pudo eliminar el artículo. Intenta nuevamente.");
    }
};


const confirmDelete = async (id) => {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${URL}/api/articles/${id}`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("No se pudo obtener la información del artículo.");
        }

        const article = await response.json();
        const storageIds = article.data?.storageIds || []; // Obtén directamente storageIds del response

        if (storageIds.length > 0) {
            showError("No se puede eliminar", "El artículo está asignado a uno o más almacenes.");
            return;
        }

        // Si no hay storageIds, muestra la alerta de confirmación
        let title = "¿Eliminar artículo?";
        let message = "¿Estás seguro de que deseas eliminar este artículo?";
        await showWarningAlert(title, message, id);

    } catch (error) {
        console.error("Error al eliminar el artículo:", error.message);
        showError("Error al eliminar", error.message || "No se pudo eliminar el artículo. Intenta nuevamente.");
    }
};

const logOut = async () => {
    await showLogoutWarning("¿Estás seguro de que deseas cerrar sesión?");
}

const filterByCategory = async () => {
    // Cargar todos los artículos
    await findAllArticle();

    // Obtener el valor seleccionado en el select
    const categorySelect = document.getElementById('categories');
    const selectedCategoryId = categorySelect.value;

    // Filtrar los artículos que pertenezcan a la categoría seleccionada
    const filteredArticles = articleList.filter(article => 
        article.category && article.category.id == selectedCategoryId
    );

    // Obtener el contenedor de las cards
    const articleContainer = document.getElementById("articleContainer");
    articleContainer.innerHTML = ''; // Limpiar el contenido previo

    if (filteredArticles.length > 0) {
        // Crear las cards para los artículos filtrados
        filteredArticles.forEach(article => {
            const categoryClass = getCategoryBadgeClass(article.category.color);

            const card = document.createElement('div');
            card.classList.add('col-12', 'col-md-6', 'col-lg-4');
            card.innerHTML = `
                <div class="card border">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-start mb-0 text-truncate">${article.name}</h5>
                            <p class="text-end mb-0 text-truncate"><small class="text-body-secondary user-select-none">${article.registeredOn}</small></p>
                        </div>
                        <h5 class="card-text text-start"><span class="badge ${categoryClass} user-select-none shadow-sm">${article.category.name || 'Sin categoría'}</span></h5>
                        <p class="card-text text-start"><strong>Stock:</strong> ${article.onStock}</p>
                    </div>
                    <div class="card-footer text-end">
                        <div class="btn-group gap-1">
                            <button type="button" class="btn btn-outline-info" onclick="showDescription('${article.name}', '${article.description}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-primary" onclick="editArticle(${article.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                    fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                    <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                </svg>
                            </button>
                            <button type="button" class="btn btn-outline-danger" onclick="confirmDelete(${article.id})">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                                    fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            articleContainer.appendChild(card);
        });
    } else {
        // Mostrar mensaje si no hay artículos en la categoría
        articleContainer.innerHTML = `
            <div class="text-center my-5">
                <p class="fs-4">No hay artículos en esta categoría.</p>
            </div>
        `;
    }
};

// HEADER DE BÚSQUEDA
const loadCategories = async () => {
    let categorySelect = document.getElementById('categories');

    await findAllCategory();

    let content = "<option selected disabled>Filtrar por categoría</option>";

    if (categoryList.length === 0) {
        content = `<option selected disabled>No hay categorías registradas</option>`;
    } else  {
        categoryList.forEach(item => {
            content += `<option value="${item.id}">${item.name}</option>`;
        })
    };
    categorySelect.innerHTML = content;
    document.getElementById('categories').addEventListener('change', filterByCategory);
};

document.addEventListener('DOMContentLoaded', loadCategories);

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
            deleteArticle(id);
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
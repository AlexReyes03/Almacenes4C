const URL = 'http://localhost:8080';

let storageList = [];
let userList = [];
let categoryList = [];
let articleinStorageList = [];
let allArticles = [];
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

// TABLE CONFIGURATION
const findAllStorage = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.replace('http://localhost:8080/view/employee/profile.html');
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
        console.log(responseData);
        // Filtra solo el almacén gestionado por el usuario conectado
        storageList = responseData.data?.filter(storage => storage.user.id === userLogged.id) || [];
    }).catch(error => {
        if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED") || error.message.includes("Authentica")) {
            console.error('Error al conectar con el servidor:', error.message);
        } else {
            console.error('Error fetching storage data:', error.message);
        }
    });
}

const loadTable = async () => {
    await findAllStorage();

    let tbody = document.getElementById("tbody");
    let content = '';

    if (storageList.length === 0) {
        content = `
            <tr>
                <td colspan="5" class="text-center" style="height: 200px;">
                    No gestionas ningún almacén
                </td>
            </tr>
        `;
    } else {
        storageList.forEach((item, index) => {
            const categoryClass = getCategoryBadgeClass(item.category.id);
            const lastname = item.user.lastname ? item.user.lastname : '';

            content += `<tr>
                            <td>${item.name}</td>
                            <td>${item.user.name} ${item.user.surname} ${lastname}</td>
                            <td><h5><span class="badge ${categoryClass} user-select-none shadow-sm">${item.category.name}</span></h5></td>
                            <td>
                                <div class="btn-group gap-1" role="group">
                                    <button type="button" class="btn btn-outline-info" data-bs-toggle="modal" data-bs-target="#readStorage" onclick="readStorage(${item.id})" title="Ver más">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                            <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                            <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#updateStorage" onclick="loadStorage(${item.id})" title="Editar">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                                        </svg>
                                    </button>
                                    <button type="button" class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#itemControl" onclick="manageItems(${item.id})" title="Gestionar artículos en almacén">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-boxes" viewBox="0 0 16 16">
                                            <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434zM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567zM7.5 9.933l-2.75 1.571v3.134l2.75-1.571zm1 3.134 2.75 1.571v-3.134L8.5 9.933zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567zm2.242-2.433V3.504L8.5 5.076V8.21zM7.5 8.21V5.076L4.75 3.504v3.134zM5.258 2.643 8 4.21l2.742-1.567L8 1.076zM15 9.933l-2.75 1.571v3.134L15 13.067zM3.75 14.638v-3.134L1 9.933v3.134z"/>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>`;
        });
    }

    tbody.innerHTML = content;
}

(async () => {
    await loadTable();
    await loadProfileData();
})()

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
        categoryList = responseData.data;
    }).catch(error => {
        console.error('Error fetching category data:', error);
    });
}

const findAllUser = async () => {
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
        console.log(responseData);
        userList = responseData.data;
    }).catch(error => {
        console.error('Error fetching user data:', error);
    });
}

const loadAllArticles = async () => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/articles`, { // Cambia el endpoint según tu API
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        allArticles = data.data; // Asignar la lista de artículos no asignados
    })
    .catch(error => {
        console.error("Error fetching all articles:", error);
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
})()

// MODALS CONFIGURATION
const loadData = async () => {
    await findAllCategory();
    await findAllUser();

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

    const usersWithStorage = storageList.map(storage => storage.user.id);

    let availableUsers = userList.filter(user => !usersWithStorage.includes(user.id));

    // Configurar lista de usuarios
    if (availableUsers.length === 0) {
        content = `<option selected disabled>No hay usuarios disponibles</option>`;
    } else {
        content = "<option selected value='' disabled>Usuarios</option>";
        availableUsers.forEach(item => {
            const lastname = item.lastname ? item.lastname : '';
            content += `<option value="${item.id}">${item.name} ${item.surname} ${lastname}</option>`;
        });
    }
    userSelect.innerHTML = content;
}

const findStorageById = async id => {
    const token = localStorage.getItem('token');

    await fetch(`${URL}/api/storage/${id}`, {
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
        storage = responseData.data;
        articleinStorageList = storage.articles || [];
    }).catch(error => {
        console.error('Error fetching storage data:', error);
    });
}

const loadStorage = async id => {
    await findStorageById(id);
    await findAllCategory();
    await findAllUser();

    let categorySelect = document.getElementById('u_categoryList');
    let content = '';

    const articleIds = storage.articles ? storage.articles.map(article => article.id) : [];

    if (articleIds.length > 0) {
        categorySelect.disabled = true;
    } else {
        categorySelect.disabled = false;
    }

    if (categoryList.length === 0) {
        content += `<option selected disabled>No hay categorías registradas</option>`;
    } else  {
        categoryList.forEach(item => {
            content += `<option value="${item.id}">${item.name}</option>`;
        })
    }
    categorySelect.innerHTML = content;

    const userName = storage.user?.name || "";
    const userSurname = storage.user?.surname || "";
    const userLastname = storage.user?.lastname || "";
    const fullUserName = `${userName} ${userSurname} ${userLastname}`.trim() || "Sin encargado";
    document.getElementById('u_user').value = fullUserName;

    document.getElementById("u_name").value = storage.name;
    categorySelect.value = storage.category.id;
}

const readStorage = async id => {
    // Llamar a findStorageById para llenar articleinStorageList
    await findStorageById(id);

    document.getElementById('r_name').value = storage.name || "Sin información";
    document.getElementById('r_category').value = storage.category?.name || "Sin categoría";
    
    const userName = storage.user?.name || "";
    const userSurname = storage.user?.surname || "";
    const userLastname = storage.user?.lastname || "";
    const fullUserName = `${userName} ${userSurname} ${userLastname}`.trim() || "Sin encargado";
    document.getElementById('r_user').value = fullUserName;

    const articlesContainer = document.getElementById("articles-container"); // El contenedor de los artículos

    articlesContainer.innerHTML = '';

    if (articleinStorageList.length === 0) {
        articlesContainer.innerHTML = `
            <div>
                <p class="text-center m-5">Aún no hay artículos almacenados</p>
            </div>
        `;
    } else {
        articleinStorageList.forEach((article, index) => {
            const card = document.createElement("div");
            card.classList.add("col-12", "col-sm-6", "mb-3", "mb-sm-0");

            card.innerHTML = `
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-start mb-0 text-truncate">${article.name}</h5>
                            <p class="text-end mb-0 text-truncate"><small class="text-body-secondary user-select-none">${article.registeredOn}</small></p>
                        </div>
                        <div class="card-text">
                            <p class="text-truncate">${article.description}</p>
                            <span class="badge text-bg-success user-select-none shadow-sm">
                                <p class="d-inline-block mb-0">Cantidad:</p>
                                <p class="d-inline-block mb-0">${article.onStock}</p>
                            </span>
                        </div>
                    </div>
                </div>
            `;
            articlesContainer.appendChild(card);
        });
    }
}

const manageItems = async (id) => {
    let selectedInsertArticles = [];
    let selectedOutArticles = [];

    let modal = bootstrap.Modal.getInstance(document.getElementById('itemControl'));

    // Llamar a findStorageById para llenar articleList y cargar el almacén
    await findStorageById(id);

    await loadAllArticles();

    const btnAvailable = document.getElementById('btnAvailable');
    const btnStored = document.getElementById('btnStored');
    const confirmButton1 = document.getElementById('confirmAvailableArticles');
    const confirmButton2 = document.getElementById('confirmStoredArticles');
    const cancelButton = document.getElementById('cancelSelectedArticles');

    if (!btnAvailable || !btnStored || !confirmButton1 || !confirmButton2 || !cancelButton) {
        console.error("No se encontraron los botones necesarios en el DOM.");
        return;
    }

    const toggleButtons = (clicked, other, confirmButton) => {
        if (!clicked.classList.contains('btn-primary')) {
            clicked.classList.replace('btn-outline-primary', 'btn-primary');
            other.classList.replace('btn-primary', 'btn-outline-primary');
            confirmButton1.classList.toggle('d-none', confirmButton !== confirmButton1);
            confirmButton2.classList.toggle('d-none', confirmButton !== confirmButton2);
        }
    };

    // Función para obtener artículos disponibles
    const getAvailableArticles = () => {
        if (!allArticles || !storage?.category || !storage.articles) {
            console.error("Datos insuficientes para calcular artículos disponibles.");
            return [];
        }
        return allArticles.filter(article =>
            // Coincide la categoría del artículo
            article?.category?.id === storage.category.id && 
            // No se encuentra ya en la lista de artículos del almacén
            !storage.articles.some(storedArticle => storedArticle.id === article.id)
        );
    };    

    const updateArticleList = (type) => {
        const articlesContainer = document.getElementById("m_articles-container");
        articlesContainer.innerHTML = '';

        selectedInsertArticles = [];
        selectedOutArticles = [];

        let articlesToShow = type === 'available' ? getAvailableArticles() : articleinStorageList;

        if (articlesToShow.length === 0) {
            articlesContainer.innerHTML = `
                <div>
                    <p class="text-center m-5">Aún no hay artículos ${type === 'available' ? 'disponibles' : 'almacenados'}.</p>
                </div>
            `;
        } else {
            articlesToShow.forEach((article) => {
                const card = document.createElement("div");
                card.classList.add("col-12", "col-sm-6", "mb-3", "mb-sm-0");

                card.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="text-start mb-0 text-truncate">${article.name}</h5>
                                <p class="text-end mb-0 text-truncate"><small class="text-body-secondary user-select-none">${article.registeredOn}</small></p>
                            </div>
                            <div class="card-text">
                                <p class="text-truncate">${article.description}</p>
                                <div class="row">
                                    <div class="col">
                                        <span class="badge text-bg-success user-select-none shadow-sm">
                                            <p class="d-inline-block mb-0">Cantidad:</p>
                                            <p class="d-inline-block mb-0">${article.onStock}</p>
                                        </span>
                                    </div>
                                    <div class="col text-end">
                                        <button class="btn ${type === 'available' ? 'btn-success' : 'btn-danger'}" data-id="${article.id}">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi ${type === 'available' ? 'bi-plus-circle-fill' : 'bi-dash-circle-fill'}" viewBox="0 0 16 16">
                                                <path d="${type === 'available' ? 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z' : 'M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z'}"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                const button = card.querySelector('button');
                button.addEventListener('click', () => {
                    const articleId = parseInt(button.getAttribute('data-id'));
                    if (type === 'available') {
                        if (!selectedInsertArticles.includes(articleId)) {
                            selectedInsertArticles.push(articleId);
                            button.classList.replace('btn-success', 'btn-secondary');
                        } else {
                            selectedInsertArticles = selectedInsertArticles.filter(id => id !== articleId);
                            button.classList.replace('btn-secondary', 'btn-success');
                        }
                    }
                    if (type === 'stored') {
                        if (!selectedOutArticles.includes(articleId)) {
                            selectedOutArticles.push(articleId);
                            button.classList.replace('btn-danger', 'btn-secondary');
                        } else {
                            selectedOutArticles = selectedOutArticles.filter(id => id !== articleId);
                            button.classList.replace('btn-secondary', 'btn-danger');
                        }
                    }
                });

                articlesContainer.appendChild(card);
            });
        }
    };

    // Inicializar botones
    btnAvailable.addEventListener('click', () => {
        console.log('Cambiando a vista Avalaible');

        toggleButtons(btnAvailable, btnStored, confirmButton1);
        updateArticleList('available');
    });

    btnStored.addEventListener('click', () => {
        console.log('Cambiando a vista Stored');
        
        toggleButtons(btnStored, btnAvailable, confirmButton2);
        updateArticleList('stored');
    });

    cancelButton.addEventListener('click', () => {
        selectedInsertArticles = [];
        selectedOutArticles = [];
    });

    confirmButton1.addEventListener('click', async () => {
        if (selectedInsertArticles.length > 0) {
            await fetch(`${URL}/api/storage/${id}/add-articles`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(selectedInsertArticles)
            })
            .then(response => response.json())
            .then(async responseData => {
                console.log("Artículos añadidos:", responseData);
                await showSuccess("Añadido exitoso", `Artículos añadidos al almacén: ${storage.name}`)
                modal.hide();
            })
            .catch(error => { 
                console.error("Error añadiendo artículos:", error)
                showError("Añadido fallido", "Ha ocurrido un error y los artículos no han sido añadidos")
                modal.hide();
            });
        } else if (getAvailableArticles().length > 0) {
            showError('Ningún artículo seleccionado', 'Selecciona al menos un artículo para añadirlo al almacén');
        } else {
            showError('Ningún artículo disponible', 'No hay artículos disponibles para añadir. Revisa la vista de artículos.');
        }
        selectedInsertArticles = [];
    });

    confirmButton2.addEventListener('click', async () => {
        if (selectedOutArticles.length > 0) {
            await fetch(`${URL}/api/storage/${id}/remove-articles`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(selectedOutArticles)
            })
            .then(response => response.json())
            .then(async responseData => {
                console.log("Artículos retirados:", responseData);
                await showSuccess("Retirado exitoso", `Artículos retirados del almacén: ${storage.name}`)
                modal.hide();
            })
            .catch(error => {
                console.error("Error removiendo artículos:", error)
                showError("Retirado fallido", "Ha ocurrido un error y los artículos no han sido retirados")
                modal.hide();
            });
        } else if (articleinStorageList.length > 0) {
            showError('Ningún artículo seleccionado', 'Selecciona al menos un artículo para retirarlo del almacén');
        } else {
            showError('Ningún artículo disponible', 'No hay artículos disponibles para añadir. Intenta añadir algúno primero.');
        }
        selectedOutArticles = [];
    });

    // Mostrar artículos disponibles inicialmente
    updateArticleList('available');
    if (!btnAvailable.classList.contains('btn-primary')) {
        btnAvailable.classList.replace('btn-outline-primary', 'btn-primary');
        btnStored.classList.replace('btn-primary', 'btn-outline-primary');
        if (confirmButton1.classList.contains('d-none')) {
            confirmButton1.classList.remove('d-none');
            confirmButton2.classList.add('d-none');
        }
    }

    // ESTO ES IMPORTANTE SE DEBE MANTENER
    document.getElementById('m_name').value = storage.name || "Sin información";
    document.getElementById('m_category').value = storage.category?.name || "Sin categoría";

    // Extraer los el nombre del usuario asignado al almacén
    const userName = storage.user?.name || "";
    const userSurname = storage.user?.surname || "";
    const userLastname = storage.user?.lastname || "";

    const fullUserName = `${userName} ${userSurname} ${userLastname}`.trim() || "Sin encargado";
    document.getElementById('m_user').value = fullUserName;
}

const saveStorage = async () => {
    const token = localStorage.getItem('token');

    let form = document.getElementById("saveForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('createStorage'));

    const nameInput = document.getElementById('name');
    let cateogryInput = document.getElementById('categoryList');
    let userInput = document.getElementById('userList');

    const namePattern = /^A-\d{3}$/;

    if (!form.checkValidity() || !namePattern.test(nameInput.value)) {
        form.classList.add('was-validated');
        let message = ""
        let title = "Campos incompletos o inválidos";
        if (!nameInput.value) {
            message = "El campo de nombre está vacío. ";
        } else if (!namePattern.test(nameInput.value)) {
            message = "El campo de nombre no cumple con el formato requerido";
        } else if (!cateogryInput.value) {
            message = "Selecciona una categoría válida";
        } else if (!userInput.value) {
            message = "Selecciona un encargado válido";
        }

        showError(title, message);
        return;
    }

    storage = {
        name: document.getElementById('name').value,
        user: {
            id: document.getElementById('userList').value
        },
        category: {
            id: document.getElementById('categoryList').value
        }
    };

    await fetch(`${URL}/api/storage`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(storage)
    })
    .then(response => response.json())
    .then(async responseData => {
        console.log(responseData);
        storage = {};
        await showSuccess("Registro exitoso", "Almacén registrado exitosamente.")
        await loadTable();
        form.reset();
        modal.hide();
    }).catch(error => {
        console.error('Error fetching storage data:', error);
        form.reset();
        modal.hide();
        showError("Registro fallido", "Ha ocurrido un error y el almacén no pudo ser registrado.")
    });
}

const updateStorage = async () => {
    const token = localStorage.getItem('token');

    const articleIds = storage.articles ? storage.articles.map(article => article.id) : [];

    let form = document.getElementById("updateForm");
    let modal = bootstrap.Modal.getInstance(document.getElementById('updateStorage'));

    const nameInput = document.getElementById('u_name');

    const namePattern = /^A-\d{3}$/;

    if (!form.checkValidity() || !namePattern.test(nameInput.value)) {
        form.classList.add('was-validated');
        let message = ""
        let title = "Campos incompletos o inválidos";
        if (!nameInput.value) {
            message += "El campo de nombre está vacío. ";
        } else if (!namePattern.test(nameInput.value)) {
            message += "El campo de nombre no cumple con el formato requerido";
        }

        showError(title, message);
        return;
    }

    let updated = {
        id: storage.id, 
        name: storageList[0].name,
        user: {
            id: userLogged.id
        },
        category: {
            id: document.getElementById('u_categoryList').value
        }
    };

    if (articleIds.length > 0 && document.getElementById('u_categoryList').value != storage.category.id) {
        showError("Actualización fallida","No puedes cambiar la categoría del almacen porque este cuenta con artículos")
        return;
    } else {
    await fetch(`${URL}/api/storage`, {
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
        storage = {};
        await showSuccess("Actualización exitosa", "Almacén actualizado exitosamente")
        await loadTable();
        form.reset();
        modal.hide();
    }).catch(error => {
        console.error('Error fetching storage data:', error);
        form.reset();
        showError("Actualización fallida", "Ha ocurrido un error y el almacén no pudo ser actualizado")
    });
    }
}

const deleteStorage = async (storageId) => {
    const token = localStorage.getItem('token');

    let storage;
    await fetch(`${URL}/api/storage/${storageId}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(responseData => {
        storage = responseData.data;
    })
    .catch(error => {
        console.error('Error fetching storage:', error);
    });

    const deleted = { id: storageId };

    const articleIds = storage.articles ? storage.articles.map(article => article.id) : [];

    if (articleIds.length > 0) {
            showError("No puedes eliminar el almacén", "Este almacén tiene artículos dentro");
    } else {
        await fetch(`${URL}/api/storage`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(deleted)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición de eliminación del almacén: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(async data => {
            console.log("Respuesta del servidor:", data);
            await showSuccess("Eliminación exitosa", "Almacén eliminado exitosamente");
            await loadTable();
        })
        .catch(error => {
            console.error("Error al eliminar el almacén:", error.message);
            showError("Eliminación fallida", "Ha ocurrido un error y el almacén no pudo ser eliminado");
        });
    }
};

const confirmDelete = async (id) => {
    const token = localStorage.getItem('token');

    let storage;

    await fetch(`${URL}/api/storage/${id}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`
        },
    })
    .then(response => response.json())
    .then(responseData => {
        storage = responseData.data;
    })
    .catch(error => {
        console.error('Error fetching storage:', error);
    });

    const articleIds = storage.articles ? storage.articles.map(article => article.id) : [];

    if (articleIds.length > 0) {
        await showError('No puedes eliminar este almacén', 'No puedes eliminar un almacen con artículos dentro')
    } else {
        let title = "¿Eliminar almacén?";
        let message = "¿Estás seguro de que deseas eliminar este almacén?";
        await showWarningAlert(title, message, id);
    }
}


const logOut = async () => {
    await showLogoutWarning("¿Estás seguro de que deseas cerrar sesión?");
}
// SIDEBAR


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
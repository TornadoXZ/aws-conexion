document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

// Variables globales
let isEditing = false;
const API_URL = '/api/users';

// Configuración de eventos
function setupEventListeners() {
    document.getElementById('saveUser').addEventListener('click', handleSaveUser);
    document.getElementById('profilePicture').addEventListener('change', handleImagePreview);
    document.getElementById('userModal').addEventListener('hidden.bs.modal', handleModalClose);
}

// Cargar usuarios
async function loadUsers() {
    showLoading();
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        displayUsers(users);
    } catch (error) {
        showError('Error al cargar usuarios');
    } finally {
        hideLoading();
    }
}

// Mostrar usuarios en la tabla
function displayUsers(users) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>
                ${user.profile_picture 
                    ? `<img src="${user.profile_picture}" class="user-avatar" alt="Foto de perfil">` 
                    : '<i class="bi bi-person-circle"></i>'}
            </td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${new Date(user.created_at).toLocaleString()}</td>
            <td class="action-buttons">
                <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Manejar vista previa de imagen
function handleImagePreview(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.src = e.target.result;
            document.querySelector('.preview-image').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
    }
}

// Guardar usuario
async function handleSaveUser() {
    const userId = document.getElementById('userId').value;
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    
    const profilePicture = document.getElementById('profilePicture').files[0];
    if (profilePicture) {
        formData.append('profilePicture', profilePicture);
    }

    showLoading();
    try {
        const url = isEditing ? `${API_URL}/${userId}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (!response.ok) throw new Error('Error en la operación');
        
        await loadUsers();
        bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
        showSuccess(`Usuario ${isEditing ? 'actualizado' : 'creado'} correctamente`);
    } catch (error) {
        showError(`Error al ${isEditing ? 'actualizar' : 'crear'} usuario`);
    } finally {
        hideLoading();
    }
}

// Editar usuario
async function editUser(id) {
    showLoading();
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const user = await response.json();
        
        document.getElementById('userId').value = user.id;
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        
        if (user.profile_picture) {
            document.getElementById('imagePreview').src = user.profile_picture;
            document.querySelector('.preview-image').classList.remove('d-none');
        }

        isEditing = true;
        document.getElementById('modalTitle').textContent = 'Editar Usuario';
        new bootstrap.Modal(document.getElementById('userModal')).show();
    } catch (error) {
        showError('Error al cargar usuario');
    } finally {
        hideLoading();
    }
}

// Eliminar usuario
async function deleteUser(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    showLoading();
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Error al eliminar usuario');
        
        await loadUsers();
        showSuccess('Usuario eliminado correctamente');
    } catch (error) {
        showError('Error al eliminar usuario');
    } finally {
        hideLoading();
    }
}

// Manejar cierre del modal
function handleModalClose() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.querySelector('.preview-image').classList.add('d-none');
    isEditing = false;
    document.getElementById('modalTitle').textContent = 'Agregar Usuario';
}

// Funciones de utilidad
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) loading.remove();
}

function showSuccess(message) {
    alert(message); // Aquí podrías usar una librería de notificaciones más elegante
}

function showError(message) {
    alert(message); // Aquí podrías usar una librería de notificaciones más elegante
} 
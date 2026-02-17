
(function() {
// ===== Configuración base =====
const API_URL = 'http://localhost:3000/api';

// ===== Funciones para autenticación =====
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return await response.json();
    } catch (error) {
        console.error('Error en login:', error);
    }
}

async function register(nombre, email, password, passwordConfirm) {
    try {
        const response = await fetch(`${API_URL}/auth/registro`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password, passwordConfirm })
        });
        return await response.json();
    } catch (error) {
        console.error('Error en register:', error);
    }
}

// ===== Funciones para categorías =====
async function getCategories() {
    try {
        const response = await fetch(`${API_URL}/categorias`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
}

// ===== Renderizar selector de categorías =====
async function renderCategorySelector() {
    const select = document.querySelector('select[name="categoria_id"]');
    if (!select) return;
    select.innerHTML = '<option value="">Categoría</option>';
    const data = await getCategories();
    if (data && data.categorias) {
        data.categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.nombre} (${cat.tipo})`;
            select.appendChild(option);
        });
    }
}

// ===== Función para listar transacciones =====
async function getTransactions() {
    try {
        const response = await fetch(`${API_URL}/transacciones`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        return await response.json();
    } catch (error) {
        console.error('Error al obtener transacciones:', error);
    }
}

// ===== Función para registrar una transacción =====
async function addTransaction(categoria_id, tipo, monto, fecha, nota) {
    try {
        const response = await fetch(`${API_URL}/transacciones`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ categoria_id, tipo, monto, fecha, nota })
        });
        return await response.json();
    } catch (error) {
        console.error('Error al registrar transacción:', error);
    }
}

// ===== Función para manejar el registro =====
async function handleRegister(event) {
    event.preventDefault();

    const name = document.querySelector('input[name="nombre"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const passwordConfirm = document.querySelector('input[name="passwordConfirm"]').value;

    const response = await register(name, email, password, passwordConfirm);

    if (response.error) {
        alert(`Error: ${response.error}`);
    } else {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        window.location.href = 'login.html';
    }
}

// ===== Función para manejar el inicio de sesión =====
async function handleLogin(event) {
    event.preventDefault();

    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;

    const response = await login(email, password);

    if (response.error) {
        alert(`Error: ${response.error}`);
    } else {
        alert('Inicio de sesión exitoso.');
        localStorage.setItem('token', response.token); // Guardar el token en localStorage
        window.location.href = 'dashboard.html';
    }
}

// ===== Función para cerrar sesión =====
function logout() {
    localStorage.removeItem('token');
    alert('Has cerrado sesión.');
    window.location.href = 'login.html';
}

// ===== Función para manejar el formulario de transacciones =====
async function handleTransaction(event) {
    event.preventDefault();

    const categoria_id = document.querySelector('select[name="categoria_id"]').value;
    const tipo = document.querySelector('select[name="tipo"]').value;
    const monto = parseFloat(document.querySelector('input[name="monto"]').value);
    const fecha = document.querySelector('input[name="fecha"]').value;
    const nota = document.querySelector('textarea[name="nota"]').value;

    const response = await addTransaction(categoria_id, tipo, monto, fecha, nota);

    if (response.error) {
        alert(`Error: ${response.error}`);
    } else {
        alert('Transacción registrada con éxito.');
            await renderTransactions();
    }
}

    // ===== Renderizar transacciones en el dashboard =====
    async function renderTransactions() {
        const tbody = document.querySelector('#transacciones-list');
        if (!tbody) return;
        tbody.innerHTML = '';
        const data = await getTransactions();
        if (data && data.transacciones) {
            // Obtener categorías para mostrar nombre
            const catData = await getCategories();
            const categorias = catData && catData.categorias ? catData.categorias : [];
            data.transacciones.forEach(tx => {
                const tr = document.createElement('tr');
                const cat = categorias.find(c => c.id === tx.categoria_id);
                tr.innerHTML = `
                    <td>${tx.fecha}</td>
                    <td>${tx.tipo}</td>
                    <td>${cat ? cat.nombre : tx.categoria_id}</td>
                    <td>$${tx.monto}</td>
                    <td>${tx.nota || ''}</td>
                `;
                tbody.appendChild(tr);
            });
        }
    }

// ===== Asociar eventos a los formularios =====
const registerForm = document.querySelector('#registro-form');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

const loginForm = document.querySelector('#login-form');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

// ===== Asociar evento al botón de cerrar sesión =====
const logoutButton = document.querySelector('#logout');
if (logoutButton) {
    logoutButton.addEventListener('click', logout);
}

// ===== Asociar evento al formulario de transacciones =====
const transactionForm = document.querySelector('#transaction-form');
if (transactionForm) {
    transactionForm.addEventListener('submit', handleTransaction);
    renderTransactions();
    renderCategorySelector();
}
})();

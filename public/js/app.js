// ==============================================================================
// UNIVERSIDAD CATÓLICA DE PEREIRA - METODOLOGÍA DE LA PROGRAMACIÓN IV
// PARCIAL 3 - CLIENTE WEB DE GESTIÓN REST
// Autores: Juan David Arboleda Vallecilla & Diego Diaz
// Docente: Carlos Andrés Cortés
// ==============================================================================

// Estado de la aplicación
const state = {
  games: [],
  stats: null,
  viewMode: 'grid', // 'grid' | 'table'
  search: '',
  genre: '',
  sortBy: 'id',
  order: 'desc',
  selectedGame: null,
  activeModalMode: 'create' // 'create' (POST) | 'edit' (PUT)
};

// Referencias del DOM
const elements = {
  // Estado y KPIs
  serverStatusBadge: document.getElementById('serverStatusBadge'),
  engineText: document.getElementById('engineText'),
  kpiTotal: document.getElementById('kpiTotal'),
  kpiInStock: document.getElementById('kpiInStock'),
  kpiRating: document.getElementById('kpiRating'),
  kpiPrice: document.getElementById('kpiPrice'),
  kpiPriceRange: document.getElementById('kpiPriceRange'),
  kpiGenres: document.getElementById('kpiGenres'),

  // Filtros
  searchInput: document.getElementById('searchInput'),
  btnClearSearch: document.getElementById('btnClearSearch'),
  filterGenre: document.getElementById('filterGenre'),
  filterSort: document.getElementById('filterSort'),
  filterOrder: document.getElementById('filterOrder'),
  btnGridView: document.getElementById('btnGridView'),
  btnTableView: document.getElementById('btnTableView'),

  // Contenedores de contenido
  gamesContainer: document.getElementById('gamesContainer'),
  tableContainer: document.getElementById('tableContainer'),
  tableBody: document.getElementById('tableBody'),
  emptyState: document.getElementById('emptyState'),

  // Consola REST
  restConsole: document.getElementById('restConsole'),
  toggleConsole: document.getElementById('toggleConsole'),
  consoleLogs: document.getElementById('consoleLogs'),
  lastMethodBadge: document.getElementById('lastMethodBadge'),
  lastEndpoint: document.getElementById('lastEndpoint'),
  btnClearLogs: document.getElementById('btnClearLogs'),
  btnExpandConsole: document.getElementById('btnExpandConsole'),

  // Acciones principales
  btnOpenCreateModal: document.getElementById('btnOpenCreateModal'),
  btnResetSeed: document.getElementById('btnResetSeed'),

  // Modal Crear / Editar (POST / PUT)
  gameModal: document.getElementById('gameModal'),
  modalTitle: document.getElementById('modalTitle'),
  modalMethodChip: document.getElementById('modalMethodChip'),
  gameForm: document.getElementById('gameForm'),
  gameId: document.getElementById('gameId'),
  inputTitulo: document.getElementById('inputTitulo'),
  inputAnio: document.getElementById('inputAnio'),
  inputDesarrollador: document.getElementById('inputDesarrollador'),
  inputGenero: document.getElementById('inputGenero'),
  inputPlataforma: document.getElementById('inputPlataforma'),
  inputCalificacion: document.getElementById('inputCalificacion'),
  inputPrecio: document.getElementById('inputPrecio'),
  inputImagenUrl: document.getElementById('inputImagenUrl'),
  btnPreviewImage: document.getElementById('btnPreviewImage'),
  imagePreviewContainer: document.getElementById('imagePreviewContainer'),
  imagePreview: document.getElementById('imagePreview'),
  inputDescripcion: document.getElementById('inputDescripcion'),
  inputEnStock: document.getElementById('inputEnStock'),
  btnSaveText: document.getElementById('btnSaveText'),
  btnCloseGameModal: document.getElementById('btnCloseGameModal'),
  btnCancelGameModal: document.getElementById('btnCancelGameModal'),

  // Modal PATCH
  patchModal: document.getElementById('patchModal'),
  patchForm: document.getElementById('patchForm'),
  patchGameId: document.getElementById('patchGameId'),
  patchGameTitle: document.getElementById('patchGameTitle'),
  patchCheckPrecio: document.getElementById('patchCheckPrecio'),
  patchInputPrecioWrapper: document.getElementById('patchInputPrecioWrapper'),
  patchInputPrecio: document.getElementById('patchInputPrecio'),
  patchCurrentPrecio: document.getElementById('patchCurrentPrecio'),
  patchCheckCalificacion: document.getElementById('patchCheckCalificacion'),
  patchInputCalificacionWrapper: document.getElementById('patchInputCalificacionWrapper'),
  patchInputCalificacion: document.getElementById('patchInputCalificacion'),
  patchCurrentCalificacion: document.getElementById('patchCurrentCalificacion'),
  patchCheckEnStock: document.getElementById('patchCheckEnStock'),
  patchInputEnStockWrapper: document.getElementById('patchInputEnStockWrapper'),
  patchInputEnStock: document.getElementById('patchInputEnStock'),
  patchCurrentEnStock: document.getElementById('patchCurrentEnStock'),
  patchCheckPlataforma: document.getElementById('patchCheckPlataforma'),
  patchInputPlataformaWrapper: document.getElementById('patchInputPlataformaWrapper'),
  patchInputPlataforma: document.getElementById('patchInputPlataforma'),
  patchCurrentPlataforma: document.getElementById('patchCurrentPlataforma'),
  btnClosePatchModal: document.getElementById('btnClosePatchModal'),
  btnCancelPatchModal: document.getElementById('btnCancelPatchModal'),

  // Modal Detalle (GET :id)
  detailModal: document.getElementById('detailModal'),
  detailContent: document.getElementById('detailContent'),
  btnCloseDetailModal: document.getElementById('btnCloseDetailModal'),
  btnCloseDetailBtn: document.getElementById('btnCloseDetailBtn'),

  // Modal Delete
  deleteModal: document.getElementById('deleteModal'),
  deleteGameTitle: document.getElementById('deleteGameTitle'),
  deleteGameId: document.getElementById('deleteGameId'),
  btnConfirmDelete: document.getElementById('btnConfirmDelete'),
  btnCancelDelete: document.getElementById('btnCancelDelete'),
  btnCloseDeleteModal: document.getElementById('btnCloseDeleteModal'),

  // Toasts
  toastContainer: document.getElementById('toastContainer')
};

// ==================== REST CLIENT WITH LIVE LOGGING ====================
async function apiRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const startTime = performance.now();

  try {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const response = await fetch(endpoint, config);
    const duration = Math.round(performance.now() - startTime);
    const data = await response.json();

    logRestActivity(method, endpoint, response.status, duration, data);

    if (!response.ok) {
      const err = new Error(data.error || `Error HTTP ${response.status}`);
      (err).details = data.detalles;
      throw err;
    }

    return data;
  } catch (error) {
    const duration = Math.round(performance.now() - startTime);
    if (!error.details) {
      logRestActivity(method, endpoint, 500, duration, { error: error.message });
    }
    throw error;
  }
}

function logRestActivity(method, url, status, duration, responseData) {
  const time = new Date().toLocaleTimeString();

  // Actualizar resumen en la cabecera de la barra de consola
  elements.lastMethodBadge.textContent = method;
  elements.lastMethodBadge.className = `last-method-badge badge-${method.toLowerCase()}`;
  elements.lastEndpoint.textContent = `${url} (${status} - ${duration}ms)`;

  // Determinar color de status
  let statusClass = 'status-2xx';
  if (status >= 400 && status < 500) statusClass = 'status-4xx';
  if (status >= 500) statusClass = 'status-5xx';

  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <span class="log-time">${time}</span>
    <span class="badge-method badge-${method.toLowerCase()}">${method}</span>
    <span class="log-status ${statusClass}">${status}</span>
    <span class="log-url">${url}</span>
    <span style="color: var(--text-dim); white-space: nowrap;">${duration}ms</span>
  `;

  elements.consoleLogs.prepend(entry);
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'circle-check' : (type === 'error' ? 'circle-exclamation' : 'circle-info');
  toast.innerHTML = `
    <i class="fa-solid fa-${icon}"></i>
    <span>${message}</span>
  `;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==================== DATA FETCHING ====================
async function checkHealth() {
  try {
    const res = await apiRequest('/api/health');
    elements.engineText.textContent = `Online (${res.motorBaseDatos.toUpperCase()})`;
    elements.serverStatusBadge.title = `Servidor activo con motor: ${res.motorBaseDatos}`;
  } catch (err) {
    elements.engineText.textContent = 'Servidor Desconectado';
    elements.serverStatusBadge.style.background = 'rgba(239, 68, 68, 0.15)';
    elements.serverStatusBadge.style.color = '#f87171';
  }
}

async function loadStats() {
  try {
    const res = await apiRequest('/api/videojuegos/stats');
    state.stats = res.data;
    renderStats();
    populateGenreFilter();
  } catch (err) {
    console.error('Error al cargar estadísticas:', err);
  }
}

function renderStats() {
  if (!state.stats) return;
  elements.kpiTotal.textContent = state.stats.total;
  elements.kpiInStock.textContent = `${state.stats.totalEnStock} en inventario`;
  elements.kpiRating.textContent = state.stats.promedioCalificacion ? `${state.stats.promedioCalificacion} / 10` : '-';
  elements.kpiPrice.textContent = `$${state.stats.precioPromedio.toFixed(2)}`;
  elements.kpiPriceRange.textContent = `$${state.stats.precioMinimo.toFixed(2)} - $${state.stats.precioMaximo.toFixed(2)}`;
  elements.kpiGenres.textContent = state.stats.generosDisponibles;
}

function populateGenreFilter() {
  if (!state.stats || !state.stats.conteoPorGenero) return;
  const current = elements.filterGenre.value;
  elements.filterGenre.innerHTML = '<option value="">Todos los géneros</option>';
  state.stats.conteoPorGenero.forEach((g) => {
    const opt = document.createElement('option');
    opt.value = g.genero;
    opt.textContent = `${g.genero} (${g.cantidad})`;
    if (g.genero === current) opt.selected = true;
    elements.filterGenre.appendChild(opt);
  });
}

async function loadGames() {
  try {
    const params = new URLSearchParams();
    if (state.search) params.append('search', state.search);
    if (state.genre) params.append('genero', state.genre);
    if (state.sortBy) params.append('sortBy', state.sortBy);
    if (state.order) params.append('order', state.order);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await apiRequest(`/api/videojuegos${queryStr}`);
    state.games = res.data;

    renderGames();
  } catch (err) {
    showToast(`Error al cargar videojuegos: ${err.message}`, 'error');
  }
}

// ==================== RENDERING ====================
function renderGames() {
  if (state.games.length === 0) {
    elements.gamesContainer.style.display = 'none';
    elements.tableContainer.style.display = 'none';
    elements.emptyState.style.display = 'block';
    return;
  }

  elements.emptyState.style.display = 'none';

  if (state.viewMode === 'grid') {
    elements.gamesContainer.style.display = 'grid';
    elements.tableContainer.style.display = 'none';
    renderGridView();
  } else {
    elements.gamesContainer.style.display = 'none';
    elements.tableContainer.style.display = 'block';
    renderTableView();
  }
}

function renderGridView() {
  elements.gamesContainer.innerHTML = state.games.map((game) => `
    <article class="game-card" data-id="${game.id}">
      <div class="card-media">
        <img class="card-img" src="${escapeHtml(game.imagenUrl)}" alt="${escapeHtml(game.titulo)}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'" />
        <span class="card-stock-badge ${game.enStock ? 'stock-in' : 'stock-out'}">
          ${game.enStock ? 'En Stock' : 'Agotado'}
        </span>
        <span class="card-rating-badge">
          <i class="fa-solid fa-star"></i> ${game.calificacion.toFixed(1)}
        </span>
        <span class="card-genre-badge">${escapeHtml(game.genero)}</span>
      </div>

      <div class="card-content">
        <div class="card-header-info">
          <span class="card-developer">${escapeHtml(game.desarrollador)}</span>
          <span><i class="fa-regular fa-calendar"></i> ${game.anioLanzamiento}</span>
        </div>

        <h3 class="card-title">${escapeHtml(game.titulo)}</h3>
        <p class="card-desc">${escapeHtml(game.descripcion)}</p>

        <div class="card-platform">
          <i class="fa-solid fa-tv"></i>
          <span>${escapeHtml(game.plataforma)}</span>
        </div>

        <div class="card-footer">
          <span class="card-price">$${game.precio.toFixed(2)}</span>
          <div class="card-actions">
            <button class="btn-card-action action-view" title="Ver Detalle (GET :id)" onclick="openDetailModal(${game.id})">
              <i class="fa-solid fa-eye"></i>
            </button>
            <button class="btn-card-action action-patch" title="Modificación Parcial (PATCH)" onclick="openPatchModal(${game.id})">
              <i class="fa-solid fa-sliders"></i>
            </button>
            <button class="btn-card-action action-edit" title="Editar Completo (PUT)" onclick="openEditModal(${game.id})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
            <button class="btn-card-action action-delete" title="Eliminar (DELETE)" onclick="openDeleteModal(${game.id})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

function renderTableView() {
  elements.tableBody.innerHTML = state.games.map((game) => `
    <tr>
      <td><strong>#${game.id}</strong></td>
      <td>
        <img class="table-thumb" src="${escapeHtml(game.imagenUrl)}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=100&q=80'" />
      </td>
      <td><strong>${escapeHtml(game.titulo)}</strong></td>
      <td>${escapeHtml(game.desarrollador)}</td>
      <td><span class="detail-tag">${escapeHtml(game.genero)}</span></td>
      <td>${escapeHtml(game.plataforma)}</td>
      <td>${game.anioLanzamiento}</td>
      <td><strong style="color: var(--accent-yellow);"><i class="fa-solid fa-star"></i> ${game.calificacion.toFixed(1)}</strong></td>
      <td><strong style="color: #34d399;">$${game.precio.toFixed(2)}</strong></td>
      <td>
        <span class="card-stock-badge ${game.enStock ? 'stock-in' : 'stock-out'}">
          ${game.enStock ? 'En Stock' : 'Agotado'}
        </span>
      </td>
      <td>
        <div class="card-actions">
          <button class="btn-card-action action-view" title="Ver Detalle (GET :id)" onclick="openDetailModal(${game.id})">
            <i class="fa-solid fa-eye"></i>
          </button>
          <button class="btn-card-action action-patch" title="Modificación Parcial (PATCH)" onclick="openPatchModal(${game.id})">
            <i class="fa-solid fa-sliders"></i>
          </button>
          <button class="btn-card-action action-edit" title="Editar Completo (PUT)" onclick="openEditModal(${game.id})">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn-card-action action-delete" title="Eliminar (DELETE)" onclick="openDeleteModal(${game.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==================== MODALS LOGIC ====================

// 1. Modal Crear / Editar (POST & PUT)
function openCreateModal() {
  state.activeModalMode = 'create';
  elements.modalTitle.textContent = 'Nuevo Videojuego (POST)';
  elements.modalMethodChip.textContent = 'POST';
  elements.modalMethodChip.className = 'method-chip';
  elements.btnSaveText.textContent = 'Guardar Videojuego';
  elements.gameForm.reset();
  elements.gameId.value = '';
  elements.inputAnio.value = new Date().getFullYear();
  elements.inputEnStock.checked = true;
  elements.imagePreviewContainer.style.display = 'none';
  elements.gameModal.style.display = 'flex';
}

async function openEditModal(id) {
  try {
    const res = await apiRequest(`/api/videojuegos/${id}`);
    const game = res.data;
    state.activeModalMode = 'edit';
    elements.modalTitle.textContent = `Editar Videojuego #${id} (PUT)`;
    elements.modalMethodChip.textContent = 'PUT';
    elements.modalMethodChip.className = 'method-chip';
    elements.btnSaveText.textContent = 'Actualizar Todo (PUT)';

    elements.gameId.value = game.id;
    elements.inputTitulo.value = game.titulo;
    elements.inputAnio.value = game.anioLanzamiento;
    elements.inputDesarrollador.value = game.desarrollador;
    elements.inputGenero.value = game.genero;
    elements.inputPlataforma.value = game.plataforma;
    elements.inputCalificacion.value = game.calificacion;
    elements.inputPrecio.value = game.precio;
    elements.inputImagenUrl.value = game.imagenUrl;
    elements.inputDescripcion.value = game.descripcion;
    elements.inputEnStock.checked = Boolean(game.enStock);

    if (game.imagenUrl) {
      elements.imagePreview.src = game.imagenUrl;
      elements.imagePreviewContainer.style.display = 'block';
    } else {
      elements.imagePreviewContainer.style.display = 'none';
    }

    elements.gameModal.style.display = 'flex';
  } catch (err) {
    showToast(`Error al obtener videojuego: ${err.message}`, 'error');
  }
}

elements.gameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    titulo: elements.inputTitulo.value.trim(),
    desarrollador: elements.inputDesarrollador.value.trim(),
    genero: elements.inputGenero.value.trim(),
    plataforma: elements.inputPlataforma.value.trim(),
    anioLanzamiento: parseInt(elements.inputAnio.value, 10),
    calificacion: parseFloat(elements.inputCalificacion.value),
    precio: parseFloat(elements.inputPrecio.value),
    descripcion: elements.inputDescripcion.value.trim(),
    imagenUrl: elements.inputImagenUrl.value.trim(),
    enStock: elements.inputEnStock.checked
  };

  try {
    if (state.activeModalMode === 'create') {
      const res = await apiRequest('/api/videojuegos', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      showToast(`¡Videojuego creado exitosamente! (ID: ${res.data.id})`);
    } else {
      const id = elements.gameId.value;
      await apiRequest(`/api/videojuegos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      showToast(`¡Videojuego #${id} actualizado completamente (PUT)!`);
    }

    elements.gameModal.style.display = 'none';
    await Promise.all([loadGames(), loadStats()]);
  } catch (err) {
    const details = err.details ? err.details.map((d) => `${d.campo}: ${d.mensaje}`).join(', ') : err.message;
    showToast(`Error al guardar: ${details}`, 'error');
  }
});

// Previsualización de imagen
elements.btnPreviewImage.addEventListener('click', () => {
  const url = elements.inputImagenUrl.value.trim();
  if (url) {
    elements.imagePreview.src = url;
    elements.imagePreviewContainer.style.display = 'block';
  }
});

// 2. Modal Detalle (GET :id)
async function openDetailModal(id) {
  try {
    const res = await apiRequest(`/api/videojuegos/${id}`);
    const g = res.data;
    elements.detailContent.innerHTML = `
      <div class="detail-layout">
        <img class="detail-cover" src="${escapeHtml(g.imagenUrl)}" alt="${escapeHtml(g.titulo)}" onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80'" />
        <div class="detail-info">
          <h2 class="detail-title">${escapeHtml(g.titulo)}</h2>
          <div class="detail-meta-tags">
            <span class="detail-tag"><i class="fa-solid fa-hashtag"></i> ID: ${g.id}</span>
            <span class="detail-tag"><i class="fa-solid fa-shapes"></i> ${escapeHtml(g.genero)}</span>
            <span class="detail-tag"><i class="fa-solid fa-tv"></i> ${escapeHtml(g.plataforma)}</span>
            <span class="card-stock-badge ${g.enStock ? 'stock-in' : 'stock-out'}">${g.enStock ? 'En Stock' : 'Agotado'}</span>
          </div>

          <p class="detail-desc">${escapeHtml(g.descripcion)}</p>

          <div class="detail-grid-specs">
            <div class="spec-item">
              <span>Desarrollador</span>
              <strong>${escapeHtml(g.desarrollador)}</strong>
            </div>
            <div class="spec-item">
              <span>Año de Lanzamiento</span>
              <strong>${g.anioLanzamiento}</strong>
            </div>
            <div class="spec-item">
              <span>Calificación</span>
              <strong style="color: var(--accent-yellow);"><i class="fa-solid fa-star"></i> ${g.calificacion.toFixed(1)} / 10</strong>
            </div>
            <div class="spec-item">
              <span>Precio de Venta</span>
              <strong style="color: #34d399;">$${g.precio.toFixed(2)} USD</strong>
            </div>
            ${g.creadoEn ? `
            <div class="spec-item" style="grid-column: span 2;">
              <span>Fecha de Registro</span>
              <strong>${new Date(g.creadoEn).toLocaleString()}</strong>
            </div>` : ''}
          </div>
        </div>
      </div>
    `;
    elements.detailModal.style.display = 'flex';
  } catch (err) {
    showToast(`Error al consultar detalle: ${err.message}`, 'error');
  }
}

// 3. Modal PATCH (Actualización Parcial)
async function openPatchModal(id) {
  try {
    const res = await apiRequest(`/api/videojuegos/${id}`);
    const g = res.data;
    state.selectedGame = g;

    elements.patchGameId.value = g.id;
    elements.patchGameTitle.textContent = `#${g.id} - ${g.titulo}`;

    // Resetear checkboxes e inputs
    elements.patchCheckPrecio.checked = false;
    elements.patchInputPrecioWrapper.style.display = 'none';
    elements.patchCurrentPrecio.textContent = `Actual: $${g.precio.toFixed(2)}`;
    elements.patchInputPrecio.value = g.precio;

    elements.patchCheckCalificacion.checked = false;
    elements.patchInputCalificacionWrapper.style.display = 'none';
    elements.patchCurrentCalificacion.textContent = `Actual: ${g.calificacion.toFixed(1)}`;
    elements.patchInputCalificacion.value = g.calificacion;

    elements.patchCheckEnStock.checked = false;
    elements.patchInputEnStockWrapper.style.display = 'none';
    elements.patchCurrentEnStock.textContent = `Actual: ${g.enStock ? 'En Stock' : 'Agotado'}`;
    elements.patchInputEnStock.value = g.enStock ? 'true' : 'false';

    elements.patchCheckPlataforma.checked = false;
    elements.patchInputPlataformaWrapper.style.display = 'none';
    elements.patchCurrentPlataforma.textContent = `Actual: ${g.plataforma}`;
    elements.patchInputPlataforma.value = g.plataforma;

    elements.patchModal.style.display = 'flex';
  } catch (err) {
    showToast(`Error al preparar PATCH: ${err.message}`, 'error');
  }
}

// Handlers para mostrar/ocultar inputs en PATCH
elements.patchCheckPrecio.addEventListener('change', (e) => {
  elements.patchInputPrecioWrapper.style.display = e.target.checked ? 'block' : 'none';
});
elements.patchCheckCalificacion.addEventListener('change', (e) => {
  elements.patchInputCalificacionWrapper.style.display = e.target.checked ? 'block' : 'none';
});
elements.patchCheckEnStock.addEventListener('change', (e) => {
  elements.patchInputEnStockWrapper.style.display = e.target.checked ? 'block' : 'none';
});
elements.patchCheckPlataforma.addEventListener('change', (e) => {
  elements.patchInputPlataformaWrapper.style.display = e.target.checked ? 'block' : 'none';
});

elements.patchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = elements.patchGameId.value;
  const payload = {};

  if (elements.patchCheckPrecio.checked) {
    payload.precio = parseFloat(elements.patchInputPrecio.value);
  }
  if (elements.patchCheckCalificacion.checked) {
    payload.calificacion = parseFloat(elements.patchInputCalificacion.value);
  }
  if (elements.patchCheckEnStock.checked) {
    payload.enStock = elements.patchInputEnStock.value === 'true';
  }
  if (elements.patchCheckPlataforma.checked) {
    payload.plataforma = elements.patchInputPlataforma.value.trim();
  }

  if (Object.keys(payload).length === 0) {
    showToast('Selecciona al menos un campo para actualizar con PATCH', 'info');
    return;
  }

  try {
    await apiRequest(`/api/videojuegos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });

    showToast(`¡Videojuego #${id} modificado parcialmente (PATCH)!`);
    elements.patchModal.style.display = 'none';
    await Promise.all([loadGames(), loadStats()]);
  } catch (err) {
    showToast(`Error en PATCH: ${err.message}`, 'error');
  }
});

// 4. Modal Eliminar (DELETE)
let gameIdToDelete = null;

function openDeleteModal(id) {
  const game = state.games.find((g) => g.id === id);
  if (!game) return;
  gameIdToDelete = id;
  elements.deleteGameId.textContent = id;
  elements.deleteGameTitle.textContent = game.titulo;
  elements.deleteModal.style.display = 'flex';
}

elements.btnConfirmDelete.addEventListener('click', async () => {
  if (!gameIdToDelete) return;
  try {
    await apiRequest(`/api/videojuegos/${gameIdToDelete}`, {
      method: 'DELETE'
    });

    showToast(`Videojuego #${gameIdToDelete} eliminado correctamente`);
    elements.deleteModal.style.display = 'none';
    gameIdToDelete = null;
    await Promise.all([loadGames(), loadStats()]);
  } catch (err) {
    showToast(`Error al eliminar: ${err.message}`, 'error');
  }
});

// 5. Reset Seed Data
elements.btnResetSeed.addEventListener('click', async () => {
  if (!confirm('¿Deseas restaurar la base de datos a sus valores iniciales de prueba?')) return;
  try {
    await apiRequest('/api/videojuegos/reset-seed', { method: 'POST' });
    showToast('Base de datos restaurada con los datos semilla iniciales');
    await Promise.all([loadGames(), loadStats()]);
  } catch (err) {
    showToast(`Error al reiniciar semillas: ${err.message}`, 'error');
  }
});

// ==================== EVENT LISTENERS ====================

// Búsqueda en tiempo real
let searchTimeout = null;
elements.searchInput.addEventListener('input', (e) => {
  const val = e.target.value;
  elements.btnClearSearch.style.display = val ? 'block' : 'none';
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    state.search = val.trim();
    loadGames();
  }, 300);
});

elements.btnClearSearch.addEventListener('click', () => {
  elements.searchInput.value = '';
  elements.btnClearSearch.style.display = 'none';
  state.search = '';
  loadGames();
});

// Filtros
elements.filterGenre.addEventListener('change', (e) => {
  state.genre = e.target.value;
  loadGames();
});

elements.filterSort.addEventListener('change', (e) => {
  state.sortBy = e.target.value;
  loadGames();
});

elements.filterOrder.addEventListener('change', (e) => {
  state.order = e.target.value;
  loadGames();
});

// Vistas Cuadrícula / Tabla
elements.btnGridView.addEventListener('click', () => {
  state.viewMode = 'grid';
  elements.btnGridView.classList.add('active');
  elements.btnTableView.classList.remove('active');
  renderGames();
});

elements.btnTableView.addEventListener('click', () => {
  state.viewMode = 'table';
  elements.btnTableView.classList.add('active');
  elements.btnGridView.classList.remove('active');
  renderGames();
});

// Cerrar modales
const closeModals = () => {
  elements.gameModal.style.display = 'none';
  elements.patchModal.style.display = 'none';
  elements.detailModal.style.display = 'none';
  elements.deleteModal.style.display = 'none';
};

elements.btnCloseGameModal.addEventListener('click', closeModals);
elements.btnCancelGameModal.addEventListener('click', closeModals);
elements.btnClosePatchModal.addEventListener('click', closeModals);
elements.btnCancelPatchModal.addEventListener('click', closeModals);
elements.btnCloseDetailModal.addEventListener('click', closeModals);
elements.btnCloseDetailBtn.addEventListener('click', closeModals);
elements.btnCancelDelete.addEventListener('click', closeModals);
elements.btnCloseDeleteModal.addEventListener('click', closeModals);

elements.btnOpenCreateModal.addEventListener('click', openCreateModal);

// Consola REST: toggle collapse & clear
elements.toggleConsole.addEventListener('click', (e) => {
  if (e.target.closest('#btnClearLogs')) return;
  elements.restConsole.classList.toggle('collapsed');
  const icon = elements.btnExpandConsole.querySelector('i');
  if (elements.restConsole.classList.contains('collapsed')) {
    icon.className = 'fa-solid fa-chevron-up';
  } else {
    icon.className = 'fa-solid fa-chevron-down';
  }
});

elements.btnClearLogs.addEventListener('click', () => {
  elements.consoleLogs.innerHTML = `
    <div class="log-entry log-welcome">
      <span class="log-time">[LOGS]</span>
      <span class="log-msg">Historial de peticiones limpiado.</span>
    </div>
  `;
});

// Cierre al presionar ESC o click en backdrop
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModals();
});

document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModals();
  });
});

function resetFilters() {
  state.search = '';
  state.genre = '';
  state.sortBy = 'id';
  state.order = 'desc';
  elements.searchInput.value = '';
  elements.btnClearSearch.style.display = 'none';
  elements.filterGenre.value = '';
  elements.filterSort.value = 'id';
  elements.filterOrder.value = 'desc';
  loadGames();
}

// Inicialización
window.addEventListener('DOMContentLoaded', async () => {
  await checkHealth();
  await Promise.all([loadGames(), loadStats()]);
});

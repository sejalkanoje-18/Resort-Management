const BASE_URL = 'http://localhost:5000/api'

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem('resort_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, config)
    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      if (res.status === 401) {
        // Clear token on 401
        localStorage.removeItem('resort_token')
      }
      const errorMsg = data.error || `HTTP ${res.status}: ${res.statusText}`
      throw new Error(errorMsg)
    }

    return data
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err.message)
    throw err
  }
}

// Domain API services
export const authApi = {
  login: (email, password) => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name, email, password, phone) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, phone }) }),
  me: () => apiFetch('/auth/me'),
}

export const resortsApi = {
  getAll: () => apiFetch('/resorts'),
  create: (data) => apiFetch('/resorts', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/resorts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

export const roomsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/rooms${query ? `?${query}` : ''}`)
  },
  getAvailable: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/rooms/available${query ? `?${query}` : ''}`)
  },
  create: (data) => apiFetch('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  updateStatus: (id, data) => apiFetch(`/rooms/${id}/status`, { method: 'PATCH', body: JSON.stringify(data) }),
}

export const guestsApi = {
  getAll: (search = '') => apiFetch(`/guests${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getById: (id) => apiFetch(`/guests/${id}`),
  create: (data) => apiFetch('/guests', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/guests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

export const reservationsApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/reservations${query ? `?${query}` : ''}`)
  },
  getById: (id) => apiFetch(`/reservations/${id}`),
  create: (data) => apiFetch('/reservations', { method: 'POST', body: JSON.stringify(data) }),
  checkIn: (id, roomNumber) => apiFetch(`/reservations/${id}/check-in`, { method: 'POST', body: JSON.stringify({ roomNumber }) }),
  checkOut: (id) => apiFetch(`/reservations/${id}/check-out`, { method: 'POST' }),
  extend: (id, additionalNights) => apiFetch(`/reservations/${id}/extend`, { method: 'POST', body: JSON.stringify({ additionalNights }) }),
  transfer: (id, newRoomNumber) => apiFetch(`/reservations/${id}/transfer`, { method: 'POST', body: JSON.stringify({ newRoomNumber }) }),
  cancel: (id, reason) => apiFetch(`/reservations/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  noShow: (id) => apiFetch(`/reservations/${id}/no-show`, { method: 'POST' }),
}

export const housekeepingApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/housekeeping${query ? `?${query}` : ''}`)
  },
  create: (data) => apiFetch('/housekeeping', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status, notes) => apiFetch(`/housekeeping/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
}

export const maintenanceApi = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return apiFetch(`/maintenance${query ? `?${query}` : ''}`)
  },
  create: (data) => apiFetch('/maintenance', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status, notes) => apiFetch(`/maintenance/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
}

export const fnbApi = {
  getOrders: () => apiFetch('/fnb/orders'),
  createOrder: (data) => apiFetch('/fnb/orders', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => apiFetch(`/fnb/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export const spaApi = {
  getAppointments: () => apiFetch('/spa/appointments'),
  bookAppointment: (data) => apiFetch('/spa/appointments', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id, status) => apiFetch(`/spa/appointments/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
}

export const billingApi = {
  getInvoices: (search = '') => apiFetch(`/billing/invoices${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getFolio: (reservationId) => apiFetch(`/billing/folio/${reservationId}`),
  addCharge: (reservationId, data) => apiFetch(`/billing/folio/${reservationId}/charge`, { method: 'POST', body: JSON.stringify(data) }),
  payFolio: (reservationId, amount, method) => apiFetch(`/billing/folio/${reservationId}/pay`, { method: 'POST', body: JSON.stringify({ amount, method }) }),
}

export const offersApi = {
  getAll: () => apiFetch('/offers'),
  create: (data) => apiFetch('/offers', { method: 'POST', body: JSON.stringify(data) }),
  validate: (code, amount) => apiFetch('/offers/validate', { method: 'POST', body: JSON.stringify({ code, amount }) }),
}

export const reviewsApi = {
  getAll: () => apiFetch('/reviews'),
  create: (data) => apiFetch('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/reviews/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
}

export const reportsApi = {
  getDashboardStats: () => apiFetch('/reports/dashboard-stats'),
  getOccupancy: () => apiFetch('/reports/occupancy'),
  getRevenue: () => apiFetch('/reports/revenue'),
}

export const usersApi = {
  getAll: () => apiFetch('/users'),
  create: (data) => apiFetch('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
}

export const auditApi = {
  getAll: () => apiFetch('/audit'),
}

const API_BASE = 'http://localhost:8080/api';

// --- ROUTING & VIEW MANAGEMENT ---
document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Auth State Listener
    window.addEventListener('auth-change', updateNavbar);
});

function initApp() {
    updateNavbar();
    fetchDoctors();

    // Default route
    if (Auth.isAuthenticated()) {
        const user = Auth.getUser();
        if (user.role === 'ADMIN') showSection('dashboard-admin');
        else showSection('dashboard-patient');
    } else {
        showSection('home');
    }
}

function showSection(sectionId) {
    // Hide all
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));

    // Helper functionality for specific views
    const view = document.getElementById(`view-${sectionId}`);
    if (view) {
        view.classList.remove('hidden');

        // Load data if needed
        if (sectionId === 'dashboard-patient') loadPatientDashboard();
        if (sectionId === 'dashboard-admin') loadAdminDashboard();
        if (sectionId === 'doctors') renderDoctorsView();
    }

    window.scrollTo(0, 0);
}

function updateNavbar() {
    const user = Auth.getUser();
    if (user) {
        document.getElementById('nav-guest').classList.add('hidden');
        document.getElementById('nav-user').classList.remove('hidden');
        document.getElementById('user-greeting').textContent = `Hi, ${user.name.split(' ')[0]}`;
    } else {
        document.getElementById('nav-guest').classList.remove('hidden');
        document.getElementById('nav-user').classList.add('hidden');
    }
}

function navigateToDashboard() {
    const user = Auth.getUser();
    if (!user) return showSection('login');
    if (user.role === 'ADMIN') showSection('dashboard-admin');
    else showSection('dashboard-patient');
}

// --- AUTHENTICATION ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('loginBtn');
        const originalText = btn.textContent;
        btn.textContent = 'Signing in...';
        btn.disabled = true;

        const email = document.getElementById('email-address').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error('Invalid credentials');

            const user = await res.json();
            Auth.login(user); // Save to local storage
            showToast(`Welcome back, ${user.name}!`);

            // Redirect based on role
            if (user.role === 'ADMIN') showSection('dashboard-admin');
            else showSection('dashboard-patient');

        } catch (err) {
            showToast(err.message || 'Login failed', 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });
}

// --- PATIENT DASHBOARD ---
async function loadPatientDashboard() {
    const user = Auth.getUser();
    if (!user) return;

    const listEl = document.getElementById('patient-appointments-list');
    listEl.innerHTML = '<div class="p-8 text-center text-gray-500">Loading appointments...</div>';

    try {
        const res = await fetch(`${API_BASE}/appointments/patient/${user.id}`);
        const appointments = await res.json();

        if (appointments.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-10">
                    <ion-icon name="calendar-outline" class="text-4xl text-gray-300 mb-3"></ion-icon>
                    <p class="text-gray-500">No appointments found.</p>
                    <button onclick="showSection('book-appointment')" class="mt-4 text-blue-600 font-medium hover:underline">Book your first one</button>
                </div>
            `;
            return;
        }

        listEl.innerHTML = appointments.map(appt => `
            <div class="px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-center group">
                <div>
                    <h4 class="text-sm font-bold text-gray-900">${appt.doctorName} (ID: ${appt.doctorId})</h4>
                    <p class="text-xs text-gray-500">${appt.date} at ${appt.startTime.substring(0, 5)}</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appt.status)} mt-2">
                        ${appt.status}
                    </span>
                </div>
                ${appt.status !== 'CANCELLED' && appt.status !== 'COMPLETED' ? `
                    <button onclick="cancelAppointment(${appt.id})" class="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                    </button>
                ` : ''}
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
        listEl.innerHTML = '<div class="p-8 text-center text-red-500">Failed to load data.</div>';
    }
}

// --- ADMIN DASHBOARD ---
async function loadAdminDashboard() {
    const tableBody = document.getElementById('admin-appointments-table');
    tableBody.innerHTML = '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">Loading...</td></tr>';

    try {
        const [apptsRes, docsRes] = await Promise.all([
            fetch(`${API_BASE}/appointments/all`),
            fetch(`${API_BASE}/doctors`)
        ]);

        const appointments = await apptsRes.json();
        const doctors = await docsRes.json();

        // Stats
        document.getElementById('stat-total-appts').textContent = appointments.length;
        document.getElementById('stat-active-docs').textContent = doctors.length;

        // Table
        tableBody.innerHTML = appointments.map(appt => `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#${appt.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${appt.patientName || 'Patient ' + appt.patientId}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appt.doctorName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${appt.date} ${appt.startTime.substring(0, 5)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appt.status)}">
                        ${appt.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     ${appt.status === 'CREATED' || appt.status === 'CONFIRMED' ? `
                        <button onclick="cancelAppointment(${appt.id})" class="text-red-600 hover:text-red-900">Cancel</button>
                    ` : '<span class="text-gray-300">--</span>'}
                </td>
            </tr>
        `).join('');

    } catch (err) {
        console.error(err);
    }
}


// --- BOOKING LOGIC ---
// (Similar to previous, but integrated)
let doctorListCache = [];

async function fetchDoctors() {
    try {
        const res = await fetch(`${API_BASE}/doctors`);
        doctorListCache = await res.json();

        const select = document.getElementById('doctorSelect');
        if (select) {
            select.innerHTML = '<option value="">Select a Doctor...</option>';
            doctorListCache.forEach(doc => {
                const name = doc.user ? `Dr. ${doc.user.firstName} ${doc.user.lastName}` : `Doctor #${doc.id}`;
                const option = document.createElement('option');
                option.value = doc.id;
                option.textContent = `${name} - ${doc.specialization}`;
                select.appendChild(option);
            });
        }
    } catch (err) { console.error('Error fetching doctors', err); }
}

function renderDoctorsView() {
    const container = document.getElementById('doctors-list-container');
    if (!container) return;

    container.innerHTML = doctorListCache.map(doc => {
        const name = doc.user ? `Dr. ${doc.user.firstName} ${doc.user.lastName}` : `Doctor #${doc.id}`;
        return `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                <div class="h-20 w-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl font-bold mb-4">
                    ${name.charAt(4)}
                </div>
                <h3 class="text-lg font-bold text-gray-900">${name}</h3>
                <p class="text-blue-600 font-medium mb-2">${doc.specialization}</p>
                <p class="text-gray-500 text-sm mb-4 line-clamp-2">${doc.bio || 'Experienced specialist.'}</p>
                <div class="mt-auto">
                    <p class="text-gray-900 font-bold mb-3">$${doc.consultationFee}</p>
                    <button onclick="preselectDoctorForBooking(${doc.id})" class="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition">Book Appointment</button>
                </div>
            </div>
        `;
    }).join('');
}

function preselectDoctorForBooking(docId) {
    showSection('book-appointment');
    setTimeout(() => {
        const select = document.getElementById('doctorSelect');
        if (select) {
            select.value = docId;
            select.dispatchEvent(new Event('change'));
        }
    }, 100);
}


// Slot Logic
const doctorSelect = document.getElementById('doctorSelect');
const dateInput = document.getElementById('appointmentDate');
let selectedSlot = null;

if (doctorSelect && dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];

    const checkSlots = () => {
        if (doctorSelect.value && dateInput.value) loadSlots(doctorSelect.value, dateInput.value);
    };

    doctorSelect.addEventListener('change', checkSlots);
    dateInput.addEventListener('change', checkSlots);
}

async function loadSlots(doctorId, date) {
    const container = document.getElementById('slotsContainer');
    const grid = document.getElementById('slotsGrid');

    try {
        const res = await fetch(`${API_BASE}/doctors/${doctorId}/schedule?date=${date}`);
        const slots = await res.json();

        container.classList.remove('hidden');
        grid.innerHTML = '';
        selectedSlot = null;

        if (slots.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">No slots available (Day off or Fully Booked)</div>';
            return;
        }

        slots.forEach(slot => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = slot.available ?
                'py-2 px-1 text-sm font-medium border rounded-md hover:border-blue-500 hover:text-blue-600 focus:ring-2 focus:ring-blue-500 bg-white text-gray-700' :
                'py-2 px-1 text-sm font-medium border rounded-md bg-gray-100 text-gray-400 cursor-not-allowed';
            btn.disabled = !slot.available;
            btn.textContent = slot.start.substring(0, 5);

            if (slot.available) {
                btn.onclick = (e) => {
                    e.preventDefault();
                    // clear others
                    Array.from(grid.children).forEach(c => c.classList.remove('bg-blue-600', 'text-white', 'border-blue-600'));
                    // set active
                    btn.classList.add('bg-blue-600', 'text-white', 'border-blue-600');
                    btn.classList.remove('bg-white', 'text-gray-700');
                    selectedSlot = slot;
                };
            }
            grid.appendChild(btn);
        });

    } catch (err) { console.error(err); }
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = Auth.getUser();
        if (!user) {
            showToast('Please login to book', 'error');
            showSection('login');
            return;
        }

        if (!selectedSlot) {
            showToast('Please select a time slot', 'error');
            return;
        }

        // Check for patient ID in auth object
        if (!user.patientId && user.role === 'PATIENT') {
            showToast('Patient profile not found. Contact admin.', 'error');
            return;
        }

        // For Admin booking on behalf of someone else, we'd need a patient selector. 
        // For this requirement, we assume Self-Booking or Demo fallback.
        const patientId = user.patientId || 1;

        const payload = {
            doctorId: parseInt(doctorSelect.value),
            patientId: patientId,
            date: dateInput.value,
            startTime: selectedSlot.start,
            endTime: selectedSlot.end,
            reason: document.getElementById('reason').value
        };

        try {
            const res = await fetch(`${API_BASE}/appointments/book`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Booking failed');

            showToast('Confirmed! Check your dashboard.');
            setTimeout(() => showSection('dashboard-patient'), 1500);

        } catch (err) {
            showToast('Failed to book', 'error');
        }
    });
}

async function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    try {
        await fetch(`${API_BASE}/appointments/${id}/cancel`, { method: 'POST' });
        showToast('Appointment cancelled');
        // Refresh appropriate view
        const currentView = document.querySelector(':not(.hidden).view-section').id;
        if (currentView === 'view-dashboard-admin') loadAdminDashboard();
        else loadPatientDashboard();
    } catch (err) {
        showToast('Action failed', 'error');
    }
}


// --- UTILS ---
function getStatusColor(status) {
    switch (status) {
        case 'CONFIRMED': return 'bg-green-100 text-green-800';
        case 'CREATED': return 'bg-blue-100 text-blue-800';
        case 'CANCELLED': return 'bg-red-100 text-red-800';
        case 'COMPLETED': return 'bg-gray-100 text-gray-800';
        default: return 'bg-gray-100 text-gray-600';
    }
}

function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    document.getElementById('toastMessage').textContent = msg;
    toast.classList.remove('translate-y-full');
    setTimeout(() => toast.classList.add('translate-y-full'), 3000);
}

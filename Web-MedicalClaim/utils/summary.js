/**
 * getMedic. Template - Centralized Dashboard Summary Logic (All Roles)
 */

const initDashboard = () => {
    const sessionData = localStorage.getItem('medic_session');
    if (!sessionData) return;
    const session = JSON.parse(sessionData);

    // 1. Tampilkan kontainer dashboard yang sesuai dengan role
    const viewContainer = document.getElementById('view-' + session.role);
    if (viewContainer) {
        viewContainer.classList.remove('hidden');
    }

    // 2. Ambil data global dari LocalStorage
    const allClaims = JSON.parse(localStorage.getItem('medic_claims')) || [];
    const allUsers = JSON.parse(localStorage.getItem('medic_users')) || [];

    // 3. Distribusikan tugas rendering berdasarkan role
    switch (session.role) {
        case 'employee':
            renderEmployeeSummary(session, allClaims);
            break;
        case 'manager':
            renderManagerSummary(allClaims);
            break;
        case 'finance':
            renderFinanceSummary(allClaims);
            break;
        case 'admin':
            renderAdminSummary(allClaims, allUsers);
            break;
    }
};

// ==========================================
// LOGIKA SUMMARY: EMPLOYEE
// ==========================================
const renderEmployeeSummary = (session, allClaims) => {
    document.getElementById('cardName').textContent = session.name;
    document.getElementById('cardId').textContent = session.id;

    const myClaims = allClaims.filter(c => c.userId === session.id);
    const tbody = document.getElementById('empTableBody');
    let totalAmount = 0;

    if (myClaims.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center py-6 text-slate-500">No claims found.</td></tr>';
    } else {
        myClaims.forEach(claim => {
            totalAmount += claim.amount;
            let color = claim.status === 'Approved' || claim.status === 'Settled' ? 'bg-emerald-50 text-emerald-700' : (claim.status === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700');
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="hover:bg-slate-50/80">
                    <td class="px-6 py-4 font-bold text-slate-900">${claim.id}</td>
                    <td class="px-6 py-4 text-right font-semibold">$${claim.amount.toFixed(2)}</td>
                    <td class="px-6 py-4 text-center"><span class="px-2.5 py-0.5 rounded-full text-xs font-bold ${color}">${claim.status}</span></td>
                    <td class="px-6 py-4 text-center">
                        <button onclick="openTrackingModal('${claim.status}', '${claim.id}')" class="text-blue-600 hover:text-blue-800 font-bold text-xs bg-blue-50 px-2 py-1 rounded">Track</button>
                    </td>
                </tr>
            `);
        });
    }
    document.getElementById('empDeductible').textContent = totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2});
    document.getElementById('empOop').textContent = totalAmount.toLocaleString('en-US', {minimumFractionDigits: 2});
    setTimeout(() => {
        document.getElementById('barDeductible').style.width = Math.min((totalAmount / 500) * 100, 100) + '%';
        document.getElementById('barOop').style.width = Math.min((totalAmount / 2500) * 100, 100) + '%';
    }, 100);
};

// ==========================================
// LOGIKA SUMMARY: MANAGER
// ==========================================
const renderManagerSummary = (allClaims) => {
    const pendingClaims = allClaims.filter(c => c.status === 'Pending');
    document.getElementById('mgrPendingCount').textContent = pendingClaims.length;

    const totalTeamBilled = allClaims.reduce((sum, c) => sum + c.amount, 0);
    document.getElementById('mgrTotalBilled').textContent = '$' + totalTeamBilled.toLocaleString('en-US', {minimumFractionDigits: 0});

    const tbody = document.getElementById('mgrTableBody');
    if (pendingClaims.length === 0) {
        tbody.innerHTML = '<tr><td class="text-center py-4 text-slate-500 text-xs">All caught up!</td></tr>';
    } else {
        pendingClaims.slice(0, 3).forEach(claim => {
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="hover:bg-slate-50/80">
                    <td class="px-6 py-3 font-bold text-xs text-slate-900">${claim.userName}</td>
                    <td class="px-6 py-3 font-semibold text-xs text-slate-500">${claim.id}</td>
                    <td class="px-6 py-3 text-right font-black text-xs text-slate-900">$${claim.amount}</td>
                </tr>
            `);
        });
    }

    // Panggil engine grafik dari utils/charts.js
    setTimeout(() => {
        if (typeof renderManagerChart === 'function') {
            renderManagerChart(allClaims);
        }
    }, 100);
};

// ==========================================
// LOGIKA SUMMARY: FINANCE (Dashboard Baru)
// ==========================================
const renderFinanceSummary = (allClaims) => {
    const approvedClaims = allClaims.filter(c => c.status === 'Approved');
    const settledClaims = allClaims.filter(c => c.status === 'Settled');

    // Hitung dana yang siap dicairkan & dana yang sudah sukses ditransfer
    const totalAwaiting = approvedClaims.reduce((sum, c) => sum + c.amount, 0);
    const totalDisbursed = settledClaims.reduce((sum, c) => sum + c.amount, 0);

    document.getElementById('finPendingPayouts').textContent = approvedClaims.length;
    document.getElementById('finAwaitingAmount').textContent = '$' + totalAwaiting.toLocaleString('en-US', {minimumFractionDigits: 0});
    document.getElementById('finDisbursedAmount').textContent = '$' + totalDisbursed.toLocaleString('en-US', {minimumFractionDigits: 0});

    // Tampilkan pratinjau antrean transfer bank teratas
    const tbody = document.getElementById('finTableBody');
    if (approvedClaims.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center py-6 text-slate-500 text-xs font-medium">No pending bank transfers.</td></tr>';
    } else {
        approvedClaims.slice(0, 3).forEach(claim => {
            tbody.insertAdjacentHTML('beforeend', `
                <tr class="hover:bg-slate-50/80">
                    <td class="px-6 py-3 font-bold text-xs text-slate-900">${claim.userName}</td>
                    <td class="px-6 py-3 font-mono text-xs text-slate-500">Bank of America</td>
                    <td class="px-6 py-3 text-right font-black text-xs text-emerald-600">$${claim.amount.toFixed(2)}</td>
                </tr>
            `);
        });
    }
};

// ==========================================
// LOGIKA SUMMARY: ADMIN
// ==========================================
const renderAdminSummary = (allClaims, allUsers) => {
    document.getElementById('admUserCount').textContent = allUsers.length;
    document.getElementById('admClaimCount').textContent = allClaims.length;

    let totalLimit = allUsers.reduce((sum, u) => sum + parseFloat(u.limit), 0);
    document.getElementById('admGlobalLimit').textContent = '$' + totalLimit.toLocaleString('en-US', {minimumFractionDigits: 0});

    const rejected = allClaims.filter(c => c.status === 'Rejected');
    document.getElementById('admExceptionCount').textContent = rejected.length;
};

// Jalankan otomatis saat dokumen dimuat
document.addEventListener("DOMContentLoaded", initDashboard);
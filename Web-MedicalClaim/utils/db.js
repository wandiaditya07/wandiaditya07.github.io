/**
 * getMedic. Template - LocalStorage Database Simulator
 * Handles initial data seeding and CRUD operations for the demo.
 */

const initializeDB = () => {
    // 1. Blueprint Pengaturan Pabrik (Akan dieksekusi jika LocalStorage kosong)
    const defaultUsers = [
        { id: 'EMP-18431', name: 'Lynxx', password: 'password123', role: 'employee', dept: 'IT & Engineering', limit: 1500, balance: 1250, avatar: 'https://ui-avatars.com/api/?name=Lynxx&background=0D8ABC&color=fff' },
        { id: 'MGR-2041', name: 'Sarah Miller', password: 'password123', role: 'manager', dept: 'Marketing', limit: 2000, balance: 2000, avatar: 'https://ui-avatars.com/api/?name=Sarah+Miller&background=8B5CF6&color=fff' },
        { id: 'FIN-5050', name: 'Diana Cash', password: 'password123', role: 'finance', dept: 'Finance & Accounting', limit: 3000, balance: 3000, avatar: 'https://ui-avatars.com/api/?name=Diana+Cash&background=F59E0B&color=fff' },
        { id: 'ADM-9999', name: 'System Admin', password: 'admin', role: 'admin', dept: 'Human Resources', limit: 5000, balance: 5000, avatar: 'https://ui-avatars.com/api/?name=System+Admin&background=10B981&color=fff' }
    ];

    // Blueprint Klaim (Dikosongkan agar saat presentasi/demo, dashboardnya bersih)
    const defaultClaims = [];

    // 2. Logika Pengecekan & Injeksi
    if (!localStorage.getItem('medic_users')) {
        localStorage.setItem('medic_users', JSON.stringify(defaultUsers));
        console.log('Sistem di-reset: 4 Akun Default berhasil dibuat.');
    }
    
    if (!localStorage.getItem('medic_claims')) {
        localStorage.setItem('medic_claims', JSON.stringify(defaultClaims));
        console.log('Sistem di-reset: Database klaim dikosongkan.');
    }
};

// Eksekusi fungsi setiap kali file terpanggil
initializeDB();
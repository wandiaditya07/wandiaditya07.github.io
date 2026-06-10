/**
 * getMedic. Template - Dynamic Layout & Session Guard
 */

document.addEventListener("DOMContentLoaded", () => {
    const sessionData = localStorage.getItem('medic_session');
    if (!sessionData && !window.location.pathname.includes('index.html')) {
        window.location.href = '../index.html';
        return;
    }
    
    let currentRole = 'employee';
    let userSession = {};
    if (sessionData) {
        userSession = JSON.parse(sessionData);
        currentRole = userSession.role;
    }

    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    const sidebarHTML = `
        <div id="sidebar-overlay" class="fixed inset-0 bg-slate-900/60 z-40 hidden lg:hidden backdrop-blur-sm transition-opacity duration-300 opacity-0 cursor-pointer"></div>
        <aside id="main-sidebar" class="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed lg:static inset-y-0 left-0 z-50 transform -translate-x-full lg:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none">
            <div class="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950 shrink-0">
                <div class="flex items-center">
                    <div class="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg flex items-center justify-center mr-3 shadow-md">
                        <i class="fa-solid fa-notes-medical text-white text-xs"></i>
                    </div>
                    <span class="text-xl font-extrabold text-white tracking-tight">getMedic<span class="text-blue-500">.</span></span>
                </div>
                <button id="close-sidebar" class="lg:hidden text-slate-400 hover:text-white focus:outline-none transition"><i class="fa-solid fa-xmark text-xl"></i></button>
            </div>
            
            <nav class="p-4 flex-1 overflow-y-auto">
                <p class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-3">Main Menu</p>
                <ul id="sidebarMenu" class="space-y-1">
                    <li class="menu-item" data-roles="employee,manager,finance,admin">
                        <a href="dashboard.html" class="nav-link flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition group">
                            <i class="fa-solid fa-chart-pie w-5 text-slate-400 group-hover:text-white transition"></i><span class="font-medium text-sm ml-3">Dashboard</span>
                        </a>
                    </li>
                    <li class="menu-item" data-roles="manager,admin">
                        <a href="pending-approvals.html" class="nav-link flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition group">
                            <i class="fa-solid fa-clipboard-check w-5 text-slate-400 group-hover:text-white transition"></i><span class="font-medium text-sm ml-3">Adjudication</span>
                        </a>
                    </li>
                    <li class="menu-item" data-roles="finance,admin">
                        <a href="payouts.html" class="nav-link flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition group">
                            <i class="fa-solid fa-money-bill-transfer w-5 text-slate-400 group-hover:text-white transition"></i><span class="font-medium text-sm ml-3">Settlements</span>
                        </a>
                    </li>
                    <li class="menu-item" data-roles="manager,finance,admin">
                        <a href="analytics.html" class="nav-link flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition group">
                            <i class="fa-solid fa-chart-line w-5 text-slate-400 group-hover:text-white transition"></i><span class="font-medium text-sm ml-3">Analytics & EOB</span>
                        </a>
                    </li>
                    <li class="menu-item" data-roles="admin">
                        <a href="directory.html" class="nav-link flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition group">
                            <i class="fa-solid fa-users w-5 text-slate-400 group-hover:text-white transition"></i><span class="font-medium text-sm ml-3">Employee Directory</span>
                        </a>
                    </li>
                    <li class="menu-item" data-roles="admin">
                        <a href="settings.html" class="nav-link flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition group">
                            <i class="fa-solid fa-gear w-5 text-slate-400 group-hover:text-white transition"></i><span class="font-medium text-sm ml-3">Policy Settings</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>
    `;

    const topbarHTML = `
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 z-10 shadow-sm w-full">
            <div class="flex items-center gap-4">
                <button id="open-sidebar" class="lg:hidden text-slate-500 hover:text-blue-600 focus:outline-none transition"><i class="fa-solid fa-bars text-xl"></i></button>
                <span class="hidden sm:inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                    <i class="fa-solid fa-user-shield mr-1.5"></i> Access: ${userSession.role || 'Guest'}
                </span>
            </div>
            <div class="flex items-center gap-4 sm:gap-5">
                <a href="profile.html" class="flex items-center gap-3 hover:bg-slate-50 p-1.5 pr-3 rounded-lg border border-transparent hover:border-slate-200 transition group">
                    <div class="hidden sm:block text-right">
                        <p class="text-sm font-bold text-slate-700 leading-none group-hover:text-blue-600 transition">${userSession.name || 'User'}</p>
                        <p class="text-xs text-slate-500 mt-1 font-medium leading-none">${userSession.dept || 'Department'}</p>
                    </div>
                    <div class="w-9 h-9 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shadow-sm">
                        <img src="${userSession.avatar || 'https://ui-avatars.com/api/?name=U'}" alt="Profile" class="w-full h-full object-cover">
                    </div>
                </a>
                <div class="hidden sm:block w-px h-6 bg-slate-200 mx-1"></div>
                <a href="#" id="logoutBtn" class="text-sm text-slate-500 hover:text-red-600 font-bold transition flex items-center gap-1.5">
                    <i class="fa-solid fa-right-from-bracket"></i><span class="hidden sm:inline-block">Sign Out</span>
                </a>
            </div>
        </header>
    `;

    const sidebarContainer = document.getElementById('sidebar-container');
    const topbarContainer = document.getElementById('topbar-container');
    if(sidebarContainer) sidebarContainer.innerHTML = sidebarHTML;
    if(topbarContainer) topbarContainer.innerHTML = topbarHTML;

    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        localStorage.removeItem('medic_session');
        window.location.href = '../index.html';
    });

    document.querySelectorAll('.menu-item').forEach(item => {
        if (!item.getAttribute('data-roles').split(',').includes(currentRole)) item.style.display = 'none';
    });

    const currentPath = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.remove('text-slate-300', 'hover:bg-slate-800');
            link.classList.add('bg-blue-600', 'text-white', 'shadow-md');
            const icon = link.querySelector('i');
            if(icon) icon.classList.replace('text-slate-400', 'text-white');
        }
    });

    const toggleSidebar = () => {
        document.getElementById('main-sidebar').classList.toggle('-translate-x-full');
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay.classList.contains('hidden')) {
            overlay.classList.remove('hidden'); setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        } else {
            overlay.classList.add('opacity-0'); setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    };
    document.getElementById('open-sidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('close-sidebar')?.addEventListener('click', toggleSidebar);
    document.getElementById('sidebar-overlay')?.addEventListener('click', toggleSidebar);
});
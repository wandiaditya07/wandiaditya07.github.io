/**
 * getMedic. Template - Charts & Data Visualization Engine
 */

const renderManagerChart = (allClaims) => {
    const canvas = document.getElementById('mgrDonutChart');
    if (!canvas) {
        console.error("Canvas element 'mgrDonutChart' not found!");
        return;
    }

    // Pastikan Chart.js sudah termuat
    if (typeof Chart === 'undefined') {
        console.error("Chart.js library is not loaded!");
        return;
    }

    // 1. Kategorisasi Data (Hitung total NOMINAL uang per kategori, bukan cuma jumlah klaimnya, agar grafiknya lebih berbobot)
    const categoryTotals = { 'Outpatient': 0, 'Inpatient': 0, 'Dental Care': 0, 'Optical': 0 };
    let hasData = false;

    allClaims.forEach(c => { 
        if(categoryTotals.hasOwnProperty(c.category)) {
            categoryTotals[c.category] += c.amount; 
            hasData = true;
        } else {
            categoryTotals[c.category] = c.amount; 
            hasData = true;
        }
    });

    // Jika belum ada klaim sama sekali, beri data kosong agar grafik abu-abu muncul
    if (!hasData) {
        categoryTotals['No Data'] = 1;
    }

    // 2. Hapus chart lama jika ada (mencegah bug 'canvas is already in use')
    if (window.mgrChartInstance) {
        window.mgrChartInstance.destroy();
    }

    // 3. Konfigurasi dan Render Chart
    const ctx = canvas.getContext('2d');
    window.mgrChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                // Warna: Biru, Ungu, Hijau, Oranye, Merah Muda, atau Abu-abu jika kosong
                backgroundColor: hasData ? ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'] : ['#e2e8f0'],
                borderWidth: 0,
                hoverOffset: hasData ? 10 : 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    position: 'right', // Pindah ke kanan agar lebih rapi
                    labels: { 
                        usePointStyle: true, 
                        padding: 20, 
                        font: { size: 12, weight: '500' },
                        color: '#64748b'
                    } 
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            if (!hasData) return 'No data available';
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed);
                            }
                            return label;
                        }
                    }
                }
            },
            cutout: '75%', // Lubang tengah lebih besar agar terlihat modern
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
};
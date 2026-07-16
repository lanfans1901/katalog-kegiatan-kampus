// Variabel global untuk menyimpan semua data kegiatan dari JSON
let dataKegiatan = [];

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById('kegiatan-container');
    const inputPencarian = document.getElementById('pencarian');
    const selectKategori = document.getElementById('kategori');
    const selectStatus = document.getElementById('status');
    const selectPilihanKegiatan = document.getElementById('pilihan-kegiatan');

    // 1. Mengambil data JSON saat halaman pertama dimuat
    fetch('kegiatan.json')
        .then(response => {
            if (!response.ok) throw new Error("Gagal mengambil data JSON");
            return response.json();
        })
        .then(data => {
            dataKegiatan = data; // Simpan data utuh ke variabel
            renderKegiatan(dataKegiatan); // Tampilkan semua data untuk pertama kali
            isiPilihanKegiatan(dataKegiatan); // Isi dropdown form pendaftaran
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = `
                <div class="col-12 text-center text-danger">
                    <p>Gagal memuat data kegiatan. Pastikan Anda menjalankan web ini di local server.</p>
                </div>`;
        });

    // 2. Fungsi Utama untuk merender HTML Card Kegiatan
    function renderKegiatan(data) {
        let htmlContent = '';

        if (data.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-muted my-5">
                    <i class="bi bi-search display-4"></i>
                    <p class="mt-3">Maaf, tidak ada kegiatan yang sesuai dengan pencarian/filter Anda.</p>
                </div>`;
            return;
        }

        data.forEach(item => {
            // Logika Warna Badge Kategori
            let badgeClass = 'bg-secondary-subtle text-secondary';
            if (item.kategori === 'Akademik') badgeClass = 'bg-primary-subtle text-primary';
            else if (item.kategori === 'Olahraga') badgeClass = 'bg-success-subtle text-success';
            else if (item.kategori === 'Seni & Budaya') badgeClass = 'bg-warning-subtle text-warning';
            else if (item.kategori === 'Organisasi & BEM') badgeClass = 'bg-info-subtle text-info';

            // Logika Status
            let statusIcon = '';
            let statusColor = '';
            let btnState = '';

            if (item.status === 'Buka Pendaftaran') {
                statusIcon = '<i class="bi bi-check-circle-fill me-1"></i>';
                statusColor = 'text-success';
            } else if (item.status === 'Segera Buka') {
                statusIcon = '<i class="bi bi-clock-fill me-1"></i>';
                statusColor = 'text-warning';
                btnState = 'disabled';
            } else {
                statusIcon = '<i class="bi bi-x-circle-fill me-1"></i>';
                statusColor = 'text-danger';
                btnState = 'disabled';
            }

            htmlContent += `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 card-kegiatan" data-id="${item.id}">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge ${badgeClass} px-2 py-1 fw-semibold rounded-pill">${item.kategori}</span>
                            <span class="${statusColor} small fw-bold">${statusIcon}${item.status}</span>
                        </div>
                        <h3 class="card-title h5 fw-bold text-dark mb-2">${item.nama}</h3>
                        <div class="mb-3">
                            <p class="text-muted small mb-1"><i class="bi bi-calendar3 me-2 text-primary"></i>${item.tanggal}</p>
                            <p class="text-muted small mb-0"><i class="bi bi-geo-alt-fill me-2 text-danger"></i>${item.lokasi}</p>
                        </div>
                        <p class="card-text text-secondary flex-grow-1">${item.deskripsi}</p>
                        <a href="#pendaftaran" class="btn btn-outline-primary w-100 mt-3 fw-medium daftar-btn ${btnState}" data-id="${item.id}">Daftar Sekarang</a>
                    </div>
                </div>
            </div>
            `;
        });

        container.innerHTML = htmlContent;

        // Klik tombol "Daftar Sekarang" -> otomatis pilih kegiatan di form
        document.querySelectorAll('.daftar-btn:not(.disabled)').forEach(btn => {
            btn.addEventListener('click', function () {
                const id = this.getAttribute('data-id');
                if (selectPilihanKegiatan) selectPilihanKegiatan.value = id;
            });
        });
    }

    // 3. Isi dropdown "Pilih Kegiatan" pada form pendaftaran dari data JSON
    function isiPilihanKegiatan(data) {
        let options = '<option value="">-- Pilih Kegiatan --</option>';
        data.forEach(item => {
            options += `<option value="${item.id}">${item.nama}</option>`;
        });
        selectPilihanKegiatan.innerHTML = options;
    }

    // 4. Fungsi gabungan: pencarian (nama & deskripsi) + filter (kategori & status)
    function jalankanPencarianDanFilter() {
        const kataKunci = inputPencarian.value.trim().toLowerCase();
        const filterKategori = selectKategori.value;
        const filterStatus = selectStatus.value;

        const dataHasil = dataKegiatan.filter(item => {
            const cocokKataKunci = kataKunci === '' ||
                item.nama.toLowerCase().includes(kataKunci) ||
                item.deskripsi.toLowerCase().includes(kataKunci);

            const cocokKategori = (filterKategori === 'Semua') ? true : (item.kategori === filterKategori);
            const cocokStatus = (filterStatus === 'Semua') ? true : (item.status === filterStatus);

            return cocokKataKunci && cocokKategori && cocokStatus;
        });

        renderKegiatan(dataHasil);
    }

    // Event pencarian (mengetik) & filter (memilih dropdown)
    inputPencarian.addEventListener('input', jalankanPencarianDanFilter);
    selectKategori.addEventListener('change', jalankanPencarianDanFilter);
    selectStatus.addEventListener('change', jalankanPencarianDanFilter);

    // 5. Validasi Form Pendaftaran
    const formPendaftaran = document.getElementById('form-pendaftaran');
    const alertSukses = document.getElementById('alert-sukses');
    const formSubtitle = document.getElementById('form-subtitle');
    const btnDaftarLagi = document.getElementById('btn-daftar-lagi');

    formPendaftaran.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();

        if (!formPendaftaran.checkValidity()) {
            formPendaftaran.classList.add('was-validated');
            return;
        }

        // JIKA SEMUA VALID:
        formPendaftaran.classList.add('d-none');
        formSubtitle.classList.add('d-none');
        alertSukses.classList.remove('d-none');
        alertSukses.scrollIntoView({ behavior: 'smooth', block: 'center' });

        console.log("Form valid! Data siap dikirim ke server.");

        formPendaftaran.classList.remove('was-validated');
    });

    // 6. Tombol "Daftar Kegiatan Lain" (Reset Form)
    btnDaftarLagi.addEventListener('click', function () {
        formPendaftaran.reset();
        alertSukses.classList.add('d-none');
        formPendaftaran.classList.remove('d-none');
        formSubtitle.classList.remove('d-none');
        formPendaftaran.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

});

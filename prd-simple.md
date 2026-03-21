# PRD — SimpleDesk

**Personal Productivity & Task Tracking System untuk Mahasiswa SI**

> **Stack:** Laravel 13 · React 19 · Inertia.js · TypeScript · Tailwind CSS v4 · SQLite
> **Versi:** 1.1.0 · Maret 2026 · Status: Draft

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Latar Belakang](#2-latar-belakang)
3. [Tujuan Produk](#3-tujuan-produk)
4. [Konteks Pengguna](#4-konteks-pengguna)
5. [Fitur Produk](#5-fitur-produk)
6. [Alur Sistem](#6-alur-sistem)
7. [Arsitektur Database](#7-arsitektur-database)
8. [Tech Stack](#8-tech-stack)
9. [Struktur Halaman & Routes](#9-struktur-halaman--routes)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Error Handling & Edge Cases](#11-error-handling--edge-cases)
12. [Seed Data](#12-seed-data)
13. [Roadmap & Milestone](#13-roadmap--milestone)
14. [Out of Scope v1.0](#14-out-of-scope-v10)
15. [Rencana Fitur Future (v2.0+)](#15-rencana-fitur-future-v20)
16. [Setup Lokal & Auto-launch](#16-setup-lokal--auto-launch)
17. [Kesimpulan](#17-kesimpulan)

---

## 1. Ringkasan Eksekutif

**SimpleDesk** adalah aplikasi produktivitas personal yang berjalan sepenuhnya di localhost, terinspirasi dari konsep ticketing system osTicket namun dirancang ulang khusus untuk kebutuhan mahasiswa Sistem Informasi.

Alih-alih mengelola tiket support dari pelanggan, SimpleDesk dipakai untuk **mengelola semua hal yang perlu diselesaikan** — tugas kuliah, deadline, project kelompok, bug di kode, hingga to-do harian — dalam satu tempat yang selalu terbuka di browser.

Konsep "tiket" dipinjam karena sangat cocok dengan cara kerja mahasiswa SI: setiap tugas punya status, prioritas, kategori, catatan, dan lampiran. Bedanya, di sini kamu adalah user sekaligus agent-nya sendiri.

---

## 2. Latar Belakang

### 2.1 Masalah Nyata sebagai Mahasiswa SI Semester 4

| Masalah                                             | Dampak Harian                              |
| --------------------------------------------------- | ------------------------------------------ |
| Deadline tugas tersebar di WhatsApp, email, dan LMS | Sering ada yang kelewat atau lupa          |
| Project kelompok tidak ada tracking yang jelas      | Bingung siapa ngerjain apa dan sampai mana |
| Bug/issue saat coding tidak tercatat                | Masalah yang sama muncul lagi dan lagi     |
| Tidak ada gambaran besar progress semester          | Baru sadar keteteran saat UAS sudah dekat  |
| To-do harian tercampur dengan tugas kuliah          | Susah fokus, prioritas tidak jelas         |

### 2.2 Kenapa Tidak Pakai Notion / Trello / Todoist?

- Tools tersebut bagus, tapi kamu tidak bisa **modifikasi sesuai kebutuhan sendiri**
- Tidak ada koneksi internet? Tidak bisa buka
- Kamu mahasiswa SI — **membangun tools-mu sendiri adalah investasi skill**, bukan pemborosan waktu
- Proses membangunnya sendiri = latihan real-world Laravel + React yang jauh lebih bermakna dari tutorial

---

## 3. Tujuan Produk

| #   | Tujuan                                  | Indikator Keberhasilan                                         |
| --- | --------------------------------------- | -------------------------------------------------------------- |
| 1   | Tidak ada deadline kuliah yang terlewat | 0 tugas missed deadline dalam 1 semester pemakaian             |
| 2   | Semua task terpusat di satu tempat      | Tidak perlu buka apps lain untuk cek apa yang harus dikerjakan |
| 3   | Bug & issue coding tercatat dengan baik | Setiap sesi coding, issue yang muncul langsung dicatat di sini |
| 4   | Bisa melihat progress per mata kuliah   | Bisa jawab "seberapa selesai semester ini?" dalam 10 detik     |
| 5   | Terbuka otomatis saat buka browser      | Selalu jadi hal pertama yang dilihat saat mulai kerja          |

---

## 4. Konteks Pengguna

### Kamu — Mahasiswa SI Semester 4

**Situasi saat ini:**

- Sedang ambil mata kuliah seperti: Basis Data, Pemrograman Web, Analisis Sistem, Statistika, dll.
- Mulai sering kerjain project coding, baik individu maupun kelompok
- Butuh alat yang bisa dipakai langsung, tidak butuh setup ribet
- Ingin aplikasi ini juga jadi **portofolio nyata** yang bisa ditunjukkan ke recruiter/dosen

**Cara kamu akan pakai SimpleDesk sehari-hari:**

```
Pagi  → Buka browser → SimpleDesk langsung terbuka
       → Lihat dashboard: ada berapa deadline hari ini & minggu ini?
       → Cek to-do harian yang perlu diselesaikan

Siang → Lagi ngoding, ketemu bug → langsung catat sebagai issue ticket
       → Update status task yang baru selesai dikerjakan

Malam → Review progress hari ini
       → Tambahkan tugas baru yang dikasih dosen tadi
       → Set reminder untuk deadline besok
```

---

## 5. Fitur Produk

### 5.1 ⭐ Ticket / Task Management (Core)

Setiap "pekerjaan" di SimpleDesk direpresentasikan sebagai **tiket**. Satu tiket bisa berupa tugas kuliah, bug coding, to-do, atau item project.

- **Buat tiket baru** — judul, deskripsi, tipe, mata kuliah/konteks, prioritas, deadline, label
- **Tipe tiket:**
  - 📚 `Tugas` — tugas dari dosen, ada mata kuliah dan deadline
  - 🐛 `Bug / Issue` — masalah yang ditemukan saat coding
  - ✅ `To-do` — task harian / personal
  - 👥 `Project` — bagian dari project kelompok
- **Edit & hapus tiket**
- **Duplikasi tiket** — berguna untuk tugas yang polanya sama tiap minggu
- **Arsip tiket** — selesai tapi ingin disimpan sebagai referensi

### 5.2 ⭐ Deadline & Reminder

- **Tanggal & jam deadline** per tiket
- **Tampilan "Deadline Hari Ini"** — section khusus di dashboard yang tidak bisa dilewatkan
- **Tampilan "Deadline Minggu Ini"** — planning mingguan
- **Indikator overdue** — tiket yang sudah lewat deadline otomatis ditandai merah
- **Countdown timer** — berapa jam/hari lagi deadline di detail tiket
- **Browser notification** (via Web Notification API) — pengingat H-1 dan H-0 deadline

> **⚠️ Limitasi Notifikasi:** Web Notification API hanya bekerja **saat tab/browser sedang terbuka**. Untuk v1.0, notifikasi H-1 dan H-0 akan di-trigger saat user membuka atau sedang berada di SimpleDesk — bukan push notification di background. Jika tab belum dibuka, notifikasi akan muncul saat pertama kali membuka SimpleDesk hari itu. Implementasi **Service Worker** untuk background push notification masuk rencana v2.0.

### 5.3 ⭐ Kategorisasi per Mata Kuliah

- **Mata kuliah sebagai kategori** — bisa tambah/edit sesuai semester aktif
- **Warna per mata kuliah** — visual cue yang memudahkan scanning
- **Filter cepat** — klik nama matkul langsung filter semua tiket terkait
- **Progress per matkul** — persentase task selesai vs total per mata kuliah
- **Ganti semester** — arsip matkul semester lalu, mulai fresh untuk semester baru

### 5.4 Catatan & Lampiran per Tiket

- **Editor catatan** — tulis detail pengerjaan, solusi bug, atau deskripsi tugas
- **Markdown support** — format teks dengan heading, bold, list, code block
- **Upload lampiran** — foto soal tugas, screenshot bug, file referensi (PDF, gambar)
  - Format yang didukung: JPG, PNG, GIF, PDF, ZIP, DOC/DOCX, XLS/XLSX, TXT
  - Batas ukuran: **10 MB** per file
  - Disimpan di `storage/app/attachments/{ticket_id}/`
- **Versioning catatan** — setiap kali catatan di-edit, versi sebelumnya tersimpan di tabel `ticket_note_versions`. User bisa melihat diff antar versi dan restore versi lama jika diperlukan
- **Copy kode ke clipboard** — satu klik copy untuk code snippet di catatan

> **Catatan:** Riwayat perubahan **status, prioritas, dan field tiket** dicatat otomatis di `ticket_histories` (§7). Ini berbeda dengan **versioning catatan** yang mencatat perubahan isi teks catatan.

### 5.5 Dashboard & Progress Semester

- **Overview harian** — berapa tiket open, in progress, selesai hari ini
- **Deadline hari ini & minggu ini** — diurutkan dari yang paling mendesak
- **Progress per mata kuliah** — progress bar visual berapa % task selesai
- **Grafik produktivitas** — berapa tiket diselesaikan per hari/minggu (Recharts)
- **Streak harian** — berapa hari berturut-turut kamu menyelesaikan minimal 1 task
- **Summary mingguan** — setiap hari **Senin**, saat pertama kali membuka SimpleDesk, tampil modal/banner berisi:
  - 📊 **Rekap minggu lalu**: jumlah tiket selesai vs target, tiket overdue, streak
  - 📋 **Rencana minggu ini**: auto-generated dari tiket yang deadline-nya jatuh di minggu ini, diurutkan per hari
  - User bisa **dismiss** banner ini, dan bisa membukanya kembali dari dashboard
  - Data disimpan di tabel `settings` dengan key `last_weekly_summary_shown` untuk tracking kapan terakhir ditampilkan

### 5.6 Status & Alur Pengerjaan

- **Kanban view** opsional — lihat tiket dalam board kolom status
- **List view** — tampilan tabel dengan sorting & filter
- **Update status cepat** — klik langsung dari list tanpa buka detail (inline dropdown)
- **Bulk action** — pilih beberapa tiket sekaligus untuk update status/label/prioritas

### 5.7 Pencarian & Filter

- **Global search** — cari berdasarkan judul atau isi tiket
- **Filter** — kombinasi tipe + mata kuliah + status + prioritas + rentang tanggal
- **Sortir** — berdasarkan deadline, prioritas, tanggal dibuat, tanggal diupdate
- **Label / Tag** — beri label custom seperti `#uts`, `#kelompok`, `#penting`

### 5.8 📅 Tampilan Kalender

- **Kalender bulanan** — tampilan grid kalender standar, setiap cell tanggal menampilkan jumlah tiket yang deadline-nya jatuh di hari itu
- **Indikator visual** — dot berwarna sesuai prioritas (🔴 urgent, 🟠 high, 🟡 medium, 🟢 low) di cell tanggal
- **Klik tanggal** — menampilkan panel samping berisi daftar tiket yang deadline-nya di tanggal tersebut
- **Buat tiket dari kalender** — klik tanggal + tombol "+" untuk buat tiket baru dengan deadline otomatis terisi tanggal yang diklik
- **Navigasi bulan** — tombol prev/next untuk pindah bulan, tombol "Hari Ini" untuk kembali ke bulan aktif
- **Mini calendar di sidebar** — kalender kecil yang selalu terlihat di sidebar dashboard untuk navigasi cepat

---

## 6. Alur Sistem

### 6.1 Alur Pengerjaan Tugas Kuliah

```
Dosen kasih tugas
      │
      ▼
Buka SimpleDesk → Buat tiket baru
  - Tipe: Tugas
  - Matkul: Pemrograman Web
  - Deadline: Jumat, 28 Maret 2026 23:59
  - Prioritas: High
  - Lampiran: foto slide tugas
      │
      ▼
Status: OPEN (masuk list & dashboard)
      │
      ▼
Mulai kerjain → Status: IN PROGRESS
  + Tambah catatan progres pengerjaan
      │
      ▼
Selesai → Status: DONE ✅
  + Catat catatan akhir (misal: link repo, nilai yang didapat)
```

### 6.2 Alur Mencatat Bug Saat Coding

```
Ketemu bug saat ngoding
      │
      ▼
Alt+Tab ke browser → SimpleDesk sudah terbuka
      │
      ▼
Buat tiket baru
  - Tipe: Bug / Issue
  - Judul: "TypeError: Cannot read property of undefined di UserController"
  - Catatan: deskripsi bug + kode yang bermasalah (markdown code block)
  - Label: #laravel #backend
      │
      ▼
Lanjut debugging...
      │
      ├── Belum solved → Status: IN PROGRESS, update catatan
      │
      └── Solved → Status: DONE
            + Catat solusinya di catatan
            → Jadi referensi kalau ketemu bug serupa di masa depan 💡
```

### 6.3 Status Tiket

| Status          | Ikon | Keterangan                               |
| --------------- | ---- | ---------------------------------------- |
| **OPEN**        | 🟡   | Baru dibuat, belum mulai dikerjakan      |
| **IN PROGRESS** | 🔵   | Sedang aktif dikerjakan                  |
| **BLOCKED**     | 🔴   | Stuck, butuh sesuatu sebelum bisa lanjut |
| **DONE**        | 🟢   | Selesai dikerjakan                       |
| **ARCHIVED**    | ⚫   | Disimpan sebagai referensi, tidak aktif  |

### 6.4 Prioritas

| Prioritas     | Kapan Dipakai                        |
| ------------- | ------------------------------------ |
| 🔴 **Urgent** | Deadline < 24 jam atau sangat kritis |
| 🟠 **High**   | Deadline < 3 hari atau impact besar  |
| 🟡 **Medium** | Deadline < 1 minggu                  |
| 🟢 **Low**    | Tidak ada deadline ketat, santai     |

---

## 7. Arsitektur Database

| Tabel                  | Kolom Utama                                                                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `tickets`              | id, ticket_number, title, description, type, status, priority, subject_id, deadline_at, completed_at, is_archived, **deleted_at**, timestamps |
| `subjects`             | id, name, code, color, semester, is_active, timestamps                                                                                        |
| `ticket_notes`         | id, ticket_id, body, timestamps                                                                                                               |
| `ticket_note_versions` | id, ticket_note_id, body, version_number, timestamps                                                                                          |
| `ticket_attachments`   | id, ticket_id, note_id (nullable), file_path, file_name, mime_type, file_size, timestamps                                                     |
| `ticket_histories`     | id, ticket_id, action, old_value, new_value, timestamps                                                                                       |
| `tags`                 | id, name, color                                                                                                                               |
| `ticket_tag`           | ticket*id, tag_id *(pivot)\_                                                                                                                  |
| `settings`             | key, value                                                                                                                                    |

### Ticket Number Format

Setiap tiket mendapat nomor unik dengan format: **`SD-XXXX`** (contoh: `SD-0001`, `SD-0042`). Nomor di-generate secara auto-increment dan di-pad 4 digit. Nomor ini yang ditampilkan di UI — bukan ID database.

### Soft Delete

Tabel `tickets` menggunakan **Soft Delete** (kolom `deleted_at`). Tiket yang dihapus tidak benar-benar hilang dari database, melainkan ditandai sebagai deleted. Ini berbeda dengan **arsip** (`is_archived`) yang hanya menyembunyikan dari tampilan utama.

- Tiket yang di-soft-delete bisa di-restore dalam 30 hari
- Setelah 30 hari, bisa di-purge permanen via pengaturan
- Query default menggunakan Laravel `SoftDeletes` trait sehingga tiket yang dihapus otomatis terfilter

### Autentikasi (Single-User)

> Tidak ada tabel `users` karena ini aplikasi single-user yang berjalan di localhost.

Mekanisme lock/unlock opsional:

- Password disimpan di tabel `settings` dengan key `app_password`, di-hash menggunakan **bcrypt**
- Saat fitur lock diaktifkan, user diminta memasukkan password sebelum bisa mengakses aplikasi
- Session-based: setelah unlock, session Laravel menyimpan state `authenticated = true` selama browser terbuka
- Jika password belum di-set (default), aplikasi langsung terbuka tanpa lock screen
- Tidak ada mekanisme "lupa password" — user bisa reset langsung via artisan command: `php artisan simpledesk:reset-password`

### Relasi Utama

```
subjects ──< tickets
tickets ──< ticket_notes
  ticket_notes ──< ticket_note_versions
tickets ──< ticket_attachments
tickets ──< ticket_histories
tickets >──< tags (many-to-many)
```

---

## 8. Tech Stack

| Komponen    | Teknologi                   | Alasan                                                                          |
| ----------- | --------------------------- | ------------------------------------------------------------------------------- |
| Backend     | Laravel 13                  | Familiar, ekosistem besar, bagus untuk portofolio                               |
| Frontend    | React 19 + TypeScript       | Industry standard, bagus dipelajari sejak semester 4                            |
| SPA Bridge  | Inertia.js v2               | Tidak perlu REST API, lebih simpel untuk solo project                           |
| Styling     | Tailwind CSS v4             | Cepat, konsisten, utility-first                                                 |
| Komponen UI | shadcn/ui                   | Komponen siap pakai, accessible, mudah dikustomisasi                            |
| Database    | SQLite                      | Zero-config, satu file, sempurna untuk lokal                                    |
| State       | React useState/useReducer   | Cukup untuk v1.0; Inertia page props handle server state, lokal pakai hooks     |
| Charts      | Recharts                    | Deklaratif, cocok dengan React                                                  |
| Markdown    | react-markdown + remark-gfm | Render catatan dengan format yang rapi                                          |
| File Upload | Laravel Storage facade      | Built-in, ringan, tanpa dependency tambahan — cocok untuk SQLite single-user    |
| Notifikasi  | Web Notification API        | Browser notification untuk deadline reminder (limitasi: hanya saat tab terbuka) |
| Dev Server  | Laravel Herd                | Auto-serve lokal, akses via `simpledesk.test`                                   |
| Testing BE  | Pest PHP                    | Belajar testing yang baik sejak awal                                            |
| Testing FE  | Vitest + RTL                | Unit test komponen React                                                        |

> **Catatan State Management:** Inertia.js v2 sudah meng-handle server state melalui page props. Untuk client-side UI state (modal open/close, form state, filter selection), cukup gunakan React `useState` dan `useReducer`. Jika di kemudian hari ada kebutuhan state global yang kompleks (misal: real-time notification queue), baru pertimbangkan Zustand di v2.0.

> **Catatan File Upload:** Spatie Media Library tidak digunakan karena terlalu opinionated untuk kebutuhan single-user SQLite. Laravel `Storage` facade + tabel `ticket_attachments` custom sudah mencukupi dan lebih ringan.

---

## 9. Struktur Halaman & Routes

### Halaman Utama

| Halaman      | Route                | Method | Deskripsi                                                      |
| ------------ | -------------------- | ------ | -------------------------------------------------------------- |
| Dashboard    | `/`                  | GET    | Overview harian: deadline hari ini, task aktif, streak, grafik |
| Semua Tiket  | `/tickets`           | GET    | List view semua tiket + filter + search                        |
| Buat Tiket   | `/tickets/create`    | GET    | Form buat tiket baru                                           |
| Simpan Tiket | `/tickets`           | POST   | Submit form buat tiket baru                                    |
| Detail Tiket | `/tickets/{id}`      | GET    | Detail, catatan, lampiran, riwayat                             |
| Edit Tiket   | `/tickets/{id}/edit` | GET    | Edit tiket yang sudah ada                                      |
| Update Tiket | `/tickets/{id}`      | PUT    | Submit form edit tiket                                         |
| Hapus Tiket  | `/tickets/{id}`      | DELETE | Soft delete tiket                                              |
| Kanban Board | `/board`             | GET    | Tampilan kanban per status                                     |
| Kalender     | `/calendar`          | GET    | Tampilan deadline dalam format kalender bulanan                |

### Action Routes (Non-CRUD)

| Action              | Route                       | Method | Deskripsi                                           |
| ------------------- | --------------------------- | ------ | --------------------------------------------------- |
| Duplikasi Tiket     | `/tickets/{id}/duplicate`   | POST   | Buat copy tiket dengan status OPEN & tanpa deadline |
| Update Status Cepat | `/tickets/{id}/status`      | PATCH  | Update status saja tanpa buka halaman edit          |
| Update Prioritas    | `/tickets/{id}/priority`    | PATCH  | Update prioritas saja dari list view                |
| Bulk Update         | `/tickets/bulk`             | PATCH  | Update status/prioritas/label untuk beberapa tiket  |
| Bulk Delete         | `/tickets/bulk`             | DELETE | Soft delete beberapa tiket sekaligus                |
| Arsipkan Tiket      | `/tickets/{id}/archive`     | PATCH  | Toggle arsip status tiket                           |
| Restore Tiket       | `/tickets/{id}/restore`     | PATCH  | Restore tiket yang sudah di-soft-delete             |
| Upload Lampiran     | `/tickets/{id}/attachments` | POST   | Upload file lampiran ke tiket                       |
| Hapus Lampiran      | `/attachments/{id}`         | DELETE | Hapus file lampiran                                 |

### Halaman per Mata Kuliah

| Halaman       | Route            | Deskripsi                                  |
| ------------- | ---------------- | ------------------------------------------ |
| Daftar Matkul | `/subjects`      | List mata kuliah semester aktif + progress |
| Detail Matkul | `/subjects/{id}` | Semua tiket dalam mata kuliah ini          |

### Halaman Analitik & Arsip

| Halaman   | Route      | Deskripsi                                     |
| --------- | ---------- | --------------------------------------------- |
| Statistik | `/stats`   | Grafik produktivitas, completion rate, streak |
| Arsip     | `/archive` | Tiket yang sudah diarsipkan + soft-deleted    |

### Pengaturan

| Halaman         | Route                | Deskripsi                              |
| --------------- | -------------------- | -------------------------------------- |
| Pengaturan Umum | `/settings`          | Nama, tema, konfigurasi notifikasi     |
| Kelola Matkul   | `/settings/subjects` | CRUD mata kuliah, ganti semester       |
| Kelola Tag      | `/settings/tags`     | CRUD tag/label                         |
| Keamanan        | `/settings/security` | Set/ubah password lock, reset password |

---

## 10. Non-Functional Requirements

| Aspek       | Target                                                           |
| ----------- | ---------------------------------------------------------------- |
| Performa    | Load < 1 detik di localhost, navigasi antar halaman instan (SPA) |
| Offline     | 100% fitur berjalan tanpa koneksi internet                       |
| Database    | SQLite, satu file, mudah di-backup (tinggal copy 1 file)         |
| Ukuran      | Bundle frontend < 500KB gzipped                                  |
| Setup       | Dari clone repo sampai jalan < 10 menit                          |
| Backup data | Cukup copy file `database/database.sqlite` ke tempat lain        |
| Keamanan    | Opsional: password sederhana untuk lock/unlock aplikasi          |

---

## 11. Error Handling & Edge Cases

| Skenario                                           | Penanganan                                                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Upload file > 10 MB                                | Tampilkan error toast, file tidak di-upload. Validasi di backend (`max:10240`) dan frontend                                                      |
| Upload file format tidak didukung                  | Tampilkan error toast dengan daftar format yang didukung                                                                                         |
| Hapus mata kuliah yang masih punya tiket           | Tampilkan konfirmasi dialog: _"Mata kuliah ini memiliki X tiket. Tiket akan menjadi tanpa kategori."_ Set `subject_id = null` pada tiket terkait |
| Deadline sudah lewat saat buat tiket               | Izinkan, tapi tampilkan warning: _"Deadline yang dipilih sudah lewat"_                                                                           |
| Ganti semester                                     | Arsip semua mata kuliah semester lama (`is_active = false`), tiket tetap ada dan bisa diakses via arsip                                          |
| Ticket number overflow (> 9999)                    | Format otomatis melebar: `SD-10000`, `SD-10001`, dst.                                                                                            |
| Database file corrupt                              | Panduan di docs: copy backup file, replace `database.sqlite`                                                                                     |
| Browser tidak support Notification API             | Graceful degradation: fitur notifikasi tidak muncul, tampilkan info di settings                                                                  |
| Concurrent edit (buka 2 tab, edit tiket yang sama) | Last-write-wins karena single-user. Inertia.js akan me-refresh data saat navigate                                                                |

---

## 12. Seed Data

Saat pertama kali menjalankan `php artisan migrate --seed`, aplikasi akan di-populate dengan data contoh agar tidak terasa kosong:

### Mata Kuliah (5 contoh)

| Kode  | Nama                          | Warna              | Semester |
| ----- | ----------------------------- | ------------------ | -------- |
| SI201 | Basis Data                    | `#3B82F6` (biru)   | 4        |
| SI202 | Pemrograman Web               | `#10B981` (hijau)  | 4        |
| SI203 | Analisis & Perancangan Sistem | `#F59E0B` (kuning) | 4        |
| SI204 | Statistika                    | `#8B5CF6` (ungu)   | 4        |
| SI205 | Jaringan Komputer             | `#EF4444` (merah)  | 4        |

### Tiket Contoh (5 tiket)

| Tiket                                       | Tipe      | Matkul                        | Status      | Prioritas |
| ------------------------------------------- | --------- | ----------------------------- | ----------- | --------- |
| SD-0001: Setup project Laravel              | To-do     | Pemrograman Web               | DONE        | Medium    |
| SD-0002: Tugas ERD database perpustakaan    | Tugas     | Basis Data                    | OPEN        | High      |
| SD-0003: Bug login redirect loop            | Bug/Issue | Pemrograman Web               | IN PROGRESS | Urgent    |
| SD-0004: Analisis kebutuhan sistem koperasi | Tugas     | Analisis & Perancangan Sistem | OPEN        | Medium    |
| SD-0005: Review materi regresi linear       | To-do     | Statistika                    | OPEN        | Low       |

### Tag Contoh

`#uts`, `#uas`, `#kelompok`, `#individu`, `#penting`, `#referensi`

> Seed data bisa di-reset kapan saja via `php artisan migrate:fresh --seed`. Semua data akan di-reset ke kondisi awal.

---

## 13. Roadmap & Milestone

| Phase       | Durasi     | Deliverable                                                                      |
| ----------- | ---------- | -------------------------------------------------------------------------------- |
| **Phase 1** | 1 Minggu   | Setup Laravel 13 + React + Inertia + Tailwind + shadcn/ui, layout dasar, routing |
| **Phase 2** | 1.5 Minggu | CRUD tiket lengkap: buat, edit, hapus, update status, list view + filter         |
| **Phase 3** | 1 Minggu   | Deadline system: due date, indikator overdue, countdown, tampilan kalender       |
| **Phase 4** | 1 Minggu   | Mata kuliah: CRUD subject, kategorisasi tiket, progress per matkul               |
| **Phase 5** | 1 Minggu   | Catatan & lampiran: editor markdown, upload file, riwayat catatan                |
| **Phase 6** | 1 Minggu   | Dashboard: overview harian, grafik Recharts, streak, summary mingguan            |
| **Phase 7** | 0.5 Minggu | Kanban board view, bulk actions, browser notification untuk deadline             |
| **Phase 8** | 1 Minggu   | Polish UI, testing Pest + Vitest, dokumentasi, setup auto-launch                 |

**Total Estimasi: ~8 Minggu (~2 Bulan)**

> Ini dikerjakan sambil kuliah. Kalau dikerjakan konsisten ~2 jam/hari, 8 minggu sangat achievable.

---

## 14. Out of Scope v1.0

- Multi-user / sharing dengan teman kelompok
- Sinkronisasi cloud / backup online otomatis
- Background push notification (Service Worker)
- Integrasi dengan LMS kampus (SIAK, eLearning, dll.)
- Mobile app
- Import tugas dari Google Calendar / Notion
- AI-powered task suggestion
- Time tracking (catat berapa lama ngerjain tiap tiket)

---

## 15. Rencana Fitur Future (v2.0+)

Ini fitur yang kamu minta untuk "kedepannya" — masuk roadmap v2.0 setelah v1.0 stabil:

### 🎯 Skill Development Tracker

- Modul **Learning Tracker** terpisah dari tiket biasa
- Catat topik/skill yang sedang dipelajari (Laravel, React, SQL, Algoritma, dll.)
- Progress per skill: Beginner → Intermediate → Advanced
- Catatan belajar per sesi: apa yang dipelajari hari ini?
- Simpan link resource: tutorial, dokumentasi, artikel yang berguna
- Prompt harian di dashboard: _"Hari ini belajar apa?"_

### 🐛 Bug Journal

- Halaman khusus semua tiket bertipe Bug
- Full-text search di isi catatan bug
- Auto-tag bahasa/framework (`#laravel`, `#react`, `#sql`)
- Jadi **personal knowledge base debugging** — solusi bug yang pernah kamu temui tersimpan rapi

### 📊 Semester Review

- Rekap otomatis per semester: berapa tugas selesai tepat waktu vs terlambat
- Perbandingan produktivitas antar semester
- Export sebagai PDF untuk refleksi pribadi

### 👥 Mini Kolaborasi via LAN

- Share tiket project kelompok lewat jaringan lokal yang sama (kampus/kos)
- Tidak perlu internet, cukup satu WiFi yang sama

---

## 16. Setup Lokal & Auto-launch

### 14.1 Cara Install

```bash
# 1. Clone repo
git clone https://github.com/kamu/simpledesk.git
cd simpledesk

# 2. Install dependencies
composer install
npm install

# 3. Setup environment
cp .env.example .env
php artisan key:generate
# Pastikan DB_CONNECTION=sqlite di .env

# 4. Buat file database & migrasi
touch database/database.sqlite
php artisan migrate --seed

# 5. Build frontend
npm run build

# 6. Jalankan
php artisan serve
# Buka http://localhost:8000
```

### 14.2 Supaya Buka Otomatis di Browser

**Opsi A — Laravel Herd (Rekomendasi) ✅**

1. Download & install [Laravel Herd](https://herd.laravel.com) (gratis, Mac & Windows)
2. Pindahkan folder project ke `~/Herd/simpledesk`
3. Herd otomatis serve di background — akses via `http://simpledesk.test`
4. Di Chrome/Firefox: Settings → On startup → Open a specific page → `http://simpledesk.test`
5. Setiap buka browser → SimpleDesk langsung terbuka ✅

**Opsi B — Windows Task Scheduler**

1. Buat file `start-simpledesk.bat`:
   ```bat
   cd C:\path\to\simpledesk
   php artisan serve --port=8000
   ```
2. Tambahkan ke Task Scheduler dengan trigger "At log on"
3. Set `http://localhost:8000` sebagai homepage browser

### 14.3 Backup Data

Cukup copy satu file:

```bash
# Backup manual
cp database/database.sqlite ~/Documents/Backup/simpledesk-$(date +%Y%m%d).sqlite
```

---

## 17. Kesimpulan

SimpleDesk bukan sekadar project kuliah — ini adalah **tools yang akan benar-benar kamu pakai setiap hari**. Itulah yang membuatnya berbeda dari project tutorial biasa.

Dengan membangunnya sendiri, kamu mendapatkan tiga hal sekaligus:

1. **Tools produktivitas** yang benar-benar sesuai kebutuhan kamu sebagai mahasiswa SI
2. **Pengalaman coding real-world** dengan Laravel 13 + React + Inertia.js yang relevan di industri
3. **Portofolio nyata** yang bisa ditunjukkan — bukan todo-app biasa, tapi aplikasi yang kamu pakai sendiri setiap hari

Mulai dari yang simpel di v1.0, lalu tambahkan fitur skill tracker dan bug journal di v2.0 setelah kamu makin mahir. Setiap fitur baru yang kamu tambahkan = skill baru yang kamu kuasai.

---

> _"The best way to learn is to build something you actually use."_
>
> _SimpleDesk — Built by a student, for a student._

# SimpleDesk — Enhancement & Innovation Roadmap

Dokumen ini berisi rencana pengembangan fitur-fitur baru dan inovasi untuk SimpleDesk, disusun berdasarkan **prioritas** dan **dampak terhadap produktivitas**.

---

## 📍 Kondisi Saat Ini

SimpleDesk sudah memiliki fondasi yang solid:

| Fitur | Status |
|-------|--------|
| Dashboard + Chart Produktivitas | ✅ |
| Kanban Board (Drag & Drop) | ✅ |
| Calendar View | ✅ |
| Ticket CRUD + Notes + Attachments | ✅ |
| Subject Management | ✅ |
| Bulk Actions | ✅ |
| Stats & Analytics | ✅ |
| Archive | ✅ |
| Toast Notifications | ✅ |
| App Lock (Security) | ✅ |

---

## 🚀 Phase 1 — Quick Wins (1-2 hari per fitur)

Fitur yang bisa langsung dirasakan dampaknya tanpa perubahan arsitektur besar.

### 1.1 🔍 Global Search + Filter (`Cmd+K`)

**Masalah:** Tidak ada cara cepat mencari tiket berdasarkan judul, kode mata kuliah, atau tag.

**Solusi:** Command palette ala Linear/Raycast yang bisa diakses dengan `Cmd+K` atau `Ctrl+K`.

- Search across tickets, subjects, dan tags
- Filter berdasarkan status, priority, subject, type
- Keyboard navigation penuh
- Recent searches history

**File yang terlibat:**
- `[NEW]` `resources/js/components/ui/CommandPalette.jsx`
- `[NEW]` `app/Http/Controllers/SearchController.php`
- `[MODIFY]` [routes/web.php](file:///var/www/html/simple-desk/routes/web.php) — tambah route `/api/search`
- `[MODIFY]` [resources/js/components/layout/AppLayout.jsx](file:///var/www/html/simple-desk/resources/js/components/layout/AppLayout.jsx) — pasang shortcut listener

---

### 1.2 📝 Quick Add Ticket (Inline Creation)

**Masalah:** Untuk membuat tiket baru harus navigasi ke halaman Create terpisah.

**Solusi:** Inline ticket creation di halaman Tickets dan Board.

- Tekan `N` untuk quick add
- Cukup isi judul → otomatis set subject & priority default
- Enter untuk simpan, Escape untuk batal
- Opsi "expand" ke full form jika butuh detail lebih

**File yang terlibat:**
- `[NEW]` `resources/js/components/tickets/QuickAddRow.jsx`
- `[MODIFY]` [resources/js/pages/Tickets/Index.jsx](file:///var/www/html/simple-desk/resources/js/pages/Tickets/Index.jsx)
- `[MODIFY]` [resources/js/pages/Board.jsx](file:///var/www/html/simple-desk/resources/js/pages/Board.jsx)

---

### 1.3 ⏱️ Pomodoro Timer (Built-in Focus Mode)

**Masalah:** Sebagai mahasiswa, sering butuh teknik Pomodoro untuk mengerjakan tugas secara fokus.

**Solusi:** Timer terintegrasi yang bisa di-assign ke tiket tertentu.

- Timer 25 menit (customizable) dengan break 5 menit
- Attach ke tiket → log total waktu yang dihabiskan
- Notifikasi suara + visual saat selesai
- Stats: berapa sesi Pomodoro per hari/minggu

**File yang terlibat:**
- `[NEW]` `resources/js/components/focus/PomodoroTimer.jsx`
- `[NEW]` `resources/js/components/focus/FocusMode.jsx`
- `[NEW]` `database/migrations/xxxx_add_time_spent_to_tickets_table.php` — kolom `time_spent_minutes`
- `[MODIFY]` [app/Models/Ticket.php](file:///var/www/html/simple-desk/app/Models/Ticket.php)

---

### 1.4 📌 Pinned / Favorite Tickets

**Masalah:** Tiket penting tenggelam di antara tiket lain.

**Solusi:** Pin tiket ke atas list atau sidebar.

- Toggle pin di tiket list dan detail
- Pinned tickets muncul di section terpisah di Dashboard
- Kolom `is_pinned` di tabel tickets

**File yang terlibat:**
- `[NEW]` `database/migrations/xxxx_add_is_pinned_to_tickets_table.php`
- `[MODIFY]` [app/Models/Ticket.php](file:///var/www/html/simple-desk/app/Models/Ticket.php)
- `[MODIFY]` [resources/js/components/tickets/TicketListItem.jsx](file:///var/www/html/simple-desk/resources/js/components/tickets/TicketListItem.jsx)
- `[MODIFY]` [resources/js/pages/Dashboard.jsx](file:///var/www/html/simple-desk/resources/js/pages/Dashboard.jsx)

---

## 🔧 Phase 2 — Produktivitas Lanjutan (3-5 hari per fitur)

Fitur yang meningkatkan workflow secara signifikan.

### 2.1 🧠 Smart Deadline Suggestions (AI-Powered)

**Masalah:** Sulit menentukan deadline yang realistis karena tidak tahu beban kerja yang sedang berjalan.

**Solusi:** Sistem yang menyarankan deadline berdasarkan:

- Jumlah tiket aktif yang sedang dikerjakan
- Rata-rata waktu penyelesaian tiket serupa
- Deadline mata kuliah lain yang berdekatan
- Visual "workload heatmap" di Calendar

**File yang terlibat:**
- `[NEW]` `app/Services/DeadlineSuggestionService.php`
- `[MODIFY]` [resources/js/pages/Tickets/Create.jsx](file:///var/www/html/simple-desk/resources/js/pages/Tickets/Create.jsx)
- `[MODIFY]` [resources/js/pages/Calendar.jsx](file:///var/www/html/simple-desk/resources/js/pages/Calendar.jsx) — heatmap overlay

---

### 2.2 📊 Weekly Report / Digest

**Masalah:** Tidak ada ringkasan mingguan tentang apa yang sudah dikerjakan.

**Solusi:** Halaman "Weekly Report" yang auto-generated.

- Rangkuman tiket selesai minggu ini per subject
- Tiket overdue yang perlu perhatian
- Perbandingan dengan minggu sebelumnya
- Exportable ke PDF/PNG untuk portofolio atau laporan

**File yang terlibat:**
- `[NEW]` `resources/js/pages/Reports/Weekly.jsx`
- `[NEW]` `app/Http/Controllers/ReportController.php`
- `[MODIFY]` [routes/web.php](file:///var/www/html/simple-desk/routes/web.php)
- `[MODIFY]` [resources/js/components/layout/Sidebar.jsx](file:///var/www/html/simple-desk/resources/js/components/layout/Sidebar.jsx) — tambah nav item

---

### 2.3 🔗 Ticket Dependencies (Subtasks)

**Masalah:** Tugas besar tidak bisa dipecah menjadi sub-tasks yang terukur.

**Solusi:** Hirarki parent-child pada tiket.

- Tiket bisa punya subtasks
- Progress bar otomatis berdasarkan subtask yang selesai
- Parent ticket auto-complete jika semua subtask done
- Visual: nested list dan tree view

**File yang terlibat:**
- `[NEW]` `database/migrations/xxxx_add_parent_id_to_tickets_table.php` — kolom `parent_id`
- `[MODIFY]` [app/Models/Ticket.php](file:///var/www/html/simple-desk/app/Models/Ticket.php) — relasi `parent()` dan `subtasks()`
- `[NEW]` `resources/js/components/tickets/SubtaskList.jsx`
- `[MODIFY]` [resources/js/pages/Tickets/Show.jsx](file:///var/www/html/simple-desk/resources/js/pages/Tickets/Show.jsx)

---

### 2.4 🎯 Daily Goals & Streaks

**Masalah:** Kurang motivasi untuk konsisten setiap hari.

**Solusi:** Gamification ringan.

- Set daily goal: "Selesaikan X tiket hari ini"
- Streak counter di Dashboard (berapa hari berturut-turut mencapai goal)
- Visual flame/fire icon yang makin besar seiring streak bertambah
- Weekly summary: "You completed 15 tickets this week! 🔥"

**File yang terlibat:**
- `[NEW]` `database/migrations/xxxx_create_daily_goals_table.php`
- `[NEW]` `app/Models/DailyGoal.php`
- `[NEW]` `resources/js/components/dashboard/StreakCounter.jsx`
- `[MODIFY]` [resources/js/pages/Dashboard.jsx](file:///var/www/html/simple-desk/resources/js/pages/Dashboard.jsx)

---

## 🏗️ Phase 3 — Arsitektur & Skalabilitas (1-2 minggu)

Peningkatan fundamental untuk jangka panjang.

### 3.1 📱 Progressive Web App (PWA)

**Masalah:** Tidak bisa diakses secara offline atau di-install di HP.

**Solusi:** Tambahkan PWA manifest dan service worker.

- Installable di Android/iOS home screen
- Offline-capable: bisa lihat tiket terakhir tanpa internet
- Push notifications untuk deadline yang mendekat
- Splash screen dan app icon kustom

**File yang terlibat:**
- `[NEW]` `public/manifest.json`
- `[NEW]` `public/sw.js` — Service Worker
- `[MODIFY]` [resources/views/app.blade.php](file:///var/www/html/simple-desk/resources/views/app.blade.php) — link manifest
- `[NEW]` `public/icons/` — app icons berbagai ukuran

---

### 3.2 🌐 Multi-User / Collaboration Mode

**Masalah:** Saat ini single-user. Tidak bisa kolaborasi dengan teman satu kelompok.

**Solusi:** Sistem multi-user sederhana.

- Tiket bisa di-assign ke user lain
- Shared subjects untuk tugas kelompok
- Activity feed: siapa mengubah apa
- Kolom `assigned_to` dan `created_by` di tabel tickets

> [!WARNING]
> Ini perubahan arsitektur besar yang mempengaruhi hampir semua controller dan view. Perlu perencanaan matang.

**File yang terlibat:**
- `[NEW]` `database/migrations/xxxx_add_user_columns_to_tickets_table.php`
- `[MODIFY]` Semua controller (scoping per user)
- `[MODIFY]` Model [Ticket](file:///var/www/html/simple-desk/app/Models/Ticket.php#10-86) — relasi `assignee()`, `creator()`
- `[NEW]` `resources/js/components/tickets/UserAvatar.jsx`

---

### 3.3 🔄 Real-time Sync (Broadcasting)

**Masalah:** Jika dibuka di 2 tab, perubahan di satu tab tidak terlihat di tab lain.

**Solusi:** Laravel Broadcasting + SSE/WebSocket.

- Real-time update saat status tiket berubah
- Live counter di Dashboard
- Kolaborator bisa lihat perubahan secara langsung (jika multi-user aktif)

**File yang terlibat:**
- `[NEW]` `app/Events/TicketUpdated.php`
- `[MODIFY]` [app/Observers/TicketObserver.php](file:///var/www/html/simple-desk/app/Observers/TicketObserver.php)
- `[NEW]` `resources/js/hooks/useRealtimeTickets.js`

---

## 💡 Phase 4 — Inovasi & Diferensiasi

Fitur yang membuat SimpleDesk **unik** dan berkesan.

### 4.1 🤖 AI Task Breakdown

Integrasi AI (Gemini API) untuk:
- Deskripsikan tugas → AI pecah menjadi subtasks otomatis
- Estimasi waktu per subtask
- Generate deskripsi tiket dari prompt singkat

### 4.2 📤 Export & Backup

- Export semua tiket ke CSV/JSON
- Backup database otomatis (schedulled)
- Import dari file (migrasi antar device)

### 4.3 🎨 Theming System

- Light mode toggle
- Custom accent color (bukan hanya orange)
- Compact vs comfortable density mode

### 4.4 📅 iCal/Google Calendar Sync

- Sync deadline ke Google Calendar
- Import jadwal kuliah sebagai tiket otomatis

---

## 📋 Prioritas Rekomendasi

Berdasarkan **dampak/effort ratio**, urutan yang disarankan:

| # | Fitur | Impact | Effort | Rekomendasi |
|---|-------|--------|--------|-------------|
| 1 | Global Search `Cmd+K` | ⭐⭐⭐⭐⭐ | 🔨 Low | **Mulai dari sini** |
| 2 | Quick Add Ticket | ⭐⭐⭐⭐ | 🔨 Low | Sangat meningkatkan speed |
| 3 | Pinned Tickets | ⭐⭐⭐ | 🔨 Low | Quick win |
| 4 | Daily Goals & Streaks | ⭐⭐⭐⭐ | 🔨🔨 Med | Gamification = motivasi |
| 5 | Pomodoro Timer | ⭐⭐⭐⭐ | 🔨🔨 Med | Student essential |
| 6 | Subtasks | ⭐⭐⭐⭐⭐ | 🔨🔨🔨 High | Game changer |
| 7 | Weekly Report | ⭐⭐⭐ | 🔨🔨 Med | Refleksi mingguan |
| 8 | PWA | ⭐⭐⭐⭐ | 🔨🔨 Med | Mobile access |
| 9 | AI Task Breakdown | ⭐⭐⭐⭐ | 🔨🔨🔨 High | Cool factor |
| 10 | Multi-User | ⭐⭐⭐ | 🔨🔨🔨🔨 Very High | Butuh planning matang |

---

> [!TIP]
> Rekomendasi: Mulai dari **Phase 1** karena semua fiturnya bisa diselesaikan cepat dan langsung terasa dampaknya. Global Search (`Cmd+K`) adalah yang paling high-impact karena mempengaruhi seluruh pengalaman navigasi aplikasi.

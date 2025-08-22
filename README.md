# Job Seeker Backend API

Backend API untuk platform pencari kerja dengan fitur multi-role (admin, company, job seeker), pencarian lowongan kerja, apply pekerjaan, manajemen profil, dan manajemen perusahaan.

---

## ✨ Fitur Utama
- **Authentication & Authorization**
  - Register & Login dengan **JWT**
  - Multi role: `Admin`, `Company`, `Job Seeker`
  - Redis digunakan untuk session/token blacklist

- **Job Management**
  - Tambah / update / hapus lowongan kerja oleh company
  - Filter & search lowongan kerja (by title, location, category, dll)
  - Upload gambar / dokumen via **Cloudinary**

- **Application Management**
  - Job seeker dapat apply ke pekerjaan
  - Cek status apply

- **Profile Management**
  - Job seeker dapat mengatur profil pribadi
  - Company dapat mengatur profil perusahaan

- **Validation**
  - Semua input tervalidasi menggunakan **Zod**

---

## 🛠 Tech Stack
- **Express.js** (REST API framework)
- **Prisma ORM** (database layer)
- **MySQL** (database)
- **Redis** (token/session management)
- **JWT** (authentication)
- **Cloudinary** (file upload)
- **Zod** (validation)
- **Jest** (unit testing)
- **Supertest** (integration testing)

---

## 📦 Requirements
Sebelum menjalankan project pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18+
- [MySQL](https://www.mysql.com/) v8+
- [Redis](https://redis.io/)
- [Cloudinary Account](https://cloudinary.com/) (untuk upload file)

---

## ⚙️ Instalasi
1. Clone repository:
   ```bash
   git clone https://github.com/username/job-seeker-backend.git
   cd job-seeker-backend

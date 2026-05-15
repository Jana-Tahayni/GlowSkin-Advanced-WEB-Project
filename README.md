<<<<<<< HEAD
# SkinCare Dashboard — Setup Guide

## 📁 هيكل المشروع

```
skincare-project/
├── backend/      ← Laravel
└── frontend/     ← React
```

---

## 🔧 إعداد الـ Backend (Laravel)

### 1. انسخ الملفات لمشروع Laravel
```
backend/
├── app/
│   ├── Models/
│   │   ├── Case_.php
│   │   ├── Routine.php
│   │   └── RoutineStep.php
│   └── Http/Controllers/Api/
│       ├── CaseController.php
│       └── RoutineController.php
├── database/
│   ├── migrations/
│   │   ├── ..._create_cases_table.php
│   │   └── ..._create_routines_table.php
│   └── seeders/
│       └── DatabaseSeeder.php
├── routes/
│   └── api.php
├── config/
│   └── cors.php
└── .env.example → انسخه وسميه .env
```

### 2. إعداد الـ .env
```bash
cp .env.example .env
```
عدّل هاي القيم:
```
DB_DATABASE=skincare_db
DB_USERNAME=root
DB_PASSWORD=        ← حطّ كلمة سرك لو في
```

### 3. شغّل الأوامر
```bash
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

الـ API رح يشتغل على: **http://localhost:8000/api**

---

## ⚛️ إعداد الـ Frontend (React)

### 1. انسخ ملف الـ API
```
frontend/src/services/api.js   ← انسخه هون
```

### 2. أنشئ ملف .env في مجلد React
```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:8000/api
```

### 3. شغّل React
```bash
npm start
```

---

## 🌐 الـ API Endpoints

### Cases
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cases | جلب كل الحالات |
| GET | /api/cases/stats | إحصائيات الداشبورد |
| GET | /api/cases/{id} | حالة واحدة |
| POST | /api/cases | إنشاء حالة |
| PUT | /api/cases/{id} | تعديل حالة |
| POST | /api/cases/{id}/approve | موافقة |
| POST | /api/cases/{id}/reject | رفض |
| DELETE | /api/cases/{id} | حذف |

### Routines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/routines | جلب الروتينات |
| POST | /api/routines | إنشاء روتين |
| POST | /api/routines/{id}/steps | إضافة خطوة |
| PATCH | /api/routines/steps/{id}/toggle | تشييك خطوة |
| DELETE | /api/routines/steps/{id} | حذف خطوة |
| DELETE | /api/routines/{id} | حذف روتين |

---

## 🔗 كيف تربط الـ Dashboard بالـ API

### مثال — جلب الحالات في Dashboard.js
```javascript
import { casesApi } from '../services/api';
import { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats]   = useState(null);
  const [cases, setCases]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      casesApi.getStats(),
      casesApi.getAll(),
    ]).then(([statsRes, casesRes]) => {
      setStats(statsRes.data);
      setCases(casesRes.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  // ... باقي الكود
}
```

### مثال — Approve حالة في CaseReview.js
```javascript
import { casesApi } from '../services/api';

const handleApprove = async () => {
  await casesApi.approve(caseData.id);
  navigate('/cases');
};
```
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
>>>>>>> 37f97714f9b44b9de397c935f5c19e95e97c4db5

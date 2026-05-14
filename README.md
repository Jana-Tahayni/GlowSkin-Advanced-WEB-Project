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

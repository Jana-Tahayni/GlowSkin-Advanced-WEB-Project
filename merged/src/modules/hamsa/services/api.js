// src/services/api.js
// ─── كل التواصل بين React و Laravel API ───────────────────
 
const BASE_URL = 'http://localhost:8000/api';
 
// Helper عام للـ fetch
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
 
  const config = {
    headers: {
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };
 
  // لو مو FormData نضيف Content-Type
  if (!(options.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
 
  const response = await fetch(url, config);
  const data = await response.json();
 
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
 
  return data;
}
 
// ════════════════════════════════════════════════
//  CASES API
// ════════════════════════════════════════════════
 
export const casesApi = {
 
  // جلب كل الحالات مع فلاتر اختيارية
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/cases${params ? '?' + params : ''}`);
  },
 
  // جلب الإحصائيات للداشبورد
  getStats: () => request('/cases/stats'),
 
  // جلب حالة واحدة بالـ id
  getOne: (id) => request(`/cases/${id}`),
 
  // إنشاء حالة جديدة (مع صورة)
  create: (formData) =>
    request('/cases', {
      method: 'POST',
      body: formData,  // FormData للصور
    }),
 
  // تحديث بيانات الحالة
  update: (id, data) =>
    request(`/cases/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
 
  // الموافقة على الحالة
  approve: (id) =>
    request(`/cases/${id}/approve`, { method: 'POST' }),
 
  // رفض الحالة
  reject: (id, reason = '') =>
    request(`/cases/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
 
  // حذف حالة
  delete: (id) =>
    request(`/cases/${id}`, { method: 'DELETE' }),
};
 
// ════════════════════════════════════════════════
//  ROUTINES API
// ════════════════════════════════════════════════
 
export const routinesApi = {
 
  // جلب كل الروتينات
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/routines${params ? '?' + params : ''}`);
  },
 
  // جلب روتين واحد
  getOne: (id) => request(`/routines/${id}`),
 
  // إنشاء روتين جديد مع خطواته
  create: (data) =>
    request('/routines', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
 
  // إضافة خطوة لروتين موجود
  addStep: (routineId, stepData) =>
    request(`/routines/${routineId}/steps`, {
      method: 'POST',
      body: JSON.stringify(stepData),
    }),
 
  // تشييك / إلغاء تشييك خطوة
  toggleStep: (stepId) =>
    request(`/routines/steps/${stepId}/toggle`, { method: 'PATCH' }),
 
  // حذف خطوة
  deleteStep: (stepId) =>
    request(`/routines/steps/${stepId}`, { method: 'DELETE' }),
 
  // حذف روتين كامل
  delete: (id) =>
    request(`/routines/${id}`, { method: 'DELETE' }),
};

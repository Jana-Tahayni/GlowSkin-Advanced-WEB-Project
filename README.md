# ✨ GlowSkin - AI-Powered Skin Care Platform

GlowSkin is an advanced full-stack web platform that leverages Artificial Intelligence to provide instant skin analysis, product ingredient evaluation, and expert-verified personalized skincare routines.

The platform bridges the gap between AI efficiency and professional medical expertise using the **Claude Vision API**.

---

# 🚀 Project Overview

## 🩺 The Problem
Many users struggle to access specialized dermatological consultations and often lack knowledge about which skincare products are suitable for their skin type.

## 💡 The Solution
GlowSkin provides:
- AI-powered 24/7 skin analysis
- Ingredient compatibility analysis
- Expert-reviewed skincare routines
- Personalized skincare recommendations

---

# 🛠 Tech Stack

The project is built using a modern full-stack architecture:

| Technology | Description |
|---|---|
| **Frontend** | React  |
| **Backend** | Laravel 11 REST API |
| **Database** | MySQL |
| **AI Engine** | Anthropic Claude API (Vision + Text) |
| **Authentication** | Passport |
| **Payments** | Stripe Integration |

---

# 🌟 Key Features

## 🔍 AI Skin Analysis
Users upload facial images to receive:
- Skin health score
- Skin type detection
- Detected skin concerns
- Personalized recommendations

---

## 🧴 Product Ingredient Analyzer
Analyze skincare products through:
- Product name
- Ingredient list image

The system evaluates:
- Product compatibility
- Safety score
- Effectiveness score
- Warnings based on skin type

---

## 👥 Role-Based Access Control (RBAC)

The platform supports 3 main roles:

- **User**
- **Specialist / Doctor**
- **Administrator**

---

## 🩺 Custom Skincare Routines
- AI generates an initial skincare routine
- Dermatologists review and customize recommendations
- Users receive professional skincare guidance

---

## 📈 Analysis History
Track progress through:
- Historical timeline
- Skin improvement charts
- Previous reports and recommendations

---

## 👨‍⚕️ Specialist Dashboard
Doctors can:
- Review pending consultations
- Analyze AI-generated reports
- Create personalized skincare routines

---

## 🛡 Admin Dashboard
Administrators can manage:
- Platform statistics
- Payments & transactions
- Users & specialists
- System monitoring

---

# 📂 Project Structure

```plaintext
GlowSkin-Advanced-WEB-Project/
├── backend/        # Laravel 11 API
├── frontend/       # React Frontend Application
└── README.md
```

---


# 🚀 Getting Started

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Jana-Tahayni/GlowSkin-Advanced-WEB-Project.git
```

---

# ⚙ Backend Setup

```bash
cd backend

composer install

cp .env.example .env

php artisan key:generate

php artisan migrate

php artisan serve
```

---

# 💻 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

# 🔐 Environment Variables

Make sure to configure the following services inside your `.env` file:

- Database Credentials
- Claude API Key
- Stripe Keys
- Mail Configuration

Example:

```env
APP_NAME=GlowSkin

DB_CONNECTION=pgsql

CLAUDE_API_KEY=your_api_key

STRIPE_KEY=your_key
STRIPE_SECRET=your_secret
```

---

# 📸 Core Modules

- AI Skin Analysis
- Product Ingredient Scanner
- Doctor Consultation System
- Notifications & Emails
- Secure Payment Processing
- Admin Analytics Dashboard

---

# 🧠 AI Integration

GlowSkin uses **Anthropic Claude Vision API** for:
- Facial skin analysis
- Ingredient recognition
- Smart skincare recommendations

---

# 💳 Payment Integration

Integrated with:
- Stripe

Features:
- Secure online payments
- Webhook handling
- Payment verification
- Consultation checkout system

---

# 📬 Notifications System

The platform supports:
- Email notifications
- Payment confirmations
- Doctor alerts
- Routine completion notifications

---

# 🧪 Development Status

✅ Authentication System  
✅ AI Skin Analysis  
✅ Product Analyzer  
✅ Doctor Dashboard  
✅ Admin Panel  
✅ Payment Integration  
✅ Notifications System  

---

# 👨‍💻 Developed By
- Lujain Toma
- Hala Eid
- Jana Tahayni
- Afnan Hasan
- Hamsa Hantash
  
Developed as part of the **Advanced Web Development Project 2025**.

---

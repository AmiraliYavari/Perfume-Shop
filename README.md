
# 🕌 عطرخانه | فروشگاه اینترنتی عطر و ادکلن

![React](https://img.shields.io/badge/React-18-blue) ![Node.js](https://img.shields.io/badge/Node.js-18-green) ![Express](https://img.shields.io/badge/Express-4-lightgrey) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-blueviolet)

یک فروشگاه اینترنتی مدرن و زیبا برای فروش عطر و ادکلن با امکانات پیشرفته.

## ✨ ویژگی‌ها

- 🛍️ **فروشگاه** با صفحه‌بندی و فیلترهای پیشرفته (نت‌های بویایی، برند، جنسیت، فصل)
- 🔍 **جستجوی هوشمند** با پیشنهادات لحظه‌ای
- 🛒 **سبد خرید کشویی** با مدیریت تعداد و حذف
- 💰 **نمایش تخفیف‌ها** با قیمت خط‌خورده
- 🎠 **اسلایدر بنر** با چرخش خودکار و لینک به محصولات تصادفی
- 📱 **واکنش‌گرا** (Mobile First) و کاملاً راست‌چین
- 🎨 **تم زیبا** (مشکی، آبی آسمانی، سفید) با انیمیشن‌های نرم
- 👨‍💼 **پنل مدیریت** (افزودن/ویرایش/حذف محصولات، مشاهده سفارشات)
- 🧪 **داده‌های واقعی** از برندهای مختلف عطر

## 🛠️ تکنولوژی‌ها

- **فرانت‌اند:** React 18 + Vite + Tailwind CSS + Zustand + React Router 6
- **بک‌اند:** Node.js + Express + Better-SQLite3 + JWT
- **پایگاه داده:** SQLite (فایل `perfume.db`)

## 🚀 نحوه اجرا

### پیش‌نیازها
- Node.js نسخه ۱۸ یا بالاتر
- npm

### راه‌اندازی

۱. پروژه را کلون کنید:
```bash
git clone https://github.com/AmiraliYavari/Perfume-Shop.git
cd atrkhane
```

۲. نصب وابستگی‌های سرور:
```bash
cd server
npm install
```

۳. اجرای سرور:
```bash
node server.js
```
سرور روی `http://localhost:3001` اجرا می‌شود.

۴. در یک ترمینال دیگر، نصب و اجرای فرانت‌اند:
```bash
cd ../client
npm install
npm run dev
```
فرانت‌اند روی `http://localhost:5173` اجرا می‌شود.

### اطلاعات ورود به پنل مدیریت
- **نام کاربری:** `admin`
- **رمز عبور:** `admin123`
- آدرس: `http://localhost:5173/admin/login`

## 📁 ساختار پروژه

```
odkolon_shop/
├── server/                # بک‌اند Express
│   ├── database.js        # ساختار و داده‌های اولیه SQLite
│   └── server.js          # API endpoints
└── client/                # فرانت‌اند React
    ├── public/
    ├── src/
    │   ├── components/    # کامپوننت‌های مشترک
    │   ├── pages/         # صفحات اصلی
    │   ├── store/         # استور Zustand
    │   └── utils/         # توابع کمکی
    └── package.json
```

## 📸 پیش‌نمایش

![صفحه اصلی](https://cdn.imgurl.ir/uploads/x907971_Screenshot_2026-06-18_223536.png)
*صفحه اصلی با اسلایدر و محصولات*

## 🤝 مشارکت

پیشنهادات و مشارکت شما خوشحال‌مان می‌کند! لطفاً یک Issue باز کنید یا Pull Request بفرستید.

---

ساخته‌شده با ❤️ توسط [امیرعلی یاوری](https://github.com/AmiraliYavari)
```

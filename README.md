# AuthFlow

Modern, güvenli ve kullanıcı dostu bir kimlik doğrulama sistemi. Next.js ve MongoDB ile geliştirilmiş tam kapsamlı bir auth çözümü.

## 🚀 Özellikler

- 🔐 JWT tabanlı kimlik doğrulama
- 👥 Kullanıcı yönetimi
- 👮‍♂️ Rol tabanlı yetkilendirme (Admin/User)
- 🌓 Karanlık/Aydınlık tema desteği
- 📱 Responsive tasarım
- 🔒 Güvenli şifre yönetimi
- 🖼️ Profil fotoğrafı yükleme
- ⚡ Hızlı ve optimize performans

## 🛠️ Teknolojiler

- [Next.js 14](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT](https://jwt.io/)
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js/)

## 📁 Proje Yapısı

```
auth-flow/
├── app/
│   ├── api/           # API rotaları
│   ├── components/    # React bileşenleri
│   ├── lib/          # Yardımcı fonksiyonlar
│   ├── models/       # MongoDB modelleri
│   └── utils/        # Genel yardımcı araçlar
├── public/           # Statik dosyalar
└── ...
```

## 🔒 API Endpoints

### Kimlik Doğrulama

- `POST /api/auth/signup` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/logout` - Çıkış yapma

### Kullanıcı İşlemleri

- `GET /api/users` - Tüm kullanıcıları listele (Admin)
- `PATCH /api/users/[id]` - Kullanıcı bilgilerini güncelle
- `POST /api/users/[id]/avatar` - Profil fotoğrafı yükle

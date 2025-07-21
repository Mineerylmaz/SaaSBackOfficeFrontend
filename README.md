# SaaSBackOfficeFrontend
Bu proje, SaaS Backoffice uygulamasının React ile geliştirilmiş frontend (kullanıcı arayüzü) kısmıdır. Kullanıcıların kayıt, giriş, abonelik planlarını görüntüleme ve ödeme sayfalarını kullanabildiği modern, responsive bir web arayüzüdür.

---

## İçindekiler
- [Proje Hakkında](#proje-hakkında)
- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Yapı ve Dizin](#yapı-ve-dizin)
- [Kullanım](#kullanım)
- [Çevresel Değişkenler](#çevresel-değişkenler)
- [Katkıda Bulunma](#katkıda-bulunma)
- [Lisans](#lisans)

---

## Proje Hakkında

React kullanarak geliştirilen bu frontend, kullanıcıların SaaS abonelik süreçlerini kolayca yönetmesini sağlar. Kayıt, giriş, abonelik planları ve ödeme sayfaları ile kullanıcı deneyimini iyileştirmeyi amaçlar.

---

## Özellikler

- Kullanıcı Kayıt ve Giriş Formları
- JWT Token Bazlı Oturum Yönetimi
- Abonelik Planları Listesi
- Ödeme Sayfası 
- Responsive Tasarım (Mobil & Desktop)
- React Router ile Sayfa Yönetimi
- Hata ve Yüklenme Yönetimi
- LocalStorage kullanarak token ve kullanıcı bilgisini saklama

---

## Teknolojiler

- React 18+
- React Router DOM
- Fetch API / Axios (API istekleri için)
- CSS Modülleri 
- React Hooks (useState, useEffect, useNavigate vs.)

---

## Kurulum
1. Depoyu klonla ve frontend dizinine gir:

git clone https://github.com/Mineerylmaz/SaaSBackOfficeFrontend.git
cd SaaSBackOfficeFrontend

2.Bağımlılıkları yükle

npm install
3.Çalıştırma
Projeyi yerel geliştirme sunucusunda başlat:

npm start
Tarayıcıda otomatik olarak http://localhost:3000 açılır.

Yapı ve Dizin

/src
  /components         # React bileşenleri (Login, Register, Pricing, Payment, Navbar vs.)
  /pages              # Sayfalar (Home, AdminPanel, NotFound vs.)
  /utils              # Yardımcı fonksiyonlar (API istekleri, token yönetimi vb.)
  App.js              # Uygulama ana bileşeni

  


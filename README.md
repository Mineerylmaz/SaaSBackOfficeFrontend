🌐 SaaS BackOffice Frontend
Bu proje, bir SaaS (Software as a Service) uygulamasının BackOffice arayüzü için geliştirilmiş modern, ölçeklenebilir ve kullanıcı dostu bir React tabanlı frontend uygulamasıdır. Kullanıcılar kayıt olabilir, giriş yapabilir, kendilerine özel abonelik planlarını görüntüleyebilir ve ödeme işlemlerini gerçekleştirebilir.
# İçindekiler
- [Proje Hakkında](#proje-hakkında)
- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Çalıştırma](#çalıştırma)
- [Dizin Yapısı](#dizin-yapısı)
- [Kullanım Senaryoları](#Kullanım-senaryoları)
- [Bağımlılıklar](#bağımlılıklar)
-[Katkı Sağlamak](#Katkı-Sağlamak)
## Proje Hakkında
Bu frontend projesi, SaaS uygulamasının kullanıcı panelini temsil eder. Kullanıcıların sisteme davetle kayıt olma, giriş yapma, abonelik planlarını görme, ödeme işlemleri yapma ve profil ayarlarını yönetme gibi işlemleri gerçekleştirmesine olanak tanır. Uygulama responsive (mobil uyumlu) olarak geliştirilmiştir ve karanlık / aydınlık tema desteği içerir.

## ✨ Özellikler
✅ Kullanıcı kayıt & giriş işlemleri (invite token desteği)

✅ JWT token ile oturum yönetimi

✅ Kullanıcı rollerine göre yönlendirme

✅ Abonelik planlarını listeleme ve satın alma

✅ Ödeme adımı ve yönlendirme

✅ Profil sayfası ve tema ayarları (dark/light)

✅ Responsive ve mobil uyumlu tasarım

✅ React Router ile sayfa bazlı yönlendirme

✅ SweetAlert2 ile kullanıcı dostu geri bildirimler

✅ LocalStorage üzerinde kullanıcı bilgileri ve token saklama

✅ Gelişmiş loading, error, fetch yönetimi

## 🛠️  Teknolojiler
Teknoloji	Açıklama
React	Kullanıcı arayüzü kütüphanesi
React Router DOM	Sayfa yönlendirme
Styled Components	CSS-in-JS stil yönetimi
SweetAlert2	Kullanıcı uyarı ve bildirimleri
Fetch API	API istekleri
LocalStorage	Oturum yönetimi için veri saklama

## 🚀 Kurulum
Projeyi klonlayın:


git clone https://github.com/Mineerylmaz/SaaSBackOfficeFrontend.git
Proje klasörüne girin:


cd SaaSBackOfficeFrontend
Bağımlılıkları yükleyin:

npm install
▶️ Projeyi Çalıştırma
Geliştirme modunda çalıştırmak için:


npm run start
Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

## 📁 Dizin Yapısı

SaaSBackOfficeFrontend/
├── src/
│   ├── components/        # Ortak bileşenler (Navbar, Buton, vs.)
│        ├── Login /            # Login sayfasu
│        ├── UserSettings/             # Kullanıcı ayarlar sayfası
│        ├── AdminPanel/             # YPanel sayfası
│        ├── Odeme/            # Odeme sayfası
│   └── App.jsx             # Ana uygulama dosyası
├── public/
├── package.json
└── README.md
## 👨‍💻 Kullanım Senaryoları
Yeni kullanıcı daveti ile kayıt

/register/:token sayfasına yönlendirilir

Daveti kabul ederse direkt giriş yapar ve plan sayfasına gider

Mevcut kullanıcı girişi

/login sayfasından giriş yapar

Plan alabilir,aldığı plana göre ayarlar sayfasına gidebilir.

Abonelik Planı Görüntüleme

/pricing sayfasında tüm planlar listelenir

Satın alma işlemi için yönlendirme yapılır

Ödeme

/ödeme sayfasında ödeme işlemi gerçekleştirilir

Başarılı işlem sonrası profil sayfasına yönlendirme yapılır

## 📦 Bağımlılıklar

"dependencies": {
  "react": "^18.x.x",
  "react-dom": "^18.x.x",
  "react-router-dom": "^6.x.x",
  "styled-components": "^5.x.x",
  "sweetalert2": "^11.x.x"
}
## ✍️ Katkı Sağlamak
Katkıda bulunmak isterseniz:

Fork'layın.

Yeni bir feature branch oluşturun.

Gerekli değişiklikleri yapın.

Pull request gönderin.


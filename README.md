 SaaS BackOffice Frontend
Bu proje, bir SaaS (Software as a Service) uygulamasının BackOffice arayüzü için geliştirilmiş modern, ölçeklenebilir ve kullanıcı dostu bir React tabanlı frontend uygulamasıdır. Kullanıcılar kayıt olabilir, giriş yapabilir, kendilerine özel abonelik planlarını görüntüleyebilir ve ödeme işlemlerini gerçekleştirebilir.
# İçindekiler
- [Proje Hakkında](#proje-hakkında)
- [Özellikler](#özellikler)
- [Teknolojiler](#teknolojiler)
- [Kurulum](#kurulum)
- [Dizin Yapısı](#dizin-yapısı)
- [Kullanım Senaryoları](#Kullanım-senaryoları)
- [Bağımlılıklar](#bağımlılıklar)
-[Katkı Sağlamak](#Katkı-Sağlamak)
## Proje Hakkında
Bu frontend projesi, SaaS uygulamasının kullanıcı panelini temsil eder. Kullanıcıların sisteme davetle kayıt olma, giriş yapma, abonelik planlarını görme, ödeme işlemleri yapma ve profil ayarlarını yönetme gibi işlemleri gerçekleştirmesine olanak tanır. Uygulama responsive (mobil uyumlu) olarak geliştirilmiştir ve karanlık / aydınlık tema desteği içerir.

##  Özellikler
˖⁺‧₊˖ Kullanıcı kayıt & giriş işlemleri (invite token desteği)

˖⁺‧₊˖ JWT token ile oturum yönetimi

˖⁺‧₊˖ Kullanıcı rollerine göre yönlendirme

˖⁺‧₊˖ Abonelik planlarını listeleme ve satın alma

˖⁺‧₊˖ Ödeme adımı ve yönlendirme

˖⁺‧₊˖ Profil sayfası ve tema ayarları (dark/light)

˖⁺‧₊˖ Responsive ve mobil uyumlu tasarım

˖⁺‧₊˖ React Router ile sayfa bazlı yönlendirme

˖⁺‧₊˖ SweetAlert2 ile kullanıcı dostu geri bildirimler

˖⁺‧₊˖ LocalStorage üzerinde kullanıcı bilgileri ve token saklama

˖⁺‧₊˖ Gelişmiş loading, error, fetch yönetimi

##   Teknolojiler

![SaaS](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white)
![React](https://img.shields.io/badge/React-FFB6C1?style=flat&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-FEC8D8?style=flat&logo=javascript&logoColor=black)
![Styled Components](https://img.shields.io/badge/Styled--Components-FADADD?style=flat&logo=styled-components&logoColor=black)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-F8C3CD?style=flat&logo=sweetalert2&logoColor=black)
![Css](https://img.shields.io/badge/CSS-FFB6C1?&style=flat&logo=css3&logoColor=white)
![Bootsrtap](https://img.shields.io/badge/Bootstrap-FFB6C1?style=flat&logo=bootstrap&logoColor=white)
![React_Router](https://img.shields.io/badge/React_Router-FFB6C1?style=flat&logo=react-router&logoColor=white)



##  Kurulum
Projeyi klonlayın:


git clone https://github.com/Mineerylmaz/SaaSBackOfficeFrontend.git
Proje klasörüne girin:
cd SaaSBackOfficeFrontend

Backend API Kullanımı
Frontend uygulaması, tüm verilerini ve iş mantığını sağlamak için bu backend API’ye bağlıdır.

API URL’sini .env dosyanızda veya config dosyanızda ayarlayın 

Kullanıcı işlemleri, abonelik ve diğer tüm backend endpointleri bu API üzerinden yönetilir.
https://github.com/Mineerylmaz/SaaS-BackOffice-Backend

Bağımlılıkları yükleyin:
npm install
 ▶  Projeyi Çalıştırma
Geliştirme modunda çalıştırmak için:


npm run start
Tarayıcınızda http://localhost:3000 adresine giderek uygulamayı görüntüleyebilirsiniz.

##  Dizin Yapısı

```plaintext
SaaSBackOfficeFrontend/
├── src/
│   ├── components/        # Ortak bileşenler (Navbar, Buton, vs.)
│   │    ├── Login/            # Login sayfası
│   │    ├── UserSettings/     # Kullanıcı ayarlar sayfası
│   │    ├── AdminPanel/       # Panel sayfası
│   │    ├── Odeme/            # Ödeme sayfası
│   └── App.jsx              # Ana uygulama dosyası
├── public/
├── package.json
└── README.md
```

##  Kullanım Senaryoları
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

## Bağımlılıklar

"dependencies": {
  "react": "^19.x.x",
  "react-dom": "^19.x.x",
  "react-router-dom": "^6.x.x",
  "styled-components": "^6.x.x",
  "sweetalert2": "^11.x.x"
}
##  Katkı Sağlamak
Katkıda bulunmak isterseniz:

Fork'layın.

Yeni bir feature branch oluşturun.

Gerekli değişiklikleri yapın.

Pull request gönderin.


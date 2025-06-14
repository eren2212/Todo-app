# Animasyon Componentleri

Bu klasörde yeniden kullanılabilir animasyon componentleri bulunmaktadır. Artık auth sayfalarınızı tek satırda oluşturabilirsiniz!

## 🚀 Hızlı Kullanım

### Auth Sayfası (Tek Satır!)

```tsx
import { AuthPageTemplate } from "@/components/animations";

export default function SignIn() {
  return (
    <AuthPageTemplate
      headerContent={<Text>Header İçeriği</Text>}
      cardContent={<Text>Form İçeriği</Text>}
    />
  );
}
```

## FloatingImage

Resimler için sürekli yüzen (floating) animasyon sağlar.

### Kullanım:

```tsx
import { FloatingImage } from "@/components/animations";

<FloatingImage
  source={require("./path/to/image.png")}
  width={300}
  height={300}
  floatDistance={15} // Hareket mesafesi (px)
  duration={3000} // Animasyon süresi (ms)
  className="rounded-full"
/>;
```

### Props:

- `source`: Resim kaynağı (ImageSourcePropType)
- `width`: Resim genişliği (varsayılan: 300)
- `height`: Resim yüksekliği (varsayılan: 300)
- `floatDistance`: Hareket mesafesi (varsayılan: 15)
- `duration`: Animasyon süresi (varsayılan: 3000)
- `className`: Tailwind CSS sınıfları

## AnimatedContainer

Çeşitli animasyon türlerini destekleyen genel amaçlı container.

### Kullanım:

```tsx
import { AnimatedContainer } from "@/components/animations";

<AnimatedContainer
  animationType="float"
  duration={2000}
  intensity={1.5}
  repeat={true}
>
  <Text>Animasyonlu içerik</Text>
</AnimatedContainer>;
```

### Animasyon Türleri:

- `float`: Yüzen hareket (x ve y ekseni)
- `pulse`: Büyüme-küçülme
- `bounce`: Zıplama
- `rotate`: Döndürme
- `shake`: Sallama
- `fadeIn`: Belirme (tek seferlik)
- `slideIn`: Kayarak gelme (tek seferlik)
- `scaleIn`: Büyüyerek belirme (tek seferlik)

### Props:

- `animationType`: Animasyon türü (AnimationType)
- `duration`: Animasyon süresi (varsayılan: 2000)
- `delay`: Başlama gecikmesi (varsayılan: 0)
- `intensity`: Animasyon yoğunluğu (varsayılan: 1)
- `repeat`: Tekrar etsin mi (varsayılan: true)
- `style`: Ek stil (ViewStyle)
- `className`: Tailwind CSS sınıfları

## Örnek Kullanımlar:

### Giriş Animasyonu:

```tsx
<AnimatedContainer animationType="fadeIn" duration={1000} repeat={false}>
  <Text>Hoş Geldiniz!</Text>
</AnimatedContainer>
```

### Sürekli Yüzen Element:

```tsx
<AnimatedContainer animationType="float" intensity={0.8}>
  <View className="bg-blue-500 p-4 rounded-lg">
    <Text>Yüzen Kutu</Text>
  </View>
</AnimatedContainer>
```

### Dikkat Çekici Buton:

```tsx
<AnimatedContainer animationType="pulse" duration={1500}>
  <TouchableOpacity className="bg-red-500 p-4 rounded-lg">
    <Text className="text-white">Önemli Buton</Text>
  </TouchableOpacity>
</AnimatedContainer>
```

## 🎯 Yeni Auth Componentleri

### AuthPageTemplate

Tam auth sayfası şablonu - tek component ile tüm sayfa!

```tsx
<AuthPageTemplate
  headerContent={headerJSX}
  cardContent={formJSX}
  gradientColors={["#6366f1", "#8b5cf6", "#a855f7"]}
/>
```

### AnimatedInput

Otomatik animasyonlu input alanları:

```tsx
<AnimatedInput
  label="Email"
  placeholder="email@example.com"
  value={email}
  onChangeText={setEmail}
  delay={800}
/>
```

### AnimatedFormButton

Basma animasyonlu butonlar:

```tsx
<AnimatedFormButton
  title="Giriş Yap"
  loadingTitle="Giriş Yapılıyor..."
  onPress={handleSubmit}
  loading={loading}
  delay={1200}
/>
```

### AnimatedLink

Animasyonlu linkler:

```tsx
<AnimatedLink
  text="Hesabınız yok mu?"
  linkText="Kayıt Ol"
  onPress={() => router.push("/signup")}
  delay={1400}
/>
```

## 📁 Dosya Yapısı

```
src/components/animations/
├── FloatingImage.tsx          # Yüzen resim animasyonu
├── AnimatedContainer.tsx      # Genel animasyon container
├── AuthPageAnimations.tsx     # Auth sayfaları için özel componentler
├── PageTemplates.tsx          # Hazır sayfa şablonları
├── FormComponents.tsx         # Form elementleri
├── index.ts                   # Export dosyası
└── README.md                  # Bu dosya
```

## ✨ Avantajlar

- **Tek satırda sayfa**: AuthPageTemplate ile
- **Otomatik animasyonlar**: Delay'ler önceden ayarlanmış
- **Tutarlı tasarım**: Tüm componentler uyumlu
- **Kolay özelleştirme**: Props ile her şey değiştirilebilir
- **TypeScript desteği**: Tam tip güvenliği

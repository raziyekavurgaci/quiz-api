# Quiz API (Backend - Node.js)
https://github.com/raziyekavurgaci

## Proje Açıklaması

Bu proje, bir Quiz (Soru-Cevap) sistemine ait RESTful API'nin backend tarafını oluşturmayı amaçlar. Kullanıcıların soru listesine ulaşabildiği, rastgele soru alabildiği ve cevaplarını göndererek doğru/yanlış bilgisi alabildiği endpoint'ler geliştirilmiştir. Veriler JSON formatında sabit olarak backend içinde tanımlanmıştır. OpenAI entegrasyonu ile yanlış cevaplara özel tavsiyeler sunulmaktadır.

## Kurulum Adımları

1.  **Gerekli Araçlar:**
    *   Node.js (v18 veya üzeri)
    *   npm (Node Package Manager)

2.  **Proje Klonlama:**

    ```bash
    git clone <proje_linki>
    cd quiz-api
    ```

3.  **Bağımlılıkları Yükleme:**

    ```bash
    npm install
    ```

4.  **.env Dosyasını Oluşturma:**

    Proje dizininde `.env` adında bir dosya oluşturun ve aşağıdaki bilgileri ekleyin:

    ```
    OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    PORT=3000
    ```

    `YOUR_OPENAI_API_KEY` yerine OpenAI API anahtarınızı girin.

5.  **Uygulamayı Çalıştırma:**

    Geliştirme modunda:

    ```bash
    npm run start:dev
    ```

    Üretim modunda:

    ```bash
    npm run build
    npm run start:prod
    ```

## API Endpoint Açıklamaları

### 1. Tüm Soruları Getirme

*   **Endpoint:** `/api/questions`
*   **Metot:** GET
*   **Açıklama:** Tüm soruları JSON formatında döndürür.
*   **Örnek İstek:**

    ```
    GET /api/questions
    ```

*   **Örnek Yanıt:**

    ```json
    [
      {
        "id": "1",
        "question": "JavaScript'te 'let' ve 'const' arasındaki fark nedir?",
        "options": [
          "Hiçbir fark yoktur",
          "let değiştirilebilir, const değiştirilemez",
          "const daha hızlıdır",
          "let global scope'ta çalışır"
        ],
        "correctAnswer": "let değiştirilebilir, const değiştirilemez"
      },
      {
        "id": "2",
        "question": "CSS'de 'box-sizing' özelliği ne işe yarar?",
        "options": [
          "Elementin boyutunu ayarlar",
          "Elementin içeriğinin boyutunu ayarlar",
          "Elementin kenar boşluklarını ayarlar",
          "Elementin çerçevesini ayarlar"
        ],
        "correctAnswer": "Elementin boyutunu ayarlar"
      }
    ]
    ```

### 2. Rastgele Soru Getirme

*   **Endpoint:** `/api/question/random`
*   **Metot:** GET
*   **Açıklama:** Rastgele bir soruyu JSON formatında döndürür.
*   **Örnek İstek:**

    ```
    GET /api/question/random
    ```

*   **Örnek Yanıt:**

    ```json
    {
      "id": "2",
      "question": "CSS'de 'box-sizing' özelliği ne işe yarar?",
      "options": [
        "Elementin boyutunu ayarlar",
        "Elementin içeriğinin boyutunu ayarlar",
        "Elementin kenar boşluklarını ayarlar",
        "Elementin çerçevesini ayarlar"
      ],
      "correctAnswer": "Elementin boyutunu ayarlar"
    }
    ```

### 3. Cevap Kontrolü

*   **Endpoint:** `/api/answer`
*   **Metot:** POST
*   **Açıklama:** Kullanıcının gönderdiği cevabı kontrol eder ve doğru/yanlış bilgisini döndürür. Yanlış cevap durumunda OpenAI ile oluşturulmuş tavsiye sunar.
*   **İstek Gövdesi (JSON):**

    ```json
    {
      "questionId": "2",
      "selectedOption": "Elementin boyutunu ayarlar"
    }
    ```

*   **Örnek Doğru Yanıt:**

    ```json
    {
      "correct": true
    }
    ```

*   **Örnek Yanlış Yanıt:**

    ```json
    {
      "correct": false,
      "recommendation": "Bu konuda daha fazla bilgi edinmek için CSS box model kavramını araştırabilirsiniz."
    }
    ```

## Test Önerileri

*   Postman veya Insomnia gibi bir araç kullanarak API endpoint'lerini test edebilirsiniz.
*   Farklı senaryoları (doğru cevap, yanlış cevap, eksik parametreler vb.) test ederek uygulamanın doğru çalıştığından emin olun.
*   OpenAI API anahtarının doğru yapılandırıldığını kontrol edin.

## Geliştirme Notları

*   Projede NestJS framework'ü kullanılmıştır.
*   Veriler sabit JSON dosyalarında saklanmaktadır.
*   OpenAI entegrasyonu ile yanlış cevaplara özel tavsiyeler sunulmaktadır.

## Lisans

Bu proje MIT lisansı altında yayınlanmıştır.

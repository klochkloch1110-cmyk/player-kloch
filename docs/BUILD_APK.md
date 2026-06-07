# Сборка APK для установки на телефон

## 🎯 Цель

Создать APK файл, который можно установить на любой Android телефон без подключения к компьютеру и без Android Studio.

## 📋 Требования

Перед сборкой убедитесь, что установлено:
- ✅ **JDK 17** (или выше)
- ✅ **Android SDK** (минимум API 33)
- ✅ Переменные `JAVA_HOME` и `ANDROID_HOME` настроены

**Если не настроено** → см. `docs/ANDROID_SETUP.md`

## 🚀 Быстрая сборка

### Windows

Запустите скрипт:
```bash
cd AudioPlayer
build-apk.bat
```

### Linux / macOS

```bash
cd AudioPlayer
chmod +x build-apk.sh
./build-apk.sh
```

Скрипт автоматически:
1. ✅ Проверит окружение
2. ✅ Очистит предыдущую сборку
3. ✅ Соберет Release APK
4. ✅ Скопирует в папку `builds/`

**Результат:** `builds/AudioPlayer-release.apk` (~30-50 MB)

## 🔧 Ручная сборка (если скрипт не работает)

### Шаг 1: Очистка

```bash
cd android
gradlew.bat clean  # Windows
./gradlew clean    # Linux/macOS
cd ..
```

### Шаг 2: Сборка Release APK

```bash
cd android
gradlew.bat assembleRelease  # Windows
./gradlew assembleRelease    # Linux/macOS
```

Процесс занимает **5-10 минут** при первой сборке.

### Шаг 3: Найти APK

APK будет в:
```
android/app/build/outputs/apk/release/app-release.apk
```

Скопируйте его в удобное место:
```bash
# Windows
copy android\app\build\outputs\apk\release\app-release.apk builds\AudioPlayer.apk

# Linux/macOS
cp android/app/build/outputs/apk/release/app-release.apk builds/AudioPlayer.apk
```

## 📱 Установка на телефон

### Способ 1: Через USB кабель

**Windows:**
1. Подключите телефон к компьютеру
2. Скопируйте APK в `Downloads` папку телефона
3. На телефоне откройте файл через File Manager

**Linux/macOS:**
```bash
adb install builds/AudioPlayer-release.apk
```

### Способ 2: Через облако

1. Загрузите APK в:
   - Google Drive
   - Dropbox
   - Яндекс.Диск
   - OneDrive

2. На телефоне скачайте файл

3. Откройте скачанный APK

### Способ 3: Через мессенджер

Отправьте APK себе через:
- Telegram ("Избранное")
- WhatsApp
- Email

### Включение установки из неизвестных источников

При первой установке Android попросит разрешение:

**Android 8.0+:**
- Нажмите **"Настройки"**
- Включите **"Разрешить из этого источника"**
- Вернитесь и нажмите **"Установить"**

**Android 7.0 и ниже:**
- Настройки → Безопасность
- Включите **"Неизвестные источники"**

## 🔐 Подписанная версия (опционально)

Для публикации в магазинах нужна подписанная версия.

### Создание ключа (один раз)

```bash
cd android/app

# Windows
keytool -genkeypair -v -storetype PKCS12 -keystore audioplayer-release.keystore -alias audioplayer -keyalg RSA -keysize 2048 -validity 10000

# Linux/macOS
keytool -genkeypair -v -storetype PKCS12 -keystore audioplayer-release.keystore -alias audioplayer -keyalg RSA -keysize 2048 -validity 10000
```

**Заполните данные:**
- Пароль: придумайте и запомните
- Имя: ваше имя
- Организация: название
- Город, регион, страна

### Настройка gradle

Создайте файл `android/gradle.properties` (или добавьте в существующий):

```properties
AUDIOPLAYER_RELEASE_STORE_FILE=audioplayer-release.keystore
AUDIOPLAYER_RELEASE_KEY_ALIAS=audioplayer
AUDIOPLAYER_RELEASE_STORE_PASSWORD=ваш_пароль
AUDIOPLAYER_RELEASE_KEY_PASSWORD=ваш_пароль
```

**⚠️ Не коммитьте этот файл в Git!** Добавьте в `.gitignore`:
```
android/gradle.properties
android/app/*.keystore
```

### Обновите android/app/build.gradle

Найдите блок `signingConfigs` и добавьте:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('AUDIOPLAYER_RELEASE_STORE_FILE')) {
                storeFile file(AUDIOPLAYER_RELEASE_STORE_FILE)
                storePassword AUDIOPLAYER_RELEASE_STORE_PASSWORD
                keyAlias AUDIOPLAYER_RELEASE_KEY_ALIAS
                keyPassword AUDIOPLAYER_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Сборка подписанного APK

```bash
cd android
./gradlew assembleRelease
cd ..
```

Теперь APK будет подписан вашим ключом.

## 🐛 Решение проблем

### Ошибка: "JAVA_HOME is not set"

**Решение:**
```bash
# Проверьте
echo %JAVA_HOME%  # Windows
echo $JAVA_HOME   # Linux/macOS

# Установите
set JAVA_HOME=C:\Program Files\Java\jdk-17  # Windows (временно)
export JAVA_HOME=/usr/lib/jvm/java-17       # Linux (временно)

# Для постоянной установки см. docs/ANDROID_SETUP.md
```

### Ошибка: "SDK location not found"

**Решение:**

Создайте `android/local.properties`:
```properties
sdk.dir=C:\\Users\\ВАШ_ПОЛЬЗОВАТЕЛЬ\\AppData\\Local\\Android\\Sdk
```

### Ошибка: "Execution failed for task ':app:mergeReleaseResources'"

**Решение:**
```bash
cd android
./gradlew clean
./gradlew assembleRelease --stacktrace
```

### Ошибка: "Could not find com.android.tools.build:gradle"

**Решение:**

Проверьте подключение к интернету. Gradle скачивает зависимости.

Или используйте VPN, если есть блокировки.

### APK не устанавливается на телефоне

**Возможные причины:**

1. **Не включены неизвестные источники** → включите в настройках
2. **Уже установлена версия с другой подписью** → удалите старую версию
3. **Минимальная версия Android** → требуется Android 6.0+
4. **Поврежденный файл** → скачайте заново

## 📊 Размер APK

**Ожидаемый размер:**
- Debug APK: ~45-60 MB
- Release APK: ~30-50 MB
- Release APK (с ProGuard): ~25-40 MB

**Большой размер из-за:**
- react-native-track-player (~10 MB)
- react-native-reanimated (~8 MB)
- @shopify/react-native-skia (~12 MB)
- Прочие библиотеки (~15 MB)

**Оптимизация (опционально):**

В `android/app/build.gradle` добавьте:
```gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

Это уменьшит размер на ~20-30%.

## ✅ Проверка APK

После сборки проверьте:

```bash
# Информация о APK
aapt dump badging builds/AudioPlayer-release.apk

# Размер
ls -lh builds/AudioPlayer-release.apk  # Linux/macOS
dir builds\AudioPlayer-release.apk     # Windows
```

## 🎉 Готово!

После успешной сборки:

1. ✅ APK готов к установке
2. ✅ Можно установить на любой Android телефон
3. ✅ Не нужен Play Store
4. ✅ Работает офлайн

**Что делать дальше:**
1. Скопируйте APK на телефон любым способом
2. Установите приложение
3. Следуйте инструкциям в `docs/QUICK_START.md`
4. Протестируйте функционал по `docs/TESTING_ID3.md`

## 📞 Нужна помощь?

- `docs/ANDROID_SETUP.md` — настройка окружения
- `docs/QUICK_START.md` — как пользоваться приложением
- `docs/TESTING_ID3.md` — что тестировать
- `PROGRESS.md` — статус разработки

---

**Приятного использования! 🎵**

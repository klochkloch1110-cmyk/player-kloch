# Настройка Android окружения для React Native (Windows)

## 🔧 Текущая ситуация

✅ **Работает:**
- Metro bundler запущен на http://localhost:8081
- TypeScript компиляция без ошибок
- Все npm зависимости установлены

❌ **Не хватает:**
- Android Studio
- Java Development Kit (JDK)
- Android SDK
- Android Emulator

## 📋 Пошаговая установка

### Шаг 1: Установка JDK 17

1. Скачайте **JDK 17** (рекомендуется):
   - [Adoptium OpenJDK 17](https://adoptium.net/) (рекомендуется)
   - Или [Oracle JDK 17](https://www.oracle.com/java/technologies/downloads/#java17)

2. Запустите установщик, установите в `C:\Program Files\Java\jdk-17`

3. Настройте переменные окружения:
   - Откройте **"Свойства системы"** → **"Переменные среды"**
   - Создайте новую системную переменную:
     - **Имя:** `JAVA_HOME`
     - **Значение:** `C:\Program Files\Java\jdk-17` (ваш путь к JDK)
   
   - Добавьте в `Path`:
     - `%JAVA_HOME%\bin`

4. Проверьте установку:
```bash
java -version
# Должно показать: openjdk version "17.x.x"
```

### Шаг 2: Установка Android Studio

1. Скачайте **Android Studio** с официального сайта:
   - https://developer.android.com/studio

2. Запустите установщик и установите:
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device (AVD)

3. При первом запуске Android Studio выберите:
   - **Standard** установка
   - Дождитесь загрузки всех компонентов (~2-4 GB)

### Шаг 3: Установка Android SDK

1. Откройте **Android Studio** → **Settings** (Ctrl+Alt+S)

2. Перейдите в **Appearance & Behavior** → **System Settings** → **Android SDK**

3. Во вкладке **SDK Platforms** установите:
   - ✅ **Android 13.0 (Tiramisu)** — API Level 33
   - ✅ **Android 12.0 (S)** — API Level 31
   - ✅ **Show Package Details** → установите:
     - Android SDK Platform 33
     - Intel x86 Atom_64 System Image (или Google APIs)

4. Во вкладке **SDK Tools** установите:
   - ✅ Android SDK Build-Tools (версия 33.0.0)
   - ✅ Android SDK Command-line Tools (latest)
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools
   - ✅ Intel x86 Emulator Accelerator (HAXM installer)

5. Нажмите **Apply** → дождитесь установки

### Шаг 4: Настройка переменных окружения

1. Откройте **"Переменные среды"**

2. Создайте новую системную переменную:
   - **Имя:** `ANDROID_HOME`
   - **Значение:** `C:\Users\ВАШ_ПОЛЬЗОВАТЕЛЬ\AppData\Local\Android\Sdk`
   - (Путь можно скопировать из Android Studio → SDK Manager)

3. Добавьте в `Path`:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\emulator`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

4. Перезапустите терминал и проверьте:
```bash
adb version
# Должно показать: Android Debug Bridge version x.x.x
```

### Шаг 5: Создание Android эмулятора

1. Откройте **Android Studio** → **Tools** → **Device Manager**

2. Нажмите **"Create Device"**

3. Выберите устройство:
   - **Phone** → **Pixel 5** (рекомендуется)
   - Нажмите **Next**

4. Выберите систему:
   - **Tiramisu** (Android 13, API 33) с Google APIs
   - Нажмите **Download** → дождитесь загрузки (~1 GB)
   - Нажмите **Next**

5. Настройки AVD:
   - **AVD Name:** `Pixel_5_API_33`
   - **Startup orientation:** Portrait
   - **Graphics:** Hardware - GLES 2.0
   - Нажмите **Finish**

6. Запустите эмулятор:
   - Нажмите кнопку ▶️ рядом с созданным устройством
   - Дождитесь полной загрузки Android (~1-2 минуты)

### Шаг 6: Запуск React Native приложения

#### Вариант 1: Автоматический запуск

1. Убедитесь, что эмулятор запущен:
```bash
adb devices
# Должно показать: emulator-5554    device
```

2. Запустите Metro bundler (если не запущен):
```bash
cd C:\Users\95\Desktop\Диван\AudioPlayer
npm start
```

3. В **новом терминале** запустите Android сборку:
```bash
npm run android
```

Приложение автоматически установится и запустится на эмуляторе.

#### Вариант 2: Ручная сборка

```bash
cd android
gradlew.bat clean
gradlew.bat installDebug
cd ..
```

### Шаг 7: Проверка работы

После установки приложение должно:
1. ✅ Запуститься на эмуляторе
2. ✅ Показать главный экран с вкладками
3. ✅ Открыться без ошибок

## 🧪 Тестирование функционала

### Добавление тестовых MP3 файлов

```bash
# Скопируйте MP3 файлы в эмулятор
adb push "C:\Music\song.mp3" /sdcard/Music/song.mp3
adb push "C:\Music\album" /sdcard/Music/
```

### Проверка ID3 метаданных

1. Откройте приложение → вкладка **Library**
2. Разрешите доступ к файлам (Allow)
3. Нажмите **"Scan Library"**
4. Проверьте, что:
   - ✅ Треки отображаются с правильными названиями
   - ✅ Исполнители извлекаются из ID3
   - ✅ Обложки видны (если есть embedded)

### Проверка воспроизведения

1. Тапните на трек
2. Проверьте:
   - ✅ Музыка начинает играть
   - ✅ Мини-плеер появляется внизу
   - ✅ Контролы работают

## 🐛 Решение проблем

### Проблема: "JAVA_HOME is not set"

**Решение:**
1. Проверьте, что JDK установлен
2. Проверьте переменную `JAVA_HOME`:
```bash
echo %JAVA_HOME%
```
3. Перезапустите терминал после настройки переменных

### Проблема: "SDK location not found"

**Решение:**
1. Создайте файл `android/local.properties`:
```properties
sdk.dir=C:\\Users\\ВАШ_ПОЛЬЗОВАТЕЛЬ\\AppData\\Local\\Android\\Sdk
```

### Проблема: "Unable to load script"

**Решение:**
```bash
npm start -- --reset-cache
```

В новом терминале:
```bash
npm run android
```

### Проблема: Эмулятор не запускается

**Решение:**
1. Убедитесь, что включена виртуализация в BIOS (Intel VT-x / AMD-V)
2. Установите Intel HAXM (если Intel процессор):
   - Android Studio → SDK Manager → SDK Tools → Intel x86 Emulator Accelerator

### Проблема: "adb: device offline"

**Решение:**
```bash
adb kill-server
adb start-server
adb devices
```

## 📱 Альтернатива: Реальное устройство

Если эмулятор не работает, можно использовать реальное Android устройство:

1. **На телефоне:**
   - Откройте **Настройки** → **О телефоне**
   - Нажмите **Номер сборки** 7 раз (активирует режим разработчика)
   - Вернитесь → **Система** → **Для разработчиков**
   - Включите **Отладка по USB**

2. **Подключите телефон к компьютеру через USB**

3. **Проверьте подключение:**
```bash
adb devices
# Должно показать: XXXXXXXX    device
```

4. **Запустите приложение:**
```bash
npm run android
```

## ⏱️ Время установки

- **JDK:** ~5 минут
- **Android Studio:** ~20-30 минут (с загрузкой SDK)
- **Эмулятор:** ~10 минут (первое создание)
- **Первая сборка:** ~5-10 минут

**Итого:** ~40-60 минут полной настройки

## ✅ Чек-лист готовности

Перед запуском убедитесь:
- [ ] JDK 17 установлен и `JAVA_HOME` настроена
- [ ] Android Studio установлен
- [ ] Android SDK (API 33) установлен
- [ ] `ANDROID_HOME` переменная настроена
- [ ] `adb` работает в терминале
- [ ] Эмулятор создан и запущен
- [ ] Metro bundler запущен (`npm start`)

## 🎯 После настройки

Когда всё готово, вернитесь к:
- **`docs/QUICK_START.md`** — быстрый старт тестирования
- **`docs/TESTING_ID3.md`** — проверка ID3 метаданных
- **`docs/NEXT_STEPS.md`** — план дальнейшей разработки

---

**Нужна помощь?** Проверьте официальную документацию:
- [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)
- [Android Studio Setup](https://developer.android.com/studio/intro)

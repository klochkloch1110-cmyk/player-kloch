#!/bin/bash
# Скрипт для сборки APK файла AudioPlayer
# Требуется: JDK 17+ и Android SDK

echo "========================================"
echo "Сборка APK для AudioPlayer"
echo "========================================"
echo ""

# Проверка JAVA_HOME
if [ -z "$JAVA_HOME" ]; then
    echo "[ОШИБКА] JAVA_HOME не установлена!"
    echo "Установите JDK 17 и настройте JAVA_HOME"
    echo "Инструкция: docs/ANDROID_SETUP.md"
    exit 1
fi

echo "[1/5] Проверка окружения..."
echo "JAVA_HOME: $JAVA_HOME"
echo ""

# Проверка Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo "[ОШИБКА] ANDROID_HOME не установлена!"
    echo "Установите Android SDK и настройте ANDROID_HOME"
    echo "Инструкция: docs/ANDROID_SETUP.md"
    exit 1
fi

echo "ANDROID_HOME: $ANDROID_HOME"
echo ""

echo "[2/5] Очистка предыдущей сборки..."
cd android
./gradlew clean
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Не удалось очистить проект"
    exit 1
fi
cd ..
echo "Готово!"
echo ""

echo "[3/5] Сборка Release APK..."
echo "Это может занять несколько минут..."
cd android
./gradlew assembleRelease
if [ $? -ne 0 ]; then
    echo "[ОШИБКА] Сборка не удалась"
    echo "Проверьте логи выше для деталей"
    exit 1
fi
cd ..
echo "Готово!"
echo ""

echo "[4/5] Поиск собранного APK..."
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "[ОШИБКА] APK файл не найден: $APK_PATH"
    exit 1
fi

echo "Найден: $APK_PATH"
echo ""

echo "[5/5] Копирование APK..."
mkdir -p builds
cp "$APK_PATH" "builds/AudioPlayer-release.apk"
echo ""

echo "========================================"
echo "УСПЕШНО!"
echo "========================================"
echo ""
echo "APK файл готов:"
echo "builds/AudioPlayer-release.apk"
echo ""
echo "Размер файла:"
ls -lh "builds/AudioPlayer-release.apk" | awk '{print $5}'
echo ""
echo "Теперь вы можете:"
echo "1. Скопировать файл на телефон через USB"
echo "2. Отправить через мессенджер"
echo "3. Загрузить в облако и скачать на телефон"
echo ""
echo "Установка на телефоне:"
echo "- Включите 'Установка из неизвестных источников'"
echo "- Откройте APK файл"
echo "- Нажмите 'Установить'"
echo ""

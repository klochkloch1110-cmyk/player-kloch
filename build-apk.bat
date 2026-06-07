@echo off
REM Скрипт для сборки APK файла AudioPlayer
REM Требуется: JDK 17+ и Android SDK

echo ========================================
echo Сборка APK для AudioPlayer
echo ========================================
echo.

REM Проверка JAVA_HOME
if not defined JAVA_HOME (
    echo [ОШИБКА] JAVA_HOME не установлена!
    echo Установите JDK 17 и настройте JAVA_HOME
    echo Инструкция: docs/ANDROID_SETUP.md
    pause
    exit /b 1
)

echo [1/5] Проверка окружения...
echo JAVA_HOME: %JAVA_HOME%
echo.

REM Проверка Android SDK
if not defined ANDROID_HOME (
    echo [ОШИБКА] ANDROID_HOME не установлена!
    echo Установите Android SDK и настройте ANDROID_HOME
    echo Инструкция: docs/ANDROID_SETUP.md
    pause
    exit /b 1
)

echo ANDROID_HOME: %ANDROID_HOME%
echo.

echo [2/5] Очистка предыдущей сборки...
cd android
call gradlew.bat clean
if errorlevel 1 (
    echo [ОШИБКА] Не удалось очистить проект
    pause
    exit /b 1
)
cd ..
echo Готово!
echo.

echo [3/5] Сборка Release APK...
echo Это может занять несколько минут...
cd android
call gradlew.bat assembleRelease
if errorlevel 1 (
    echo [ОШИБКА] Сборка не удалась
    echo Проверьте логи выше для деталей
    pause
    exit /b 1
)
cd ..
echo Готово!
echo.

echo [4/5] Поиск собранного APK...
set APK_PATH=android\app\build\outputs\apk\release\app-release.apk

if not exist "%APK_PATH%" (
    echo [ОШИБКА] APK файл не найден: %APK_PATH%
    pause
    exit /b 1
)

echo Найден: %APK_PATH%
echo.

echo [5/5] Копирование APK...
if not exist "builds" mkdir builds
copy "%APK_PATH%" "builds\AudioPlayer-release.apk"
echo.

echo ========================================
echo УСПЕШНО!
echo ========================================
echo.
echo APK файл готов:
echo builds\AudioPlayer-release.apk
echo.
echo Размер файла:
dir "builds\AudioPlayer-release.apk" | find "AudioPlayer-release.apk"
echo.
echo Теперь вы можете:
echo 1. Скопировать файл на телефон через USB
echo 2. Отправить через мессенджер
echo 3. Загрузить в облако и скачать на телефон
echo.
echo Установка на телефоне:
echo - Включите "Установка из неизвестных источников"
echo - Откройте APK файл
echo - Нажмите "Установить"
echo.
pause

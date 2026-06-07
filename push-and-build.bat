@echo off
echo ========================================
echo  GitHub Push + Автоматическая сборка APK
echo ========================================
echo.

REM Проверка статуса git
git status
echo.

REM Добавление всех файлов
echo Добавление файлов в git...
git add .
echo.

REM Коммит
echo Введите сообщение коммита (или нажмите Enter для сообщения по умолчанию):
set /p commit_message=">> "

if "%commit_message%"=="" (
    set commit_message=feat: добавлен GitHub Actions для автоматической сборки APK
)

git commit -m "%commit_message%"
echo.

REM Push
echo Отправка в GitHub...
git push -u origin main
echo.

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Ошибка при push!
    echo.
    echo Возможные причины:
    echo 1. Ветка называется не 'main', а 'master' или другое имя
    echo 2. Требуется авторизация GitHub
    echo.
    echo Попробуй вручную:
    echo   git push -u origin master
    echo   или
    echo   git push -u origin main
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  ✅ Успешно! Открываю GitHub Actions...
echo ========================================
echo.
echo Сборка APK запустится автоматически.
echo Дождись завершения (~5-8 минут).
echo.

REM Открыть страницу Actions в браузере
start https://github.com/klochkloch1110-cmyk/player-kloch/actions

echo.
echo 📱 После завершения сборки:
echo 1. Открой завершенную сборку
echo 2. Прокрути вниз до "Artifacts"
echo 3. Скачай app-release.zip
echo 4. Распакуй и получи app-release.apk
echo.
pause

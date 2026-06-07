#!/bin/bash

echo "========================================"
echo " GitHub Push + Автоматическая сборка APK"
echo "========================================"
echo ""

# Проверка статуса git
git status
echo ""

# Добавление всех файлов
echo "Добавление файлов в git..."
git add .
echo ""

# Коммит
echo "Введите сообщение коммита (или нажмите Enter для сообщения по умолчанию):"
read -r commit_message

if [ -z "$commit_message" ]; then
    commit_message="feat: добавлен GitHub Actions для автоматической сборки APK"
fi

git commit -m "$commit_message"
echo ""

# Push
echo "Отправка в GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Ошибка при push!"
    echo ""
    echo "Возможные причины:"
    echo "1. Ветка называется не 'main', а 'master' или другое имя"
    echo "2. Требуется авторизация GitHub"
    echo ""
    echo "Попробуй вручную:"
    echo "  git push -u origin master"
    echo "  или"
    echo "  git push -u origin main"
    echo ""
    exit 1
fi

echo ""
echo "========================================"
echo " ✅ Успешно! Открываю GitHub Actions..."
echo "========================================"
echo ""
echo "Сборка APK запустится автоматически."
echo "Дождись завершения (~5-8 минут)."
echo ""

# Открыть страницу Actions в браузере
if command -v xdg-open > /dev/null; then
    xdg-open "https://github.com/klochkloch1110-cmyk/player-kloch/actions"
elif command -v open > /dev/null; then
    open "https://github.com/klochkloch1110-cmyk/player-kloch/actions"
else
    echo "Открой вручную: https://github.com/klochkloch1110-cmyk/player-kloch/actions"
fi

echo ""
echo "📱 После завершения сборки:"
echo "1. Открой завершенную сборку"
echo "2. Прокрути вниз до \"Artifacts\""
echo "3. Скачай app-release.zip"
echo "4. Распакуй и получи app-release.apk"
echo ""

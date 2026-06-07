# ⚡ Быстрый старт: Получить APK за 5 минут

## Шаг 1: Запушить workflow файл

```bash
cd c:/Users/95/Desktop/Диван/AudioPlayer
git add .
git commit -m "feat: добавлен GitHub Actions для автоматической сборки APK"
git push origin main
```

*Если основная ветка называется `master`, замени `main` на `master`.*

## Шаг 2: Открыть GitHub Actions

1. Перейди на https://github.com/klochkloch1110-cmyk/player-kloch/actions
2. Увидишь запущенную сборку "Build Android APK"
3. Дождись завершения (~5-8 минут)

## Шаг 3: Скачать APK

1. Открой завершенную сборку
2. Прокрути вниз до раздела **Artifacts**
3. Скачай `app-release.zip`
4. Распакуй → получишь `app-release.apk` (~30-50 MB)

## Шаг 4: Установить на телефон

1. Отправь APK себе через Telegram / облако
2. Скачай на телефон
3. Открой файл → Установить
4. Разреши установку из неизвестных источников (если попросит)

---

## 🔄 При следующих изменениях

Просто делай `git push` — APK соберется автоматически!

---

Подробная документация: [GITHUB_ACTIONS_BUILD.md](./GITHUB_ACTIONS_BUILD.md)

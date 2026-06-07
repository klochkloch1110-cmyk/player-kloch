# ThemeProvider - Система тем

## Обзор

ThemeProvider - это контекст React для управления темами приложения. Поддерживает светлую, тёмную и автоматическую темы с синхронизацией с системными настройками.

## Установка

ThemeProvider уже интегрирован в приложение через `App.tsx`:

```tsx
<ThemeProvider initialMode="light">
  <AppContent />
</ThemeProvider>
```

## Использование

### В компонентах

Используйте хук `useTheme` для доступа к текущей теме:

```tsx
import { useTheme } from '../../shared/providers';

export const MyComponent: React.FC = () => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>
        Текущая тема: {themeMode}
      </Text>
    </View>
  );
};
```

## API

### ThemeContextType

```typescript
interface ThemeContextType {
  theme: Theme;              // Текущий объект темы
  themeMode: ThemeMode;      // 'light' | 'dark' | 'auto'
  setThemeMode: (mode: ThemeMode) => void;  // Установить режим темы
  toggleTheme: () => void;   // Переключить: light → dark → auto → light
}
```

### Theme Object

```typescript
interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    shadowDark: string;
    shadowLight: string;
    success: string;
    warning: string;
    error: string;
  };
  spacing: { xs, sm, md, lg, xl, xxl };
  borderRadius: { sm, md, lg, xl, round };
  shadows: { neumorphic: { distance, intensity, blur } };
  typography: { fontSize, fontWeight, lineHeight };
}
```

## Режимы тем

### 1. Light (светлая)
Светлый неоморфный дизайн с мягкими тенями на сером фоне.

### 2. Dark (тёмная)
Тёмный неоморфный дизайн с акцентом на глубину.

### 3. Auto (автоматическая)
Синхронизируется с системными настройками устройства. Автоматически переключается при изменении темы системы.

## Примеры использования

### Динамические стили

```tsx
const { theme } = useTheme();

<View style={[
  styles.container,
  { backgroundColor: theme.colors.background }
]}>
  <Text style={{ color: theme.colors.text }}>Привет!</Text>
</View>
```

### Кнопка переключения темы

```tsx
const { themeMode, toggleTheme } = useTheme();

<NeumorphicButton onPress={toggleTheme}>
  <Text>{themeMode === 'light' ? '🌙' : '☀️'}</Text>
</NeumorphicButton>
```

### Установка конкретной темы

```tsx
const { setThemeMode } = useTheme();

<NeumorphicButton onPress={() => setThemeMode('dark')}>
  <Text>Тёмная тема</Text>
</NeumorphicButton>
```

## Неоморфные компоненты

Все неоморфные компоненты (`NeumorphicCard`, `NeumorphicButton`, `NeumorphicSlider`) автоматически используют `useTheme` и адаптируются к текущей теме.

## Будущие улучшения

- [ ] Сохранение выбранной темы в MMKV storage
- [ ] Плавная анимация перехода между темами
- [ ] Пользовательские цветовые схемы
- [ ] Экран настроек с выбором темы

## Структура файлов

```
src/shared/
├── providers/
│   ├── ThemeProvider.tsx   # Контекст и провайдер
│   └── index.ts            # Экспорты
└── config/
    └── theme.ts            # Определения тем (lightTheme, darkTheme)
```

## Миграция старого кода

Если в коде встречается прямой импорт темы:

```tsx
// ❌ Старый способ
import { lightTheme } from '../config/theme';
const theme = lightTheme;
```

Замените на:

```tsx
// ✅ Новый способ
import { useTheme } from '../providers';
const { theme } = useTheme();
```

Все компоненты приложения уже обновлены для использования ThemeProvider.

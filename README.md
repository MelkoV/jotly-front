# Jotly Front

Frontend-приложение Jotly на `React + Vite + MUI`.

## Установка

```bash
npm install
```

## Переменные окружения

API URL можно передать через Vite-переменную:

```env
VITE_API_URL=http://localhost:8080
```

Локально это можно хранить, например, в `.env.local`.

Если переменная не задана, frontend использует fallback:

```text
http://localhost:8080
```

## Основные команды

Запуск dev-сервера:

```bash
npm run dev
```

Проверка линтером:

```bash
npm run lint
```

Production-сборка:

```bash
npm run build
```

Проверка уязвимостей зависимостей:

```bash
npm audit
```

## Пример сборки с API URL

PowerShell:

```powershell
$env:VITE_API_URL="https://api.example.com"
npm run build
```

## Архитектура

Основные директории проекта:

```text
src/
  app/         - инициализация приложения и роутинг
  pages/       - страницы приложения
  components/  - переиспользуемые UI-компоненты
  services/    - работа с API и вспомогательные сетевые утилиты
  store/       - глобальное состояние на Zustand
  hooks/       - общие React hooks
  assets/      - локальные иконки и статические ресурсы
  theme/       - тема MUI
```

Роли слоёв:

- `pages` отвечают за экран целиком и композицию UI
- `components` содержат более мелкие переиспользуемые блоки
- `services` инкапсулируют HTTP-запросы и маппинг API-контрактов
- `store` хранит клиентское состояние, статусы загрузки и действия пользователя
- `app/router.jsx` управляет маршрутами и lazy loading страниц

Ключевые точки:

- [src/services/apiClient.js](D:\projects\jotly\jotly-front\src\services\apiClient.js) — базовая настройка `axios`
- [src/store/authStore.js](D:\projects\jotly\jotly-front\src\store\authStore.js) — авторизация и профиль
- [src/store/listStore.js](D:\projects\jotly\jotly-front\src\store\listStore.js) — списки рабочего пространства
- [src/pages/ListPage.jsx](D:\projects\jotly\jotly-front\src\pages\ListPage.jsx) — страница доступных списков
- [src/pages/ListDetailPage.jsx](D:\projects\jotly\jotly-front\src\pages\ListDetailPage.jsx) — страница просмотра и редактирования списка

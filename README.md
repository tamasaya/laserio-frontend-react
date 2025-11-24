## Laserio Frontend Catalog

**Stack**: React 18+, TypeScript, Vite, TailwindCSS, React Router v6, Zustand.

This project implements a catalog of laser &amp; optoelectronic components with:

- **Каталог** с древовидной навигацией категорий и карточками товаров.
- **Страницы**: `/`, `/categories`, `/catalog/:slug`, `/products/:slug`, `/cart`, `/checkout`.
- **Корзина-заявка** на Zustand с сохранением в `localStorage`.
- **Работа с API**: `https://tamasaya.ru/api/laserio`.

### Установка и запуск

1. **Установка зависимостей**

```bash
npm install
```

2. **Запуск в dev-режиме**

```bash
npm run dev
```

3. **Сборка**

```bash
npm run build
```

4. **Просмотр собранной версии**

```bash
npm run preview
```
# Команда для обновления фронта

sudo rsync -av --delete /home/tamasaya/projects/laserio-frontend-react/dist/ /var/www/laserio-frontend/


### Основная структура `src`

- `pages/` – реализации маршрутов (Home, CategoriesMap, Catalog, Product, Cart, Checkout).
- `components/` – переиспользуемые UI-компоненты (layout, категория, товары, состояния).
- `store/` – Zustand-хранилище корзины.
- `lib/` – функции работы с API и React-хуки для загрузки данных.
- `styles/` – место для дополнительных глобальных стилей/дизайн-токенов.


# 🎁 Wishify - Менеджер списка желаний

Wishify - это современное веб-приложение для управления вашим списком желаний. Создавайте, редактируйте и отслеживайте свои желания в одном месте. Отмечайте исполненные желания и делитесь своими мечтами с друзьями.

## 🌐 Демо

Посмотрите работающую версию приложения: [https://asd4a10.github.io/wishify/](https://asd4a10.github.io/wishify/)

![Wishify Preview](screenshots/preview.png)

## ✨ Возможности

- **Создание желаний**: добавляйте название, описание, цену, ссылку на товар и изображение
- **Управление желаниями**: редактируйте, удаляйте и отмечайте желания как исполненные
- **Персонализация**: авторизация пользователей с помощью Clerk
- **Адаптивный дизайн**: приложение отлично выглядит на компьютерах, планшетах и телефонах
- **Визуальные эффекты**: плавные анимации и переходы для лучшего пользовательского опыта

## 🛠 Технологии

- **Frontend**: React, TypeScript, Vite
- **State Management**: Redux Toolkit
- **UI библиотека**: Material-UI, TailwindCSS
- **Аутентификация**: Clerk
- **Деплой**: GitHub Pages

## 🚀 Установка и запуск

### Предварительные требования

- Node.js (версия 16.x или выше)
- npm или yarn

### Шаги установки

1. Клонируйте репозиторий:

   ```
   git clone https://github.com/your-username/wishify-web.git
   cd wishify-web
   ```

2. Установите зависимости:

   ```
   npm install
   ```

3. Создайте файл `.env.local` и добавьте свои ключи для Clerk:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   ```

4. Запустите проект в режиме разработки:

   ```
   npm run dev
   ```

5. Откройте [http://localhost:5173](http://localhost:5173) в вашем браузере

## 📝 Использование

1. **Регистрация/Вход**: Используйте Clerk для регистрации или входа в приложение
2. **Добавление желания**: Нажмите на кнопку "Добавить новое желание"
3. **Управление желаниями**: Нажмите на желание для просмотра деталей
   - Редактирование: нажмите на иконку карандаша
   - Удаление: нажмите на иконку корзины
   - Отметка выполнения: нажмите на кнопку "У меня это уже есть"

## 🧪 Тестирование

Для запуска тестов:

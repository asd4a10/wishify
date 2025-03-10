import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
	fetchWishes,
	addWishAsync,
	removeWishAsync,
	toggleWishCompletedAsync,
	addWish,
	removeWish,
	toggleWishCompleted,
} from "./features/wishes/wishesSlice";
import "./App.css";

function App() {
	const [newWishTitle, setNewWishTitle] = useState("");
	const [newWishDescription, setNewWishDescription] = useState("");
	const [isAddingWish, setIsAddingWish] = useState(false);

	// Используем Redux вместо локального состояния
	const {
		items: wishes,
		status,
		error,
	} = useAppSelector((state) => state.wishes);
	const dispatch = useAppDispatch();

	// Загружаем данные при монтировании компонента
	useEffect(() => {
		if (status === "idle") {
			dispatch(fetchWishes());
		}
	}, [status, dispatch]);

	// Обновленный обработчик добавления
	const handleAddWish = () => {
		if (newWishTitle.trim() === "") return;

		// Оптимистичное обновление UI
		dispatch(addWish(newWishTitle, newWishDescription));

		// Отправка запроса на сервер
		dispatch(
			addWishAsync({
				title: newWishTitle,
				description: newWishDescription,
			})
		);

		setNewWishTitle("");
		setNewWishDescription("");
		setIsAddingWish(false);
	};

	// Функция для отмены добавления
	const cancelAdding = () => {
		setNewWishTitle("");
		setNewWishDescription("");
		setIsAddingWish(false);
	};

	// Обновленный обработчик удаления
	const handleRemoveWish = (id: string) => {
		// Оптимистичное обновление UI
		dispatch(removeWish(id));

		// Отправка запроса на сервер
		dispatch(removeWishAsync(id));
	};

	// Обновленный обработчик переключения статуса
	const handleToggleCompleted = (id: string) => {
		// Находим текущее желание
		const wish = wishes.find((w) => w.id === id);
		if (!wish) return;

		// Оптимистичное обновление UI
		dispatch(toggleWishCompleted(id));

		// Отправка запроса на сервер
		dispatch(toggleWishCompletedAsync({ id, completed: !wish.completed }));
	};

	// Рендеринг содержимого в зависимости от статуса загрузки
	let content;

	if (status === "loading" && wishes.length === 0) {
		content = <div className="loading">Загрузка...</div>;
	} else if (status === "failed") {
		content = <div className="error">Ошибка: {error}</div>;
	} else if (wishes.length === 0) {
		content = (
			<p className="empty-message">У вас пока нет желаний. Добавьте новое!</p>
		);
	} else {
		content = wishes.map((wish) => (
			<div
				key={wish.id}
				className={`wish-item ${wish.completed ? "completed" : ""}`}
			>
				<div className="wish-content">
					<h3>{wish.title}</h3>
					{wish.description && <p>{wish.description}</p>}
					<span className="created-at">
						Создано: {wish.createdAt.toLocaleDateString()}
					</span>
				</div>
				<div className="wish-actions">
					<button
						className="toggle-btn"
						onClick={() => handleToggleCompleted(wish.id)}
					>
						{wish.completed ? "Вернуть" : "Выполнить"}
					</button>
					<button
						className="remove-btn"
						onClick={() => handleRemoveWish(wish.id)}
					>
						Удалить
					</button>
				</div>
			</div>
		));
	}

	return (
		<div className="wishify-container">
			<header>
				<h1>Wishify</h1>
				<p>Храните и отслеживайте свои цели и мечты</p>
			</header>

			{!isAddingWish ? (
				<button
					className="add-wish-button"
					onClick={() => setIsAddingWish(true)}
				>
					+ Добавить новое желание
				</button>
			) : (
				<div className="add-wish-form">
					<h3>Новое желание</h3>
					<input
						type="text"
						value={newWishTitle}
						onChange={(e) => setNewWishTitle(e.target.value)}
						placeholder="Название вашего желания"
						autoFocus
					/>
					<textarea
						value={newWishDescription}
						onChange={(e) => setNewWishDescription(e.target.value)}
						placeholder="Описание (опционально)"
					/>
					<div className="form-buttons">
						<button onClick={handleAddWish} className="add-btn">
							Сохранить
						</button>
						<button onClick={cancelAdding} className="cancel-btn">
							Отмена
						</button>
					</div>
				</div>
			)}

			<div className="wishes-list">
				<h2>Ваши желания</h2>
				{content}
			</div>
		</div>
	);
}

export default App;

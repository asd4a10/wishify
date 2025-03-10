import { useState } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import {
	addWish,
	removeWish,
	toggleWishCompleted,
} from "./features/wishes/wishesSlice";
import "./App.css";

// Определение типа для элемента желания
type Wish = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	createdAt: Date;
};

const API_URL = "https://wishify.kz/api/v1/wishes";

function App() {
	const [newWishTitle, setNewWishTitle] = useState("");
	const [newWishDescription, setNewWishDescription] = useState("");
	const [isAddingWish, setIsAddingWish] = useState(false);

	// Используем Redux вместо локального состояния
	const wishes = useAppSelector((state) => state.wishes.items);
	const dispatch = useAppDispatch();

	// Обновленный обработчик добавления
	const handleAddWish = () => {
		if (newWishTitle.trim() === "") return;

		dispatch(addWish(newWishTitle, newWishDescription));
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
		dispatch(removeWish(id));
	};

	// Обновленный обработчик переключения статуса
	const handleToggleCompleted = (id: string) => {
		dispatch(toggleWishCompleted(id));
	};

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
				{wishes.length === 0 ? (
					<p className="empty-message">
						У вас пока нет желаний. Добавьте новое!
					</p>
				) : (
					wishes.map((wish) => (
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
					))
				)}
			</div>
		</div>
	);
}

export default App;

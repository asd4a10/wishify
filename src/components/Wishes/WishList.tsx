import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	fetchWishes,
	addWishAsync,
	removeWishAsync,
	toggleWishCompletedAsync,
	addWish,
	removeWish,
	toggleWishCompleted,
} from "../../features/wishes/wishesSlice";
import WishItem from "./WishItem";
import WishForm from "./WishForm";
import { useState } from "react";

interface WishListProps {
	userId: string;
}

const WishList = ({ userId }: WishListProps) => {
	const [isAddingWish, setIsAddingWish] = useState(false);
	const dispatch = useAppDispatch();
	const {
		items: wishes,
		status,
		error,
	} = useAppSelector((state) => state.wishes);

	// Загружаем данные при монтировании компонента
	useEffect(() => {
		if (status === "idle" && userId) {
			dispatch(fetchWishes(userId));
		}
	}, [status, dispatch, userId]);

	// Обработчики действий
	const handleAddWish = (title: string, description: string) => {
		// Оптимистичное обновление UI
		dispatch(addWish(title, description));

		// Отправка запроса на сервер
		dispatch(
			addWishAsync({
				title,
				description,
				userId,
			})
		);

		// Скрываем форму
		setIsAddingWish(false);
	};

	const handleRemoveWish = (id: string) => {
		dispatch(removeWish(id));
		dispatch(removeWishAsync(id));
	};

	const handleToggleCompleted = (id: string) => {
		const wish = wishes.find((w) => w.id === id);
		if (!wish) return;

		dispatch(toggleWishCompleted(id));
		dispatch(toggleWishCompletedAsync({ id, completed: !wish.completed }));
	};

	// Отображение содержимого в зависимости от статуса
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
			<WishItem
				key={wish.id}
				wish={wish}
				onToggleComplete={handleToggleCompleted}
				onRemove={handleRemoveWish}
			/>
		));
	}

	return (
		<>
			{!isAddingWish ? (
				<button
					className="add-wish-button"
					onClick={() => setIsAddingWish(true)}
				>
					+ Добавить новое желание
				</button>
			) : (
				<WishForm
					onSave={handleAddWish}
					onCancel={() => setIsAddingWish(false)}
				/>
			)}

			<div className="wishes-list">
				<h2>Ваши желания</h2>
				{content}
			</div>
		</>
	);
};

export default WishList;

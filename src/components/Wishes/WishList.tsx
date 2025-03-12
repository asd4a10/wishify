import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	fetchWishes,
	addWishAsync,
	removeWishAsync,
	toggleWishPurchasedAsync,
	addWish,
	removeWish,
	toggleWishPurchased,
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
	const handleAddWish = (
		title: string,
		description: string,
		price: number,
		targetDate: Date | null,
		productUrl: string,
		imageUrl: string
	) => {
		// Оптимистичное обновление UI
		// dispatch(
		// 	addWish(title, description, price, targetDate, productUrl, imageUrl)
		// );

		// Отправка запроса на сервер
		dispatch(
			addWishAsync({
				title,
				description,
				username: userId, // Теперь используем username вместо userId
				price,
				targetDate: targetDate || undefined,
				productUrl,
				imageUrl,
			})
		);

		// Скрываем форму
		setIsAddingWish(false);
	};

	const handleRemoveWish = (id: string) => {
		dispatch(removeWish(id));
		dispatch(removeWishAsync(id));
	};

	const handleTogglePurchased = (id: string) => {
		const wish = wishes.find((w) => w.id === id);
		if (!wish) return;

		dispatch(toggleWishPurchased(id));
		dispatch(toggleWishPurchasedAsync({ id, isPurchased: !wish.isPurchased }));
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
				onTogglePurchased={handleTogglePurchased}
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

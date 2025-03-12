import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	fetchWishes,
	addWishAsync,
	removeWishAsync,
	editWish,
	editWishAsync,
	removeWish,
	Wish,
} from "../../features/wishes/wishesSlice";
import WishItem from "./WishItem";
import WishDetails from "./WishDetails";
import WishFormModal from "./WishFormModal";

interface WishListProps {
	userId: string;
}

const WishList = ({ userId }: WishListProps) => {
	const [isAddingWish, setIsAddingWish] = useState(false);
	const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
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

	// Обработчики
	const handleAddWish = (
		title: string,
		description: string,
		price: number,
		targetDate: Date | null,
		productUrl: string,
		imageUrl: string
	) => {
		dispatch(
			addWishAsync({
				title,
				description,
				username: userId,
				price,
				targetDate: targetDate || undefined,
				productUrl,
				imageUrl,
			})
		);

		// Форма закроется автоматически внутри модального компонента
	};

	const handleRemoveWish = (id: string) => {
		dispatch(removeWish(id));
		dispatch(removeWishAsync(id));
	};

	const handleTogglePurchased = (id: string) => {
		const wish = wishes.find((w) => w.id === id);
		if (!wish) return;

		const isPurchased = !wish.isPurchased;

		// Используем новую функцию editWish
		dispatch(editWish({ id, changes: { isPurchased } }));
		dispatch(editWishAsync({ id, changes: { isPurchased } }));
	};

	const handleEditWish = (id: string, changes: Partial<Wish>) => {
		dispatch(editWish({ id, changes }));
		dispatch(editWishAsync({ id, changes }));
	};

	const handleOpenDetails = (wish: Wish) => {
		setSelectedWish(wish);
	};

	const handleCloseDetails = () => {
		setSelectedWish(null);
	};

	// Рендер содержимого
	let content;

	if (status === "loading" && wishes.length === 0) {
		content = (
			<div className="flex justify-center items-center h-40 text-primary">
				Загрузка...
			</div>
		);
	} else if (status === "failed") {
		content = (
			<div className="bg-danger/10 text-danger p-4 rounded-lg">{error}</div>
		);
	} else if (wishes.length === 0) {
		content = (
			<div className="text-center p-8 bg-gray-light rounded-lg">
				<p className="text-lg text-text-secondary">
					У вас пока нет желаний. Добавьте новое!
				</p>
			</div>
		);
	} else {
		content = (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{wishes.map((wish) => (
					<WishItem
						key={wish.id}
						wish={wish}
						onTogglePurchased={handleTogglePurchased}
						onRemove={handleRemoveWish}
						onOpenDetails={handleOpenDetails}
					/>
				))}
			</div>
		);
	}

	return (
		<>
			{/* Кнопка добавления */}
			<div className="mb-6">
				<button
					onClick={() => setIsAddingWish(true)}
					className="custom-btn btn-blue"
				>
					<span className="mr-2 text-xl">+</span>
					Добавить новое желание
				</button>
			</div>

			{/* Заголовок и фильтры */}
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-text-primary mb-2">
					Ваши желания
				</h2>
				{/* Здесь можно добавить фильтры */}
			</div>

			{/* Сетка желаний */}
			{content}

			{/* Модальное окно с деталями */}
			{selectedWish && (
				<WishDetails
					wish={selectedWish}
					onClose={handleCloseDetails}
					onTogglePurchased={handleTogglePurchased}
					onRemove={handleRemoveWish}
				/>
			)}

			{/* Модальное окно с формой добавления */}
			{isAddingWish && (
				<WishFormModal
					onSave={handleAddWish}
					onClose={() => setIsAddingWish(false)}
				/>
			)}
		</>
	);
};

export default WishList;

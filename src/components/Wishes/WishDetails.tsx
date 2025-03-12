import { Wish } from "../../features/wishes/wishesSlice";
import { useEffect, useRef } from "react";

// Используем те же цвета, что и в WishItem
const BACKGROUND_COLORS = [
	"bg-blue-500",
	"bg-purple-500",
	"bg-green-500",
	"bg-yellow-500",
	"bg-pink-500",
	"bg-indigo-500",
	"bg-red-500",
	"bg-teal-500",
	"bg-orange-500",
	"bg-cyan-500",
];

interface WishDetailsProps {
	wish: Wish;
	onClose: () => void;
	onTogglePurchased: (id: string) => void;
	onRemove: (id: string) => void;
}

const WishDetails = ({
	wish,
	onClose,
	onTogglePurchased,
	onRemove,
}: WishDetailsProps) => {
	// Ref для модального окна
	const modalRef = useRef<HTMLDivElement>(null);

	// Обработчик клика для закрытия при клике вне формы
	const handleBackdropClick = (e: React.MouseEvent) => {
		// Если клик произошел по фону (не по содержимому модального окна)
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	// Обработчик нажатия клавиши Escape
	useEffect(() => {
		const handleEscapeKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		// Добавляем обработчик при монтировании
		document.addEventListener("keydown", handleEscapeKey);

		// Убираем обработчик при размонтировании
		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [onClose]);

	// Форматирование цены
	const formattedPrice = wish.price
		? new Intl.NumberFormat("ru-RU", {
				style: "currency",
				currency: "KZT",
		  }).format(wish.price)
		: "";

	// Получаем уникальный цвет на основе id желания
	const getColorForWish = (wishId: string) => {
		const hashSum = wishId
			.split("")
			.reduce((sum, char) => sum + char.charCodeAt(0), 0);
		const colorIndex = hashSum % BACKGROUND_COLORS.length;
		return BACKGROUND_COLORS[colorIndex];
	};

	const hasImage = wish.imageUrl && wish.imageUrl.trim() !== "";
	const bgColorClass = hasImage ? "" : getColorForWish(wish.id);

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
		>
			<div
				ref={modalRef}
				className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
				// Предотвращаем всплытие события клика
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<h2
							className={`text-2xl font-bold ${
								wish.isPurchased
									? "line-through text-gray-dark"
									: "text-text-primary"
							}`}
						>
							{wish.title}
						</h2>
						<button
							onClick={onClose}
							className="text-2xl text-gray-dark hover:text-text-primary"
						>
							×
						</button>
					</div>

					{hasImage ? (
						<div className="mb-6">
							<img
								src={wish.imageUrl}
								alt={wish.title}
								className="w-full max-h-80 object-contain"
							/>
						</div>
					) : (
						<div
							className={`${bgColorClass} text-white rounded-lg p-12 mb-6 text-center`}
						>
							<span className="text-6xl block mb-4">★</span>
							<p className="text-xl font-medium">
								{wish.price > 0
									? `Примерная цена: ${formattedPrice}`
									: "Добавьте изображение для улучшения визуализации"}
							</p>
						</div>
					)}

					<div className="space-y-4">
						{wish.description && (
							<div>
								<h3 className="text-lg font-medium mb-1">Описание</h3>
								<p className="text-text-secondary">{wish.description}</p>
							</div>
						)}

						{wish.price > 0 && (
							<div>
								<h3 className="text-lg font-medium mb-1">Цена</h3>
								<p className="text-primary font-medium">{formattedPrice}</p>
							</div>
						)}

						{wish.targetDate && (
							<div>
								<h3 className="text-lg font-medium mb-1">Целевая дата</h3>
								<p>{wish.targetDate.toLocaleDateString()}</p>
							</div>
						)}

						{wish.productUrl && (
							<div>
								<h3 className="text-lg font-medium mb-1">Ссылка на товар</h3>
								<a
									href={wish.productUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-primary hover:underline"
								>
									Перейти на сайт
								</a>
							</div>
						)}

						<div>
							<p className="text-sm text-text-muted">
								Создано: {wish.createdAt.toLocaleDateString()}
							</p>
						</div>
					</div>

					<div className="flex gap-4 mt-8">
						<button
							onClick={() => onTogglePurchased(wish.id)}
							className={`custom-btn ${
								wish.isPurchased ? "btn-gray" : "btn-green"
							}`}
						>
							{wish.isPurchased ? "Вернуть" : "Купить"}
						</button>
						<button
							onClick={() => {
								onRemove(wish.id);
								onClose();
							}}
							className="custom-btn btn-red"
						>
							Удалить
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WishDetails;

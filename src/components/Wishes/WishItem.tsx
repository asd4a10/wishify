import { Wish } from "../../features/wishes/wishesSlice";

interface WishItemProps {
	wish: Wish;
	onTogglePurchased: (id: string) => void;
	onRemove: (id: string) => void;
}

const WishItem = ({ wish, onTogglePurchased, onRemove }: WishItemProps) => {
	// Форматирование цены
	const formattedPrice = wish.price
		? new Intl.NumberFormat("ru-RU", {
				style: "currency",
				currency: "KZT",
		  }).format(wish.price)
		: "";

	return (
		<div className={`wish-item ${wish.isPurchased ? "completed" : ""}`}>
			<div className="flex-1">
				<h3
					className={`text-lg font-semibold mb-2 ${
						wish.isPurchased
							? "text-gray-dark line-through"
							: "text-text-primary"
					}`}
				>
					{wish.title}
				</h3>
				{wish.description && (
					<p className="text-text-secondary mb-2">{wish.description}</p>
				)}

				{wish.price > 0 && (
					<p className="font-medium text-primary mb-1">{formattedPrice}</p>
				)}

				{wish.targetDate && (
					<p className="text-sm text-text-muted mb-1">
						Целевая дата: {wish.targetDate.toLocaleDateString()}
					</p>
				)}

				{wish.productUrl && (
					<a
						href={wish.productUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="text-primary hover:underline text-sm block mb-1"
					>
						Ссылка на товар
					</a>
				)}

				{wish.imageUrl && (
					<div className="mt-2 mb-2">
						<img
							src={wish.imageUrl}
							alt={wish.title}
							className="max-h-32 rounded object-contain"
						/>
					</div>
				)}

				<span className="text-xs text-text-muted block mt-2">
					Создано: {wish.createdAt.toLocaleDateString()}
				</span>
			</div>
			<div className="flex flex-col gap-2 ml-4">
				<button
					className={`btn ${
						wish.isPurchased ? "bg-gray-dark" : "btn-success"
					} text-sm`}
					onClick={() => onTogglePurchased(wish.id)}
				>
					{wish.isPurchased ? "Вернуть" : "Купить"}
				</button>
				<button
					className="btn btn-danger text-sm"
					onClick={() => onRemove(wish.id)}
				>
					Удалить
				</button>
			</div>
		</div>
	);
};

export default WishItem;

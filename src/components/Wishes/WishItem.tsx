import { Wish } from "../../features/wishes/wishesSlice";

// Массив цветов для карточек без изображений
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

interface WishItemProps {
	wish: Wish;
	onTogglePurchased: (id: string) => void;
	onRemove: (id: string) => void;
	onOpenDetails: (wish: Wish) => void;
}

const WishItem = ({
	wish,
	onTogglePurchased,
	onRemove,
	onOpenDetails,
}: WishItemProps) => {
	const hasImage = wish.imageUrl && wish.imageUrl.trim() !== "";

	// Получаем уникальный цвет на основе id желания
	const getColorForWish = (wishId: string) => {
		// Используем сумму кодов символов id как простой хеш
		const hashSum = wishId
			.split("")
			.reduce((sum, char) => sum + char.charCodeAt(0), 0);

		// Получаем индекс цвета из массива цветов
		const colorIndex = hashSum % BACKGROUND_COLORS.length;
		return BACKGROUND_COLORS[colorIndex];
	};

	// Получаем цвет для текущего элемента
	const bgColorClass = hasImage ? "" : getColorForWish(wish.id);

	return (
		<div
			className={`wish-card ${wish.isPurchased ? "opacity-60" : ""} ${
				hasImage ? "has-image" : "no-image"
			}`}
			onClick={() => onOpenDetails(wish)}
		>
			{hasImage ? (
				// Карточка с изображением
				<div className="relative h-full overflow-hidden rounded-lg shadow-md group">
					<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

					<img
						src={wish.imageUrl}
						alt={wish.title}
						className="w-full h-full object-cover"
					/>

					<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent z-20">
						<h3
							className={`text-white font-semibold text-lg ${
								wish.isPurchased ? "line-through" : ""
							}`}
						>
							{wish.title}
						</h3>
					</div>

					<div className="absolute top-2 right-2 flex flex-col gap-2 z-30">
						<button
							className="p-2 bg-white/80 hover:bg-green-100 rounded-full shadow-md transform transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-105 hover:scale-110 border-2 border-transparent hover:border-green-400"
							onClick={(e) => {
								e.stopPropagation();
								onTogglePurchased(wish.id);
							}}
							title={
								wish.isPurchased
									? "Отметить как непокупку"
									: "Отметить как купленное"
							}
						>
							{wish.isPurchased ? (
								<span className="text-gray-700 text-lg">↩</span>
							) : (
								<span className="text-green-500 text-lg">✓</span>
							)}
						</button>
						<button
							className="p-2 bg-white/80 hover:bg-red-100 rounded-full shadow-md transform transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-105 hover:scale-110 border-2 border-transparent hover:border-red-400"
							onClick={(e) => {
								e.stopPropagation();
								onRemove(wish.id);
							}}
							title="Удалить"
						>
							<span className="text-red-500 text-lg">×</span>
						</button>
					</div>
				</div>
			) : (
				// Карточка без изображения с цветным фоном
				<div
					className={`relative h-full ${bgColorClass} text-white rounded-lg shadow-md p-4 group hover:shadow-lg transition-transform hover:scale-[1.02]`}
				>
					<h3
						className={`font-semibold text-xl mb-2 ${
							wish.isPurchased ? "line-through opacity-70" : ""
						}`}
					>
						{wish.title}
					</h3>

					{/* Небольшая декоративная иконка */}
					<div className="absolute bottom-3 right-3 opacity-20 text-5xl">
						{wish.isPurchased ? "✓" : "★"}
					</div>

					<div className="absolute top-2 right-2 flex flex-col gap-2">
						<button
							className="p-2 bg-green-500/30 hover:bg-green-500/50 rounded-full shadow-md transform transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-105 hover:scale-110"
							onClick={(e) => {
								e.stopPropagation();
								onTogglePurchased(wish.id);
							}}
							title={
								wish.isPurchased
									? "Отметить как непокупку"
									: "Отметить как купленное"
							}
						>
							{wish.isPurchased ? (
								<span className="text-white text-lg">↩</span>
							) : (
								<span className="text-white text-lg">✓</span>
							)}
						</button>
						<button
							className="p-2 bg-red-500/30 hover:bg-red-500/50 rounded-full shadow-md transform transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:scale-105 hover:scale-110"
							onClick={(e) => {
								e.stopPropagation();
								onRemove(wish.id);
							}}
							title="Удалить"
						>
							<span className="text-white text-lg">×</span>
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default WishItem;

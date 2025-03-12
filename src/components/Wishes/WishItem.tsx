import { Wish } from "../../features/wishes/wishesSlice";

interface WishItemProps {
	wish: Wish;
	onToggleComplete: (id: string) => void;
	onRemove: (id: string) => void;
}

const WishItem = ({ wish, onToggleComplete, onRemove }: WishItemProps) => {
	return (
		<div className={`wish-item ${wish.completed ? "completed" : ""}`}>
			<div className="flex-1">
				<h3
					className={`text-lg font-semibold mb-2 ${
						wish.completed ? "text-gray-dark line-through" : "text-text-primary"
					}`}
				>
					{wish.title}
				</h3>
				{wish.description && (
					<p className="text-text-secondary mb-2">{wish.description}</p>
				)}
				<span className="text-xs text-text-muted">
					Создано: {wish.createdAt.toLocaleDateString()}
				</span>
			</div>
			<div className="flex flex-col gap-2 ml-4">
				<button
					className={`btn ${
						wish.completed ? "bg-gray-dark" : "btn-success"
					} text-sm`}
					onClick={() => onToggleComplete(wish.id)}
				>
					{wish.completed ? "Вернуть" : "Выполнить"}
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

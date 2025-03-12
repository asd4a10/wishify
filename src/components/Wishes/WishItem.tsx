import { Wish } from "../../features/wishes/wishesSlice";

interface WishItemProps {
	wish: Wish;
	onToggleComplete: (id: string) => void;
	onRemove: (id: string) => void;
}

const WishItem = ({ wish, onToggleComplete, onRemove }: WishItemProps) => {
	return (
		<div className={`wish-item ${wish.completed ? "completed" : ""}`}>
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
					onClick={() => onToggleComplete(wish.id)}
				>
					{wish.completed ? "Вернуть" : "Выполнить"}
				</button>
				<button className="remove-btn" onClick={() => onRemove(wish.id)}>
					Удалить
				</button>
			</div>
		</div>
	);
};

export default WishItem;

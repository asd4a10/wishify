import { useState } from "react";

interface WishFormProps {
	onSave: (title: string, description: string) => void;
	onCancel: () => void;
}

const WishForm = ({ onSave, onCancel }: WishFormProps) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleSubmit = () => {
		if (title.trim() === "") return;
		onSave(title, description);
		setTitle("");
		setDescription("");
	};

	return (
		<div className="add-wish-form">
			<h3>Новое желание</h3>
			<input
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Название вашего желания"
				autoFocus
			/>
			<textarea
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				placeholder="Описание (опционально)"
			/>
			<div className="form-buttons">
				<button onClick={handleSubmit} className="add-btn">
					Сохранить
				</button>
				<button onClick={onCancel} className="cancel-btn">
					Отмена
				</button>
			</div>
		</div>
	);
};

export default WishForm;

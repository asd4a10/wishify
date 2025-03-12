import { useState } from "react";

interface WishFormProps {
	onSave: (
		title: string,
		description: string,
		price: number,
		targetDate: Date | null,
		productUrl: string,
		imageUrl: string
	) => void;
	onCancel: () => void;
}

const WishForm = ({ onSave, onCancel }: WishFormProps) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [targetDate, setTargetDate] = useState("");
	const [productUrl, setProductUrl] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	const handleSubmit = () => {
		if (title.trim() === "") return;

		const priceValue = parseFloat(price) || 0;
		const dateValue = targetDate ? new Date(targetDate) : null;

		onSave(title, description, priceValue, dateValue, productUrl, imageUrl);

		// Сброс формы
		setTitle("");
		setDescription("");
		setPrice("");
		setTargetDate("");
		setProductUrl("");
		setImageUrl("");
	};

	return (
		<div className="bg-white p-6 rounded-lg shadow-md mb-6">
			<h3 className="text-xl font-semibold mb-4 text-text-primary">
				Новое желание
			</h3>

			<div className="grid gap-4">
				<div>
					<label className="block text-sm font-medium text-text-secondary mb-1">
						Название*
					</label>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Что вы хотите?"
						className="w-full p-2 border border-gray rounded-md"
						autoFocus
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text-secondary mb-1">
						Описание
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Опишите подробнее"
						className="w-full p-2 border border-gray rounded-md"
						rows={3}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text-secondary mb-1">
						Цена
					</label>
					<input
						type="number"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						placeholder="0"
						className="w-full p-2 border border-gray rounded-md"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text-secondary mb-1">
						Целевая дата
					</label>
					<input
						type="date"
						value={targetDate}
						onChange={(e) => setTargetDate(e.target.value)}
						className="w-full p-2 border border-gray rounded-md"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text-secondary mb-1">
						Ссылка на товар
					</label>
					<input
						type="url"
						value={productUrl}
						onChange={(e) => setProductUrl(e.target.value)}
						placeholder="https://..."
						className="w-full p-2 border border-gray rounded-md"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-text-secondary mb-1">
						URL изображения
					</label>
					<input
						type="url"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						placeholder="https://..."
						className="w-full p-2 border border-gray rounded-md"
					/>
				</div>
			</div>

			<div className="flex gap-3 mt-6">
				<button
					onClick={handleSubmit}
					className="btn btn-success px-5 py-2 font-medium"
				>
					Сохранить
				</button>
				<button
					onClick={onCancel}
					className="btn bg-gray hover:bg-gray-dark px-5 py-2 font-medium"
				>
					Отмена
				</button>
			</div>
		</div>
	);
};

export default WishForm;

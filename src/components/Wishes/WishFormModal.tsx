import { useState, useEffect, useRef } from "react";

interface WishFormModalProps {
	onSave: (
		title: string,
		description: string,
		price: number,
		targetDate: Date | null,
		productUrl: string,
		imageUrl: string
	) => void;
	onClose: () => void;
}

const WishFormModal = ({ onSave, onClose }: WishFormModalProps) => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [targetDate, setTargetDate] = useState("");
	const [productUrl, setProductUrl] = useState("");
	const [imageUrl, setImageUrl] = useState("");

	// Ref для модального окна
	const modalRef = useRef<HTMLDivElement>(null);

	// Обработчик клика для закрытия при клике вне формы
	const handleBackdropClick = (e: React.MouseEvent) => {
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

		document.addEventListener("keydown", handleEscapeKey);

		return () => {
			document.removeEventListener("keydown", handleEscapeKey);
		};
	}, [onClose]);

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

		// Закрытие модального окна
		onClose();
	};

	return (
		<div
			className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
			onClick={handleBackdropClick}
		>
			<div
				ref={modalRef}
				className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="p-6">
					<div className="flex justify-between items-start mb-4">
						<h2 className="text-2xl font-bold text-text-primary">
							Новое желание
						</h2>
						<button
							onClick={onClose}
							className="text-2xl text-gray-dark hover:text-text-primary"
						>
							×
						</button>
					</div>

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
							onClick={onClose}
							className="btn bg-gray hover:bg-gray-dark px-5 py-2 font-medium"
						>
							Отмена
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WishFormModal;

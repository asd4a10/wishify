import { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
	IconButton,
	Box,
	Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";

// Интерфейс для начальных данных
interface InitialWishData {
	title: string;
	description: string;
	price: number;
	targetDate: Date | null;
	productUrl: string;
	imageUrl: string;
}

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
	isEdit?: boolean; // Новое свойство для определения режима редактирования
	initialData?: InitialWishData; // Начальные данные для режима редактирования
}

const WishFormModal = ({
	onSave,
	onClose,
	isEdit = false,
	initialData = {
		title: "",
		description: "",
		price: 0,
		targetDate: null,
		productUrl: "",
		imageUrl: "",
	},
}: WishFormModalProps) => {
	// Используем initialData для начальных значений состояний
	const [title, setTitle] = useState(initialData.title);
	const [description, setDescription] = useState(initialData.description);
	const [price, setPrice] = useState(initialData.price);
	const [targetDate /* setTargetDate */] = useState<Date | null>(
		initialData.targetDate
	);
	const [productUrl, setProductUrl] = useState(initialData.productUrl);
	const [imageUrl, setImageUrl] = useState(initialData.imageUrl);

	const handleSave = () => {
		// Проверяем, что заголовок заполнен
		if (!title.trim()) {
			// Можно добавить состояние ошибки и показать пользователю
			return;
		}

		onSave(title, description, price, targetDate, productUrl, imageUrl);
		onClose();
	};

	return (
		<Dialog open onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Box display="flex" justifyContent="space-between" alignItems="center">
					{isEdit ? "Редактирование желания" : "Добавление нового желания"}
					<IconButton onClick={onClose}>
						<Close />
					</IconButton>
				</Box>
			</DialogTitle>

			<DialogContent>
				<Stack spacing={3} mt={2}>
					<TextField
						label="Название"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						fullWidth
						required
						autoFocus
					/>

					<TextField
						label="Описание"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						fullWidth
						multiline
						rows={4}
					/>

					<TextField
						label="Цена"
						value={price}
						onChange={(e) => {
							const value = parseFloat(e.target.value);
							setPrice(isNaN(value) ? 0 : value);
						}}
						type="number"
						fullWidth
					/>

					<TextField
						label="Ссылка на товар"
						value={productUrl}
						onChange={(e) => setProductUrl(e.target.value)}
						fullWidth
					/>

					<TextField
						label="Ссылка на изображение"
						value={imageUrl}
						onChange={(e) => setImageUrl(e.target.value)}
						fullWidth
						helperText="URL изображения товара (необязательно)"
					/>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Отмена</Button>
				<Button
					onClick={handleSave}
					variant="contained"
					color="primary"
					disabled={!title.trim()}
				>
					{isEdit ? "Сохранить" : "Добавить"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default WishFormModal;

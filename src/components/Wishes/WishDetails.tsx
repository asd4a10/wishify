import { useState, useEffect } from "react";
import { Wish } from "../../features/wishes/wishesSlice";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Box,
	Paper,
	Divider,
	Chip,
	IconButton,
	Tooltip,
	Fade,
	Zoom,
	CircularProgress,
} from "@mui/material";
import {
	Close,
	CheckCircle,
	RemoveCircle,
	Link as LinkIcon,
	Edit,
	DeleteOutline,
} from "@mui/icons-material";
import WishFormModal from "./WishFormModal"; // Импортируем компонент формы

interface WishDetailsProps {
	wish: Wish | null;
	open: boolean;
	onClose: () => void;
	onTogglePurchased: (id: string) => void;
	onEdit: (wish: Wish) => void;
	onRemove: (id: string) => void;
}

const WishDetails = ({
	wish,
	open,
	onClose,
	onTogglePurchased,
	onEdit,
	onRemove,
}: WishDetailsProps) => {
	const [isProcessing, setIsProcessing] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [localWish, setLocalWish] = useState<Wish | null>(null);

	// Обновляем локальную копию желания при изменении wish или при открытии/закрытии диалога
	useEffect(() => {
		if (wish) {
			setLocalWish(wish);
		}
	}, [wish, open]);

	// Сбрасываем состояния при закрытии модального окна
	useEffect(() => {
		if (!open) {
			setIsProcessing(false);
			setConfirmDelete(false);
			setIsEditing(false);
		}
	}, [open]);

	if (!localWish) return null;

	const handleTogglePurchased = () => {
		setIsProcessing(true);

		// Обновляем локальную копию для мгновенной обратной связи
		setLocalWish((prev) => {
			if (!prev) return null;
			return { ...prev, isPurchased: !prev.isPurchased };
		});

		// Добавляем небольшую задержку для отображения анимации
		setTimeout(() => {
			if (localWish) {
				onTogglePurchased(localWish.id);
			}
			setIsProcessing(false);
		}, 600);
	};

	const handleRemove = () => {
		if (confirmDelete) {
			onRemove(localWish.id);
			onClose();
		} else {
			setConfirmDelete(true);
		}
	};

	const handleCancelDelete = () => {
		setConfirmDelete(false);
	};

	const handleStartEditing = () => {
		setIsEditing(true);
	};

	const handleCancelEditing = () => {
		setIsEditing(false);
	};

	// Обработчик для сохранения отредактированного желания
	const handleSaveEdit = (
		title: string,
		description: string,
		price: number,
		targetDate: Date | null,
		productUrl: string,
		imageUrl: string
	) => {
		// Создаем обновленный объект желания
		const updatedWish: Wish = {
			...localWish,
			title,
			description,
			price,
			targetDate: targetDate || undefined,
			productUrl,
			imageUrl,
		};

		// Обновляем локальную копию для мгновенной обратной связи
		setLocalWish(updatedWish);

		// Отправляем обновленные данные
		onEdit(updatedWish);

		// Закрываем режим редактирования
		setIsEditing(false);
	};

	// Обновленная функция форматирования цены, которая игнорирует нулевые значения
	const formattedPrice =
		// Проверяем что цена существует, не равна null/undefined и строго больше нуля
		localWish.price !== undefined &&
		localWish.price !== null &&
		localWish.price > 0
			? new Intl.NumberFormat("ru-RU", {
					style: "currency",
					currency: "KZT",
			  }).format(localWish.price)
			: "";

	const hasImage = localWish.imageUrl && localWish.imageUrl.trim() !== "";

	// Если активен режим редактирования, показываем форму WishFormModal
	if (isEditing) {
		return (
			<WishFormModal
				isEdit={true}
				initialData={{
					title: localWish.title,
					description: localWish.description || "",
					price: localWish.price || 0,
					targetDate: localWish.targetDate
						? new Date(localWish.targetDate)
						: null,
					productUrl: localWish.productUrl || "",
					imageUrl: localWish.imageUrl || "",
				}}
				onSave={handleSaveEdit}
				onClose={handleCancelEditing}
			/>
		);
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth="md"
			fullWidth
			TransitionComponent={Zoom}
			transitionDuration={300}
		>
			<Box
				sx={{
					position: "relative",
					borderTop: localWish.isPurchased ? "6px solid #4caf50" : "none",
					transition: "all 0.3s ease",
				}}
			>
				{localWish.isPurchased && (
					<Fade in={localWish.isPurchased}>
						<Chip
							label="У вас уже есть"
							color="success"
							size="small"
							icon={<CheckCircle fontSize="small" />}
							sx={{
								position: "absolute",
								top: 16,
								right: 60,
								fontWeight: "bold",
							}}
						/>
					</Fade>
				)}

				<DialogTitle>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<Typography
							variant="h5"
							component="div"
							sx={{
								textDecoration: localWish.isPurchased ? "line-through" : "none",
								opacity: localWish.isPurchased ? 0.7 : 1,
								transition: "all 0.3s ease",
							}}
						>
							{localWish.title}
						</Typography>
						<IconButton onClick={onClose} size="small">
							<Close />
						</IconButton>
					</Box>
				</DialogTitle>

				<Divider />

				<DialogContent>
					<Box
						display="flex"
						flexDirection={{ xs: "column", sm: "row" }}
						gap={3}
					>
						{hasImage && (
							<Box
								component="img"
								src={localWish.imageUrl}
								alt={localWish.title}
								sx={{
									width: { xs: "100%", sm: 200 },
									height: { xs: 200, sm: 200 },
									objectFit: "cover",
									borderRadius: 2,
									opacity: localWish.isPurchased ? 0.7 : 1,
									transition: "opacity 0.3s ease",
									filter: localWish.isPurchased ? "grayscale(50%)" : "none",
								}}
							/>
						)}

						<Box flex={1}>
							{localWish.description && (
								<Typography
									variant="body1"
									gutterBottom
									sx={{
										opacity: localWish.isPurchased ? 0.7 : 1,
										transition: "opacity 0.3s ease",
									}}
								>
									{localWish.description}
								</Typography>
							)}

							{/* Блок с ценой - показываем только если цена определена и строго больше нуля */}
							{localWish.price !== undefined &&
								localWish.price !== null &&
								localWish.price > 0 && (
									<Paper
										elevation={0}
										sx={{
											p: 2,
											bgcolor: "background.paper",
											mt: 2,
											borderRadius: 2,
										}}
									>
										<Typography variant="subtitle2" color="text.secondary">
											Примерная цена:
										</Typography>
										<Typography variant="h6" color="primary">
											{formattedPrice}
										</Typography>
									</Paper>
								)}

							{localWish.productUrl && (
								<Box mt={2}>
									<Button
										variant="outlined"
										startIcon={<LinkIcon />}
										href={localWish.productUrl}
										target="_blank"
										rel="noopener noreferrer"
										fullWidth
									>
										Перейти на сайт
									</Button>
								</Box>
							)}
						</Box>
					</Box>
				</DialogContent>

				<Divider />

				<DialogActions sx={{ p: 2, justifyContent: "space-between" }}>
					<Box>
						<Tooltip title="Редактировать">
							<IconButton
								onClick={handleStartEditing}
								color="primary"
								sx={{ mr: 1 }}
							>
								<Edit />
							</IconButton>
						</Tooltip>

						<Tooltip title={confirmDelete ? "Подтвердите удаление" : "Удалить"}>
							<IconButton
								onClick={handleRemove}
								color={confirmDelete ? "error" : "default"}
								sx={{
									transition: "all 0.2s ease",
									animation: confirmDelete ? "pulse 1.5s infinite" : "none",
									"@keyframes pulse": {
										"0%": { transform: "scale(1)" },
										"50%": { transform: "scale(1.1)" },
										"100%": { transform: "scale(1)" },
									},
								}}
							>
								<DeleteOutline />
							</IconButton>
						</Tooltip>

						{confirmDelete && (
							<Button onClick={handleCancelDelete} size="small" sx={{ ml: 1 }}>
								Отмена
							</Button>
						)}
					</Box>

					<Button
						variant={localWish.isPurchased ? "outlined" : "contained"}
						color={localWish.isPurchased ? "warning" : "success"}
						onClick={handleTogglePurchased}
						startIcon={
							isProcessing ? (
								<CircularProgress size={20} color="inherit" />
							) : localWish.isPurchased ? (
								<RemoveCircle />
							) : (
								<CheckCircle />
							)
						}
						disabled={isProcessing}
					>
						{localWish.isPurchased
							? "Отметить как желаемое"
							: "У меня это уже есть"}
					</Button>
				</DialogActions>
			</Box>
		</Dialog>
	);
};

export default WishDetails;

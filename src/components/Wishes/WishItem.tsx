import { Wish } from "../../features/wishes/wishesSlice";
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	Box,
	IconButton,
	Tooltip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from "@mui/material";
import { Check, Undo, Delete } from "@mui/icons-material";
import { useState } from "react";

// Массив цветов для карточек без изображений
const BACKGROUND_COLORS = [
	"#3f51b5", // blue
	"#9c27b0", // purple
	"#4caf50", // green
	"#ffc107", // yellow
	"#e91e63", // pink
	"#3f51b5", // indigo
	"#f44336", // red
	"#009688", // teal
	"#ff9800", // orange
	"#00bcd4", // cyan
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
	const [confirmOpen, setConfirmOpen] = useState(false);
	const hasImage = wish.imageUrl && wish.imageUrl.trim() !== "";

	// Получаем уникальный цвет на основе id желания
	const getColorForWish = (wishId: string) => {
		const hashSum = wishId
			.split("")
			.reduce((sum, char) => sum + char.charCodeAt(0), 0);
		const colorIndex = hashSum % BACKGROUND_COLORS.length;
		return BACKGROUND_COLORS[colorIndex];
	};

	// Получаем цвет для текущего элемента
	const bgColor = hasImage ? undefined : getColorForWish(wish.id);

	// Обработчики для диалога подтверждения
	const handleDeleteClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setConfirmOpen(true);
	};

	const handleConfirmDelete = () => {
		onRemove(wish.id);
		setConfirmOpen(false);
	};

	const handleCancelDelete = () => {
		setConfirmOpen(false);
	};

	const handleTogglePurchased = (e: React.MouseEvent) => {
		e.stopPropagation();
		onTogglePurchased(wish.id);
	};

	return (
		<>
			<Card
				sx={{
					height: "100%",
					position: "relative",
					bgcolor: bgColor,
					opacity: wish.isPurchased ? 0.6 : 1,
					transition: "transform 0.2s, box-shadow 0.2s",
					"&:hover": {
						transform: "scale(1.02)",
						boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
					},
				}}
				onClick={() => onOpenDetails(wish)}
			>
				{hasImage ? (
					<>
						<CardMedia
							component="img"
							height="140"
							image={wish.imageUrl}
							alt={wish.title}
						/>
						<Box
							sx={{
								position: "absolute",
								bottom: 0,
								left: 0,
								right: 0,
								background:
									"linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
								padding: 2,
							}}
						>
							<Typography
								variant="h6"
								component="div"
								color="white"
								sx={{
									textDecoration: wish.isPurchased ? "line-through" : "none",
								}}
							>
								{wish.title}
							</Typography>
						</Box>
					</>
				) : (
					<CardContent>
						<Typography
							variant="h6"
							component="div"
							color={hasImage ? "inherit" : "white"}
							sx={{
								textDecoration: wish.isPurchased ? "line-through" : "none",
								opacity: wish.isPurchased ? 0.7 : 1,
							}}
						>
							{wish.title}
						</Typography>
						<Box
							sx={{
								position: "absolute",
								bottom: 2,
								right: 2,
								opacity: 0.2,
								fontSize: "3rem",
							}}
						>
							{wish.isPurchased ? "✓" : "★"}
						</Box>
					</CardContent>
				)}

				<Box
					sx={{
						position: "absolute",
						top: 8,
						right: 8,
						display: "flex",
						flexDirection: "column",
						gap: 1,
						opacity: 0,
						transition: "0.2s",
						"&:hover": {
							opacity: 1,
						},
						".MuiCard-root:hover &": {
							opacity: 1,
						},
					}}
				>
					<Tooltip
						title={
							wish.isPurchased
								? "Отметить как непокупку"
								: "Отметить как купленное"
						}
					>
						<IconButton
							size="small"
							onClick={handleTogglePurchased}
							sx={{
								bgcolor: "background.paper",
								color: wish.isPurchased ? "text.secondary" : "success.main",
								"&:hover": {
									bgcolor: wish.isPurchased ? "action.hover" : "success.light",
									color: wish.isPurchased ? "text.primary" : "white",
								},
							}}
						>
							{wish.isPurchased ? (
								<Undo fontSize="small" />
							) : (
								<Check fontSize="small" />
							)}
						</IconButton>
					</Tooltip>
					<Tooltip title="Удалить">
						<IconButton
							size="small"
							onClick={handleDeleteClick}
							sx={{
								bgcolor: "background.paper",
								color: "error.main",
								"&:hover": {
									bgcolor: "error.light",
									color: "white",
								},
							}}
						>
							<Delete fontSize="small" />
						</IconButton>
					</Tooltip>
				</Box>
			</Card>

			{/* Диалог подтверждения удаления */}
			<Dialog open={confirmOpen} onClose={handleCancelDelete}>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogContent>
					Вы уверены, что хотите удалить желание "{wish.title}"?
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCancelDelete} color="primary">
						Отмена
					</Button>
					<Button
						onClick={handleConfirmDelete}
						color="error"
						variant="contained"
					>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default WishItem;

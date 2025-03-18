import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	CardMedia,
	Button,
	Container,
	Paper,
	Fade,
} from "@mui/material";

// Типы наставников
export type MentorType = "friend" | "warrior" | "strategist";

// Интерфейс для наставника
interface Mentor {
	id: MentorType;
	name: string;
	description: string;
	imageUrl: string;
	qualities: string[];
	motivation: string;
}

// Данные о наставниках
const mentors: Mentor[] = [
	{
		id: "friend",
		name: "Дружелюбный наставник",
		description:
			"Поддерживающий и мотивирующий друг, который всегда рядом, чтобы помочь вам в достижении ваших целей.",
		imageUrl:
			"https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-jacket_1142-32498.jpg?w=996&t=st=1700924558~exp=1700925158~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
		qualities: ["Поддерживающий", "Терпеливый", "Понимающий", "Мотивирующий"],
		motivation: "Я верю в тебя! Мы вместе достигнем твоих целей!",
	},
	{
		id: "warrior",
		name: "Воин-одиночка",
		description:
			"Бескомпромиссный и целеустремленный наставник, который поможет вам преодолеть любые трудности на пути к успеху.",
		imageUrl:
			"https://img.freepik.com/free-photo/3d-illustration-cartoon-muscular-character-with-beard-glasses_1142-41887.jpg?w=996&t=st=1700924668~exp=1700925268~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
		qualities: [
			"Дисциплинированный",
			"Решительный",
			"Бескомпромиссный",
			"Сильный",
		],
		motivation: "Преодолей себя! Каждый шаг - это победа над слабостью!",
	},
	{
		id: "strategist",
		name: "Стратег",
		description:
			"Аналитический и методичный наставник, который поможет вам разработать оптимальный план достижения ваших целей.",
		imageUrl:
			"https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-bow-tie_1142-32490.jpg?w=996&t=st=1700924758~exp=1700925358~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
		qualities: [
			"Аналитический",
			"Методичный",
			"Организованный",
			"Рациональный",
		],
		motivation:
			"Правильная стратегия - залог успеха. Давай разберем твои цели шаг за шагом.",
	},
];

const MentorSelectionPage = () => {
	const [selectedMentor, setSelectedMentor] = useState<MentorType | null>(null);
	const navigate = useNavigate();

	const handleSelectMentor = (mentorId: MentorType) => {
		setSelectedMentor(mentorId);
	};

	const handleConfirm = () => {
		if (selectedMentor) {
			// Сохраняем выбор наставника в localStorage
			localStorage.setItem("selectedMentor", selectedMentor);
			// Переходим на страницу трекера целей
			navigate("/goal-tracker");
		}
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box textAlign="center" mb={6}>
				<Typography variant="h3" component="h1" gutterBottom>
					Выберите своего наставника
				</Typography>
				<Typography variant="h6" color="text.secondary">
					Каждый наставник имеет свой уникальный стиль мотивации и поддержки
				</Typography>
			</Box>

			<Grid container spacing={4} justifyContent="center">
				{mentors.map((mentor) => (
					<Grid item xs={12} md={4} key={mentor.id}>
						<Card
							sx={{
								height: "100%",
								display: "flex",
								flexDirection: "column",
								cursor: "pointer",
								transition: "transform 0.2s, box-shadow 0.2s",
								transform:
									selectedMentor === mentor.id ? "scale(1.03)" : "scale(1)",
								boxShadow:
									selectedMentor === mentor.id
										? "0 8px 24px rgba(0,0,0,0.15)"
										: "",
								border: selectedMentor === mentor.id ? "2px solid #3f51b5" : "",
							}}
							onClick={() => handleSelectMentor(mentor.id)}
						>
							<CardMedia
								component="img"
								height="240"
								image={mentor.imageUrl}
								alt={mentor.name}
							/>
							<CardContent sx={{ flexGrow: 1 }}>
								<Typography gutterBottom variant="h5" component="div">
									{mentor.name}
								</Typography>
								<Typography variant="body2" color="text.secondary" paragraph>
									{mentor.description}
								</Typography>
								<Paper
									elevation={0}
									sx={{ p: 2, bgcolor: "background.default", mt: 2 }}
								>
									<Typography
										variant="subtitle2"
										color="text.primary"
										gutterBottom
									>
										Качества:
									</Typography>
									<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
										{mentor.qualities.map((quality, index) => (
											<Box
												key={index}
												sx={{
													px: 1.5,
													py: 0.5,
													bgcolor: "primary.light",
													color: "white",
													borderRadius: 4,
													fontSize: "0.8rem",
												}}
											>
												{quality}
											</Box>
										))}
									</Box>
								</Paper>
								<Box
									mt={2}
									p={2}
									bgcolor="background.paper"
									borderRadius={1}
									sx={{ fontStyle: "italic" }}
								>
									<Typography variant="body2" color="text.primary">
										"{mentor.motivation}"
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			<Box textAlign="center" mt={6}>
				<Button
					variant="contained"
					size="large"
					onClick={handleConfirm}
					disabled={!selectedMentor}
					sx={{
						px: 4,
						py: 1.5,
						fontSize: "1.1rem",
					}}
				>
					Подтвердить выбор
				</Button>
			</Box>
		</Container>
	);
};

export default MentorSelectionPage;

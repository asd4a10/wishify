import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Container,
	Typography,
	Button,
	List,
	ListItem,
	ListItemText,
	Paper,
	TextField,
	Grid,
	Chip,
	IconButton,
	Avatar,
	LinearProgress,
	Divider,
	Card,
	CardContent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	FormHelperText,
} from "@mui/material";
import {
	Add as AddIcon,
	Delete as DeleteIcon,
	Edit as EditIcon,
	Check as CheckIcon,
	EmojiEvents as TrophyIcon,
	Refresh as RefreshIcon,
} from "@mui/icons-material";
import { MentorType } from "./MentorSelectionPage";

// Интерфейс для цели
interface Goal {
	id: string;
	title: string;
	description: string;
	dueDate?: Date;
	steps: {
		id: string;
		title: string;
		completed: boolean;
	}[];
	category: string;
	priority: "low" | "medium" | "high";
	completed: boolean;
	progress: number;
}

// Интерфейс для каждого типа наставника
interface MentorFeedback {
	greeting: string;
	encouragement: string[];
	completion: string[];
	newGoal: string[];
	progress: string[];
	noProgress: string[];
}

// Словарь сообщений для разных типов наставников
const mentorFeedbacks: Record<MentorType, MentorFeedback> = {
	friend: {
		greeting: "Привет! Я рад, что мы вместе работаем над твоими целями!",
		encouragement: [
			"Ты молодец! Продолжай в том же духе!",
			"Я верю в тебя! Ты сможешь достичь всего, что задумал.",
			"Каждый шаг имеет значение. Ты делаешь отличную работу!",
		],
		completion: [
			"Ура! Ты справился с задачей! Это потрясающе!",
			"Какой замечательный успех! Ты должен гордиться собой!",
			"Отличная работа! Ты всегда достигаешь поставленных целей!",
		],
		newGoal: [
			"Это отличная новая цель! Давай вместе добьемся успеха!",
			"Здорово, что ты ставишь новые цели! Я помогу тебе их достичь.",
			"Это амбициозная цель, но я уверен, что вместе мы справимся!",
		],
		progress: [
			"Ты делаешь успехи! Продолжай в том же духе!",
			"Я вижу прогресс! Ты двигаешься в правильном направлении.",
			"Каждый шаг приближает тебя к цели. Молодец!",
		],
		noProgress: [
			"Не волнуйся, если прогресс не такой быстрый, как хотелось бы. Главное - не сдаваться!",
			"Бывают сложные периоды, но я верю, что ты преодолеешь их.",
			"Иногда нужно сделать шаг назад, чтобы потом сделать два вперед. Не опускай руки!",
		],
	},
	warrior: {
		greeting: "Готов к бою? Пора покорять новые вершины!",
		encouragement: [
			"Преодолей себя! Только так достигается настоящий успех!",
			"Сила воли - твое главное оружие. Используй его!",
			"Нет ничего невозможного для того, кто не сдается!",
		],
		completion: [
			"Миссия выполнена! Но расслабляться рано, впереди новые вызовы!",
			"Победа! Но это только начало пути к величию!",
			"Задача выполнена! Теперь готовься к следующему испытанию!",
		],
		newGoal: [
			"Новая цель - новый вызов! Покажи, на что ты способен!",
			"Эта цель достойна воина! Бросаю тебе вызов!",
			"Вижу, ты не боишься трудностей! Эта цель закалит твой характер!",
		],
		progress: [
			"Продвижение есть, но не время расслабляться! Впереди еще много работы!",
			"Ты на верном пути, воин! Продолжай атаковать!",
			"Прогресс заметен! Теперь удвой усилия!",
		],
		noProgress: [
			"Застой - это поражение! Соберись и продолжай бой!",
			"Трудности делают нас сильнее! Преодолей эту преграду!",
			"Нет времени на жалость к себе! Вставай и продолжай двигаться вперед!",
		],
	},
	strategist: {
		greeting:
			"Приветствую! Давайте разработаем оптимальную стратегию для достижения ваших целей.",
		encouragement: [
			"Анализ показывает, что вы на верном пути. Продолжайте следовать плану.",
			"Ваш подход логичен и эффективен. Результаты не заставят себя ждать.",
			"Согласно статистике, последовательность действий приводит к успеху в 87% случаев. Продолжайте.",
		],
		completion: [
			"Цель достигнута! Это доказывает эффективность нашей стратегии.",
			"Задача выполнена в соответствии с планом. Отличный результат!",
			"Анализ завершенной цели показывает правильность выбранного подхода. Поздравляю с успешным завершением!",
		],
		newGoal: [
			"Интересная задача. Давайте разобьем ее на логические этапы и составим план действий.",
			"Новая цель требует тщательного анализа. Предлагаю начать с определения ключевых показателей успеха.",
			"Эта цель вписывается в общую стратегию вашего развития. Давайте интегрируем ее в существующий план.",
		],
		progress: [
			"Прогресс соответствует расчетным показателям. Продолжайте выполнение плана.",
			"Анализ текущего прогресса показывает, что мы движемся к цели с оптимальной скоростью.",
			"Ваши действия логичны и последовательны. Это ключевые факторы прогресса.",
		],
		noProgress: [
			"Обнаружена стагнация. Предлагаю пересмотреть стратегию и внести корректировки.",
			"Отсутствие прогресса - это информация, которую мы можем использовать для оптимизации плана.",
			"Проведем анализ причин замедления и разработаем альтернативные подходы.",
		],
	},
};

// Изображения для наставников
const mentorImages: Record<MentorType, string> = {
	friend:
		"https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-jacket_1142-32498.jpg?w=996&t=st=1700924558~exp=1700925158~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
	warrior:
		"https://img.freepik.com/free-photo/3d-illustration-cartoon-muscular-character-with-beard-glasses_1142-41887.jpg?w=996&t=st=1700924668~exp=1700925268~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
	strategist:
		"https://img.freepik.com/free-photo/3d-illustration-cartoon-character-with-glasses-bow-tie_1142-32490.jpg?w=996&t=st=1700924758~exp=1700925358~hmac=6f3f7f3b9f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f3f",
};

const initialGoals: Goal[] = [
	{
		id: "goal-1",
		title: "Выучить React и TypeScript",
		description:
			"Освоить основы React и TypeScript для создания современных веб-приложений",
		steps: [
			{ id: "step-1-1", title: "Изучить основы React", completed: true },
			{ id: "step-1-2", title: "Изучить основы TypeScript", completed: false },
			{ id: "step-1-3", title: "Создать простое приложение", completed: false },
		],
		category: "Обучение",
		priority: "high",
		completed: false,
		progress: 33,
	},
	{
		id: "goal-2",
		title: "Заниматься спортом регулярно",
		description:
			"Установить регулярный режим тренировок для улучшения физической формы",
		steps: [
			{ id: "step-2-1", title: "Составить план тренировок", completed: true },
			{ id: "step-2-2", title: "Заниматься 3 раза в неделю", completed: false },
		],
		category: "Здоровье",
		priority: "medium",
		completed: false,
		progress: 50,
	},
];

const GoalTrackerPage = () => {
	const navigate = useNavigate();
	const [goals, setGoals] = useState<Goal[]>([]);
	const [openDialog, setOpenDialog] = useState(false);
	const [newGoal, setNewGoal] = useState<Partial<Goal>>({
		title: "",
		description: "",
		category: "",
		priority: "medium",
		steps: [],
	});
	const [newStep, setNewStep] = useState("");
	const [editMode, setEditMode] = useState(false);
	const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
	const [mentorType, setMentorType] = useState<MentorType>("friend");
	const [mentorMessage, setMentorMessage] = useState("");

	// Получаем тип наставника из localStorage при загрузке компонента
	useEffect(() => {
		const savedMentor = localStorage.getItem(
			"selectedMentor"
		) as MentorType | null;

		if (!savedMentor) {
			// Если наставник не выбран, перенаправляем на страницу выбора
			navigate("/select-mentor");
			return;
		}

		setMentorType(savedMentor);
		setMentorMessage(mentorFeedbacks[savedMentor].greeting);

		// Загружаем сохраненные цели из localStorage или используем начальные данные
		const savedGoals = localStorage.getItem("goals");
		if (savedGoals) {
			setGoals(JSON.parse(savedGoals));
		} else {
			setGoals(initialGoals);
		}
	}, [navigate]);

	// Сохраняем цели в localStorage при их изменении
	useEffect(() => {
		if (goals.length > 0) {
			localStorage.setItem("goals", JSON.stringify(goals));
		}
	}, [goals]);

	// Обработчик для добавления новой цели
	const handleAddGoal = () => {
		setOpenDialog(true);
		setEditMode(false);
		setNewGoal({
			title: "",
			description: "",
			category: "",
			priority: "medium",
			steps: [],
		});
		setNewStep("");
	};

	// Обработчик для добавления нового шага
	const handleAddStep = () => {
		if (newStep.trim()) {
			setNewGoal({
				...newGoal,
				steps: [
					...(newGoal.steps || []),
					{
						id: `step-${Date.now()}`,
						title: newStep,
						completed: false,
					},
				],
			});
			setNewStep("");
		}
	};

	// Обработчик для удаления шага
	const handleRemoveStep = (stepId: string) => {
		setNewGoal({
			...newGoal,
			steps: (newGoal.steps || []).filter((step) => step.id !== stepId),
		});
	};

	// Обработчик для сохранения цели
	const handleSaveGoal = () => {
		if (!newGoal.title) return;

		if (editMode && currentGoalId) {
			// Редактирование существующей цели
			const updatedGoals = goals.map((goal) =>
				goal.id === currentGoalId
					? {
							...goal,
							title: newGoal.title || goal.title,
							description: newGoal.description || goal.description,
							category: newGoal.category || goal.category,
							priority: newGoal.priority || goal.priority,
							steps: newGoal.steps || goal.steps,
							progress: calculateProgress(newGoal.steps || []),
					  }
					: goal
			);
			setGoals(updatedGoals);

			// Показываем сообщение от наставника о прогрессе
			const randomIndex = Math.floor(
				Math.random() * mentorFeedbacks[mentorType].progress.length
			);
			setMentorMessage(mentorFeedbacks[mentorType].progress[randomIndex]);
		} else {
			// Создание новой цели
			const newGoalComplete: Goal = {
				id: `goal-${Date.now()}`,
				title: newGoal.title || "",
				description: newGoal.description || "",
				category: newGoal.category || "Другое",
				priority: (newGoal.priority as "low" | "medium" | "high") || "medium",
				steps: newGoal.steps || [],
				completed: false,
				progress: calculateProgress(newGoal.steps || []),
			};

			setGoals([...goals, newGoalComplete]);

			// Показываем сообщение от наставника о новой цели
			const randomIndex = Math.floor(
				Math.random() * mentorFeedbacks[mentorType].newGoal.length
			);
			setMentorMessage(mentorFeedbacks[mentorType].newGoal[randomIndex]);
		}

		setOpenDialog(false);
	};

	// Обработчик для редактирования цели
	const handleEditGoal = (goal: Goal) => {
		setCurrentGoalId(goal.id);
		setNewGoal({
			title: goal.title,
			description: goal.description,
			category: goal.category,
			priority: goal.priority,
			steps: [...goal.steps],
		});
		setEditMode(true);
		setOpenDialog(true);
	};

	// Обработчик для удаления цели
	const handleDeleteGoal = (goalId: string) => {
		setGoals(goals.filter((goal) => goal.id !== goalId));
	};

	// Обработчик для изменения статуса шага
	const handleToggleStep = (goalId: string, stepId: string) => {
		const updatedGoals = goals.map((goal) => {
			if (goal.id === goalId) {
				const updatedSteps = goal.steps.map((step) =>
					step.id === stepId ? { ...step, completed: !step.completed } : step
				);
				const progress = calculateProgress(updatedSteps);
				const completed = progress === 100;

				return { ...goal, steps: updatedSteps, progress, completed };
			}
			return goal;
		});

		setGoals(updatedGoals);

		// Определяем, был ли завершен шаг или отменен
		const goal = goals.find((g) => g.id === goalId);
		const step = goal?.steps.find((s) => s.id === stepId);
		const isCompleting = step ? !step.completed : false;

		// Если цель была завершена полностью
		const updatedGoal = updatedGoals.find((g) => g.id === goalId);
		if (updatedGoal?.completed) {
			const randomIndex = Math.floor(
				Math.random() * mentorFeedbacks[mentorType].completion.length
			);
			setMentorMessage(mentorFeedbacks[mentorType].completion[randomIndex]);
		} else if (isCompleting) {
			// Если был отмечен шаг как выполненный
			const randomIndex = Math.floor(
				Math.random() * mentorFeedbacks[mentorType].progress.length
			);
			setMentorMessage(mentorFeedbacks[mentorType].progress[randomIndex]);
		}
	};

	// Функция для расчета процента выполнения
	const calculateProgress = (steps: { completed: boolean }[]) => {
		if (steps.length === 0) return 0;
		const completedSteps = steps.filter((step) => step.completed).length;
		return Math.round((completedSteps / steps.length) * 100);
	};

	// Обработчик для получения случайного мотивационного сообщения
	const handleGetMotivation = () => {
		const randomIndex = Math.floor(
			Math.random() * mentorFeedbacks[mentorType].encouragement.length
		);
		setMentorMessage(mentorFeedbacks[mentorType].encouragement[randomIndex]);
	};

	// Обработчик для смены наставника
	const handleChangeMentor = () => {
		navigate("/select-mentor");
	};

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				mb={4}
			>
				<Typography variant="h4" component="h1">
					Трекер целей
				</Typography>

				<Button
					variant="contained"
					startIcon={<AddIcon />}
					onClick={handleAddGoal}
				>
					Добавить цель
				</Button>
			</Box>

			{/* Карточка наставника с сообщением */}
			<Card sx={{ mb: 4, bgcolor: "primary.main", color: "white" }}>
				<CardContent>
					<Grid container spacing={2} alignItems="center">
						<Grid item xs={12} sm={2} sx={{ textAlign: "center" }}>
							<Avatar
								src={mentorImages[mentorType]}
								sx={{
									width: 80,
									height: 80,
									mx: "auto",
									border: "2px solid white",
								}}
							/>
							<Typography variant="subtitle1" sx={{ mt: 1 }}>
								{mentorType === "friend"
									? "Друг"
									: mentorType === "warrior"
									? "Воин"
									: "Стратег"}
							</Typography>
							<Box display="flex" justifyContent="center" mt={1}>
								<Button
									variant="outlined"
									color="inherit"
									size="small"
									onClick={handleChangeMentor}
									sx={{
										borderColor: "white",
										"&:hover": {
											borderColor: "white",
											bgcolor: "rgba(255,255,255,0.1)",
										},
									}}
								>
									Сменить
								</Button>
							</Box>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Paper
								sx={{
									p: 2,
									bgcolor: "rgba(255,255,255,0.9)",
									color: "text.primary",
									borderRadius: 2,
								}}
							>
								<Typography variant="body1" sx={{ fontStyle: "italic", mb: 1 }}>
									{mentorMessage}
								</Typography>
							</Paper>
						</Grid>
						<Grid item xs={12} sm={2}>
							<Button
								variant="contained"
								fullWidth
								onClick={handleGetMotivation}
								sx={{
									bgcolor: "white",
									color: "primary.main",
									"&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
								}}
							>
								Мотивация
							</Button>
						</Grid>
					</Grid>
				</CardContent>
			</Card>

			{/* Секция "В процессе" */}
			<Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
				В процессе
			</Typography>
			<Grid container spacing={3}>
				{goals.filter((goal) => !goal.completed).length === 0 ? (
					<Grid item xs={12}>
						<Paper
							sx={{ p: 3, textAlign: "center", bgcolor: "background.default" }}
						>
							<Typography color="text.secondary">
								У вас нет активных целей. Добавьте новую цель, чтобы начать!
							</Typography>
						</Paper>
					</Grid>
				) : (
					goals
						.filter((goal) => !goal.completed)
						.map((goal) => (
							<Grid item xs={12} md={6} key={goal.id}>
								<Paper sx={{ p: 3, height: "100%", position: "relative" }}>
									<Box
										sx={{
											display: "flex",
											justifyContent: "space-between",
											mb: 2,
										}}
									>
										<Typography variant="h6" sx={{ pr: 6 }}>
											{goal.title}
										</Typography>
										<Box>
											<IconButton
												size="small"
												onClick={() => handleEditGoal(goal)}
											>
												<EditIcon />
											</IconButton>
											<IconButton
												size="small"
												color="error"
												onClick={() => handleDeleteGoal(goal.id)}
											>
												<DeleteIcon />
											</IconButton>
										</Box>
									</Box>

									<Chip
										label={goal.category}
										size="small"
										sx={{ mb: 2, bgcolor: "primary.light", color: "white" }}
									/>

									<Chip
										label={
											goal.priority === "high"
												? "Высокий приоритет"
												: goal.priority === "medium"
												? "Средний приоритет"
												: "Низкий приоритет"
										}
										size="small"
										sx={{
											ml: 1,
											mb: 2,
											bgcolor:
												goal.priority === "high"
													? "error.light"
													: goal.priority === "medium"
													? "warning.light"
													: "success.light",
											color: "white",
										}}
									/>

									{goal.description && (
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ mb: 2 }}
										>
											{goal.description}
										</Typography>
									)}

									<Box sx={{ mb: 2 }}>
										<LinearProgress
											variant="determinate"
											value={goal.progress}
											sx={{
												height: 8,
												borderRadius: 4,
												bgcolor: "grey.200",
											}}
										/>
										<Typography
											variant="body2"
											color="text.secondary"
											align="right"
											sx={{ mt: 1 }}
										>
											{Math.round(goal.progress)}% выполнено
										</Typography>
									</Box>

									<List dense>
										{goal.steps.map((step) => (
											<ListItem
												key={step.id}
												secondaryAction={
													<IconButton
														edge="end"
														size="small"
														onClick={() => handleToggleStep(goal.id, step.id)}
													>
														{step.completed ? <RefreshIcon /> : <CheckIcon />}
													</IconButton>
												}
												sx={{
													bgcolor: step.completed
														? "success.50"
														: "transparent",
													borderRadius: 1,
													mb: 0.5,
												}}
											>
												<ListItemText
													primary={step.title}
													sx={{
														textDecoration: step.completed
															? "line-through"
															: "none",
														opacity: step.completed ? 0.7 : 1,
													}}
												/>
											</ListItem>
										))}
									</List>
								</Paper>
							</Grid>
						))
				)}
			</Grid>

			{/* Секция "Завершенные" */}
			{goals.filter((goal) => goal.completed).length > 0 && (
				<>
					<Typography variant="h5" sx={{ mb: 2, mt: 4 }}>
						Завершенные цели
					</Typography>
					<Grid container spacing={3}>
						{goals
							.filter((goal) => goal.completed)
							.map((goal) => (
								<Grid item xs={12} md={6} key={goal.id}>
									<Paper
										sx={{ p: 3, bgcolor: "success.50", position: "relative" }}
									>
										<TrophyIcon
											sx={{
												position: "absolute",
												right: 16,
												top: 16,
												color: "success.main",
											}}
										/>

										<Typography variant="h6" sx={{ mb: 2, pr: 6 }}>
											{goal.title}
										</Typography>

										<Chip
											label={goal.category}
											size="small"
											sx={{ mb: 2, bgcolor: "success.main", color: "white" }}
										/>

										{goal.description && (
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ mb: 2 }}
											>
												{goal.description}
											</Typography>
										)}

										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												mt: 2,
											}}
										>
											<Button
												variant="outlined"
												color="error"
												size="small"
												startIcon={<DeleteIcon />}
												onClick={() => handleDeleteGoal(goal.id)}
											>
												Удалить
											</Button>
										</Box>
									</Paper>
								</Grid>
							))}
					</Grid>
				</>
			)}

			{/* Диалог добавления/редактирования цели */}
			<Dialog
				open={openDialog}
				onClose={() => setOpenDialog(false)}
				maxWidth="md"
				fullWidth
			>
				<DialogTitle>
					{editMode ? "Редактировать цель" : "Добавить новую цель"}
				</DialogTitle>
				<DialogContent>
					<Grid container spacing={2} sx={{ mt: 1 }}>
						<Grid item xs={12}>
							<TextField
								label="Название цели"
								value={newGoal.title}
								onChange={(e) =>
									setNewGoal({ ...newGoal, title: e.target.value })
								}
								fullWidth
								required
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								label="Описание"
								value={newGoal.description}
								onChange={(e) =>
									setNewGoal({ ...newGoal, description: e.target.value })
								}
								fullWidth
								multiline
								rows={3}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								label="Категория"
								value={newGoal.category}
								onChange={(e) =>
									setNewGoal({ ...newGoal, category: e.target.value })
								}
								fullWidth
								placeholder="Например: Работа, Спорт, Образование"
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<FormControl fullWidth>
								<InputLabel>Приоритет</InputLabel>
								<Select
									value={newGoal.priority}
									label="Приоритет"
									onChange={(e) =>
										setNewGoal({ ...newGoal, priority: e.target.value as any })
									}
								>
									<MenuItem value="low">Низкий</MenuItem>
									<MenuItem value="medium">Средний</MenuItem>
									<MenuItem value="high">Высокий</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
							<Typography variant="subtitle1" gutterBottom>
								Шаги для достижения цели
							</Typography>

							{/* Список существующих шагов */}
							<List
								dense
								sx={{ bgcolor: "background.paper", borderRadius: 1, mb: 2 }}
							>
								{(newGoal.steps || []).map((step, index) => (
									<ListItem
										key={step.id}
										secondaryAction={
											<IconButton
												edge="end"
												size="small"
												onClick={() => handleRemoveStep(step.id)}
											>
												<DeleteIcon fontSize="small" />
											</IconButton>
										}
									>
										<ListItemText primary={`${index + 1}. ${step.title}`} />
									</ListItem>
								))}
								{(newGoal.steps || []).length === 0 && (
									<ListItem>
										<ListItemText
											primary="Нет шагов"
											primaryTypographyProps={{
												color: "text.secondary",
												fontStyle: "italic",
											}}
										/>
									</ListItem>
								)}
							</List>

							{/* Форма добавления шага */}
							<Box sx={{ display: "flex", gap: 1 }}>
								<TextField
									label="Новый шаг"
									value={newStep}
									onChange={(e) => setNewStep(e.target.value)}
									fullWidth
									placeholder="Введите описание шага"
									onKeyPress={(e) => {
										if (e.key === "Enter") {
											handleAddStep();
										}
									}}
								/>
								<Button
									variant="outlined"
									onClick={handleAddStep}
									disabled={!newStep.trim()}
									sx={{ whiteSpace: "nowrap" }}
								>
									Добавить шаг
								</Button>
							</Box>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDialog(false)}>Отмена</Button>
					<Button
						onClick={handleSaveGoal}
						variant="contained"
						disabled={!newGoal.title?.trim()}
					>
						{editMode ? "Сохранить" : "Создать"}
					</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
};

export default GoalTrackerPage;
